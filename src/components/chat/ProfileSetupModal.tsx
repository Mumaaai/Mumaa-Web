import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, X, Sparkles, Calendar, Heart, Save } from 'lucide-react';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function ProfileSetupModal({ isOpen, onClose, onSave, initialData }: ProfileSetupModalProps) {
  const [babyName, setBabyName] = useState(initialData?.babyName || '');
  const [babyDOB, setBabyDOB] = useState(initialData?.babyDOB || '');
  const [babyGender, setBabyGender] = useState(initialData?.babyGender || 'not_specified');

  const handleSave = () => {
    if (!babyName || !babyDOB) return;
    onSave({ babyName, babyDOB, babyGender });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gradient-peach flex items-center justify-center text-orange-600 shadow-sm">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-stone-800">Baby's Profile</h2>
                    <p className="text-stone-500 font-medium text-sm">Let's personalize the care.</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Baby's Name</label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                    <input 
                      type="text" 
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      placeholder="e.g., Aaryav" 
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-12 py-4 text-stone-800 font-bold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
                    <input 
                      type="date" 
                      value={babyDOB}
                      onChange={(e) => setBabyDOB(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-12 py-4 text-stone-800 font-bold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Boy', 'Girl', 'Surprise'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setBabyGender(g.toLowerCase())}
                        className={`py-3 rounded-2xl font-bold text-sm border transition-all ${
                          babyGender === g.toLowerCase() 
                          ? 'bg-orange-100 border-orange-200 text-orange-700 shadow-sm' 
                          : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button 
                  onClick={handleSave}
                  disabled={!babyName || !babyDOB}
                  className="flex-1 gradient-peach text-orange-900 font-bold py-4 rounded-2xl shadow-md border border-white hover:opacity-90 transition-all btn-press disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Profile
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-stone-400 justify-center">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Personalized AI wisdom awaits</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
