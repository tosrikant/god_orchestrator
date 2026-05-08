package com.example.orchestrator_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class InferenceService {

    @Autowired
    private WebClient geminiWebClient;

    public Mono<String> generateContent(String model, String apiKey, Object request) {
        String method = model.contains("imagen") ? ":predict" : ":generateContent";
        
        return geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}" + method)
                        .queryParam("key", apiKey)
                        .build(model))
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(e -> System.err.println("Inference Error: " + e.getMessage()));
    }

    public reactor.core.publisher.Flux<String> streamGenerateContent(String model, String apiKey, Object request) {
        String method = ":streamGenerateContent";
        // Note: Imagen doesn't support streaming, so we only use this for text models
        
        return geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}" + method)
                        .queryParam("key", apiKey)
                        .queryParam("alt", "sse") // Use Server-Sent Events for cleaner streaming
                        .build(model))
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(String.class)
                .doOnError(e -> System.err.println("Inference Stream Error: " + e.getMessage()));
    }
}
