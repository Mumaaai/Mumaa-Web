import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageCircleHeart, MessageSquarePlus, X } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatSessions: any[];
  onSessionSelect: (id: string) => void;
  onNewChat: () => void;
  currentSessionId: string | null;
}

const formatDate = (dateStr: string) => {
  // Ensure the date is treated as UTC if no timezone is provided
  const normalizedDateStr = dateStr.includes('Z') || dateStr.includes('+') 
    ? dateStr 
    : `${dateStr.replace(' ', 'T')}Z`;
    
  const date = new Date(normalizedDateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

export default function HistorySidebar({ 
  isOpen, 
  onClose, 
  chatSessions, 
  onSessionSelect, 
  onNewChat,
  currentSessionId
}: HistorySidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/10 backdrop-blur-[2px] z-[45] md:hidden"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-[320px] bg-white border-l border-stone-100 z-[50] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-black text-stone-800 tracking-tight">Recent Chats</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">Your conversation history</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
              <button 
                onClick={() => { onNewChat(); onClose(); }}
                className="w-full py-4 bg-orange-50 border border-orange-100 rounded-[2rem] text-sm font-bold text-orange-600 hover:bg-orange-100 transition-all flex items-center justify-center gap-2 mb-6 group shadow-sm shadow-orange-100"
              >
                <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                Start New Chat
              </button>

              {chatSessions.length === 0 ? (
                <div className="py-20 text-center text-stone-400">
                  <div className="w-16 h-16 rounded-[2rem] bg-stone-50 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
                </div>
              ) : (
                chatSessions.map((session: any) => {
                  const isActive = session.session_id === currentSessionId;
                  return (
                    <button
                      key={session.session_id}
                      onClick={() => {
                        onSessionSelect(session.session_id);
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={`w-full text-left p-4 rounded-[2rem] transition-all group flex items-center gap-4 border ${
                        isActive 
                          ? 'bg-orange-50 border-orange-200 shadow-sm' 
                          : 'bg-white border-transparent hover:bg-stone-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all shadow-sm ${
                        isActive ? 'bg-white text-orange-500 scale-110' : 'bg-stone-50 text-stone-400 group-hover:bg-white group-hover:text-orange-400'
                      }`}>
                        <MessageCircleHeart className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-[15px] font-bold truncate transition-colors ${
                          isActive ? 'text-orange-900' : 'text-stone-700 group-hover:text-stone-900'
                        }`}>
                          {session.title || 'Saheli Session'}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className={`w-3 h-3 ${isActive ? 'text-orange-300' : 'text-stone-400'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-orange-400' : 'text-stone-400'}`}>
                            {formatDate(session.created_at)}
                          </span>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-6 bg-stone-50/50 border-t border-stone-100">
              <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">
                Mumaa AI Companion
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
