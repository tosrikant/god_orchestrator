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

import java.util.Map;

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
                        
                        // Extract user message text from request body (last message in 'contents')
                        Object contentsObj = request.get("contents");
                        if (contentsObj instanceof java.util.List) {
                            java.util.List<?> contents = (java.util.List<?>) contentsObj;
                            if (!contents.isEmpty()) {
                                // Find the last message with role 'user'
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
                        }

                        history.setMessages(java.util.List.of(userMsg, aiMsg));
                        
                        // Extract the sanitized text to return to the frontend
                        String responseToReturn = aiMsg.getText();
                        
                        // Save asynchronously and return the sanitized response
                        return chatHistoryRepository.save(history)
                                .thenReturn(responseToReturn);
                                
                    } catch (Exception e) {
                        return Mono.just(rawResponse);
                    }
                });
    }

    @GetMapping("/history")
    public Flux<com.example.orchestrator_service.model.ChatHistory> getHistory(@RequestParam String label) {
        return chatHistoryRepository.findAllByLabel(label);
    }

    @DeleteMapping("/history")
    public Mono<Void> deleteHistory(@RequestParam String label) {
        return chatHistoryRepository.deleteAllByLabel(label);
    }

    @GetMapping("/billing")
    public Mono<com.example.orchestrator_service.model.BillingStats> getBilling() {
        return billingStatsRepository.findById("GLOBAL_STATS");
    }

    @GetMapping("/health")
    public String health() {
        return "Orchestrator Service is Online";
    }
}
