import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Baby, Calendar, Heart, Languages, Edit3, Save, Activity, Weight, Users, Stethoscope } from 'lucide-react';

interface BabyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  forceEdit?: boolean;
}

export default function BabyProfileModal({ isOpen, onClose, onSave, initialData, forceEdit = false }: BabyProfileModalProps) {
  const [isEditing, setIsEditing] = useState(forceEdit || !initialData?.name);
  
  // Form State
  const [momName, setMomName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyDOB, setBabyDOB] = useState('');
  const [gender, setGender] = useState('boy');
  const [bloodGroup, setBloodGroup] = useState('Unknown');
  const [language, setLanguage] = useState('Hinglish');
  const [aiDetail, setAiDetail] = useState('Balanced');
  
  // New Fields
  const [deliveryType, setDeliveryType] = useState('Normal');
  const [parentingType, setParentingType] = useState('Dual Parent');
  const [babyMedical, setBabyMedical] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [momCondition, setMomCondition] = useState('');

  // Sync state with initialData when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setMomName(initialData.mom_name || '');
      setBabyName(initialData.name || '');
      setBabyDOB(initialData.date_of_birth || '');
      setGender(initialData.gender || 'boy');
      setBloodGroup(initialData.blood_group || 'Unknown');
      setLanguage(initialData.preferred_language || 'Hinglish');
      setAiDetail(initialData.ai_detail || 'Balanced');
      
      setDeliveryType(initialData.delivery_type || 'Normal');
      setParentingType(initialData.parenting_type || 'Dual Parent');
      setBabyMedical(initialData.medical_conditions || '');
      setBirthWeight(initialData.birth_weight || '');
      setMomCondition(initialData.mom_condition || '');
      
      if (!initialData.name) {
        setIsEditing(true);
      } else if (!forceEdit) {
        setIsEditing(false);
      }
    }
  }, [isOpen, initialData, forceEdit]);

  const handleSave = () => {
    if (!babyName || !babyDOB) return;
    onSave({ 
      name: babyName, 
      dob: babyDOB, 
      gender, 
      bloodGroup, 
      language, 
      aiDetail, 
      momName,
      deliveryType,
      parentingType,
      medicalConditions: babyMedical,
      birthWeight: parseFloat(birthWeight) || 0,
      momCondition
    });
    setIsEditing(false);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "Newborn";
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months < 1) return "Newborn";
    if (months < 12) return `${months} Months Old`;
    return `${Math.floor(months / 12)} Years Old`;
  };

  const InfoRow = ({ icon: Icon, label, value, color }: any) => (
    <div className="flex items-center gap-4 p-4 bg-stone-50/50 rounded-2xl border border-stone-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</div>
        <div className="text-sm font-bold text-stone-800 truncate">{value || 'None'}</div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/30 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl border border-white overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-stone-800 tracking-tight">
                      {isEditing ? (initialData?.name ? 'Edit Profile' : 'Setup Profile') : 'Baby Profile'}
                    </h2>
                    <p className="text-xs text-stone-500 font-semibold uppercase tracking-widest mt-0.5">Mumaa Companion</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && initialData?.name && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-3 bg-stone-50 hover:bg-orange-50 text-stone-400 hover:text-orange-600 rounded-2xl transition-all border border-transparent hover:border-orange-100 btn-press"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={onClose} className="p-3 hover:bg-stone-50 rounded-2xl transition-colors text-stone-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 max-h-[75vh] overflow-y-auto no-scrollbar">
              {isEditing ? (
                /* Edit Mode - Form */
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Mother's Name & Condition</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                        type="text" 
                        value={momName}
                        onChange={(e) => setMomName(e.target.value)}
                        placeholder="Your name" 
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-3xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all placeholder:text-stone-300 shadow-inner" 
                        />
                        <input 
                        type="text" 
                        value={momCondition}
                        onChange={(e) => setMomCondition(e.target.value)}
                        placeholder="Mom's Health Cond?" 
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-3xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all placeholder:text-stone-300 shadow-inner" 
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Baby's Name</label>
                      <input 
                        type="text" 
                        value={babyName}
                        onChange={(e) => setBabyName(e.target.value)}
                        placeholder="Baby's name" 
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all placeholder:text-stone-300 shadow-inner" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Baby's DOB</label>
                      <input 
                        type="date" 
                        value={babyDOB}
                        onChange={(e) => setBabyDOB(e.target.value)}
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all shadow-inner" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Gender</label>
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all appearance-none shadow-inner"
                      >
                        <option value="boy">Boy</option>
                        <option value="girl">Girl</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Birth Weight (kg)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={birthWeight}
                        onChange={(e) => setBirthWeight(e.target.value)}
                        placeholder="3.2" 
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all placeholder:text-stone-300 shadow-inner" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Delivery Type</label>
                        <select 
                            value={deliveryType}
                            onChange={(e) => setDeliveryType(e.target.value)}
                            className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all appearance-none shadow-inner"
                        >
                            <option value="Normal">Normal</option>
                            <option value="C Section">C Section</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Parenting Type</label>
                        <select 
                            value={parentingType}
                            onChange={(e) => setParentingType(e.target.value)}
                            className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all appearance-none shadow-inner"
                        >
                            <option value="Dual Parent">Dual Parent</option>
                            <option value="Single Mom">Single Mom</option>
                            <option value="Single Dad">Single Dad</option>
                            <option value="Co-Parenting">Co-Parenting</option>
                        </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Baby Medical Conditions (if any)</label>
                    <textarea 
                      value={babyMedical}
                      onChange={(e) => setBabyMedical(e.target.value)}
                      placeholder="e.g. Allergies, Jaundice history..." 
                      className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-4 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all placeholder:text-stone-300 shadow-inner h-20 resize-none" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Preferred Language</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all appearance-none shadow-inner"
                      >
                        <option value="Hinglish">Hinglish</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">AI Tone</label>
                      <select 
                        value={aiDetail}
                        onChange={(e) => setAiDetail(e.target.value)}
                        className="w-full bg-stone-50/50 border border-stone-100 rounded-2xl px-6 py-5 text-stone-800 font-bold outline-none focus:border-orange-200 transition-all appearance-none shadow-inner"
                      >
                        <option value="Balanced">Balanced</option>
                        <option value="Gentle">Gentle</option>
                        <option value="Strict">Strict</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={!babyName || !babyDOB}
                    className="w-full gradient-peach text-orange-900 font-black py-5 rounded-[2rem] shadow-xl border border-white hover:opacity-95 transition-all btn-press disabled:opacity-50 text-xl mt-4 flex items-center justify-center gap-2"
                  >
                    <Save className="w-6 h-6" /> Save Profile
                  </button>
                </div>
              ) : (
                /* View Mode - Elegant Card */
                <div className="space-y-4 pt-4 pb-8">
                  <div className="bg-stone-50/80 rounded-[2.5rem] p-8 border border-stone-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                    
                    <div className="text-center relative z-10">
                      <div className="text-4xl font-black text-stone-800 mb-2">{initialData?.name}</div>
                      <div className="text-orange-600 font-black text-sm uppercase tracking-[0.2em]">
                        {calculateAge(initialData?.date_of_birth)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow 
                      icon={User} 
                      label="Mother" 
                      value={`${initialData?.mom_name}${initialData?.mom_condition ? ` (${initialData.mom_condition})` : ''}`} 
                      color="bg-rose-50 text-rose-500"
                    />
                    <InfoRow 
                      icon={Calendar} 
                      label="Birthday" 
                      value={new Date(initialData?.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                      color="bg-sky-50 text-sky-500"
                    />
                    <InfoRow 
                      icon={Heart} 
                      label="Gender" 
                      value={initialData?.gender === 'boy' ? 'Prince (Boy)' : 'Princess (Girl)'} 
                      color="bg-orange-50 text-orange-500"
                    />
                    <InfoRow 
                      icon={Weight} 
                      label="Birth Weight" 
                      value={`${initialData?.birth_weight || '--'} kg`} 
                      color="bg-emerald-50 text-emerald-500"
                    />
                    <InfoRow 
                      icon={Activity} 
                      label="Delivery" 
                      value={initialData?.delivery_type} 
                      color="bg-violet-50 text-violet-500"
                    />
                    <InfoRow 
                      icon={Users} 
                      label="Parenting" 
                      value={initialData?.parenting_type} 
                      color="bg-amber-50 text-amber-500"
                    />
                    <InfoRow 
                      icon={Stethoscope} 
                      label="Med Condition" 
                      value={initialData?.medical_conditions} 
                      color="bg-rose-50 text-rose-600"
                    />
                    <InfoRow 
                      icon={Languages} 
                      label="Language" 
                      value={initialData?.preferred_language} 
                      color="bg-indigo-50 text-indigo-500"
                    />
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">AI Mumaa • Mindful Parenting</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
