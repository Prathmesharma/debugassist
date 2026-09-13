import React, { useState } from 'react';
import type { Analysis, Issue } from '../types';
import { AnalysisStats } from '../components/Analysis/AnalysisStats';
import { LogViewer } from '../components/Analysis/LogViewer';
import { IssuePanel } from '../components/Analysis/IssuePanel';

interface AnalyzePageProps {
  analysis: Analysis;
  logContent: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ analysis, logContent }) => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(
    analysis.issues.length > 0 ? analysis.issues[0] : null
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Stats Bar */}
      <AnalysisStats analysis={analysis} />

      {/* Main Content Area (Split) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Log Viewer (60%) */}
        <div className="w-[60%] min-w-[500px] flex flex-col">
          <LogViewer 
            logContent={logContent} 
            issues={analysis.issues}
            selectedIssue={selectedIssue}
          />
        </div>

        {/* Right: Analysis Panel (40%) */}
        <div className="w-[40%] min-w-[400px] border-l border-gray-200 z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <IssuePanel 
            issues={analysis.issues}
            selectedIssue={selectedIssue}
            onSelectIssue={setSelectedIssue}
            summary={analysis.summary}
          />
        </div>
      </div>
    </div>
  );
};
