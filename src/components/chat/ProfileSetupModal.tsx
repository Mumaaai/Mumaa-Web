import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function ProfileSetupModal({ isOpen, onClose, onSave, initialData }: ProfileSetupModalProps) {
  const [momName, setMomName] = useState(initialData?.mom_name || '');
  const [babyName, setBabyName] = useState(initialData?.name || '');
  const [babyDOB, setBabyDOB] = useState(initialData?.date_of_birth || '');
  const [gender, setGender] = useState(initialData?.gender || 'boy');
  const [bloodGroup, setBloodGroup] = useState(initialData?.blood_group || 'Unknown');
  const [language, setLanguage] = useState(initialData?.preferred_language || 'Hinglish');
  const [aiDetail, setAiDetail] = useState(initialData?.ai_detail || 'Balanced');

  const handleSave = () => {
    if (!babyName || !babyDOB) return;
    onSave({ 
      name: babyName, 
      dob: babyDOB, 
      gender, 
      bloodGroup, 
      language, 
      aiDetail, 
      momName 
    });
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
            className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl border border-white overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-black text-stone-800 tracking-tight">Profile Setup</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Mother's Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Mother's Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={momName}
                      onChange={(e) => setMomName(e.target.value)}
                      placeholder="E.g. Priya" 
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-3xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all placeholder:text-stone-300" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Baby's Name */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Baby's Name</label>
                    <input 
                      type="text" 
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      placeholder="E.g. Arjun" 
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all placeholder:text-stone-300" 
                    />
                  </div>
                  {/* Baby's DOB */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Baby's DOB</label>
                    <input 
                      type="date" 
                      value={babyDOB}
                      onChange={(e) => setBabyDOB(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Gender Select */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all appearance-none"
                    >
                      <option value="boy">Boy</option>
                      <option value="girl">Girl</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Blood Group</label>
                    <select 
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all appearance-none"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Language */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all appearance-none"
                    >
                      <option value="Hinglish">Hinglish</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                  {/* AI Detail */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">AI Detail</label>
                    <select 
                      value={aiDetail}
                      onChange={(e) => setAiDetail(e.target.value)}
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 transition-all appearance-none"
                    >
                      <option value="Balanced">Balanced</option>
                      <option value="Gentle">Gentle</option>
                      <option value="Strict">Strict</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button 
                  onClick={handleSave}
                  disabled={!babyName || !babyDOB}
                  className="w-full gradient-peach text-orange-900 font-bold py-5 rounded-[2rem] shadow-lg border border-white hover:opacity-95 transition-all btn-press disabled:opacity-50 text-xl"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
