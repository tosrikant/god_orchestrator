package com.example.orchestrator_service.service;

import com.example.orchestrator_service.model.GeminiRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class InferenceService {

    @Autowired
    private WebClient geminiWebClient;

    public Mono<String> generateContent(String model, String apiKey, GeminiRequest request) {
        
        return geminiWebClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/{model}:generateContent")
                        .queryParam("key", apiKey)
                        .build(model))
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.isError(), response -> 
                    response.bodyToMono(String.class).flatMap(errorBody -> 
                        Mono.error(new RuntimeException("Gemini API Error: " + errorBody))
                    )
                )
                .bodyToMono(String.class)
                .doOnError(e -> System.err.println("Inference Error: " + e.getMessage()));
    }
}
