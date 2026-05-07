package com.example.orchestrator_service.controller;

import com.example.orchestrator_service.model.GeminiRequest;
import com.example.orchestrator_service.service.InferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/orchestrator")
@CrossOrigin(origins = "*")
public class OrchestratorController {

    @Autowired
    private InferenceService inferenceService;

    @Autowired
    private com.example.orchestrator_service.repository.ChatHistoryRepository chatHistoryRepository;

    @PostMapping("/chat")
    public Mono<String> chat(
            @RequestParam String model,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestBody GeminiRequest request) {
        
        return inferenceService.generateContent(model, apiKey, request)
                .flatMap(response -> {
                    // Save history logic (Session ID is simplified for now)
                    com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                    history.setSessionId("default-session");
                    history.setTimestamp(java.time.Instant.now());
                    // In a real app, we'd map the request/response parts here
                    return chatHistoryRepository.save(history).thenReturn(response);
                });
    }

    @GetMapping("/history/{sessionId}")
    public Mono<com.example.orchestrator_service.model.ChatHistory> getHistory(@PathVariable String sessionId) {
        return chatHistoryRepository.findBySessionId(sessionId);
    }
    
    @GetMapping("/health")
    public String health() {
        return "Orchestrator Service is Online";
    }
}
