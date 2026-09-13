package com.debugassist.ai;

import com.debugassist.exception.AnalysisException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
@Primary
@RequiredArgsConstructor
public class GeminiAiAnalysisService implements AiAnalysisService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    @Value("${ai.gemini.model}")
    private String model;

    @Value("${ai.gemini.api-url}")
    private String apiUrl;

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 2000;

    @Override
    public AiAnalysisResult analyzeLog(String logExcerpt, int totalLines, int errorCount, int warningCount) {
        String prompt = buildPrompt(logExcerpt, totalLines, errorCount, warningCount);
        String url = apiUrl + "/" + model + ":generateContent?key=" + apiKey;

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, String> parts = new HashMap<>();
        parts.put("text", prompt);
        contents.put("parts", List.of(parts));
        requestBody.put("contents", List.of(contents));

        // Note: generationConfig (temperature/maxOutputTokens) causes 503 on gemini-flash-latest free tier
        // The model works correctly without it using its defaults

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // Retry loop for transient 5xx errors
        Exception lastException = null;
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                return callGeminiAndParse(url, request);
            } catch (HttpServerErrorException e) {
                lastException = e;
                if (attempt < MAX_RETRIES) {
                    try { Thread.sleep(RETRY_DELAY_MS * attempt); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                }
            } catch (AnalysisException e) {
                throw e; // Don't retry client errors or parse errors
            } catch (Exception e) {
                lastException = e;
                break;
            }
        }

        if (lastException instanceof HttpServerErrorException hse) {
            throw new AnalysisException("Gemini AI service is temporarily unavailable (" + hse.getStatusCode() + "). Please try again in a moment.");
        }
        throw new AnalysisException("AI analysis failed: " + (lastException != null ? lastException.getMessage() : "unknown error"));
    }

    private AiAnalysisResult callGeminiAndParse(String url, HttpEntity<Map<String, Object>> request) {
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || !body.containsKey("candidates")) {
                throw new AnalysisException("AI returned an unexpected response format. Please try again.");
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new AnalysisException("AI returned no candidates. The log content may be empty or too short.");
            }

            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> contentParts = (List<Map<String, Object>>) content.get("parts");

            // Find the part that has "text" (skip parts with only thoughtSignature)
            String jsonText = null;
            for (Map<String, Object> part : contentParts) {
                if (part.containsKey("text")) {
                    jsonText = (String) part.get("text");
                    break;
                }
            }

            if (jsonText == null || jsonText.isBlank()) {
                throw new AnalysisException("AI returned an empty response. Please try again.");
            }

            // Strip markdown code fences if present
            jsonText = jsonText.replaceAll("(?s)^```json\\s*", "").replaceAll("(?s)^```\\s*", "").replaceAll("(?s)```\\s*$", "").trim();

            return objectMapper.readValue(jsonText, AiAnalysisResult.class);

        } catch (AnalysisException e) {
            throw e;
        } catch (HttpClientErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            throw new AnalysisException("Gemini API error (" + e.getStatusCode() + "): " + extractGeminiErrorMessage(errorBody));
        } catch (HttpServerErrorException e) {
            throw e; // Let the retry loop handle this
        } catch (ResourceAccessException e) {
            throw new AnalysisException("Cannot reach Gemini API. Please check your internet connection.");
        } catch (JsonProcessingException e) {
            throw new AnalysisException("AI returned an unexpected response format. Please try again. Details: " + e.getMessage());
        } catch (Exception e) {
            throw new AnalysisException("AI analysis failed: " + e.getMessage());
        }
    }

    private String extractGeminiErrorMessage(String errorBody) {
        try {
            Map<?, ?> errorMap = objectMapper.readValue(errorBody, Map.class);
            Map<?, ?> error = (Map<?, ?>) errorMap.get("error");
            if (error != null && error.containsKey("message")) {
                return error.get("message").toString();
            }
        } catch (Exception ignored) {}
        return errorBody;
    }

    private String buildPrompt(String logExcerpt, int totalLines, int errorCount, int warningCount) {
        return String.format(
            "You are an experienced software debugging assistant. Analyze the supplied application logs.\n\n" +
            "Rules:\n" +
            "- Identify only meaningful problems (ERROR, WARN, Exception, FATAL, connection failures, etc.)\n" +
            "- Do NOT treat normal INFO messages as errors\n" +
            "- Determine the most likely root cause using evidence present in the logs\n" +
            "- Provide practical and safe troubleshooting steps\n" +
            "- If evidence is insufficient, explicitly say the cause is uncertain instead of inventing information\n" +
            "- Understand common technologies: Spring Boot, Java, PostgreSQL, REST APIs, HTTP, JDBC, Maven, Linux/server errors, common Java exceptions\n\n" +
            "Log Statistics:\n" +
            "- Total lines: %d\n" +
            "- Error lines: %d\n" +
            "- Warning lines: %d\n\n" +
            "Log Content:\n%s\n\n" +
            "Respond with ONLY valid JSON in this exact format (no markdown, no explanation outside JSON):\n" +
            "{\n" +
            "  \"summary\": \"Brief 2-3 sentence summary of what happened in the application\",\n" +
            "  \"issues\": [\n" +
            "    {\n" +
            "      \"title\": \"Short descriptive title\",\n" +
            "      \"severity\": \"CRITICAL|ERROR|WARNING|INFO\",\n" +
            "      \"category\": \"DATABASE|NETWORK|APPLICATION|CONFIGURATION|SECURITY|PERFORMANCE|OTHER\",\n" +
            "      \"error\": \"The exact error message or brief error description\",\n" +
            "      \"rootCause\": \"Detailed explanation of the most likely root cause based on log evidence\",\n" +
            "      \"confidence\": 85,\n" +
            "      \"solution\": [\"Step 1\", \"Step 2\", \"Step 3\"],\n" +
            "      \"relatedLines\": [\"Exact log line 1\", \"Exact log line 2\"]\n" +
            "    }\n" +
            "  ]\n" +
            "}\n\n" +
            "Order issues by severity (CRITICAL first). Include only real problems - maximum 10 issues.",
            totalLines, errorCount, warningCount, logExcerpt
        );
    }
}
