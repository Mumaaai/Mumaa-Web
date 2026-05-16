import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-react';

interface TopbarProps {
  onMenuClick?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onToggleSidebar, isSidebarCollapsed, theme, onToggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ops_session');
    navigate('/opsboard/auth');
  };

  return (
    <header className="h-16 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/8 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm dark:shadow-[0_1px_0_rgba(15,23,42,0.12)] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="flex items-center flex-1 max-w-2xl gap-3 min-w-0">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden md:inline-flex items-center justify-center p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 rounded-xl transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
        <div className="relative group flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks, projects, or team members..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 focus:bg-white dark:focus:bg-white/10 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl text-sm transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <button className="sm:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 rounded-xl transition-colors">
          <Search size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {onToggleTheme && (
          <button onClick={onToggleTheme} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 rounded-xl transition-colors" title="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        <div className="hidden md:block h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-1 md:mx-2" />

        {/* Logout Icon */}
        <button 
          onClick={handleLogout}
          className="hidden sm:block p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 rounded-xl transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
