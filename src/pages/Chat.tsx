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
import SettingsView from '../components/chat/views/SettingsView';
import BabyProfileModal from '../components/chat/ProfileSetupModal';
import HistorySidebar from '../components/chat/HistorySidebar';

export default function Chat() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>(
    () => (localStorage.getItem('mumaa_active_tab') as TabId) || 'chat'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [babyProfile, setBabyProfile] = useState<any>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [knownTitles, setKnownTitles] = useState<Record<string, string>>({});
  const [dashboardData, setDashboardData] = useState<any>(null);

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
      fetchDashboardData(parsedUser.id);
    } catch (e) {
      navigate('/auth');
    }
  }, [navigate]);

  const fetchDashboardData = async (userId: string) => {
    try {
      const data = await api.get(`/dashboard/${userId}`);
      if (data && !data.error) {
        setDashboardData(data);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    }
  };

  const fetchBabyProfile = async (userId: string) => {
    try {
      const data = await api.get(`/baby/${userId}`);
      if (data && !data.error && data.name) {
        setBabyProfile(data);
      } else {
        // Show modal if profile is missing
        setIsProfileModalOpen(true);
      }
      fetchChatSessions(userId);
    } catch (e) {
      console.error("Failed to fetch baby profile", e);
      setIsProfileModalOpen(true);
    }
  };

  const fetchChatSessions = async (userId: string) => {
    try {
      const sessions = await api.get(`/chat/sessions/${userId}`);
      // Sort sessions by created_at descending (latest first)
      const sortedSessions = (sessions || []).map((s: any) => {
        const sid = s.session_id || s.id; // Support both just in case
        return {
          ...s,
          session_id: sid,
          // Prefer knownTitle if the API still returns a generic one
          title: (knownTitles[sid] && (s.title === 'Parenting Chat' || s.title === 'Saheli Session' || s.title === 'New Parenting Chat' || !s.title)) 
            ? knownTitles[sid] 
            : s.title
        };
      }).sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setChatSessions(sortedSessions);
    } catch (e) {
      console.error("Failed to fetch chat sessions", e);
    }
  };

  const handleTabChange = (tab: TabId) => {
    localStorage.setItem('mumaa_active_tab', tab);
    setActiveTab(tab);
  };

  const startNewChat = () => {
    setCurrentSessionId(crypto.randomUUID());
    handleTabChange('chat');
  };

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return (
        <AIChatView 
          user={user} 
          babyProfile={babyProfile} 
          sessionId={currentSessionId || ''} 
          onSessionChange={setCurrentSessionId}
          onHistoryRefresh={(title, sid) => {
            if (title && sid) {
              setKnownTitles(prev => ({ ...prev, [sid]: title }));
              setChatSessions(prev => {
                const exists = prev.some(s => s.session_id === sid);
                if (exists) {
                  return prev.map(s => s.session_id === sid ? { ...s, title } : s);
                } else {
                  return [{ session_id: sid, title, created_at: new Date().toISOString() }, ...prev];
                }
              });
            }
            fetchChatSessions(user.id);
          }}
        />
      );
      case 'dashboard': return <DashboardView user={user} babyProfile={babyProfile} onTabChange={handleTabChange} />;
      case 'feeding': return <FeedingView user={user} babyProfile={babyProfile} onActivityLogged={() => fetchDashboardData(user.id)} />;
      case 'growth': return <GrowthView user={user} babyProfile={babyProfile} />;
      case 'vaccination': return <VaccinationView user={user} babyProfile={babyProfile} />;
      case 'milestones': return <MilestonesView user={user} babyProfile={babyProfile} />;
      case 'guide': return <GuideView />;
      case 'diet': return <DietView user={user} babyProfile={babyProfile} />;
      case 'study': return <StudyView user={user} babyProfile={babyProfile} />;
      case 'games': return <GamesView />;
      case 'routine': return <RoutineView user={user} babyProfile={babyProfile} />;
      case 'cry': return <CryView />;
      case 'journal': return <JournalView user={user} />;
      case 'lullaby': return <LullabyView />;
      case 'photo': return <PhotoView />;
      case 'settings': return <SettingsView />;
      default: return (
        <AIChatView 
          user={user} 
          babyProfile={babyProfile} 
          sessionId={currentSessionId || ''} 
          onSessionChange={setCurrentSessionId}
          onHistoryRefresh={(title, sid) => {
            if (title && sid) {
              setKnownTitles(prev => ({ ...prev, [sid]: title }));
              setChatSessions(prev => {
                const exists = prev.some(s => s.session_id === sid);
                if (exists) {
                  return prev.map(s => s.session_id === sid ? { ...s, title } : s);
                } else {
                  return [{ session_id: sid, title, created_at: new Date().toISOString() }, ...prev];
                }
              });
            }
            fetchChatSessions(user.id);
          }}
        />
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#FFF8F3] font-sans overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        babyProfile={babyProfile}
        dashboardData={dashboardData}
        onProfileClick={() => setIsProfileModalOpen(true)}
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
          babyProfile={babyProfile}
          activeSessionTitle={chatSessions.find(s => s.session_id === currentSessionId)?.title}
          onNewChat={startNewChat}
          onHistoryToggle={() => setIsHistorySidebarOpen(!isHistorySidebarOpen)}
          isHistoryOpen={isHistorySidebarOpen}
        />

        {/* Dynamic Content Container */}
        <div className="flex-1 relative overflow-hidden z-10">
          {renderContent()}
        </div>

      </div>

      <BabyProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onSave={async (data) => {
          try {
            const response = await api.post('/baby', { ...data, userId: user.id });
            if (response && !response.error) {
              const updated = await api.get(`/baby/${user.id}`);
              setBabyProfile(updated);
            } else {
              alert(response?.error || "Failed to save profile. Please ensure the backend is deployed and database is updated.");
            }
          } catch (e) {
            console.error("Failed to save profile", e);
            alert("A network error occurred while saving the profile.");
          }
        }}
        initialData={babyProfile}
      />

      <HistorySidebar 
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        chatSessions={chatSessions}
        onSessionSelect={(id) => {
          setCurrentSessionId(id);
          setActiveTab('chat');
        }}
        onNewChat={startNewChat}
        currentSessionId={currentSessionId}
      />
    </div>
  );
}
