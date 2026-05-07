package com.example.orchestrator_service.repository;

import com.example.orchestrator_service.model.ChatHistory;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface ChatHistoryRepository extends ReactiveMongoRepository<ChatHistory, String> {
    reactor.core.publisher.Flux<ChatHistory> findAllBySessionId(String sessionId);
    reactor.core.publisher.Flux<ChatHistory> findAllByLabel(String label);
    Mono<Void> deleteAllByLabel(String label);
}
