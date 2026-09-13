import React from 'react';
import { getSeverityColor } from '../../utils/severity';

interface IssueBadgeProps {
  severity: string;
  size?: 'sm' | 'md';
}

export const IssueBadge: React.FC<IssueBadgeProps> = ({ severity, size = 'sm' }) => {
  const colorClass = getSeverityColor(severity);
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  
  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}>
      {severity?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};
