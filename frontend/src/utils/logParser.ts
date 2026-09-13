import type { LogLine, LogLevel } from '../types';

const LOG_LEVEL_PATTERN = /\b(ERROR|WARN|INFO|DEBUG|TRACE|FATAL|SEVERE)\b/;
const TIMESTAMP_PATTERN = /(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?)|(?:^|\s)(\d{2}:\d{2}:\d{2}(?:[.,]\d+)?)/;

export function parseLogLines(content: string): LogLine[] {
  if (!content) return [];
  const lines = content.split('\n');
  return lines.map((raw, index) => {
    const levelMatch = LOG_LEVEL_PATTERN.exec(raw);
    const level = (levelMatch?.[1] as LogLevel) || undefined;
    const timestampMatch = TIMESTAMP_PATTERN.exec(raw);
    const timestamp = timestampMatch?.[1] || timestampMatch?.[2] || undefined;
    const isError = level === 'ERROR' || level === 'FATAL' || level === 'SEVERE' ||
      /\bException\b|\bError\b|\bFATAL\b|Caused by:/i.test(raw);
    const isWarning = level === 'WARN';
    
    // Extract message (everything after level)
    let message = raw;
    if (level) {
      const idx = raw.indexOf(level);
      message = raw.substring(idx + level.length).trim().replace(/^[-:\s]+/, '');
    }

    return {
      lineNumber: index + 1,
      raw,
      timestamp,
      level,
      message: message || raw,
      isError,
      isWarning,
    };
  });
}

export function filterLines(
  lines: LogLine[],
  filter: 'all' | 'error' | 'warning',
  search: string
): LogLine[] {
  let result = lines;
  if (filter === 'error') result = result.filter(l => l.isError);
  if (filter === 'warning') result = result.filter(l => l.isWarning);
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(l => l.raw.toLowerCase().includes(q));
  }
  return result;
}
