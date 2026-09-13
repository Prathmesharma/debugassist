import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, FileCode } from 'lucide-react';
import type { Issue } from '../../types';
import { IssueBadge } from './IssueBadge';
import { getSeverityDot } from '../../utils/severity';

interface IssuePanelProps {
  issues: Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue) => void;
  summary?: string;
}

export const IssuePanel: React.FC<IssuePanelProps> = ({ issues, selectedIssue, onSelectIssue, summary }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">AI Analysis</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {issues.length === 0 ? (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-lg border border-green-100 mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="text-lg font-medium text-green-800">No Issues Detected</h3>
              <p className="text-sm text-green-600 mt-1">The log file looks clean without any critical errors or warnings.</p>
            </div>
            {summary && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-200">
                  {summary}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Issue List Header */}
            <div className="px-4 py-2 border-b border-gray-100 bg-white">
              <span className="text-xs font-semibold text-gray-500 uppercase">{issues.length} Issues Found</span>
            </div>
            
            {/* Scrollable Issue List */}
            <div className="max-h-48 overflow-y-auto border-b border-gray-200">
              {issues.map(issue => (
                <button
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                    selectedIssue?.id === issue.id ? 'bg-blue-50/50 hover:bg-blue-50/50 relative' : ''
                  }`}
                >
                  {selectedIssue?.id === issue.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  )}
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${getSeverityDot(issue.severity)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <IssueBadge severity={issue.severity} />
                      <span className="text-xs text-gray-500 truncate">{issue.category}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Issue Details */}
            {selectedIssue ? (
              <div className="flex-1 overflow-auto p-5 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedIssue.title}</h3>
                  <IssueBadge severity={selectedIssue.severity} size="md" />
                </div>

                <div className="space-y-6">
                  {/* What Happened */}
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      What happened?
                    </h4>
                    <p className="text-sm text-gray-600 bg-red-50 text-red-900 p-3 rounded border border-red-100">
                      {selectedIssue.errorMessage}
                    </p>
                  </section>

                  {/* Root Cause */}
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      Root Cause
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedIssue.rootCause}
                    </p>
                  </section>

                  {/* Confidence */}
                  <section>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-800">AI Confidence</h4>
                      <span className="text-xs font-medium text-gray-600">{selectedIssue.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedIssue.confidence >= 80 ? 'bg-green-500' :
                          selectedIssue.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedIssue.confidence}%` }}
                      ></div>
                    </div>
                  </section>

                  {/* How to fix */}
                  <section>
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      How to Fix
                    </h4>
                    <ol className="list-decimal list-outside ml-4 space-y-2 text-sm text-gray-700">
                      {selectedIssue.solution.map((step, idx) => (
                        <li key={idx} className="pl-1 leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </section>

                  {/* Relevant Logs */}
                  {selectedIssue.relatedLogLines && selectedIssue.relatedLogLines.length > 0 && (
                    <section>
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                        <FileCode className="w-4 h-4 text-gray-500" />
                        Relevant Log Lines
                      </h4>
                      <div className="bg-[#1a2332] rounded-md p-3 overflow-x-auto">
                        <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all">
                          {selectedIssue.relatedLogLines.join('\n')}
                        </pre>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select an issue to view details
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
