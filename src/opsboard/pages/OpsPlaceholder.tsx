import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import { Hammer, Calendar, Bell, Settings, Briefcase, Users, CheckSquare } from 'lucide-react';
import { useOpsData } from '../hooks/useOpsData';

const pageData: Record<string, any> = {
  '/opsboard/calendar': { title: 'Operational Calendar', icon: Calendar, message: 'Timeline view and scheduling will be available in Phase 6.' },
  '/opsboard/notifications': { title: 'Notification Center', icon: Bell, message: 'Real-time alerts and webhook integrations are coming soon.' },
  '/opsboard/settings': { title: 'System Settings', icon: Settings, message: 'Global workspace configuration is currently locked to administrators.' },
  '/opsboard/projects': { title: 'Project Portfolios', icon: Briefcase, message: 'Advanced project Gantt charts and tracking are in development.' },
  '/opsboard/teams': { title: 'Teams & Squads', icon: Users, message: 'Detailed team performance and allocation dashboards are upcoming.' },
  '/opsboard/tasks': { title: 'Task Directory', icon: CheckSquare, message: 'Dedicated task filtering views are being finalized.' }
};

const OpsPlaceholder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Need to ensure the user is logged in
  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setUser(JSON.parse(session));
    }
  }, [navigate]);

  const data = pageData[location.pathname] || { title: 'Under Construction', icon: Hammer, message: 'This module is currently being built.' };
  const Icon = data.icon;

  return (
    <OpsLayout user={user} onAddClick={() => alert('Quick Create is available from the main dashboard.')}>
      <main className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-lg w-full">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Icon size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">{data.title}</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            {data.message}
          </p>
          <button 
            onClick={() => navigate('/opsboard')}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md"
          >
            Return to Dashboard
          </button>
        </div>
      </main>
    </OpsLayout>
  );
};

export default OpsPlaceholder;
