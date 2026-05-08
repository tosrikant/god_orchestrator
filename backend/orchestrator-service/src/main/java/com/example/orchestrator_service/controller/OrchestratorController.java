package com.example.orchestrator_service.controller;

import com.example.orchestrator_service.model.GeminiRequest;
import com.example.orchestrator_service.service.InferenceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/orchestrator")
@CrossOrigin(origins = "*")
public class OrchestratorController {

    @Autowired
    private InferenceService inferenceService;

    @Autowired
    private com.example.orchestrator_service.repository.ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private com.example.orchestrator_service.repository.BillingStatsRepository billingStatsRepository;

    @PostMapping("/chat")
    public Mono<String> chat(
            @RequestParam String model,
            @RequestParam(required = false, defaultValue = "Default") String label,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestBody com.fasterxml.jackson.databind.JsonNode request) {
        
        return inferenceService.generateContent(model, apiKey, request)
                .map(rawResponse -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(rawResponse);
                        
                        // Case 1: Gemini Chat Response (Candidates)
                        if (root.has("candidates")) {
                            JsonNode part = root.path("candidates").get(0).path("content").path("parts").get(0);
                            if (part.has("text")) {
                                return part.path("text").asText();
                            } else if (part.has("functionCall")) {
                                return "[TOOL_CALL]:" + mapper.writeValueAsString(part.path("functionCall"));
                            }
                        }
                        
                        // Case 2: Imagen Response (Predictions)
                        if (root.has("predictions")) {
                            return rawResponse; // Return raw JSON so frontend can handle image logic
                        }

                        return rawResponse;
                    } catch (Exception e) {
                        return rawResponse;
                    }
                })
                .doOnNext(cleanText -> {
                    try {
                        System.out.println("Processing response persistence for label: " + label);
                        
                        String userText = "[No Text]";
                        if (request.has("contents")) {
                            var contents = request.get("contents");
                            if (contents.isArray() && contents.size() > 0) {
                                var lastContent = contents.get(contents.size() - 1);
                                if (lastContent.has("parts") && lastContent.get("parts").size() > 0) {
                                    userText = lastContent.get("parts").get(0).path("text").asText("[Complex/Media Content]");
                                }
                            }
                        } else if (request.has("instances")) {
                            userText = request.path("instances").path("prompt").asText("[Image Generation]");
                        }

                        // 1. Persist Chat History
                        com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                        history.setSessionId("default-session");
                        history.setLabel(label);
                        history.setTimestamp(java.time.Instant.now());
                        
                        com.example.orchestrator_service.model.ChatHistory.Message userMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        userMsg.setRole("user");
                        userMsg.setText(userText);

                        com.example.orchestrator_service.model.ChatHistory.Message aiMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        aiMsg.setRole("model");
                        aiMsg.setText(cleanText); 
                        
                        history.setMessages(java.util.List.of(userMsg, aiMsg));
                        chatHistoryRepository.save(history).subscribe(
                            null, 
                            err -> System.err.println("History Save Error: " + err.getMessage())
                        );

                        // 2. Update Billing Stats
                        long inputTokens = (userText.length() / 4) + 10;
                        long outputTokens = (cleanText.length() / 4) + 10;
                        double pricePer1M = model.contains("flash") ? 0.075 : 1.25;
                        double cost = ((inputTokens + outputTokens) / 1000000.0) * pricePer1M;

                        billingStatsRepository.findById("GLOBAL_STATS")
                            .defaultIfEmpty(new com.example.orchestrator_service.model.BillingStats())
                            .flatMap(stats -> {
                                stats.addUsage(inputTokens, outputTokens, cost);
                                return billingStatsRepository.save(stats);
                            })
                            .subscribe(
                                null,
                                err -> System.err.println("Billing Save Error: " + err.getMessage())
                            );
                    } catch (Exception e) {
                        System.err.println("Persistence Ops Failed: " + e.getMessage());
                        e.printStackTrace();
                    }
                });
    }

    @GetMapping("/billing")
    public Mono<com.example.orchestrator_service.model.BillingStats> getBilling() {
        return billingStatsRepository.findById("GLOBAL_STATS")
            .defaultIfEmpty(new com.example.orchestrator_service.model.BillingStats());
    }

    @GetMapping("/history")
    public reactor.core.publisher.Flux<com.example.orchestrator_service.model.ChatHistory> getHistoryByLabel(@RequestParam String label) {
        return chatHistoryRepository.findAllByLabel(label);
    }

    @DeleteMapping("/history")
    public Mono<Void> deleteHistoryByLabel(@RequestParam String label) {
        return chatHistoryRepository.deleteAllByLabel(label);
    }
    
    @GetMapping("/health")
    public String health() {
        return "Orchestrator Service is Online";
    }
}
