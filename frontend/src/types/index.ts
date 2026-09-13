export interface Issue {
  id: number;
  title: string;
  severity: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
  category: string;
  errorMessage: string;
  rootCause: string;
  confidence: number;
  solution: string[];
  relatedLogLines: string[];
}

export interface Analysis {
  id: number;
  fileName: string;
  summary: string;
  totalLines: number;
  errorCount: number;
  warningCount: number;
  analysisTimeMs: number;
  createdAt: string;
  issues: Issue[];
}

export interface AnalysisSummary {
  id: number;
  fileName: string;
  totalLines: number;
  errorCount: number;
  warningCount: number;
  issueCount: number;
  analysisTimeMs: number;
  createdAt: string;
  status: string;
}

export interface ApiError {
  error: string;
}

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'FATAL' | 'SEVERE';

export interface LogLine {
  lineNumber: number;
  raw: string;
  timestamp?: string;
  level?: LogLevel;
  logger?: string;
  message: string;
  isError: boolean;
  isWarning: boolean;
}

export type AnalyzeTab = 'upload' | 'paste' | 'sample';
export type NavPage = 'dashboard' | 'analyze' | 'history' | 'settings';
