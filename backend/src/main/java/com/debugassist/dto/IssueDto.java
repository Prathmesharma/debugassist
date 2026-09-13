package com.debugassist.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueDto {
    private Long id;
    private String title;
    private String severity;
    private String category;
    private String errorMessage;
    private String rootCause;
    private Integer confidence;
    private List<String> solution;
    private List<String> relatedLogLines;
}
