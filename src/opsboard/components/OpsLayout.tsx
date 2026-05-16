import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface OpsLayoutProps {
  user: any;
  onAddClick?: () => void;
  children: React.ReactNode;
}

const OpsLayout: React.FC<OpsLayoutProps> = ({ user, onAddClick, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('ops_sidebar_collapsed') === 'true');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('ops_theme') as 'dark' | 'light') || 'dark');

  useEffect(() => {
    localStorage.setItem('ops_sidebar_collapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('ops_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[radial-gradient(circle_at_top_left,_#111827_0,_#0f172a_38%,_#020617_100%)] flex font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[286px] transform md:hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar user={user} onLinkClick={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block shrink-0 h-screen sticky top-0 overflow-hidden transition-[width] duration-300 ease-in-out ${isSidebarCollapsed ? 'w-[88px]' : 'w-[286px]'}`}>
        <Sidebar
          user={user}
          onLinkClick={() => setIsMobileMenuOpen(false)}
          collapsed={isSidebarCollapsed}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="flex-1 overflow-auto bg-transparent dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_40%)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OpsLayout;
