import React from 'react';
import { Bot, Shield, FileText, Moon } from 'lucide-react';

interface SettingsPanelProps {
  apiConfigured: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ apiConfigured }) => {
  return (
    <div className="max-w-3xl bg-white shadow-sm rounded-lg border border-gray-200 divide-y divide-gray-200">
      
      {/* AI Settings */}
      <div className="p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-blue-500" />
          AI Settings
        </h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">AI Provider</dt>
            <dd className="mt-1 text-sm text-gray-900 flex items-center gap-2">
              Google Gemini
              {apiConfigured ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Not Configured
                </span>
              )}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Model</dt>
            <dd className="mt-1 text-sm text-gray-900">gemini-2.0-flash</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Configuration</dt>
            <dd className="mt-1 text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200">
              API keys are securely managed via environment variables on the backend server.
              Ensure <code>GEMINI_API_KEY</code> is set in the server's environment.
            </dd>
          </div>
        </dl>
      </div>

      {/* Analysis Settings */}
      <div className="p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-500" />
          Analysis Configuration
        </h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Maximum File Size</dt>
            <dd className="mt-1 text-sm text-gray-900">20 MB</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Secret Redaction</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Enabled
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Excerpt Mode</dt>
            <dd className="mt-1 text-sm text-gray-900">Smart extraction</dd>
            <dd className="mt-1 text-xs text-gray-500">
              The backend automatically extracts relevant error contexts from large logs to stay within token limits.
            </dd>
          </div>
        </dl>
      </div>

      {/* Appearance */}
      <div className="p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-indigo-500" />
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Theme</h4>
            <p className="text-sm text-gray-500">Choose your preferred visual theme.</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-gray-900">
              Light
            </button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900">
              Dark
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
