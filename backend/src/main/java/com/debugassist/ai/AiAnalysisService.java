package com.debugassist.ai;

public interface AiAnalysisService {
    AiAnalysisResult analyzeLog(String logExcerpt, int totalLines, int errorCount, int warningCount);
}
