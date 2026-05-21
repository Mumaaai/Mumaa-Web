import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCw, Check, Trash2, Info } from 'lucide-react';
import { api } from '../../../api';

interface RoutineViewProps {
  user: any;
  babyProfile: any;
}

interface RoutineTask {
  id: string;
  time: string;
  task: string;
}

const DEFAULT_ROUTINE: RoutineTask[] = [
  { id: 'r1', time: '07:00', task: 'Wake up & Morning Cuddles' },
  { id: 'r2', time: '07:30', task: 'First Feed / Breakfast' },
  { id: 'r3', time: '09:00', task: 'Gentle Play / Tummy Time' },
  { id: 'r4', time: '10:00', task: 'Morning Nap' },
  { id: 'r5', time: '12:00', task: 'Midday Feed / Lunch' },
  { id: 'r6', time: '14:00', task: 'Afternoon Rest' },
  { id: 'r7', time: '16:00', task: 'Fresh Air / Walk' },
  { id: 'r8', time: '18:00', task: 'Evening Feed / Dinner' },
  { id: 'r9', time: '19:00', task: 'Warm Bath & Massage' },
  { id: 'r10', time: '19:30', task: 'Lullaby & Deep Sleep' }
];

function CustomTimePicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const time = value || '09:00';
  const [h, m] = time.split(':');

  const formatDisplay = (timeStr: string) => {
    if (!timeStr) return '--:--';
    const [hh, mm] = timeStr.split(':');
    const hour = parseInt(hh, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${mm} ${ampm}`;
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold hover:bg-white hover:border-orange-300 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none cursor-pointer flex items-center justify-between transition-all"
      >
        <span>{value ? formatDisplay(value) : '--:--'}</span>
        <Clock className="w-5 h-5 text-stone-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-xl border border-stone-100 p-4 z-50 flex gap-2 min-w-[240px]"
            >
              {/* Hour column */}
              <div className="flex-1 h-56 overflow-y-auto border-r border-stone-100 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {Array.from({ length: 24 }).map((_, i) => {
                  const hr = i.toString().padStart(2, '0');
                  const isSelected = hr === h;
                  return (
                    <button
                      key={`h-${hr}`}
                      onClick={() => onChange(`${hr}:${m}`)}
                      className={`w-full py-2.5 px-2 text-center rounded-xl font-bold mb-1 transition-colors ${
                        isSelected ? 'bg-orange-100 text-orange-600' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {hr}
                    </button>
                  );
                })}
              </div>
              
              {/* Minute column */}
              <div className="flex-1 h-56 overflow-y-auto pl-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {Array.from({ length: 12 }).map((_, i) => {
                  const min = (i * 5).toString().padStart(2, '0');
                  const isSelected = min === m;
                  return (
                    <button
                      key={`m-${min}`}
                      onClick={() => {
                        onChange(`${h}:${min}`);
                        setIsOpen(false);
                      }}
                      className={`w-full py-2.5 px-2 text-center rounded-xl font-bold mb-1 transition-colors ${
                        isSelected ? 'bg-orange-100 text-orange-600' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {min}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoutineView({ user, babyProfile }: RoutineViewProps) {
  const [customRoutines, setCustomRoutines] = useState<RoutineTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [timeInput, setTimeInput] = useState('');
  const [taskInput, setTaskInput] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Fetch from backend, fallback to local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const data = await api.get(`/routines/${user.id}`);
          if (data && !data.error) {
             setCustomRoutines(data.customRoutines || []);
             setCompletedTasks(data.completedTasks?.[today] || {});
             setIsLoaded(true);
             return;
          }
        }
      } catch (e) {
        console.error("Backend fetch failed, using local storage", e);
      }
      
      // Fallback to local storage
      try {
        const savedRoutines = localStorage.getItem('mumaa_customRoutines');
        if (savedRoutines) setCustomRoutines(JSON.parse(savedRoutines));
        
        const savedTasks = localStorage.getItem('mumaa_routines');
        if (savedTasks) {
          const parsed = JSON.parse(savedTasks);
          setCompletedTasks(parsed[today] || {});
        }
      } catch (e) {
        console.error("Local storage error", e);
      }
      setIsLoaded(true);
    };
    fetchData();
  }, [user, today]);

  // Save to backend and local storage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    
    let parsed = {};
    try {
      localStorage.setItem('mumaa_customRoutines', JSON.stringify(customRoutines));
      
      const savedTasks = localStorage.getItem('mumaa_routines');
      parsed = savedTasks ? JSON.parse(savedTasks) : {};
      parsed[today] = completedTasks;
      localStorage.setItem('mumaa_routines', JSON.stringify(parsed));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }

    // Sync to backend
    const syncData = async () => {
      if (user?.id) {
        try {
          await api.post('/routines', {
            userId: user.id,
            customRoutines,
            completedTasks: parsed
          });
        } catch (e) {
          console.error("Failed to sync routine with backend", e);
        }
      }
    };
    
    const timeoutId = setTimeout(syncData, 500);
    return () => clearTimeout(timeoutId);
  }, [customRoutines, completedTasks, isLoaded, user, today]);

  const allTasks = [...DEFAULT_ROUTINE, ...customRoutines].sort((a, b) => a.time.localeCompare(b.time));

  const addRoutineTask = () => {
    if (!timeInput || !taskInput.trim()) return;
    const newTask = {
      id: 'custom_' + Date.now(),
      time: timeInput,
      task: taskInput.trim()
    };
    setCustomRoutines(prev => [...prev, newTask]);
    setTimeInput('');
    setTaskInput('');
  };

  const deleteCustomRoutine = (id: string) => {
    setCustomRoutines(prev => prev.filter(r => r.id !== id));
  };

  const toggleRoutineItem = (id: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetRoutine = () => {
    setCompletedTasks({});
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 md:space-y-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-stone-800 tracking-tight">Daily Rhythm</h1>
            <p className="text-stone-500 font-medium mt-2 text-lg">Gentle structures for peaceful days.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetRoutine}
            className="text-sm font-bold bg-white text-stone-600 px-6 py-3 rounded-full transition-colors border border-stone-200 flex items-center justify-center gap-2 shadow-sm hover:border-orange-200 hover:text-orange-600 self-start md:self-auto"
          >
            <RotateCw className="w-4 h-4" /> Start Fresh
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Timeline Column */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[3rem] p-6 md:p-10 border border-stone-100 soft-shadow relative overflow-hidden h-full"
            >
              <div className="absolute top-0 left-0 w-full h-2 gradient-peach"></div>
              
              <div className="relative mt-2">
                {/* Timeline vertical line */}
                <div className="absolute top-8 bottom-8 left-[2.25rem] w-0.5 bg-gradient-to-b from-orange-200 via-stone-100 to-transparent hidden sm:block"></div>
                
                <div className="space-y-6 md:space-y-8">
                  <AnimatePresence mode="popLayout">
                    {allTasks.map((item, index) => {
                      const isDone = completedTasks[item.id];
                      const isCustom = item.id.startsWith('custom');

                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={item.id}
                          className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
                        >
                          {/* Timeline Node */}
                          <div className="relative z-10 flex flex-row sm:flex-col items-center gap-3 sm:gap-2 sm:w-[4.5rem] shrink-0">
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={() => toggleRoutineItem(item.id)}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 shadow-sm z-10 shrink-0 ${
                                isDone 
                                  ? 'bg-orange-400 border-orange-400 scale-110' 
                                  : 'bg-white border-stone-200 hover:border-orange-300 hover:scale-110'
                              }`}
                            >
                              <AnimatePresence>
                                {isDone && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 45 }}
                                  >
                                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                            <div className="text-sm font-black text-orange-400 tracking-tight shrink-0">
                              {formatTime(item.time)}
                            </div>
                          </div>

                          {/* Task Card */}
                          <div className={`flex-1 w-full flex items-center gap-4 p-5 sm:p-6 rounded-[2rem] transition-all duration-300 border ${
                            isDone 
                              ? 'opacity-60 bg-stone-50 border-stone-100 shadow-inner' 
                              : 'bg-white border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:border-orange-100 hover:shadow-[0_8px_30px_-4px_rgba(253,186,116,0.2)]'
                          }`}>
                            <div className={`text-lg font-bold flex-1 transition-all duration-300 ${
                              isDone ? 'line-through text-stone-400' : 'text-stone-700'
                            }`}>
                              {item.task}
                            </div>
                            {isCustom && (
                              <motion.button 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => deleteCustomRoutine(item.id)}
                                className="p-3 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors btn-press shrink-0"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side Column (Add Task & Info) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Add Custom Task Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-6 border border-stone-100 soft-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100/50">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-800 text-xl tracking-tight">Add Activity</h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">
                    Time
                  </label>
                  <CustomTimePicker value={timeInput} onChange={setTimeInput} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-1">
                    Activity Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.g., Park stroll"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRoutineTask()}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder-stone-300"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addRoutineTask}
                  className="w-full gradient-peach hover:opacity-90 text-orange-900 py-4 rounded-2xl font-bold transition-colors btn-press shadow-md border border-white mt-4 flex items-center justify-center gap-2 text-lg"
                >
                  Add to Routine
                </motion.button>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-[2.5rem] border border-orange-100 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-200/40 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <motion.div 
                  animate={{ 
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-white rounded-2xl shadow-sm text-orange-400 flex items-center justify-center mb-5 border border-orange-50"
                >
                  <Info className="w-6 h-6" />
                </motion.div>
                <strong className="text-stone-800 font-bold block mb-2 text-lg">Gentle Reminder</strong>
                <p className="text-stone-600 font-medium leading-relaxed">
                  Be flexible! Babies go through growth spurts that change everything. Don't stress if the schedule shifts.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
