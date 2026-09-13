import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search, Download } from 'lucide-react';
import type { Issue, LogLine } from '../../types';
import { parseLogLines, filterLines } from '../../utils/logParser';

interface LogViewerProps {
  logContent: string;
  issues: Issue[];
  selectedIssue: Issue | null;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logContent, issues, selectedIssue }) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning'>('all');
  const [search, setSearch] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const parsedLines = useMemo(() => parseLogLines(logContent), [logContent]);
  const displayedLines = useMemo(() => filterLines(parsedLines, filter, search), [parsedLines, filter, search]);

  const relatedLineNumbers = useMemo(() => {
    if (!selectedIssue || !selectedIssue.relatedLogLines.length) return new Set<number>();
    const lines = new Set<number>();
    
    // Simple heuristic to find matching lines. In a real app, AI should return line numbers.
    selectedIssue.relatedLogLines.forEach(targetLine => {
      const match = parsedLines.find(l => l.raw.includes(targetLine.trim()) || targetLine.includes(l.message.trim()));
      if (match) lines.add(match.lineNumber);
    });
    return lines;
  }, [selectedIssue, parsedLines]);

  useEffect(() => {
    if (relatedLineNumbers.size > 0 && logContainerRef.current) {
      const firstLineNum = Math.min(...Array.from(relatedLineNumbers));
      const element = lineRefs.current.get(firstLineNum);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedIssue, relatedLineNumbers]);

  const handleDownload = () => {
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debugassist_log.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-gray-800">
      <div className="flex items-center justify-between px-4 py-2 bg-navy-950 border-b border-gray-800">
        <div className="flex space-x-1">
          {(['all', 'error', 'warning'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === f ? 'bg-navy-700 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-navy-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Filter logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-navy-900 border border-gray-700 text-gray-200 text-xs rounded-md pl-8 pr-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
          </div>
          <button
            onClick={handleDownload}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            title="Download Log"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div 
        ref={logContainerRef}
        className="flex-1 overflow-auto log-scroll font-mono text-xs py-2"
      >
        {displayedLines.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No log lines match current filters.</div>
        ) : (
          displayedLines.map((line) => {
            const isHighlighted = relatedLineNumbers.has(line.lineNumber);
            
            let bgClass = 'hover:bg-[#161b22]';
            if (isHighlighted) bgClass = 'bg-blue-900/30 border-l-2 border-blue-500';
            else if (line.isError) bgClass = 'bg-red-950/20 hover:bg-red-950/40';
            else if (line.isWarning) bgClass = 'bg-amber-950/10 hover:bg-amber-950/30';
            else if (isHighlighted === false) bgClass += ' border-l-2 border-transparent';

            let levelClass = 'text-gray-500';
            if (line.isError) levelClass = 'text-red-400 font-semibold';
            else if (line.isWarning) levelClass = 'text-amber-400 font-semibold';
            else if (line.level === 'INFO') levelClass = 'text-blue-400';

            return (
              <div 
                key={line.lineNumber}
                ref={el => { if (el) lineRefs.current.set(line.lineNumber, el); }}
                className={`flex px-2 py-0.5 whitespace-pre-wrap break-all ${bgClass}`}
              >
                <div className="w-12 flex-shrink-0 text-right pr-4 text-gray-600 select-none border-r border-gray-800 mr-3">
                  {line.lineNumber}
                </div>
                {line.timestamp && (
                  <div className="w-36 flex-shrink-0 text-gray-500 select-none mr-2">
                    {line.timestamp}
                  </div>
                )}
                {line.level && (
                  <div className={`w-16 flex-shrink-0 select-none ${levelClass}`}>
                    {line.level}
                  </div>
                )}
                <div className={`flex-1 ${line.isError ? 'text-gray-200' : 'text-gray-300'}`}>
                  {line.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
