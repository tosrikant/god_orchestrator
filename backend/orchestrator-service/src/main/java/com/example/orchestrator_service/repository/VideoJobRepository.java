package com.example.orchestrator_service.repository;

import com.example.orchestrator_service.model.VideoJob;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface VideoJobRepository extends ReactiveMongoRepository<VideoJob, String> {
    Flux<VideoJob> findAllByLabel(String label);
    Flux<VideoJob> findAllByStatus(String status);
}
