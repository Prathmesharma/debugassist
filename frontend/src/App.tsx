import React, { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import type { NavPage, Analysis } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [logContent, setLogContent] = useState<string>('');

  const handleNavigate = (page: NavPage) => {
    if (page === 'analyze' && !currentAnalysis) {
      setCurrentPage('dashboard');
      return;
    }
    setCurrentPage(page);
  };

  const handleAnalysisComplete = (analysis: Analysis, content: string) => {
    setCurrentAnalysis(analysis);
    setLogContent(content);
    setCurrentPage('analyze');
  };

  const handleViewAnalysis = (analysis: Analysis) => {
    setCurrentAnalysis(analysis);
    // When viewing from history, we might not have the full log content 
    // unless the backend stores it. For now, empty string or a message.
    setLogContent('Log content not available for historical analyses.');
    setCurrentPage('analyze');
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'dashboard' && <DashboardPage onAnalysisComplete={handleAnalysisComplete} />}
      {currentPage === 'analyze' && currentAnalysis && (
        <AnalyzePage analysis={currentAnalysis} logContent={logContent} />
      )}
      {currentPage === 'history' && <HistoryPage onViewAnalysis={handleViewAnalysis} />}
      {currentPage === 'settings' && <SettingsPage />}
    </Layout>
  );
}

export default App;
