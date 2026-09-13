package com.debugassist.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisSummaryDto {
    private Long id;
    private String fileName;
    private Integer totalLines;
    private Integer errorCount;
    private Integer warningCount;
    private Integer issueCount;
    private Long analysisTimeMs;
    private LocalDateTime createdAt;
    private String status;
}
