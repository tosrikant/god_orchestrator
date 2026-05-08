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
                .exchangeToMono(response -> {
                    if (response.statusCode().isError()) {
                        return response.bodyToMono(String.class).flatMap(errorBody -> 
                            Mono.error(new RuntimeException("Inference API Error (" + response.statusCode() + "): " + errorBody))
                        );
                    } else {
                        return response.bodyToMono(String.class);
                    }
                })
                .doOnError(e -> System.err.println("Inference Error: " + e.getMessage()));
    }
}
