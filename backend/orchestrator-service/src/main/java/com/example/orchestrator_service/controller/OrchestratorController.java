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
            @RequestBody GeminiRequest request) {
        
        return inferenceService.generateContent(model, apiKey, request)
                .map(rawResponse -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(rawResponse);
                        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                    } catch (Exception e) {
                        return rawResponse;
                    }
                })
                .doOnNext(cleanText -> {
                    try {
                        // 1. Persist Chat History
                        com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                        history.setSessionId("default-session");
                        history.setLabel(label);
                        history.setTimestamp(java.time.Instant.now());
                        
                        String userText = request.getContents().get(request.getContents().size() - 1).getParts().get(0).getText();
                        com.example.orchestrator_service.model.ChatHistory.Message userMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        userMsg.setRole("user");
                        userMsg.setText(userText);

                        com.example.orchestrator_service.model.ChatHistory.Message aiMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        aiMsg.setRole("model");
                        aiMsg.setText(cleanText); 
                        
                        history.setMessages(java.util.List.of(userMsg, aiMsg));
                        chatHistoryRepository.save(history).subscribe();

                        // 2. Update Billing Stats
                        long inputTokens = (userText.length() / 4) + 10; // Rough token estimate
                        long outputTokens = (cleanText.length() / 4) + 10;
                        double pricePer1M = model.contains("flash") ? 0.075 : 1.25;
                        double cost = ((inputTokens + outputTokens) / 1000000.0) * pricePer1M;

                        billingStatsRepository.findById("GLOBAL_STATS")
                            .defaultIfEmpty(new com.example.orchestrator_service.model.BillingStats())
                            .flatMap(stats -> {
                                stats.addUsage(inputTokens, outputTokens, cost);
                                return billingStatsRepository.save(stats);
                            })
                            .subscribe();

                    } catch (Exception e) {
                        System.err.println("Persistence Ops Failed: " + e.getMessage());
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
