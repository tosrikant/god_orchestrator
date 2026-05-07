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
                .doOnNext(response -> {
                    try {
                        com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                        history.setSessionId("default-session");
                        history.setTimestamp(java.time.Instant.now());
                        
                        com.example.orchestrator_service.model.ChatHistory.Message userMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        userMsg.setRole("user");
                        userMsg.setText(request.getContents().get(request.getContents().size() - 1).getParts().get(0).getText());

                        com.example.orchestrator_service.model.ChatHistory.Message aiMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        aiMsg.setRole("model");
                        aiMsg.setText(response); // Saving the actual AI response
                        
                        history.setMessages(java.util.List.of(userMsg, aiMsg));
                        chatHistoryRepository.save(history).subscribe();
                    } catch (Exception e) {
                        System.err.println("Database Save Failed: " + e.getMessage());
                    }
                });
    }

    @GetMapping("/history/{sessionId}")
    public reactor.core.publisher.Flux<com.example.orchestrator_service.model.ChatHistory> getHistory(@PathVariable String sessionId) {
        return chatHistoryRepository.findAllBySessionId(sessionId);
    }
    
    @GetMapping("/health")
    public String health() {
        return "Orchestrator Service is Online";
    }
}
