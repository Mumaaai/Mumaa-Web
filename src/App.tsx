import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import ForgotPassword from './pages/ForgotPassword';
import Marketplace from './pages/marketplace/Marketplace';
import Reels from './pages/Reels';
import OpsDashboard from './opsboard/pages/OpsDashboard';
import OpsAuth from './opsboard/pages/OpsAuth';
import OpsAdmin from './opsboard/pages/OpsAdmin';
import OpsReports from './opsboard/pages/OpsReports';
import OpsPlaceholder from './opsboard/pages/OpsPlaceholder';
import OpsProjects from './opsboard/pages/OpsProjects';
import OpsTeams from './opsboard/pages/OpsTeams';
import OpsTasks from './opsboard/pages/OpsTasks';
import OpsCalendar from './opsboard/pages/OpsCalendar';
import OpsNotifications from './opsboard/pages/OpsNotifications';
import OpsSettings from './opsboard/pages/OpsSettings';
import OpsChat from './opsboard/pages/OpsChat';
import { OpsDataProvider } from './opsboard/hooks/useOpsData';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/opsboard/auth" element={<OpsAuth />} />
          <Route path="/opsboard/*" element={
            <OpsDataProvider>
              <Routes>
                <Route path="admin" element={<OpsAdmin />} />
                <Route path="reports" element={<OpsReports />} />
                <Route path="projects" element={<OpsProjects />} />
                <Route path="teams" element={<OpsTeams />} />
                <Route path="tasks" element={<OpsTasks />} />
                <Route path="calendar" element={<OpsCalendar />} />
                <Route path="notifications" element={<OpsNotifications />} />
                <Route path="chat" element={<OpsChat />} />
                <Route path="settings" element={<OpsSettings />} />
                <Route path="*" element={<OpsDashboard />} />
              </Routes>
            </OpsDataProvider>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
