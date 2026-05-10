import { useState } from 'react';
import { User, Sparkles, Volume2, History, MessageSquarePlus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TabId } from './Sidebar';

interface HeaderProps {
  onMenuClick: () => void;
  activeTab: TabId;
  user: any;
  chatSessions?: any[];
  onSessionSelect?: (id: string) => void;
  onNewChat?: () => void;
}

const getTabTitle = (tab: TabId) => {
  switch (tab) {
    case 'chat': return 'AI Chat';
    case 'dashboard': return 'Dashboard';
    case 'feeding': return 'Log & Sleep';
    case 'growth': return 'Growth Tracker';
    case 'vaccination': return 'Vaccination';
    case 'milestones': return 'Milestones';
    case 'guide': return 'Parenting Guide';
    case 'diet': return 'Diet Plans';
    case 'study': return 'Play Ideas';
    case 'games': return 'Toddler Games';
    case 'routine': return 'Routine Planner';
    case 'cry': return 'Cry Analyzer';
    case 'journal': return 'Memory Journal';
    case 'lullaby': return 'Sleep & Lullabies';
    case 'photo': return 'Vision AI';
    default: return 'Mumaa AI';
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Header({ onMenuClick, activeTab, user, chatSessions = [], onSessionSelect, onNewChat }: HeaderProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="h-16 min-h-[4rem] border-b border-stone-200/60 flex items-center justify-between px-4 md:px-8 bg-white/85 backdrop-blur-xl z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-orange-900 shadow-sm btn-press border border-white">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
        <div>
          <h2 className="font-bold text-xl leading-tight tracking-tight text-stone-800">{getTabTitle(activeTab)}</h2>
          <p className="text-[11px] text-stone-500 font-semibold tracking-wider uppercase truncate max-w-[150px] sm:max-w-none mt-0.5">
            Welcome, {user?.name?.split(' ')[0] || 'Parent'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3 relative">
        {activeTab === 'chat' && (
          <>
            <button 
              onClick={onNewChat}
              className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-stone-600 hover:text-orange-600" 
              title="New Chat"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`p-2.5 rounded-full transition-all border btn-press shadow-sm ${isHistoryOpen ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-stone-200 text-stone-600 hover:text-orange-600'}`} 
              title="Chat History"
            >
              <History className="w-5 h-5" />
            </button>
          </>
        )}

        <button className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-amber-500" title="Daily Tip">
          <Sparkles className="w-5 h-5" />
        </button>
        <button className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-stone-500 hover:text-stone-700" title="Toggle Voice">
          <Volume2 className="w-5 h-5" />
        </button>

        {/* History Dropdown */}
        <AnimatePresence>
          {isHistoryOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsHistoryOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-14 w-72 bg-white rounded-[2rem] shadow-2xl border border-stone-100 z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-stone-50 bg-stone-50/50">
                  <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest px-2">Recent Chats</h3>
                </div>
                <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                  {chatSessions.length === 0 ? (
                    <div className="py-8 text-center text-stone-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
                    </div>
                  ) : (
                    chatSessions.map((session: any) => (
                      <button
                        key={session.session_id}
                        onClick={() => {
                          onSessionSelect?.(session.session_id);
                          setIsHistoryOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-stone-50 rounded-2xl transition-colors group flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                          <History className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-stone-700 truncate">Chat Session</div>
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{formatDate(session.created_at)}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-3 bg-stone-50/30 border-t border-stone-50">
                  <button 
                    onClick={() => { onNewChat?.(); setIsHistoryOpen(false); }}
                    className="w-full py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-black text-stone-600 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquarePlus className="w-4 h-4" /> Start New Chat
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
