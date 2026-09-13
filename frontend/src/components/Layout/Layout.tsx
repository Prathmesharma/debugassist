import React from 'react';
import { Sidebar } from './Sidebar';
import type { NavPage } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="ml-60 flex-1 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
};
