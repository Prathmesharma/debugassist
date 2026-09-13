import React, { useEffect, useState } from 'react';
import type { Analysis, AnalysisSummary } from '../types';
import { apiService, getErrorMessage } from '../services/api';
import { HistoryTable } from '../components/History/HistoryTable';
import { ErrorBanner } from '../components/common/ErrorBanner';

interface HistoryPageProps {
  onViewAnalysis: (analysis: Analysis) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewAnalysis }) => {
  const [histories, setHistories] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getAnalyses();
      setHistories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  const handleView = async (id: number) => {
    try {
      const analysis = await apiService.getAnalysis(id);
      onViewAnalysis(analysis);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    
    try {
      await apiService.deleteAnalysis(id);
      setHistories(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analysis History</h1>
        <p className="mt-2 text-gray-600">Review past log analyses and AI-generated insights.</p>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <HistoryTable 
        histories={histories}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
      />
    </div>
  );
};
