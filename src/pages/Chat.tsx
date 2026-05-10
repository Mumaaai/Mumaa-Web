import { useState } from 'react';
import Sidebar, { type TabId } from '../components/chat/Sidebar';
import Header from '../components/chat/Header';

import AIChatView from '../components/chat/views/AIChatView';
import DashboardView from '../components/chat/views/DashboardView';
import FeedingView from '../components/chat/views/FeedingView';
import GrowthView from '../components/chat/views/GrowthView';
import VaccinationView from '../components/chat/views/VaccinationView';
import MilestonesView from '../components/chat/views/MilestonesView';
import GuideView from '../components/chat/views/GuideView';
import DietView from '../components/chat/views/DietView';
import StudyView from '../components/chat/views/StudyView';
import GamesView from '../components/chat/views/GamesView';
import RoutineView from '../components/chat/views/RoutineView';
import CryView from '../components/chat/views/CryView';
import JournalView from '../components/chat/views/JournalView';
import LullabyView from '../components/chat/views/LullabyView';
import PhotoView from '../components/chat/views/PhotoView';

export default function Chat() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <AIChatView />;
      case 'dashboard': return <DashboardView />;
      case 'feeding': return <FeedingView />;
      case 'growth': return <GrowthView />;
      case 'vaccination': return <VaccinationView />;
      case 'milestones': return <MilestonesView />;
      case 'guide': return <GuideView />;
      case 'diet': return <DietView />;
      case 'study': return <StudyView />;
      case 'games': return <GamesView />;
      case 'routine': return <RoutineView />;
      case 'cry': return <CryView />;
      case 'journal': return <JournalView />;
      case 'lullaby': return <LullabyView />;
      case 'photo': return <PhotoView />;
      default: return <AIChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FFF8F3] font-sans overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Background Decorators */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/40 to-rose-50/40 pointer-events-none"></div>
        <div className="orb-1 opacity-50 pointer-events-none"></div>
        
        {/* Header Component */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          activeTab={activeTab}
        />

        {/* Dynamic Content Container */}
        <div className="flex-1 relative overflow-hidden z-10">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
