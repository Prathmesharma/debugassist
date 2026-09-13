import React from 'react';
import { Eye, Trash2, FileText } from 'lucide-react';
import type { AnalysisSummary } from '../../types';
import { formatDate } from '../../utils/severity';

interface HistoryTableProps {
  histories: AnalysisSummary[];
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ histories, onView, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse flex flex-col">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 border-b border-gray-100 bg-gray-50 m-2 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No analyses yet</h3>
        <p className="mt-1 text-sm text-gray-500">Upload a log file to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lines</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {histories.map((history) => (
            <tr key={history.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{history.fileName}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(history.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {history.totalLines.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {history.issueCount > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {history.issueCount}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    0
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(history.id)}
                  className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1.5 rounded mr-2 transition-colors"
                  title="View Analysis"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(history.id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
