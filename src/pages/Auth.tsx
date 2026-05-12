import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '../api';

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
      {/* Background Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>

      {/* Navigation (Simple version) */}
      <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-3 select-none group bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 shadow-sm hover:bg-white transition-all">
        <img src="images/MumaaAIlogo.png" alt="Mumaa Logo" className="w-8 h-8 object-cover rounded-full" />
        <span className="text-lg font-black tracking-tighter text-stone-800">MUMAA</span>
      </Link>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 w-full max-w-7xl mx-auto">
        <div className="w-full flex bg-white/70 backdrop-blur-xl rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden min-h-[600px]">
          
          {/* Left Side - Visual */}
          <div className="hidden lg:flex w-1/2 relative bg-stone-50 items-center justify-center p-12 overflow-hidden border-r border-stone-100">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-rose-50/50 to-indigo-100/50"></div>
            
            <div className="relative z-10 max-w-md">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur text-orange-600 text-xs font-bold uppercase tracking-widest shadow-sm border border-orange-100 mb-8">
                  <Sparkles className="w-4 h-4" /> Your Parenting Village
                </div>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight text-stone-800 mb-6">
                  Experience a <br/>
                  <span className="text-orange-500">calmer</span> journey.
                </h1>
                <p className="text-stone-500 font-medium text-lg leading-relaxed">
                  Join thousands of mothers who trust Mumaa AI for gentle guidance, smart routines, and non-judgmental support.
                </p>
              </motion.div>
            </div>

            {/* Decorative Floating UI */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/4 right-10 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3"
            >
               <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xl">😴</div>
               <div>
                 <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">AI Insight</div>
                 <div className="text-sm font-bold text-stone-800">Baby is sleepy</div>
               </div>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
            <div className="w-full max-w-md mx-auto">
              
              {/* Tabs */}
              <div className="flex p-1 bg-stone-100 rounded-2xl mb-10 w-max">
                <button 
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${isLogin ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${!isLogin ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Create Account
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-stone-800 mb-2">
                  {isLogin ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-stone-500 font-medium">
                  {isLogin ? 'Enter your details to access your workspace.' : 'Start your journey with a calmer companion.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <input ref={nameRef} required={!isLogin} type="text" placeholder="Priya Sharma" className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.com" 
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Password</label>
                    {isLogin && <Link to="/forgot-password" className="text-xs font-bold text-orange-500 hover:text-orange-600">Forgot?</Link>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                    <input 
                      required 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-stone-50 border border-stone-200 text-stone-800 font-medium pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all" 
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isLoading}
                  className="w-full gradient-peach text-orange-900 font-bold text-lg py-4 mt-2 rounded-2xl hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 btn-press disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')} <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              <div className="mt-8">
                <div className="relative flex items-center py-5">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink-0 mx-4 text-stone-400 text-xs font-bold uppercase tracking-widest">Or continue with</span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Login Failed')}
                    useOneTap
                    theme="outline"
                    shape="pill"
                    size="large"
                    width="100%"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
