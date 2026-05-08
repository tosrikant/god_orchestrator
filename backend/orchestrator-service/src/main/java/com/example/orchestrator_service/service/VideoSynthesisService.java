package com.example.orchestrator_service.service;

import com.example.orchestrator_service.model.VideoJob;
import com.example.orchestrator_service.repository.VideoJobRepository;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.AccessToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.io.IOException;
import java.time.Instant;
import java.time.Duration;
import java.util.Map;
import java.util.List;

@Service
public class VideoSynthesisService {

    @Autowired
    private VideoJobRepository videoJobRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    private final ObjectMapper mapper = new ObjectMapper();

    public Mono<VideoJob> initiateSynthesis(String prompt, String projectId, String bucket, String label) {
        String region = "us-central1"; // Veo primary region
        String model = "veo-2.0-generate-001";
        String url = String.format("https://%s-aiplatform.googleapis.com/v1/projects/%s/locations/%s/publishers/google/models/%s:predict", 
                region, projectId, region, model);

        return getAccessToken()
                .flatMap(token -> {
                    Map<String, Object> body = Map.of(
                        "instances", List.of(Map.of("prompt", prompt)),
                        "parameters", Map.of(
                            "sampleCount", 1,
                            "outputGcsUri", String.format("gs://%s/godmode-video-outputs/", bucket)
                        )
                    );

                    return webClientBuilder.build().post()
                            .uri(url)
                            .header("Authorization", "Bearer " + token)
                            .bodyValue(body)
                            .retrieve()
                            .bodyToMono(JsonNode.class)
                            .flatMap(response -> {
                                String operationName = response.get("name").asText(); // LRO Name
                                VideoJob job = new VideoJob();
                                job.setLabel(label);
                                job.setPrompt(prompt);
                                job.setStatus("PROCESSING");
                                job.setOperationName(operationName);
                                return videoJobRepository.save(job);
                            });
                })
                .doOnSuccess(job -> pollOperation(job, projectId));
    }

    private void pollOperation(VideoJob job, String projectId) {
        String region = "us-central1";
        String url = String.format("https://%s-aiplatform.googleapis.com/v1/%s", region, job.getOperationName());

        Mono.delay(Duration.ofSeconds(10))
                .flatMap(d -> getAccessToken())
                .flatMap(token -> webClientBuilder.build().get()
                        .uri(url)
                        .header("Authorization", "Bearer " + token)
                        .retrieve()
                        .bodyToMono(JsonNode.class))
                .flatMap(response -> {
                    if (response.has("done") && response.get("done").asBoolean()) {
                        if (response.has("error")) {
                            job.setStatus("FAILED");
                        } else {
                            // Extract video URL from response.response.outputs[0].gcsUri
                            JsonNode outputs = response.path("response").path("outputs");
                            if (outputs.isArray() && outputs.size() > 0) {
                                String gcsUri = outputs.get(0).path("gcsUri").asText();
                                // Convert gs:// to https://storage.googleapis.com/
                                String publicUrl = gcsUri.replace("gs://", "https://storage.googleapis.com/");
                                job.setVideoUrl(publicUrl);
                                job.setStatus("COMPLETED");
                                job.setCompletedAt(Instant.now());
                                job.setCost(1.75);
                            }
                        }
                        return videoJobRepository.save(job);
                    } else {
                        // Continue polling
                        pollOperation(job, projectId);
                        return Mono.empty();
                    }
                })
                .subscribe();
    }

    private Mono<String> getAccessToken() {
        return Mono.fromCallable(() -> {
            try {
                GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
                credentials.refreshIfExpired();
                AccessToken token = credentials.getAccessToken();
                return token.getTokenValue();
            } catch (IOException e) {
                throw new RuntimeException("GCP Auth Failure: " + e.getMessage());
            }
        });
    }
}
