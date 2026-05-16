import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Calendar, 
  BarChart3, 
  Bell, 
  Settings,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  user: any;
  onLinkClick?: () => void;
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLinkClick, collapsed = false }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/opsboard' },
    { name: 'Chat', icon: MessageSquare, path: '/opsboard/chat' },
    { name: 'Projects', icon: Briefcase, path: '/opsboard/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/opsboard/tasks' },
    { name: 'Teams', icon: Users, path: '/opsboard/teams' },
    { name: 'Staff Admin', icon: ShieldCheck, path: '/opsboard/admin', adminOnly: true },
    { name: 'Calendar', icon: Calendar, path: '/opsboard/calendar' },
    { name: 'Reports', icon: BarChart3, path: '/opsboard/reports' },
    { name: 'Notifications', icon: Bell, path: '/opsboard/notifications' },
    { name: 'Settings', icon: Settings, path: '/opsboard/settings' },
  ];

  return (
    <aside className="relative h-full w-full flex flex-col bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-white border-r border-slate-200 dark:border-white/10 shadow-lg dark:shadow-[0_10px_30px_rgba(15,23,42,0.18)] overflow-hidden transition-colors duration-300">
      <div className={`pt-5 pb-4 border-b border-slate-200 dark:border-white/10 transition-all duration-300 flex flex-col h-full`}>
        <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center px-0 mb-6' : 'px-6 mb-2 gap-3'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <span className="text-white font-black">M</span>
          </div>
          <div className={`transition-all duration-300 overflow-hidden flex-1 ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">MumaaAI Ops</h1>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/45 mt-1 whitespace-nowrap">Operations hub</p>
          </div>
        </div>

        <nav className={`mt-4 space-y-1.5 transition-all duration-300 ${collapsed ? 'px-4' : 'px-4'}`}>
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'Admin') return null;
            
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onLinkClick}
                className={`group flex items-center transition-all duration-300 overflow-hidden ${
                  collapsed 
                    ? `w-12 h-12 mx-auto rounded-2xl justify-center ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 dark:text-white/70 hover:text-blue-600 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-white/8'}`
                    : `w-full h-12 px-4 rounded-2xl justify-start ${isActive ? 'bg-blue-600 dark:bg-white text-white dark:text-slate-900 shadow-lg dark:shadow-black/10 shadow-blue-600/20' : 'text-slate-600 dark:text-white/70 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8'}`
                }`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon size={20} className={`shrink-0 transition-colors ${isActive && !collapsed ? 'text-white dark:text-blue-600' : 'text-current'}`} />
                <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 overflow-hidden ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto border-t border-slate-200 dark:border-white/10 transition-all duration-300 ${collapsed ? 'px-4 pt-4 pb-2' : 'p-6'}`}>
          <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden shrink-0">
              <img 
                src={user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0D8ABC&color=fff`} 
                alt="User"
              />
            </div>
            <div className={`transition-all duration-300 overflow-hidden flex-1 ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate whitespace-nowrap">{user?.name || 'Staff User'}</p>
              <p className="text-xs text-slate-500 dark:text-white/55 truncate whitespace-nowrap">{user?.email || 'staff@mumaa.ai'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
