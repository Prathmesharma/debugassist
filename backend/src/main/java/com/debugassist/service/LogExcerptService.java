package com.debugassist.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LogExcerptService {

    @Value("${analysis.context-lines:5}")
    private int contextLines;

    private static final Pattern ERROR_PATTERN = Pattern.compile("(?i)(ERROR|Exception|FATAL|SEVERE|Caused by:|at com\\.)");
    private static final Pattern WARN_PATTERN = Pattern.compile("(?i)(WARN)");
    private static final Pattern INTERESTING_PATTERN = Pattern.compile("(?i)(ERROR|WARN|Exception|FATAL|SEVERE|at com\\.|Caused by:)");

    public String extractExcerpt(String logContent, int maxLines) {
        if (logContent == null || logContent.isEmpty()) {
            return "";
        }

        String[] lines = logContent.split("\\r?\\n");
        int totalLines = lines.length;

        if (totalLines <= maxLines) {
            return logContent;
        }

        Set<Integer> includedIndices = new TreeSet<>();
        for (int i = 0; i < lines.length; i++) {
            if (INTERESTING_PATTERN.matcher(lines[i]).find()) {
                int start = Math.max(0, i - contextLines);
                int end = Math.min(lines.length - 1, i + contextLines);
                for (int j = start; j <= end; j++) {
                    includedIndices.add(j);
                }
            }
        }

        if (includedIndices.isEmpty()) {
            // If nothing interesting found, just return the first maxLines / 2 and last maxLines / 2
            StringBuilder sb = new StringBuilder();
            int half = maxLines / 2;
            for (int i = 0; i < half && i < lines.length; i++) {
                sb.append(lines[i]).append("\n");
            }
            if (lines.length > maxLines) {
                sb.append("... [").append(lines.length - maxLines).append(" lines omitted] ...\n");
            }
            for (int i = Math.max(half, lines.length - half); i < lines.length; i++) {
                sb.append(lines[i]).append("\n");
            }
            return sb.toString();
        }

        StringBuilder excerpt = new StringBuilder();
        int lastIndex = -1;
        int currentExcerptLines = 0;

        for (int index : includedIndices) {
            if (currentExcerptLines >= maxLines && index != includedIndices.stream().reduce((first, second) -> second).orElse(-1)) {
                 // Try to respect maxLines somewhat, but ensure we keep the most relevant if it's huge.
                 // This is a simplified approach; if we have too many interesting lines, we might exceed maxLines.
                 // For now, let's keep it simple and just include them.
            }

            if (lastIndex != -1 && index > lastIndex + 1) {
                int omitted = index - lastIndex - 1;
                excerpt.append("... [").append(omitted).append(" lines omitted] ...\n");
            }
            excerpt.append(lines[index]).append("\n");
            lastIndex = index;
            currentExcerptLines++;
            
            if (currentExcerptLines >= maxLines) {
                break; // Hard cap
            }
        }

        return excerpt.toString();
    }

    public int countTotalLines(String logContent) {
        if (logContent == null || logContent.isEmpty()) return 0;
        return logContent.split("\\r?\\n").length;
    }

    public int countErrorLines(String logContent) {
        if (logContent == null || logContent.isEmpty()) return 0;
        int count = 0;
        for (String line : logContent.split("\\r?\\n")) {
            if (ERROR_PATTERN.matcher(line).find()) {
                count++;
            }
        }
        return count;
    }

    public int countWarningLines(String logContent) {
        if (logContent == null || logContent.isEmpty()) return 0;
        int count = 0;
        for (String line : logContent.split("\\r?\\n")) {
            if (WARN_PATTERN.matcher(line).find() && !ERROR_PATTERN.matcher(line).find()) {
                count++;
            }
        }
        return count;
    }
}
