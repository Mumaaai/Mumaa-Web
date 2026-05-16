import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  ChevronLeft,
  Command
} from 'lucide-react';
import { api } from '../../api';

export default function OpsAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (session) {
      navigate('/opsboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/ops/auth/login' : '/ops/auth/signup';
      const body = isLogin 
        ? { email, password } 
        : { email, password, fullName };

      const data = await api.post(endpoint, body);

      if (data.error) {
        setError(data.error);
      } else {
        if (!isLogin) {
          setSuccess('Access requested. Your account is now pending manual verification.');
          setIsLogin(true);
        } else {
          localStorage.setItem('ops_session', JSON.stringify(data.user));
          navigate('/opsboard');
        }
      }
    } catch (err) {
      setError('System unavailable. Please verify infrastructure status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-stone-200">
      {/* Top Bar */}
      <div className="p-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 text-stone-400 hover:text-stone-900 transition-all group select-none">
          <div className="w-8 h-8 bg-white border border-stone-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <ChevronLeft size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Exit to Portal</span>
        </Link>
        <div className="flex items-center gap-2 select-none">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Systems Online</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-white border border-stone-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Command className="text-stone-900" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-3">MumaaAI Operations</h1>
            <p className="text-stone-400 font-medium text-sm">Secure access for authorized personnel only.</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-stone-200/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />

            <div className="flex p-1 bg-stone-50 rounded-2xl mb-10 border border-stone-100">
              <button 
                onClick={() => { setIsLogin(true); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${isLogin ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${!isLogin ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
              >
                Registration
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 text-xs font-bold text-red-600 bg-red-50/50 p-4 rounded-2xl border border-red-100"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 text-xs font-bold text-emerald-600 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Staff Identity</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="Full Legal Name"
                        className="w-full bg-stone-50 border border-stone-200/60 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-900 placeholder:text-stone-300"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Enterprise Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                    <input 
                      required
                      type="email" 
                      placeholder="work@mumaa.ai"
                      className="w-full bg-stone-50 border border-stone-200/60 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-900 placeholder:text-stone-300"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Security Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200/60 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:outline-none focus:border-stone-900 focus:bg-white transition-all text-stone-900 placeholder:text-stone-300"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm py-4.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-stone-200 disabled:opacity-50 mt-4 active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Access Console' : 'Initialize Request')}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.3em]">
              Property of MumaaAI • All sessions encrypted
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
