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
                            return rawResponse; 
                        }

                        return rawResponse;
                    } catch (Exception e) {
                        return rawResponse;
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
