import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Baby, MessageCircleHeart, LayoutDashboard, Utensils, 
  TrendingUp, ShieldCheck, Star, Compass, Apple, Blocks, 
  Puzzle, Clock, AudioWaveform, BookHeart, MoonStar, 
  Camera, HeartHandshake, Stethoscope, MessageSquare, Settings2,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export type TabId = 'chat' | 'dashboard' | 'feeding' | 'growth' | 'vaccination' | 'milestones' | 
                    'guide' | 'diet' | 'study' | 'games' | 'routine' | 'cry' | 'journal' | 
                    'lullaby' | 'photo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
        
        {/* Toggle Collapse Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-4 top-8 w-8 h-8 bg-white border border-stone-200 rounded-full items-center justify-center text-stone-500 hover:text-stone-800 shadow-sm z-50 hover:scale-110 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Logo Section */}
        <div className={`p-6 border-b border-stone-100 bg-white flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between'}`}>
          <Link to="/" className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="relative w-10 h-10 shrink-0">
              <img src="/images/MumaaAIlogo.png" alt="MUMAA Logo" className="w-full h-full border-2 border-white rounded-full shadow-sm" />
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

        {/* Quick Stats (Hidden on collapse) */}
        {!isCollapsed && (
          <div className="p-5 border-b border-stone-100 bg-[#FFFDFB]">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-stone-800 truncate">Baby</div>
                  <div className="text-xs text-stone-500 font-semibold truncate">4 Months Old</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center bg-stone-50/80 rounded-xl py-2 border border-stone-100/50">
                  <div className="text-xl font-bold text-emerald-500">0</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Feeds</div>
                </div>
                <div className="text-center bg-stone-50/80 rounded-xl py-2 border border-stone-100/50">
                  <div className="text-xl font-bold text-sky-500">0</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Diapers</div>
                </div>
                <div className="text-center bg-stone-50/80 rounded-xl py-2 border border-stone-100/50">
                  <div className="text-xl font-bold text-indigo-400">0h</div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-0.5">Sleep</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div className={`flex-1 overflow-y-auto no-scrollbar pb-24 ${isCollapsed ? 'p-2' : 'p-4'}`}>
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
            {navItem('diet', <Apple className="w-4 h-4" />, 'Diet Plans')}
            {navItem('study', <Blocks className="w-4 h-4" />, 'Play Ideas')}
            {navItem('games', <Puzzle className="w-4 h-4" />, 'Toddler Games')}
            {navItem('routine', <Clock className="w-4 h-4" />, 'Routine Planner')}
            {navItem('cry', <AudioWaveform className="w-4 h-4" />, 'Cry Analyzer', 'text-rose-500 bg-rose-100', 'text-rose-600 bg-rose-100')}
            {navItem('journal', <BookHeart className="w-4 h-4" />, 'Memory Journal')}
            {navItem('lullaby', <MoonStar className="w-4 h-4" />, 'Sleep & Lullabies')}
            {navItem('photo', <Camera className="w-4 h-4" />, 'Vision AI')}
          </nav>
          
          {!isCollapsed ? (
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-3 px-3 mt-8">For You</div>
          ) : <div className="h-6"></div>}
          
          <nav className="space-y-1.5">
            <button title={isCollapsed ? "Mother's Care" : undefined} className={`w-full text-left py-3 rounded-2xl flex items-center gap-3 text-[15px] transition group hover:bg-rose-50 border border-transparent ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-4 h-4 text-rose-500" />
              </div>
              {!isCollapsed && <span className="text-rose-700 font-semibold truncate">Mother's Care</span>}
            </button>
            <button title={isCollapsed ? "Emergency Info" : undefined} className={`w-full text-left py-3 rounded-2xl flex items-center gap-3 text-[15px] transition group hover:bg-red-50 border border-transparent ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-4 h-4 text-red-500" />
              </div>
              {!isCollapsed && <span className="text-red-600 font-semibold truncate">Emergency Info</span>}
            </button>
            <button title={isCollapsed ? "Feedback" : undefined} className={`w-full text-left py-3 rounded-2xl flex items-center gap-3 text-[15px] transition group hover:bg-stone-50 border border-transparent ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
              <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4 text-stone-500" />
              </div>
              {!isCollapsed && <span className="text-stone-600 font-semibold truncate">Feedback</span>}
            </button>
          </nav>
        </div>
        
        {/* Settings Button */}
        <div className={`p-5 border-t border-stone-100 bg-white absolute bottom-0 w-full z-10 hidden md:block ${isCollapsed ? 'px-2' : ''}`}>
          <Link to="/auth" title={isCollapsed ? "Settings" : undefined} className={`w-full text-left py-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 flex items-center gap-3 text-[15px] transition-colors border border-stone-200 group btn-press ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
            <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-stone-200 shadow-sm">
              <Settings2 className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate text-stone-800">Setup Profile</div>
                <div className="text-[11px] text-stone-500 truncate font-medium uppercase tracking-wider">Settings</div>
              </div>
            )}
          </Link>
        </div>

      </div>
    </>
  );
}
