import React, { useState, useEffect } from 'react';
import { UploadCloud, ClipboardType, FileCode2 } from 'lucide-react';
import type { Analysis, AnalyzeTab } from '../types';
import { apiService, getErrorMessage } from '../services/api';
import { SAMPLE_LOG } from '../utils/sampleLog';
import { DropZone } from '../components/Upload/DropZone';
import { LogPasteArea } from '../components/Upload/LogPasteArea';
import { AnalyzingState } from '../components/Analysis/AnalyzingState';
import { ErrorBanner } from '../components/common/ErrorBanner';

interface DashboardPageProps {
  onAnalysisComplete: (analysis: Analysis, logContent: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<AnalyzeTab>('upload');
  const [pastedLog, setPastedLog] = useState('');
  const [pastedFileName, setPastedFileName] = useState('pasted-log.txt');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Cycle analysis steps for visual feedback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStep(s => (s < 3 ? s + 1 : s));
      }, 2000);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyzeUpload = async () => {
    if (!fileToUpload) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const content = await fileToUpload.text();
      const analysis = await apiService.analyzeFile(fileToUpload);
      onAnalysisComplete(analysis, content);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzePaste = async () => {
    if (!pastedLog.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const name = activeTab === 'sample' ? 'spring-boot-sample.log' : pastedFileName;
      const analysis = await apiService.analyzeLog(pastedLog, name || 'pasted-log.txt');
      onAnalysisComplete(analysis, pastedLog);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsAnalyzing(false);
    }
  };

  const loadSample = () => {
    setPastedLog(SAMPLE_LOG);
  };

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analyze Your Logs</h1>
        <p className="mt-2 text-gray-600">Find errors, understand root causes, and get actionable solutions instantly.</p>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isAnalyzing ? (
          <AnalyzingState currentStep={analysisStep} />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'upload' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UploadCloud className="w-4 h-4" /> File Upload
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'paste' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ClipboardType className="w-4 h-4" /> Paste Logs
              </button>
              <button
                onClick={() => setActiveTab('sample')}
                className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'sample' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileCode2 className="w-4 h-4" /> Sample Log
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <DropZone onFileSelect={setFileToUpload} />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAnalyzeUpload}
                      disabled={!fileToUpload}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Analyze File
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'paste' && (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 w-24">File Name:</label>
                    <input
                      type="text"
                      value={pastedFileName}
                      onChange={(e) => setPastedFileName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. app-error.log"
                    />
                  </div>
                  <LogPasteArea value={pastedLog} onChange={setPastedLog} />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAnalyzePaste}
                      disabled={!pastedLog.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Analyze Logs
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'sample' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Spring Boot Database Connection Error</h3>
                    <p className="text-sm text-blue-600">
                      This sample contains a realistic Spring Boot startup failure due to PostgreSQL authentication issues, followed by a NullPointerException request handling error.
                    </p>
                  </div>
                  
                  {!pastedLog ? (
                    <div className="text-center py-8">
                      <button
                        onClick={loadSample}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm"
                      >
                        Load Sample Log Data
                      </button>
                    </div>
                  ) : (
                    <>
                      <LogPasteArea value={pastedLog} onChange={setPastedLog} />
                      <div className="flex justify-end">
                        <button
                          onClick={handleAnalyzePaste}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors"
                        >
                          Analyze Sample
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
