import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { User } from '../../types/auth';

interface MainLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export function MainLayout({ children, user, onLogout }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        user={user} 
        onLogout={onLogout} 
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar 
          onLogout={onLogout} 
          isCollapsed={isSidebarCollapsed}
          onToggle={setIsSidebarCollapsed}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <div className="w-full h-full px-4 md:px-8 lg:px-12 py-8 md:py-12">
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
