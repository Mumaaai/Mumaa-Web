import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ScaleProvider } from './context/ScaleContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import ForgotPassword from './pages/ForgotPassword';
import Marketplace from './pages/marketplace/Marketplace';
import Reels from './pages/Reels';
import OpsMoved from './pages/OpsMoved';


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

          <Route path="/opsboard" element={<OpsMoved />} />
          <Route path="/opsboard/*" element={<OpsMoved />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
