export type Severity = 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';

export function getSeverityColor(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
    case 'ERROR': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'WARNING': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'INFO': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getSeverityDot(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 'bg-red-500';
    case 'ERROR': return 'bg-orange-500';
    case 'WARNING': return 'bg-amber-500';
    case 'INFO': return 'bg-blue-500';
    default: return 'bg-gray-400';
  }
}

export function getSeverityOrder(severity: string): number {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return 0;
    case 'ERROR': return 1;
    case 'WARNING': return 2;
    case 'INFO': return 3;
    default: return 4;
  }
}

export function formatAnalysisTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = (ms / 1000).toFixed(1);
  return `${s}s`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
