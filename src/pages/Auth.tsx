import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, AlertCircle, Loader2, Heart } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '../api';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const nameRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('mumaa_session');
    if (session) {
      navigate('/chat');
    } else {
      setIsCheckingSession(false);
    }
  }, [navigate]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/google', { 
        id_token: credentialResponse.credential 
      });

      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('mumaa_session', JSON.stringify(data.user));
        navigate('/chat');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/signin' : '/auth/signup';
      const body = isLogin 
        ? { email, password } 
        : { email, password, fullName: nameRef.current?.value };

      const data = await api.post(endpoint, body);

      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('mumaa_session', JSON.stringify(data.user));
        navigate('/chat');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) return null;

  return (
    <div className="min-h-screen flex bg-[#FFF8F3] selection:bg-orange-200 selection:text-orange-900 font-sans relative overflow-hidden">
      {/* Dynamic Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square bg-gradient-to-br from-orange-200/40 to-rose-200/40 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 60, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[5%] w-[40%] aspect-square bg-gradient-to-tr from-indigo-200/30 to-violet-200/30 blur-[120px] rounded-full"
      />

      {/* Navigation */}
      <Link to="/" className="absolute top-8 left-8 z-50 flex items-center gap-3 select-none group bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-[1.5rem] border border-white shadow-xl shadow-orange-900/5 hover:bg-white hover:scale-105 transition-all">
        <img src="images/MumaaAIlogo.png" alt="Mumaa Logo" className="w-8 h-8 object-cover rounded-full shadow-sm" />
        <span className="text-xl font-black tracking-tight text-stone-800 uppercase">AI Mumaa</span>
      </Link>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex bg-white/40 backdrop-blur-[40px] rounded-[3.5rem] border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden min-h-[700px] relative"
        >
          {/* Glass Overlay for depth */}
          <div className="absolute inset-0 bg-white/20 pointer-events-none" />
          
          {/* Left Side - Visual Storytelling */}
          <div className="hidden lg:flex w-[45%] relative items-center justify-center p-16 overflow-hidden border-r border-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white/40 to-indigo-50/80" />
            
            <div className="relative z-10 w-full">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur shadow-sm border border-stone-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                  <Heart className="w-3.5 h-3.5 fill-current" /> Your Parenting Companion
                </div>
                <h1 className="text-5xl xl:text-6xl font-black leading-[1.1] text-stone-800 mb-8 tracking-tighter">
                  Every Mumaa <br/>
                  deserves <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">peace of mind.</span>
                </h1>
                <p className="text-stone-500 font-medium text-lg leading-relaxed max-w-sm">
                  Smart routines, gentle guidance, and expert support — all in one place, 24/7.
                </p>

                {/* Testimonial Tag */}
                <div className="mt-16 flex items-center gap-4 p-4 bg-white/60 backdrop-blur rounded-[2rem] border border-white shadow-lg shadow-stone-200/50 w-max">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-white" />
                        ))}
                    </div>
                    <div className="text-xs font-bold text-stone-600">
                        Join <span className="text-stone-800">2,000+</span> happy mothers
                    </div>
                </div>
              </motion.div>
            </div>

            {/* Abstract Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-orange-100/30 to-transparent pointer-events-none" />
          </div>

          {/* Right Side - Refined Form UI */}
          <div className="w-full lg:w-[55%] p-8 md:p-20 flex flex-col justify-center relative">
            <div className="w-full max-w-md mx-auto">
              
              {/* Modern Tab Switcher */}
              <div className="flex p-1.5 bg-stone-100/50 backdrop-blur-md rounded-[1.5rem] mb-12 w-max border border-stone-200/50">
                <button 
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-white text-stone-800 shadow-xl shadow-stone-200/50' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-white text-stone-800 shadow-xl shadow-stone-200/50' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Join Us
                </button>
              </div>

              <div className="mb-10">
                <h2 className="text-4xl font-black text-stone-800 mb-3 tracking-tight">
                  {isLogin ? 'Welcome back' : 'Start your journey'}
                </h2>
                <p className="text-stone-500 font-medium text-base">
                  {isLogin ? 'Enter your details to reconnect.' : 'Create an account for a calmer parenting journey.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="flex items-center gap-3 text-sm font-bold text-rose-600 bg-rose-50/80 backdrop-blur-md p-4 rounded-2xl border border-rose-100 shadow-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-5">
                    <AnimatePresence mode="popLayout">
                    {!isLogin && (
                        <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-2"
                        >
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                            <input ref={nameRef} required={!isLogin} type="text" placeholder="Priya Sharma" className="w-full bg-white/50 border border-stone-200/60 text-stone-800 font-bold pl-14 pr-6 py-4.5 rounded-[1.5rem] focus:outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100/50 transition-all shadow-sm" />
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                required 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="priya@example.com" 
                                className="w-full bg-white/50 border border-stone-200/60 text-stone-800 font-bold pl-14 pr-6 py-4.5 rounded-[1.5rem] focus:outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100/50 transition-all shadow-sm" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Password</label>
                            {isLogin && <Link to="/forgot-password" title="Recover Password" className="text-xs font-black text-orange-500 hover:text-orange-600 uppercase tracking-widest">Forgot?</Link>}
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                required 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                className="w-full bg-white/50 border border-stone-200/60 text-stone-800 font-bold pl-14 pr-6 py-4.5 rounded-[1.5rem] focus:outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100/50 transition-all shadow-sm" 
                            />
                        </div>
                    </div>
                </div>

                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-stone-800 text-white font-black text-sm uppercase tracking-[0.2em] py-5 mt-4 rounded-[1.5rem] hover:bg-stone-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200 disabled:opacity-50 btn-press"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')} <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              <div className="mt-10">
                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-stone-100"></div>
                  <span className="flex-shrink-0 mx-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Quick Access</span>
                  <div className="flex-grow border-t border-stone-100"></div>
                </div>

                <div className="flex justify-center group/google">
                  {googleClientId ? (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google Login Failed')}
                      useOneTap
                      theme="outline"
                      shape="pill"
                      size="large"
                      width="100%"
                    />
                  ) : (
                    <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 text-center">
                      Google sign-in is not configured for this environment.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .orb-1 {
          position: absolute;
          top: -10%;
          left: -5%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, rgba(255,237,213,0.6) 0%, rgba(255,255,255,0) 70%);
          filter: blur(100px);
          z-index: 0;
        }
        .orb-2 {
          position: absolute;
          bottom: -10%;
          right: -5%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, rgba(238,242,255,0.6) 0%, rgba(255,255,255,0) 70%);
          filter: blur(100px);
          z-index: 0;
        }
      `}} />
    </div>
  );
}
