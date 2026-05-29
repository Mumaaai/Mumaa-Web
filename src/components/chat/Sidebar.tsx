import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Baby, MessageCircleHeart, LayoutDashboard, Utensils, 
  TrendingUp, ShieldCheck, Star, Compass, Apple, Blocks, 
  Clock, AudioWaveform, BookHeart, MoonStar, 
  HeartHandshake, Stethoscope, MessageSquare, Settings2,
  ChevronLeft, ChevronRight, LogOut, PlayCircle, Brain,
  Users, UtensilsCrossed, Mic, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type TabId = 'chat' | 'dashboard' | 'feeding' | 'growth' | 'vaccination' | 'milestones' | 
                    'guide' | 'diet' | 'study' | 'games' | 'routine' | 'cry' | 'journal' | 
                    'lullaby' | 'photo' | 'settings' | 'momcare' | 'emergency' | 'feedback' |
                    'single-parenting' | 'nutrition-ai' | 'voice-cloning' | 'traditional-wisdom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  user: any;
  babyProfile: any;
  dashboardData?: any;
  onProfileClick?: () => void;
}

const calculateAge = (dob: string) => {
  if (!dob) return "0 months";
  const birthDate = new Date(dob);
  const today = new Date();
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  
  if (months < 1) {
    return "0 months";
  }
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''}`;
};

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange, user, babyProfile, dashboardData, onProfileClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('mumaa_session');
    navigate('/auth');
  };
  
  const navItem = (id: TabId, icon: React.ReactNode, label: string, colorClass: string = 'text-stone-500 bg-stone-100', activeColorClass: string = 'text-orange-600 bg-orange-100') => {
    const isActive = activeTab === id;
    
    return (
      <button 
        onClick={() => { onTabChange(id); onClose(); }} 
        className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 text-[15px] transition-all duration-200 group ${isActive ? 'bg-stone-50 shadow-sm border border-stone-100' : 'hover:bg-stone-50 border border-transparent'} ${isCollapsed ? 'justify-center px-0' : ''}`}
        title={isCollapsed ? label : undefined}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${isActive ? activeColorClass : colorClass}`}>
          {icon}
        </div>
        {!isCollapsed && (
          <span className={`font-semibold truncate ${isActive ? 'text-stone-800 font-bold' : 'text-stone-600 group-hover:text-stone-900'}`}>{label}</span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-stone-100 flex flex-col transform transition-all duration-300 ease-in-out md:translate-x-0 md:relative shadow-2xl md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-[90px]' : 'w-[280px]'}`}>

        {/* Logo Section */}
        <div className={`p-6 border-b border-stone-100 bg-white flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between'}`}>
          <Link to="/" className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative w-10 h-10 shrink-0">
              <img src="images/MumaaAIlogo.png" alt="MUMAA Logo" className="w-full h-full border-2 border-white rounded-full shadow-sm" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-2xl font-bold tracking-tight text-stone-800 block truncate">MUMAA</span>
                <div className="text-[11px] text-stone-500 font-bold uppercase tracking-widest mt-0.5 truncate">AI Companion</div>
              </div>
            )}
          </Link>
          {!isCollapsed && (
            <button onClick={onClose} className="md:hidden p-2 shrink-0 text-stone-400 hover:text-stone-700 bg-stone-50 rounded-full btn-press" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Stats (Hidden on collapse) - Now Clickable */}
        {!isCollapsed && (
          <div className="p-5 border-b border-stone-100 bg-[#FFFDFB]">
            <button 
              onClick={onProfileClick}
              className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Baby className="w-5 h-5 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-stone-800 truncate group-hover:text-orange-600 transition-colors">{babyProfile?.name || 'Setup Profile'}</div>
                  <div className="text-xs text-stone-500 font-semibold truncate">
                    {babyProfile ? calculateAge(babyProfile.date_of_birth) : 'Click to complete'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center bg-stone-50/80 rounded-xl py-2 border border-stone-100/50">
                  <div className="text-xl font-bold text-emerald-500">{dashboardData?.todayStats?.feedings || 0}</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Feeds</div>
                </div>
                <div className="text-center bg-stone-50/80 rounded-xl py-2 border border-stone-100/50">
                  <div className="text-xl font-bold text-sky-500">{dashboardData?.todayStats?.diapers || 0}</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Diapers</div>
                </div>
                <div className="text-center bg-stone-50/80 rounded-xl py-2 border border-stone-100/50">
                  <div className="text-xl font-bold text-indigo-400">{dashboardData?.todayStats?.sleepHours || 0}h</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Sleep</div>
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* Navigation */}
        <div className={`flex-1 overflow-y-auto no-scrollbar pb-36 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 px-3">Core Care</div>}
          <nav className="space-y-1.5">
            {navItem('chat', <MessageCircleHeart className="w-4 h-4" />, 'AI Chat', 'text-stone-500 bg-stone-100', 'text-orange-600 bg-orange-100')}
            {navItem('dashboard', <LayoutDashboard className="w-4 h-4" />, 'Dashboard')}
            {navItem('feeding', <Utensils className="w-4 h-4" />, 'Log & Sleep')}
            {navItem('growth', <TrendingUp className="w-4 h-4" />, 'Growth Tracker')}
            {navItem('vaccination', <ShieldCheck className="w-4 h-4" />, 'Vaccination')}
            {navItem('milestones', <Star className="w-4 h-4" />, 'Milestones')}
          </nav>

          {!isCollapsed ? (
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 px-3 mt-8">Smart Assistants</div>
          ) : <div className="h-6"></div>}
          
          <nav className="space-y-1.5">
            {navItem('guide', <Compass className="w-4 h-4" />, 'Parenting Guide')}
            {navItem('single-parenting', <Users className="w-4 h-4" />, 'Single Parenting', 'text-stone-500 bg-stone-100 group-hover:text-orange-500 group-hover:bg-orange-100', 'text-orange-600 bg-orange-200')}
            {navItem('nutrition-ai', <UtensilsCrossed className="w-4 h-4" />, 'Nutrition AI', 'text-stone-500 bg-stone-100 group-hover:text-emerald-500 group-hover:bg-emerald-100', 'text-emerald-600 bg-emerald-200')}
            {navItem('voice-cloning', <Mic className="w-4 h-4" />, 'Voice Cloning', 'text-stone-500 bg-stone-100 group-hover:text-indigo-500 group-hover:bg-indigo-100', 'text-indigo-600 bg-indigo-200')}
            {navItem('traditional-wisdom', <BookOpen className="w-4 h-4" />, 'Traditional Wisdom', 'text-stone-500 bg-stone-100 group-hover:text-amber-500 group-hover:bg-amber-100', 'text-amber-600 bg-amber-200')}
            {navItem('diet', <Apple className="w-4 h-4" />, 'Diet Plans')}
            {navItem('study', <Blocks className="w-4 h-4" />, 'Play Ideas')}
            {navItem('routine', <Clock className="w-4 h-4" />, 'Routine Planner')}
            {navItem('cry', <AudioWaveform className="w-4 h-4" />, 'Cry Analyzer', 'text-rose-500 bg-rose-100', 'text-rose-600 bg-rose-100')}
            {navItem('journal', <BookHeart className="w-4 h-4" />, 'Memory Journal')}
            {navItem('lullaby', <MoonStar className="w-4 h-4" />, 'Soothing Sounds')}
            <button 
              onClick={() => { navigate('/reels'); onClose(); }}
              className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 text-[15px] transition-all duration-200 group hover:bg-stone-50 border border-transparent ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-emerald-600 bg-emerald-100">
                <PlayCircle className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="font-semibold text-stone-600 group-hover:text-stone-900 truncate">Video Guidance</span>}
            </button>
            {navItem('games', <Brain className="w-4 h-4" />, 'Mind Games')}
            {navItem('settings', <Settings2 className="w-4 h-4" />, 'App Settings')}
          </nav>
          
          {!isCollapsed ? (
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 px-3 mt-8">For You</div>
          ) : <div className="h-6"></div>}
          
          <nav className="space-y-1.5">
            {navItem('momcare', <HeartHandshake className="w-4 h-4" />, "Mother's Care", 'text-rose-500 bg-rose-100', 'text-rose-600 bg-rose-100')}
            {navItem('emergency', <Stethoscope className="w-4 h-4" />, 'Emergency Info', 'text-red-500 bg-red-100', 'text-red-600 bg-red-100')}
            {navItem('feedback', <MessageSquare className="w-4 h-4" />, 'Feedback', 'text-stone-500 bg-stone-100', 'text-stone-700 bg-stone-100')}
          </nav>
        </div>
        
        <div className={`p-5 pb-8 border-t border-stone-100 bg-white absolute bottom-0 w-full z-10 hidden md:flex flex-col gap-2 ${isCollapsed ? 'px-2' : ''}`}>
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            title={isCollapsed ? "User Settings" : undefined} 
            className={`w-full text-left py-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 flex items-center gap-3 text-[15px] transition-colors border border-stone-200 group btn-press ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-stone-200 shadow-sm overflow-hidden">
              <Settings2 className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate text-stone-800">{babyProfile?.name || 'test'}</div>
                <div className="text-[11px] text-stone-500 truncate font-bold uppercase tracking-wider">SETTINGS</div>
              </div>
            )}
          </button>
        </div>

        {/* User Menu Popover */}
        <AnimatePresence>
          {isLogoutModalOpen && (
            <div className="absolute bottom-[100px] left-6 z-[60] w-[232px]">
              {/* Backdrop for closing */}
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsLogoutModalOpen(false)}
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="bg-white rounded-[2rem] p-6 shadow-2xl border border-stone-100 text-center"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-[1.2rem] flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <LogOut className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-stone-800 tracking-tight mb-1">Ready to Leave?</h3>
                <p className="text-stone-500 text-[11px] font-bold uppercase tracking-wider mb-6">
                  Session will be saved
                </p>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-100"
                  >
                    Logout
                  </button>
                  <button 
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="w-full py-3 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
