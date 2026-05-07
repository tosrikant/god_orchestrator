package com.example.orchestrator_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeminiRequest {
    private List<Content> contents;
    private SystemInstruction systemInstruction;
    private GenerationConfig generationConfig;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Content {
        private String role;
        private List<Part> parts;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Part {
        private String text;
        private InlineData inlineData;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class InlineData {
        private String mimeType;
        private String data;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SystemInstruction {
        private List<Part> parts;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GenerationConfig {
        private String responseMimeType;
        private Double temperature;
    }
}
