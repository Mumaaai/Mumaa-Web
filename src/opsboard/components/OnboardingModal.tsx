import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  User, 
  Shield, 
  CheckCircle2, 
  Loader2, 
  Phone, 
  Calendar, 
  MapPin, 
  HeartPulse,
  IdCard,
  Building
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  user: any;
  onSubmit: (data: any) => Promise<void>;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, user, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    designation: '',
    department: 'Engineering',
    role: 'Developer',
    employee_id: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
    emergency_contact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, user_id: user.id });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-10 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Staff Onboarding</h2>
            <p className="text-stone-400 text-sm font-medium mt-1">Hello, {user?.name}</p>
          </div>
          <div className="flex gap-1.5">
            {[1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-stone-900' : 'w-2 bg-stone-100'}`} />
            ))}
          </div>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Staff ID</label>
                    <div className="relative group">
                      <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="EMP-001"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-stone-900 transition-all"
                        value={formData.employee_id}
                        onChange={e => setFormData({...formData, employee_id: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Designation</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Lead Developer"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-stone-900 transition-all"
                        value={formData.designation}
                        onChange={e => setFormData({...formData, designation: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Department</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <select 
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none appearance-none"
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                      >
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Design</option>
                        <option>Operations</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Clearance Role</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <select 
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none appearance-none"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                      >
                        <option>Developer</option>
                        <option>Manager</option>
                        <option>Admin</option>
                        <option>QA</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!formData.employee_id || !formData.designation}
                  className="w-full bg-stone-900 text-white font-bold text-sm py-4.5 rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-100 disabled:opacity-50 mt-4"
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Primary Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                      <input 
                        type="tel" 
                        placeholder="+91 00000 00000"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-stone-900 transition-all"
                        value={formData.phone_number}
                        onChange={e => setFormData({...formData, phone_number: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                      <input 
                        type="date" 
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-stone-900 transition-all"
                        value={formData.date_of_birth}
                        onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Emergency Contact</label>
                  <div className="relative group">
                    <HeartPulse className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Relation: Name - Phone"
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-stone-900 transition-all"
                      value={formData.emergency_contact}
                      onChange={e => setFormData({...formData, emergency_contact: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Residential Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
                    <textarea 
                      placeholder="Enter your current residential address"
                      rows={3}
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-stone-900 transition-all resize-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4.5 rounded-2xl text-stone-400 font-bold text-sm hover:text-stone-900 transition-all"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.phone_number || !formData.date_of_birth}
                    className="flex-[2] bg-stone-900 text-white font-bold text-sm py-4.5 rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-100 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Complete Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
