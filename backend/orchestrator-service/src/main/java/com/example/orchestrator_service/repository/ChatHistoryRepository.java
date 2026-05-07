package com.example.orchestrator_service.repository;

import com.example.orchestrator_service.model.ChatHistory;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface ChatHistoryRepository extends ReactiveMongoRepository<ChatHistory, String> {
    Mono<ChatHistory> findBySessionId(String sessionId);
}
