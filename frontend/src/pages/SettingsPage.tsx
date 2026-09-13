import React, { useState, useEffect } from 'react';
import { SettingsPanel } from '../components/Settings/SettingsPanel';
import { apiService } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [apiConfigured, setApiConfigured] = useState(true); // Default true, update if check fails

  useEffect(() => {
    // Quick check to see if API is alive. If we get analyses, it's configured.
    apiService.getAnalyses().catch(() => {
      // In a real app, you might have a dedicated /health endpoint
      setApiConfigured(false);
    });
  }, []);

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="mt-2 text-gray-600">Configure application preferences and analysis rules.</p>
      </div>

      <SettingsPanel apiConfigured={apiConfigured} />
    </div>
  );
};
