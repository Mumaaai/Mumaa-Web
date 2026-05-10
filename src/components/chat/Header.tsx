import { User, Sparkles, Volume2 } from 'lucide-react';
import type { TabId } from './Sidebar';

interface HeaderProps {
  onMenuClick: () => void;
  activeTab: TabId;
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

export default function Header({ onMenuClick, activeTab }: HeaderProps) {
  return (
    <div className="h-16 min-h-[4rem] border-b border-stone-200/60 flex items-center justify-between px-4 md:px-8 bg-white/85 backdrop-blur-xl z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden w-10 h-10 rounded-full gradient-peach flex items-center justify-center text-orange-900 shadow-sm btn-press border border-white">
          <User className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-bold text-xl leading-tight tracking-tight text-stone-800">{getTabTitle(activeTab)}</h2>
          <p className="text-[11px] text-stone-500 font-semibold tracking-wider uppercase truncate max-w-[150px] sm:max-w-none mt-0.5">
            Welcome, Priya
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-amber-500" title="Daily Tip">
          <Sparkles className="w-5 h-5" />
        </button>
        <button className="p-2.5 bg-white hover:bg-stone-50 rounded-full transition-all border border-stone-200 btn-press shadow-sm text-stone-500 hover:text-stone-700" title="Toggle Voice">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
