import { useState, useEffect } from 'react';
import { User, Sparkles, History, MessageSquarePlus, X, Loader2, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { TabId } from './Sidebar';

interface HeaderProps {
  onMenuClick: () => void;
  activeTab: TabId;
  user: any;
  babyProfile: any;
  activeSessionTitle?: string;
  isHistoryOpen?: boolean;
  onHistoryToggle?: () => void;
  onNewChat?: () => void;
}

const getTabTitle = (tab: TabId, activeSessionTitle?: string) => {
  if (tab === 'chat' && activeSessionTitle) return activeSessionTitle;
  
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

export default function Header({ 
  onMenuClick, 
  activeTab, 
  user, 
  babyProfile, 
  activeSessionTitle,
  isHistoryOpen,
  onHistoryToggle,
  onNewChat 
}: HeaderProps) {
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [dailyTip, setDailyTip] = useState<string>("");
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);

  const calculateAge = (dob: string) => {
    if (!dob) return "Newborn";
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months < 1) return "Newborn";
    if (months < 12) return `${months} months`;
    return `${Math.floor(months / 12)} years`;
  };

  const generateAITip = async () => {
    if (dailyTip && !isTipOpen) return; // Only generate if we don't have one or opening
    if (!window.puter) return;
    
    setIsGeneratingTip(true);
    try {
      const babyAge = calculateAge(babyProfile?.date_of_birth);
      const babyName = babyProfile?.name || "the baby";
      
      const response = await window.puter.ai.chat([
        { 
          role: 'system', 
          content: 'You are MUMAA, a gentle parenting companion. Generate ONE supportive, practical, and warm parenting tip (max 25 words). Focus on the baby\'s age and well-being. Use a maternal, soothing tone. No quotes.' 
        },
        { 
          role: 'user', 
          content: `Generate a tip for a parent of a ${babyAge} old baby named ${babyName}.` 
        }
      ], { model: 'gpt-4o-mini' });
      
      setDailyTip(response?.message?.content || "Trust your heart, Mumaa. You are doing a wonderful job.");
    } catch (e) {
      setDailyTip("Every moment with your little one is a gift. Embrace the journey.");
    } finally {
      setIsGeneratingTip(false);
    }
  };

  useEffect(() => {
    if (isTipOpen && !dailyTip) {
      generateAITip();
    }
  }, [isTipOpen]);

  return (
    <>
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
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl leading-tight tracking-tight text-stone-800">{getTabTitle(activeTab, activeSessionTitle)}</h2>
              {activeTab === 'chat' && activeSessionTitle && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:block" />
              )}
            </div>
            <p className="text-[11px] text-stone-500 font-semibold tracking-wider uppercase truncate max-w-[150px] sm:max-w-none mt-0.5">
              {activeTab === 'chat' && activeSessionTitle ? 'Active Session' : `Welcome, ${user?.name?.split(' ')[0] || 'Parent'}`}
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
                onClick={onHistoryToggle}
                className={`p-2.5 rounded-full transition-all border btn-press shadow-sm ${isHistoryOpen ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-stone-200 text-stone-600 hover:text-orange-600'}`} 
                title="Chat History"
              >
                <History className="w-5 h-5" />
              </button>
            </>
          )}

          <Link 
            to="/marketplace"
            className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-stone-600 hover:text-orange-600" 
            title="Marketplace"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>

          <button 
            onClick={() => setIsTipOpen(true)}
            className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-amber-500" 
            title="Daily Tip"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Daily Tip Modal - Moved out of the flex header to ensure true viewport centering */}
      <AnimatePresence>
        {isTipOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] top-0 left-0 right-0 bottom-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[3rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 gradient-peach opacity-50" />
              <button 
                onClick={() => setIsTipOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 rounded-[1.5rem] gradient-peach flex items-center justify-center text-orange-600 mb-6 shadow-lg shadow-orange-200/50 mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black text-stone-800 mb-4 tracking-tight leading-tight text-center">Gentle Tip</h3>
              
              <div className="bg-stone-50/50 rounded-[2rem] p-6 mb-8 border border-stone-100 min-h-[120px] flex items-center justify-center">
                {isGeneratingTip ? (
                  <div className="flex flex-col items-center gap-3 text-stone-400 italic text-sm">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
                    <span>Mumaa is thinking...</span>
                  </div>
                ) : (
                  <p className="text-stone-600 text-lg font-medium leading-relaxed italic text-center">
                    "{dailyTip}"
                  </p>
                )}
              </div>
              
              <div className="text-center mb-6">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-3 py-1 bg-stone-100 rounded-full">
                  For {babyProfile?.name || 'Baby'} at {calculateAge(babyProfile?.date_of_birth)}
                </span>
              </div>
              
              <button 
                onClick={() => setIsTipOpen(false)}
                className="w-full py-4 bg-stone-800 text-white rounded-[1.5rem] font-bold hover:bg-stone-900 transition-all shadow-xl shadow-stone-200 btn-press flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 text-rose-400" /> Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
