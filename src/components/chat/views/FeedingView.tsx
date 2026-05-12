import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Milk, MoonStar, Play, Square, 
  List, Utensils, History, Clock, Check
} from 'lucide-react';
import { api } from '../../../api';

interface ActivityLog {
  id: string;
  activity_type: 'feeding' | 'sleep';
  detail: string;
  start_time: string;
  end_time?: string;
  notes?: string;
}

interface FeedingViewProps {
  user: any;
  babyProfile: any;
  onActivityLogged: () => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function FeedingView({ user, babyProfile, onActivityLogged }: FeedingViewProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const timerRef = useRef<any>(null);

  useEffect(() => {
    fetchTodayLogs();
    
    // Check if there's an ongoing sleep session in localStorage
    const savedSleep = localStorage.getItem('mumaa_ongoing_sleep');
    if (savedSleep) {
      const startTime = new Date(savedSleep);
      setSleepStartTime(startTime);
      setIsSleeping(true);
      startTimer(startTime);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user?.id]);

  const fetchTodayLogs = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await api.get(`/logs/activity/${user.id}`);
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch logs", e);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (type: string, detail: string, start?: string, end?: string) => {
    if (!babyProfile?.id) return;
    try {
      const startTime = start || new Date().toISOString();
      await api.post('/logs/activity', {
        babyId: babyProfile.id,
        type,
        detail,
        start: startTime,
        end: end || null,
        notes: ''
      });
      fetchTodayLogs();
      onActivityLogged();
    } catch (e) {
      console.error("Failed to log activity", e);
    }
  };

  const startTimer = (start: Date) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsedTime(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    }, 1000);
  };

  const handleStartSleep = () => {
    const now = new Date();
    setSleepStartTime(now);
    setIsSleeping(true);
    localStorage.setItem('mumaa_ongoing_sleep', now.toISOString());
    startTimer(now);
  };

  const handleEndSleep = async () => {
    if (!sleepStartTime) return;
    const end = new Date();
    if (timerRef.current) clearInterval(timerRef.current);
    
    await logActivity('sleep', 'Napped', sleepStartTime.toISOString(), end.toISOString());
    
    setIsSleeping(false);
    setSleepStartTime(null);
    setElapsedTime("00:00:00");
    localStorage.removeItem('mumaa_ongoing_sleep');
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10 bg-[#FFF8F3]">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-2">
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">Care Logger</h1>
          <p className="text-stone-500 font-bold mt-1">Keep track of {babyProfile?.name || 'your baby'}'s routines easily.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Feeding Panel */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="bg-white rounded-[2.5rem] p-7 border border-stone-100 shadow-sm relative overflow-hidden md:col-span-2"
          >
            <h3 className="text-lg font-black text-stone-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-xl shadow-inner"><Milk className="w-5 h-5" /></div>
              Log Feedings
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Breast', emoji: '🤱', type: 'breast' },
                { label: 'Bottle', emoji: '🍼', type: 'bottle' },
                { label: 'Solid', emoji: '🥣', type: 'solid' },
              ].map((item) => (
                <button 
                  key={item.type}
                  onClick={() => logActivity('feeding', item.label)}
                  className="bg-stone-50 border-2 border-transparent hover:border-orange-200 hover:bg-orange-50 rounded-3xl p-5 transition-all btn-press flex flex-col items-center justify-center gap-3 group shadow-sm"
                >
                  <div className="text-3xl group-hover:scale-125 transition-transform duration-300">{item.emoji}</div>
                  <div className="text-[11px] font-black text-stone-500 uppercase tracking-widest group-hover:text-stone-900">{item.label}</div>
                </button>
              ))}
            </div>
          </motion.div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Sleep Tracking */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="bg-white rounded-[2.5rem] p-7 border border-stone-100 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-black text-stone-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl shadow-inner"><MoonStar className="w-5 h-5" /></div>
              Sleep Tracking
            </h3>
            
            <AnimatePresence mode="wait">
              {isSleeping ? (
                <motion.div 
                  key="timer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center mb-8 py-10 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 shadow-inner relative overflow-hidden"
                >
                  <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white"
                  ></motion.div>
                  <span className="text-5xl font-black font-mono text-indigo-600 tracking-wider relative z-10">{elapsedTime}</span>
                  <div className="text-[11px] text-indigo-400 mt-4 uppercase font-black tracking-widest relative z-10 animate-pulse">
                    Sweet Dreams...
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-8 py-10 bg-stone-50/50 rounded-[2.5rem] border border-dashed border-stone-200 flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-300">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="text-stone-400 font-bold text-sm">Ready to track sleep?</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 mt-auto">
              {!isSleeping ? (
                <button 
                  onClick={handleStartSleep}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-5 rounded-3xl text-base font-black shadow-lg shadow-indigo-100 transition-all btn-press flex justify-center items-center gap-3"
                >
                  <Play className="w-5 h-5 fill-current" /> Start Sleep
                </button>
              ) : (
                <button 
                  onClick={handleEndSleep}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-5 rounded-3xl text-base font-black shadow-lg shadow-rose-100 transition-all btn-press flex justify-center items-center gap-3"
                >
                  <Square className="w-5 h-5 fill-current" /> Wake Up
                </button>
              )}
            </div>
          </motion.div>

          {/* Today's Activity Log */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="bg-white rounded-[2.5rem] p-7 border border-stone-100 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-black text-stone-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl shadow-inner"><History className="w-5 h-5" /></div>
              Today's Activity
            </h3>
            <div className="space-y-3 max-h-[320px] overflow-y-auto chat-scroll pr-2 flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-stone-100 border-t-emerald-500 rounded-full animate-spin"></div>
                </div>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 bg-stone-50/80 rounded-[1.8rem] border border-stone-100/50 group transition-all hover:bg-white hover:shadow-sm">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      log.activity_type === 'feeding' ? 'bg-orange-100 text-orange-500' :
                      'bg-indigo-100 text-indigo-500'
                    }`}>
                      {log.activity_type === 'feeding' ? <Utensils className="w-6 h-6" /> :
                       <MoonStar className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-black text-stone-800 capitalize">{log.activity_type}</span>
                        <span className="px-2 py-0.5 bg-white border border-stone-100 rounded-lg text-[10px] font-black text-stone-400 uppercase tracking-tight">{log.detail}</span>
                      </div>
                      <div className="text-[11px] font-bold text-stone-400 mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {log.end_time && ` - ${new Date(log.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-stone-400 text-sm font-bold text-center py-16 bg-stone-50/50 border border-dashed border-stone-200 rounded-[2rem] flex flex-col items-center gap-3">
                  <List className="w-10 h-10 opacity-20" />
                  No activity logged today
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
