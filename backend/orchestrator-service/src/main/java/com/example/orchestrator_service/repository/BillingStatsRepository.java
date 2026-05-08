package com.example.orchestrator_service.repository;

import com.example.orchestrator_service.model.BillingStats;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingStatsRepository extends ReactiveMongoRepository<BillingStats, String> {
}
