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

    @PostMapping("/chat")
    public Mono<String> chat(
            @RequestParam String model,
            @RequestHeader("X-API-KEY") String apiKey,
            @RequestBody GeminiRequest request) {
        
        return inferenceService.generateContent(model, apiKey, request)
                .map(rawResponse -> {
                    // Extract clean text from Gemini JSON
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode root = mapper.readTree(rawResponse);
                        return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                    } catch (Exception e) {
                        return rawResponse; // Fallback to raw if parsing fails
                    }
                })
                .doOnNext(cleanText -> {
                    try {
                        com.example.orchestrator_service.model.ChatHistory history = new com.example.orchestrator_service.model.ChatHistory();
                        history.setSessionId("default-session");
                        history.setTimestamp(java.time.Instant.now());
                        
                        com.example.orchestrator_service.model.ChatHistory.Message userMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        userMsg.setRole("user");
                        userMsg.setText(request.getContents().get(request.getContents().size() - 1).getParts().get(0).getText());

                        com.example.orchestrator_service.model.ChatHistory.Message aiMsg = new com.example.orchestrator_service.model.ChatHistory.Message();
                        aiMsg.setRole("model");
                        aiMsg.setText(cleanText); 
                        
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
