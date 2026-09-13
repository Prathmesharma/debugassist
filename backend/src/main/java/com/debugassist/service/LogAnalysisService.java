package com.debugassist.service;

import com.debugassist.ai.AiAnalysisResult;
import com.debugassist.ai.AiAnalysisService;
import com.debugassist.dto.AnalysisResponseDto;
import com.debugassist.dto.AnalysisSummaryDto;
import com.debugassist.dto.IssueDto;
import com.debugassist.entity.Analysis;
import com.debugassist.entity.Issue;
import com.debugassist.exception.AnalysisException;
import com.debugassist.repository.AnalysisRepository;
import com.debugassist.repository.IssueRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LogAnalysisService {

    private final LogExcerptService logExcerptService;
    private final LogSanitizationService logSanitizationService;
    private final AiAnalysisService aiAnalysisService;
    private final AnalysisRepository analysisRepository;
    private final IssueRepository issueRepository;
    private final ObjectMapper objectMapper;

    @Value("${analysis.max-log-size-mb:20}")
    private int maxLogSizeMb;

    @Value("${analysis.max-excerpt-lines:300}")
    private int maxExcerptLines;

    @Transactional
    public AnalysisResponseDto analyzeLog(String logContent, String fileName) {
        if (logContent == null || logContent.trim().isEmpty()) {
            throw new AnalysisException("Log content cannot be empty");
        }
        
        long sizeBytes = logContent.getBytes().length;
        long maxBytes = (long) maxLogSizeMb * 1024 * 1024;
        if (sizeBytes > maxBytes) {
            throw new AnalysisException("Log file exceeds maximum size of " + maxLogSizeMb + "MB");
        }

        int totalLines = logExcerptService.countTotalLines(logContent);
        int errorCount = logExcerptService.countErrorLines(logContent);
        int warningCount = logExcerptService.countWarningLines(logContent);

        String sanitized = logSanitizationService.sanitize(logContent);
        String excerpt = logExcerptService.extractExcerpt(sanitized, maxExcerptLines);

        long startTime = System.currentTimeMillis();
        AiAnalysisResult aiResult = aiAnalysisService.analyzeLog(excerpt, totalLines, errorCount, warningCount);
        long analysisTimeMs = System.currentTimeMillis() - startTime;

        Analysis analysis = new Analysis();
        analysis.setFileName(fileName != null ? fileName : "pasted-log.log");
        analysis.setSummary(aiResult.getSummary());
        analysis.setTotalLines(totalLines);
        analysis.setErrorCount(errorCount);
        analysis.setWarningCount(warningCount);
        analysis.setAnalysisTimeMs(analysisTimeMs);

        List<Issue> issues = new ArrayList<>();
        if (aiResult.getIssues() != null) {
            for (int i = 0; i < aiResult.getIssues().size(); i++) {
                AiAnalysisResult.AiIssue ai = aiResult.getIssues().get(i);
                Issue issue = new Issue();
                issue.setAnalysis(analysis);
                issue.setTitle(ai.getTitle());
                issue.setSeverity(ai.getSeverity());
                issue.setCategory(ai.getCategory());
                issue.setErrorMessage(ai.getError());
                issue.setRootCause(ai.getRootCause());
                issue.setConfidence(ai.getConfidence());
                
                try {
                    issue.setSolution(objectMapper.writeValueAsString(ai.getSolution()));
                    issue.setRelatedLogLines(objectMapper.writeValueAsString(ai.getRelatedLines()));
                } catch (JsonProcessingException e) {
                    // Fallback
                    issue.setSolution("[]");
                    issue.setRelatedLogLines("[]");
                }
                
                issue.setOrderIndex(i);
                issues.add(issue);
            }
        }
        analysis.setIssues(issues);
        Analysis saved = analysisRepository.save(analysis);

        return toResponseDto(saved);
    }

    public List<AnalysisSummaryDto> getAllAnalyses() {
        return analysisRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());
    }

    public AnalysisResponseDto getAnalysis(Long id) {
        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new AnalysisException("Analysis not found with id: " + id));
        return toResponseDto(analysis);
    }

    public void deleteAnalysis(Long id) {
        if (!analysisRepository.existsById(id)) {
            throw new AnalysisException("Analysis not found with id: " + id);
        }
        analysisRepository.deleteById(id);
    }

    private AnalysisResponseDto toResponseDto(Analysis analysis) {
        return AnalysisResponseDto.builder()
                .id(analysis.getId())
                .fileName(analysis.getFileName())
                .summary(analysis.getSummary())
                .totalLines(analysis.getTotalLines())
                .errorCount(analysis.getErrorCount())
                .warningCount(analysis.getWarningCount())
                .analysisTimeMs(analysis.getAnalysisTimeMs())
                .createdAt(analysis.getCreatedAt())
                .issues(analysis.getIssues() != null ? 
                        analysis.getIssues().stream().map(this::toIssueDto).collect(Collectors.toList()) : 
                        new ArrayList<>())
                .build();
    }

    private AnalysisSummaryDto toSummaryDto(Analysis analysis) {
        return AnalysisSummaryDto.builder()
                .id(analysis.getId())
                .fileName(analysis.getFileName())
                .totalLines(analysis.getTotalLines())
                .errorCount(analysis.getErrorCount())
                .warningCount(analysis.getWarningCount())
                .issueCount(analysis.getIssues() != null ? analysis.getIssues().size() : 0)
                .analysisTimeMs(analysis.getAnalysisTimeMs())
                .createdAt(analysis.getCreatedAt())
                .status("COMPLETED")
                .build();
    }

    private IssueDto toIssueDto(Issue issue) {
        List<String> solutionList = new ArrayList<>();
        List<String> relatedLinesList = new ArrayList<>();
        try {
            if (issue.getSolution() != null) {
                solutionList = objectMapper.readValue(issue.getSolution(), new TypeReference<List<String>>() {});
            }
            if (issue.getRelatedLogLines() != null) {
                relatedLinesList = objectMapper.readValue(issue.getRelatedLogLines(), new TypeReference<List<String>>() {});
            }
        } catch (JsonProcessingException e) {
            // Log warning in real app
        }

        return IssueDto.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .severity(issue.getSeverity())
                .category(issue.getCategory())
                .errorMessage(issue.getErrorMessage())
                .rootCause(issue.getRootCause())
                .confidence(issue.getConfidence())
                .solution(solutionList)
                .relatedLogLines(relatedLinesList)
                .build();
    }
}
