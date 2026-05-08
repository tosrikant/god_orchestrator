package com.example.orchestrator_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "billing_stats")
public class BillingStats {
    @Id
    private String id = "GLOBAL_STATS";
    private long totalInputTokens;
    private long totalOutputTokens;
    private double totalCost;
    private double totalVideoCost;
    private long requestCount;

    public void addUsage(long input, long output, double cost) {
        this.totalInputTokens += input;
        this.totalOutputTokens += output;
        this.totalCost += cost;
        this.requestCount++;
    }

    public void addVideoUsage(double cost) {
        this.totalVideoCost += cost;
        this.totalCost += cost;
        this.requestCount++;
    }
}
