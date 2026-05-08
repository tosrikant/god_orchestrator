package com.example.orchestrator_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "chat_history")
public class ChatHistory {
    @Id
    private String id;
    private String sessionId;
    private String label; // New field for group labeling
    private Instant timestamp;
    private List<Message> messages;

    @Data
    public static class Message {
        private String role;
        private String text;
        private String imageUrl;
        private String audioUrl;
        private String gamePayload;
        private String agent;
    }
}
