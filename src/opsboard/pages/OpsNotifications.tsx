import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import { useOpsData } from '../hooks/useOpsData';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  MessageSquare, 
  Briefcase, 
  CheckSquare, 
  AlertTriangle,
  Info,
  Archive,
  MoreVertical,
  Search
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { api } from '../../api';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'comment' | 'project' | 'alert' | 'system';
  read: boolean;
  timestamp: string;
}

const OpsNotifications: React.FC = () => {
  const { user, users, channels } = useOpsData();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const formatNotificationTitle = (title: string) => {
    if (title.startsWith('New Message:DM:')) {
      const idOrName = title.substring(15);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrName);
      if (isUUID) {
        const u = users?.find(u => u.id === idOrName);
        return `New Message: DM with ${u?.full_name || idOrName}`;
      }
      return `New Message: DM with ${idOrName}`;
    }
    if (title.startsWith('New Message:Channel:')) {
      const idOrName = title.substring(20);
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrName);
      if (isUUID) {
        const c = channels?.find(c => c.id === idOrName);
        return `New Message: #${c?.name || idOrName}`;
      }
      return `New Message: #${idOrName}`;
    }
    return title;
  };

  const formatNotificationDescription = (description: string) => {
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    return description.replace(uuidRegex, (match) => {
      const u = users?.find(u => u.id === match);
      return u?.full_name || match;
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/ops/notifications');
        if (Array.isArray(response)) {
          setNotifications(response.map((n: any) => ({
            id: n.id,
            title: n.title,
            description: n.description,
            type: n.type ? n.type.toLowerCase() : 'system',
            read: Boolean(n.is_read),
            timestamp: n.created_at
          })));
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setCurrentUser(JSON.parse(session));
    }
  }, [navigate]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeTab === 'unread' && n.read) return false;
      if (activeTab === 'archived' && !n.read) return false; // Simple logic: read are archived for demo
      
      if (searchTerm) {
        return n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
               n.description.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [notifications, activeTab, searchTerm]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/ops/notifications/${id}/read`, {});
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare size={16} className="text-cyan-500" />;
      case 'comment': return <MessageSquare size={16} className="text-indigo-500" />;
      case 'project': return <Briefcase size={16} className="text-amber-500" />;
      case 'alert': return <AlertTriangle size={16} className="text-rose-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <OpsLayout user={currentUser || user}>
      <main className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-slate-800 dark:text-slate-100 bg-transparent min-h-full">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Stay updated with your tasks and team activity.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="flex items-center gap-2 h-10 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
            >
              <Check size={14} /> Mark all as read
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex p-1 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 rounded-xl shadow-sm w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'unread' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Unread
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'archived' ? 'bg-cyan-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Archived
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search notifications..."
              className="w-full h-11 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 dark:text-slate-300 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <Bell size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="font-bold">No notifications found.</p>
              <p className="text-sm mt-1">You are all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-5 flex gap-4 items-start transition-colors ${notification.read ? 'opacity-75' : 'bg-cyan-50/30 dark:bg-cyan-500/5'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notification.type === 'alert' ? 'bg-rose-100 dark:bg-rose-500/20' : 
                    notification.type === 'task' ? 'bg-cyan-100 dark:bg-cyan-500/20' : 
                    notification.type === 'comment' ? 'bg-indigo-100 dark:bg-indigo-500/20' : 
                    notification.type === 'project' ? 'bg-amber-100 dark:bg-amber-500/20' : 
                    'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-bold ${notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                        {formatNotificationTitle(notification.title)}
                      </h3>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                      </span>
                    </div>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                       {formatNotificationDescription(notification.description)}
                     </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-cyan-600 dark:text-cyan-400"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-rose-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </OpsLayout>
  );
};

export default OpsNotifications;
