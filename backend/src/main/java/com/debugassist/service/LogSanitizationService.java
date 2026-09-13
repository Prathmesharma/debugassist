package com.debugassist.service;

import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class LogSanitizationService {

    public String sanitize(String logContent) {
        if (logContent == null) return null;
        
        String sanitized = logContent;
        // Password patterns
        sanitized = Pattern.compile("(?i)(password|passwd|pwd)\\s*[=:]\\s*\\S+").matcher(sanitized).replaceAll("$1=[REDACTED]");
        // API keys
        sanitized = Pattern.compile("(?i)(api[-_]?key|apikey)\\s*[=:]\\s*\\S+").matcher(sanitized).replaceAll("$1=[REDACTED]");
        // Access tokens
        sanitized = Pattern.compile("(?i)(access[-_]?token|token)\\s*[=:]\\s*\\S+").matcher(sanitized).replaceAll("$1=[REDACTED]");
        // Bearer tokens in Authorization headers
        sanitized = Pattern.compile("(?i)Authorization:\\s*Bearer\\s+[A-Za-z0-9._\\-]+").matcher(sanitized).replaceAll("Authorization: Bearer [REDACTED]");
        // Basic auth in Authorization headers
        sanitized = Pattern.compile("(?i)Authorization:\\s*Basic\\s+[A-Za-z0-9+/=]+").matcher(sanitized).replaceAll("Authorization: Basic [REDACTED]");
        // JWT tokens (3 base64 parts separated by dots)
        sanitized = Pattern.compile("eyJ[A-Za-z0-9._\\-]{20,}").matcher(sanitized).replaceAll("[JWT_REDACTED]");
        // Secret keys
        sanitized = Pattern.compile("(?i)(secret|secret[-_]?key)\\s*[=:]\\s*\\S+").matcher(sanitized).replaceAll("$1=[REDACTED]");
        // Database URLs with embedded credentials
        sanitized = Pattern.compile("(?i)(jdbc:[^:]+://)[^:@]+:[^@]+@").matcher(sanitized).replaceAll("$1[REDACTED]:[REDACTED]@");
        // AWS keys
        sanitized = Pattern.compile("(AKIA[A-Z0-9]{16})").matcher(sanitized).replaceAll("[AWS_KEY_REDACTED]");
        // Generic key=value for common secret names
        sanitized = Pattern.compile("(?i)(private[-_]?key|client[-_]?secret|aws[-_]?secret)\\s*[=:]\\s*\\S+").matcher(sanitized).replaceAll("$1=[REDACTED]");
        
        return sanitized;
    }
}
