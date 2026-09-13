import React from 'react';
import type { Analysis } from '../../types';
import { formatAnalysisTime } from '../../utils/severity';
import { FileText, List, AlertTriangle, AlertOctagon, Lightbulb, Clock } from 'lucide-react';

interface AnalysisStatsProps {
  analysis: Analysis;
}

export const AnalysisStats: React.FC<AnalysisStatsProps> = ({ analysis }) => {
  const stats = [
    { label: 'Log File', value: analysis.fileName, icon: FileText, color: 'text-gray-600' },
    { label: 'Total Lines', value: analysis.totalLines.toLocaleString(), icon: List, color: 'text-gray-600' },
    { label: 'Errors Found', value: analysis.errorCount.toLocaleString(), icon: AlertOctagon, color: 'text-red-600', valueClass: 'text-red-600' },
    { label: 'Warnings', value: analysis.warningCount.toLocaleString(), icon: AlertTriangle, color: 'text-amber-600', valueClass: 'text-amber-600' },
    { label: 'Issues Detected', value: analysis.issues.length.toLocaleString(), icon: Lightbulb, color: 'text-blue-600', valueClass: 'text-blue-600' },
    { label: 'Analysis Time', value: formatAnalysisTime(analysis.analysisTimeMs), icon: Clock, color: 'text-gray-600' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                {stat.label}
              </span>
              <span className={`text-lg font-semibold truncate ${stat.valueClass || 'text-gray-900'}`} title={stat.value.toString()}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
