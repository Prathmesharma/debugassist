package com.debugassist.ai;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResult {
    private String summary;
    private List<AiIssue> issues;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiIssue {
        private String title;
        private String severity;
        private String category;
        private String error;
        private String rootCause;
        private Integer confidence;
        private List<String> solution;
        private List<String> relatedLines;
    }
}
