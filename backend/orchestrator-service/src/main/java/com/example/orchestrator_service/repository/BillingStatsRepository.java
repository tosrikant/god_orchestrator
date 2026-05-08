package com.example.orchestrator_service.repository;

import com.example.orchestrator_service.model.BillingStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillingStatsRepository extends MongoRepository<BillingStats, String> {
}
