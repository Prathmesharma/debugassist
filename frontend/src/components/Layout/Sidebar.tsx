import React from 'react';
import { LayoutDashboard, Search, History, Settings, TerminalSquare } from 'lucide-react';
import type { NavPage } from '../../types';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Logs', icon: Search },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="fixed inset-y-0 left-0 w-60 bg-navy-950 text-white flex flex-col z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <TerminalSquare className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-semibold">DebugAssist</span>
        </div>
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-4">
          Find Issues. Get Answers. Ship Faster.
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy-800 text-white border-l-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-navy-900 border-l-2 border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-800">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">AI-powered debugging</span>
          <span className="mt-1 inline-flex items-center rounded-full bg-navy-800 px-2 py-0.5 text-xs font-medium text-gray-400">
            v1.0
          </span>
        </div>
      </div>
    </div>
  );
};
