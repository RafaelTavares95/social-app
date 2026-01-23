import React from 'react';
import { Header } from './Header';
import type { User } from '../../types/auth';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export function MainLayout({ children, user, onLogout }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={user} 
        onLogout={onLogout} 
      />
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
