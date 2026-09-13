package com.debugassist.controller;

import com.debugassist.dto.AnalysisRequestDto;
import com.debugassist.dto.AnalysisResponseDto;
import com.debugassist.dto.AnalysisSummaryDto;
import com.debugassist.exception.AnalysisException;
import com.debugassist.service.LogAnalysisService;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AnalysisController {

    private final LogAnalysisService logAnalysisService;

    @PostMapping(value = "/analyze", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AnalysisResponseDto> analyzeJson(@RequestBody AnalysisRequestDto request) {
        if (request == null || request.getLogContent() == null) {
            throw new AnalysisException("Request body or logContent cannot be null");
        }
        AnalysisResponseDto response = logAnalysisService.analyzeLog(request.getLogContent(), request.getFileName());
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/analyze/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalysisResponseDto> analyzeUpload(
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "logContent", required = false) String logContent,
            @RequestPart(value = "fileName", required = false) String fileName) {
        
        String contentToAnalyze = logContent;
        String finalFileName = fileName;

        if (file != null && !file.isEmpty()) {
            try {
                contentToAnalyze = new String(file.getBytes(), StandardCharsets.UTF_8);
                if (finalFileName == null || finalFileName.trim().isEmpty()) {
                    finalFileName = file.getOriginalFilename();
                }
            } catch (IOException e) {
                throw new AnalysisException("Failed to read uploaded file", e);
            }
        }

        if (contentToAnalyze == null || contentToAnalyze.trim().isEmpty()) {
            throw new AnalysisException("Either file or logContent must be provided");
        }

        AnalysisResponseDto response = logAnalysisService.analyzeLog(contentToAnalyze, finalFileName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analyses")
    public ResponseEntity<List<AnalysisSummaryDto>> getAllAnalyses() {
        return ResponseEntity.ok(logAnalysisService.getAllAnalyses());
    }

    @GetMapping("/analyses/{id}")
    public ResponseEntity<AnalysisResponseDto> getAnalysis(@PathVariable Long id) {
        return ResponseEntity.ok(logAnalysisService.getAnalysis(id));
    }

    @DeleteMapping("/analyses/{id}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable Long id) {
        logAnalysisService.deleteAnalysis(id);
        return ResponseEntity.ok().build();
    }
}
