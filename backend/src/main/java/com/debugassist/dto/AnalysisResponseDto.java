package com.debugassist.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponseDto {
    private Long id;
    private String fileName;
    private String summary;
    private Integer totalLines;
    private Integer errorCount;
    private Integer warningCount;
    private Long analysisTimeMs;
    private LocalDateTime createdAt;
    private List<IssueDto> issues;
}
