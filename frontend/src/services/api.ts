import axios from 'axios';
import type { Analysis, AnalysisSummary } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 120000, // 2 min for AI analysis
});

export const apiService = {
  async analyzeLog(logContent: string, fileName: string): Promise<Analysis> {
    const response = await api.post('/analyze', { logContent, fileName });
    return response.data;
  },

  async analyzeFile(file: File): Promise<Analysis> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/analyze/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getAnalyses(): Promise<AnalysisSummary[]> {
    const response = await api.get('/analyses');
    return response.data;
  },

  async getAnalysis(id: number): Promise<Analysis> {
    const response = await api.get(`/analyses/${id}`);
    return response.data;
  },

  async deleteAnalysis(id: number): Promise<void> {
    await api.delete(`/analyses/${id}`);
  },
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.error) return data.error;
    if (error.code === 'ERR_NETWORK') return 'Cannot connect to server. Make sure the backend is running.';
    if (error.response?.status === 413) return 'File too large. Maximum size is 20MB.';
    if (error.response?.status === 500) return 'Server error. Please try again.';
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
