package com.example.orchestrator_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "video_jobs")
public class VideoJob {
    @Id
    private String id;
    private String label;
    private String prompt;
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED
    private String videoUrl;
    private String operationName; // Vertex AI LRO name
    private Instant createdAt = Instant.now();
    private Instant completedAt;
    private double cost;
}
