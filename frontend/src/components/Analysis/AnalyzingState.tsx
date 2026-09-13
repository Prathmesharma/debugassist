import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface AnalyzingStateProps {
  currentStep: number;
}

export const AnalyzingState: React.FC<AnalyzingStateProps> = ({ currentStep }) => {
  const steps = [
    'Scanning log entries...',
    'Finding important errors...',
    'Understanding root causes...',
    'Generating solutions...'
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <h2 className="text-2xl font-semibold text-gray-800">Analyzing Logs</h2>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div key={index} className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  isCompleted ? 'text-gray-900' :
                  isCurrent ? 'text-blue-700' : 'text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gray-100 rounded-full h-1.5 w-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
