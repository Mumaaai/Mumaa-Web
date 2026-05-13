import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sparkles, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy logic
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex bg-[#FFF8F3] selection:bg-orange-200 selection:text-orange-900 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[3rem] border border-stone-200 shadow-2xl overflow-hidden p-8 md:p-12">
          
          <Link to="/auth" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>

          {!isSent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur text-orange-600 text-xs font-bold uppercase tracking-widest shadow-sm border border-orange-100 mb-6">
                <Sparkles className="w-4 h-4" /> Security
              </div>
              <h1 className="text-3xl font-black text-stone-800 mb-2">Forgot Password?</h1>
              <p className="text-stone-500 font-medium mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full gradient-peach text-orange-900 font-bold text-lg py-4 rounded-2xl hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 btn-press"
                >
                  Send Reset Link <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-stone-800 mb-2">Check your email</h2>
              <p className="text-stone-500 font-medium mb-8">
                We've sent a password reset link to <br/>
                <span className="font-bold text-stone-800">{email}</span>
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
