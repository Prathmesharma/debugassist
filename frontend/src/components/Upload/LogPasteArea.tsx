import React from 'react';

interface LogPasteAreaProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export const LogPasteArea: React.FC<LogPasteAreaProps> = ({ value, onChange, disabled }) => {
  const lineCount = value ? value.split('\n').length : 0;
  const charCount = value.length;

  return (
    <div className="relative rounded-md border border-gray-300 shadow-sm bg-[#1a2332] overflow-hidden">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste your application logs here..."
        className="w-full h-full min-h-[280px] p-4 bg-transparent text-gray-200 font-mono text-sm resize-y focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 log-scroll"
        spellCheck={false}
      />
      <div className="absolute bottom-2 right-3 text-xs text-gray-400 font-mono pointer-events-none flex gap-4">
        <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
        <span>{charCount} chars</span>
      </div>
    </div>
  );
};
