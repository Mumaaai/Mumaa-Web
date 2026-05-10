import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar, { type TabId } from '../components/chat/Sidebar';
import Header from '../components/chat/Header';
import { api } from '../api';

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [babyProfile, setBabyProfile] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('mumaa_session');
    if (!session) {
      navigate('/auth');
      return;
    }
    try {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchBabyProfile(parsedUser.id);
    } catch (e) {
      navigate('/auth');
    }
  }, [navigate]);

  const fetchBabyProfile = async (userId: string) => {
    try {
      const data = await api.get(`/baby/${userId}`);
      if (data && !data.error) {
        setBabyProfile(data);
      }
    } catch (e) {
      console.error("Failed to fetch baby profile", e);
    }
  };

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <AIChatView user={user} babyProfile={babyProfile} onProfileUpdate={setBabyProfile} />;
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
      default: return <AIChatView user={user} babyProfile={babyProfile} onProfileUpdate={setBabyProfile} />;
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
        user={user}
        babyProfile={babyProfile}
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
          user={user}
        />

        {/* Dynamic Content Container */}
        <div className="flex-1 relative overflow-hidden z-10">
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
