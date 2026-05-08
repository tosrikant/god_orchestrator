package com.example.orchestrator_service.controller;

import com.example.orchestrator_service.service.InferenceService;
import com.example.orchestrator_service.repository.ChatHistoryRepository;
import com.example.orchestrator_service.repository.BillingStatsRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/orchestrator")
@CrossOrigin(origins = "*")
public class OrchestratorController {

    @Autowired
    private InferenceService inferenceService;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private BillingStatsRepository billingStatsRepository;

    @Autowired
    private com.example.orchestrator_service.repository.VideoJobRepository videoJobRepository;

    @Autowired
    private com.example.orchestrator_service.service.VideoSynthesisService videoSynthesisService;

    @PostMapping("/chat")
    public Mono<String> chat(
            @RequestParam String model,
            @RequestParam(required = false, defaultValue = "Default") String label,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestBody Map<String, Object> request) {
        
        return inferenceService.generateContent(model, apiKey, request)
                .flatMap(rawResponse -> {
                    // Log to history repository
                    com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                    history.setLabel(label);
                    history.setTimestamp(java.time.Instant.now());
                    
                    // Extract messages from request and response for persistence
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(rawResponse);
                        
                        com.example.orchestrator_service.model.ChatHistory.Message aiMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        aiMsg.setRole("model");
                        
                        if (root.has("candidates")) {
                            JsonNode part = root.path("candidates").get(0).path("content").path("parts").get(0);
                            aiMsg.setText(part.path("text").asText());
                        } else if (root.has("predictions")) {
                            // IMAGEN Case
                            String base64 = root.path("predictions").get(0).path("bytesBase64Encoded").asText();
                            if (!base64.isEmpty()) {
                                aiMsg.setImageUrl("data:image/png;base64," + base64);
                                aiMsg.setText("Visual synthesis complete.");
                            }
                        } else {
                            aiMsg.setText(rawResponse);
                        }

                        // Create historical record for user
                        com.example.orchestrator_service.model.ChatHistory.Message userMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        userMsg.setRole("user");
                        
                        // Extract user message text from request body
                        Object contentsObj = request.get("contents");
                        Object instancesObj = request.get("instances");
                        
                        if (contentsObj instanceof java.util.List) {
                            java.util.List<?> contents = (java.util.List<?>) contentsObj;
                            if (!contents.isEmpty()) {
                                for (int i = contents.size() - 1; i >= 0; i--) {
                                    Object content = contents.get(i);
                                    if (content instanceof Map) {
                                        Map<?, ?> contentMap = (Map<?, ?>) content;
                                        if ("user".equals(contentMap.get("role"))) {
                                            Object partsObj = contentMap.get("parts");
                                            if (partsObj instanceof java.util.List && !((java.util.List<?>) partsObj).isEmpty()) {
                                                Object firstPart = ((java.util.List<?>) partsObj).get(0);
                                                if (firstPart instanceof Map) {
                                                    userMsg.setText((String) ((Map<?, ?>) firstPart).get("text"));
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        } else if (instancesObj instanceof java.util.List && !((java.util.List<?>) instancesObj).isEmpty()) {
                            // IMAGEN CASE: Prompt is in instances[0].prompt
                            Object firstInstance = ((java.util.List<?>) instancesObj).get(0);
                            if (firstInstance instanceof Map) {
                                userMsg.setText((String) ((Map<?, ?>) firstInstance).get("prompt"));
                            }
                        }

                        if (userMsg.getText() == null) userMsg.setText("Orchestration Request");

                        history.setMessages(java.util.List.of(userMsg, aiMsg));
                        
                        // Extract the sanitized text to return to the frontend
                        String responseToReturn = aiMsg.getText();
                        
                        // IF it is an image generation (Imagen), we MUST return the full JSON so the frontend can extract base64
                        if (root.has("predictions")) {
                            responseToReturn = rawResponse;
                        }
                        
                        // Track billing
                        updateBilling(model, responseToReturn.length() / 3);
                        
                        // Save asynchronously and return the sanitized response (or raw JSON for images)
                        return chatHistoryRepository.save(history)
                                .thenReturn(responseToReturn);
                                
                    } catch (Exception e) {
                        return Mono.just(rawResponse);
                    }
                });
    }

    @PostMapping(value = "/chat-stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(
            @RequestParam String model,
            @RequestParam(required = false, defaultValue = "Default") String label,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestBody Map<String, Object> request) {
        
        StringBuilder fullResponse = new StringBuilder();
        
        return inferenceService.streamGenerateContent(model, apiKey, request)
                .map(chunk -> {
                    String text = parseGeminiStreamChunk(chunk);
                    fullResponse.append(text);
                    return text;
                })
                .doOnComplete(() -> {
                    // Persistence at the end of the stream
                    try {
                        com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                        history.setLabel(label);
                        history.setTimestamp(java.time.Instant.now());
                        
                        com.example.orchestrator_service.model.ChatHistory.Message aiMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        aiMsg.setRole("model");
                        aiMsg.setText(fullResponse.toString());
                        aiMsg.setAgent("Orchestrator");

                        com.example.orchestrator_service.model.ChatHistory.Message userMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        userMsg.setRole("user");
                        
                        Object contentsObj = request.get("contents");
                        if (contentsObj instanceof List) {
                            List<?> contents = (List<?>) contentsObj;
                            if (!contents.isEmpty()) {
                                for (int i = contents.size() - 1; i >= 0; i--) {
                                    Object content = contents.get(i);
                                    if (content instanceof Map) {
                                        Map<?, ?> contentMap = (Map<?, ?>) content;
                                        if ("user".equals(contentMap.get("role"))) {
                                            Object partsObj = contentMap.get("parts");
                                            if (partsObj instanceof List && !((List<?>) partsObj).isEmpty()) {
                                                Object firstPart = ((List<?>) partsObj).get(0);
                                                if (firstPart instanceof Map) {
                                                    userMsg.setText((String) ((Map<?, ?>) firstPart).get("text"));
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        history.setMessages(List.of(userMsg, aiMsg));
                        chatHistoryRepository.save(history).subscribe();
                        
                        // Update Billing Stats
                        updateBilling(model, fullResponse.length() / 3);
                    } catch (Exception e) {
                        System.err.println("Async history save failed: " + e.getMessage());
                    }
                });
    }

    private String parseGeminiStreamChunk(String chunk) {
        if (chunk == null) return "";
        String cleanJson = chunk;
        if (chunk.startsWith("data: ")) {
            cleanJson = chunk.substring(6);
        }
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(cleanJson);
            if (root.has("candidates")) {
                JsonNode candidate = root.path("candidates").get(0);
                if (candidate.has("content")) {
                    return candidate.path("content").path("parts").get(0).path("text").asText();
                }
            }
        } catch (Exception e) {
            // Ignore partial or malformed chunks during stream
        }
        return "";
    }

    @GetMapping("/history")
    public Flux<com.example.orchestrator_service.model.ChatHistory> getHistory(@RequestParam String label) {
        return chatHistoryRepository.findAllByLabel(label);
    }

    @DeleteMapping("/history")
    public Mono<Void> deleteHistory(@RequestParam String label) {
        return chatHistoryRepository.deleteAllByLabel(label);
    }

    @PostMapping("/video/generate")
    public Mono<com.example.orchestrator_service.model.VideoJob> generateVideo(
            @RequestParam(required = false, defaultValue = "Default") String label,
            @RequestHeader(value = "X-GCP-PROJECT", required = false) String projectId,
            @RequestHeader(value = "X-GCS-BUCKET", required = false) String bucket,
            @RequestBody Map<String, String> request) {
        
        String prompt = request.get("prompt");
        
        // Fallback to Simulation if GCP details are missing
        if (projectId == null || bucket == null || projectId.isEmpty() || bucket.isEmpty()) {
            com.example.orchestrator_service.model.VideoJob job = new com.example.orchestrator_service.model.VideoJob();
            job.setLabel(label);
            job.setPrompt(prompt + " [SIMULATION]");
            job.setStatus("PROCESSING");
            
            return videoJobRepository.save(job)
                .doOnSuccess(savedJob -> {
                    reactor.core.publisher.Mono.delay(java.time.Duration.ofSeconds(20))
                        .flatMap(d -> {
                            savedJob.setStatus("COMPLETED");
                            savedJob.setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
                            savedJob.setCompletedAt(java.time.Instant.now());
                            savedJob.setCost(1.75);
                            return videoJobRepository.save(savedJob);
                        })
                        .doOnSuccess(finalJob -> updateVideoBilling(finalJob.getCost()))
                        .subscribe();
                });
        }
        
        // Production Mode: Call real Vertex AI Veo
        return videoSynthesisService.initiateSynthesis(prompt, projectId, bucket, label);
    }

    @GetMapping("/video/status")
    public Mono<com.example.orchestrator_service.model.VideoJob> getVideoStatus(@RequestParam String jobId) {
        return videoJobRepository.findById(jobId);
    }

    private void updateVideoBilling(double cost) {
        billingStatsRepository.findById("GLOBAL_STATS")
                .defaultIfEmpty(new com.example.orchestrator_service.model.BillingStats())
                .flatMap(stats -> {
                    stats.addVideoUsage(cost);
                    return billingStatsRepository.save(stats);
                })
                .subscribe();
    }

    private void updateBilling(String model, int tokenCount) {
        double costPerToken = model.contains("pro") ? 0.000015 : 0.000005;
        double totalCost = tokenCount * costPerToken;
        
        billingStatsRepository.findById("GLOBAL_STATS")
                .defaultIfEmpty(new com.example.orchestrator_service.model.BillingStats())
                .flatMap(stats -> {
                    stats.addUsage(tokenCount / 2, tokenCount / 2, totalCost);
                    return billingStatsRepository.save(stats);
                })
                .subscribe();
    }

    @GetMapping("/billing")
    public Mono<com.example.orchestrator_service.model.BillingStats> getBilling() {
        return billingStatsRepository.findById("GLOBAL_STATS")
                .defaultIfEmpty(new com.example.orchestrator_service.model.BillingStats());
    }

    @GetMapping("/health")
    public String health() {
        return "Orchestrator Service is Online";
    }
}
