import { motion } from 'framer-motion';
import { Monitor, Smartphone, Palette, Shield, Bell } from 'lucide-react';
import { useScale } from '../../../context/ScaleContext';

export default function SettingsView() {
  const { dpr, isCompensated, toggleCompensation } = useScale();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-transparent p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-10"
        >
          <h2 className="text-3xl font-black text-stone-800 tracking-tight mb-2">App Settings</h2>
          <p className="text-stone-500 font-medium">Personalize your Mumaa AI experience</p>
        </motion.div>

        <div className="space-y-6">
          {/* Display & Scaling Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-xl shadow-orange-900/5"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800">Display & Scaling</h3>
                <p className="text-sm text-stone-400 font-medium">Adjust how Mumaa looks on your screen</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-stone-50 rounded-3xl border border-stone-100">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-stone-700">DPI Compensation</span>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                    {Math.round(dpr * 100)}% Detect
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                  Automatically shrinks the UI to match a standard 100% scale. Recommended for Windows users with 125% or 150% scaling.
                </p>
              </div>
              
              <button 
                onClick={toggleCompensation}
                className={`shrink-0 w-16 h-8 rounded-full relative transition-all duration-300 ${isCompensated ? 'bg-orange-500 shadow-inner' : 'bg-stone-200'}`}
              >
                <motion.div 
                  animate={{ x: isCompensated ? 32 : 4 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </motion.div>

          {/* Placeholder Sections for future settings */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 rounded-[2.5rem] p-8 border border-stone-100 border-dashed"
          >
            <div className="flex items-center gap-4 opacity-40">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800">Notifications</h3>
                <p className="text-sm text-stone-400 font-medium">Coming soon in next update</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 rounded-[2.5rem] p-8 border border-stone-100 border-dashed"
          >
            <div className="flex items-center gap-4 opacity-40">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800">Privacy & Security</h3>
                <p className="text-sm text-stone-400 font-medium">Coming soon in next update</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
