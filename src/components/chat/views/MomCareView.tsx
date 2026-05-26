import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, Smile, RefreshCw, Droplet, Sparkles, SmilePlus, Plus, Minus, Compass, BatteryCharging, Wind, CheckCircle2, Award } from 'lucide-react';

interface MoodLog {
  mood: string;
  timestamp: string;
}

const MOTIVATIONS = [
  "You are the exact parent your child needs. Remember to breathe and trust yourself.",
  "There is no such thing as a perfect parent. So just be a real one.",
  "Take a deep breath. You are doing a wonderful, wonderful job.",
  "It is okay to ask for help. It takes a village for a reason.",
  "Some days are just about surviving, and that is perfectly okay.",
  "You're growing a human and nurturing a soul. Give yourself grace.",
  "Your baby doesn't need a perfect mother; they need a happy, healthy you."
];

const MOODS = [
  { id: 'great', label: 'Great', emoji: '😇', color: 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border-emerald-150' },
  { id: 'good', label: 'Good', emoji: '😊', color: 'bg-sky-50 hover:bg-sky-100/80 text-sky-700 border-sky-150' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: 'bg-amber-50 hover:bg-amber-100/80 text-amber-700 border-amber-150' },
  { id: 'low', label: 'Low', emoji: '😔', color: 'bg-purple-50 hover:bg-purple-100/80 text-purple-700 border-purple-150' },
  { id: 'struggling', label: 'Struggling', emoji: '😩', color: 'bg-rose-50 hover:bg-rose-100/80 text-rose-700 border-rose-150' },
];

export default function MomCareView() {
  const [quote, setQuote] = useState('');
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [waterCount, setWaterCount] = useState(0);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Take 5 minutes just for yourself', done: false },
    { id: 2, text: 'Stretch or walk outdoors', done: false },
    { id: 3, text: 'Drink a warm cup of tea/water', done: false },
    { id: 4, text: 'Rest when the baby sleeps', done: false },
    { id: 5, text: 'Acknowledge one thing you did well today', done: false },
  ]);

  // Breathing exercise states
  const [breathingState, setBreathingState] = useState<'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2'>('idle');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  useEffect(() => {
    refreshQuote();
    try {
      const storedMoods = localStorage.getItem('mumaa_moods');
      if (storedMoods) setMoodLogs(JSON.parse(storedMoods));
      
      const storedWater = localStorage.getItem('mumaa_water_' + new Date().toDateString());
      if (storedWater) setWaterCount(Number(storedWater));

      const storedChecklist = localStorage.getItem('mumaa_selfcare_list');
      if (storedChecklist) setChecklist(JSON.parse(storedChecklist));
    } catch (e) {}
  }, []);

  // Handle breathing sequence timer
  useEffect(() => {
    if (breathingState === 'idle') return;

    const interval = setInterval(() => {
      setBreathingSeconds(prev => {
        if (prev <= 1) {
          if (breathingState === 'inhale') {
            setBreathingState('hold1');
            return 4;
          } else if (breathingState === 'hold1') {
            setBreathingState('exhale');
            return 4;
          } else if (breathingState === 'exhale') {
            setBreathingState('hold2');
            return 4;
          } else {
            setBreathingState('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingState]);

  const refreshQuote = () => {
    const randomIdx = Math.floor(Math.random() * MOTIVATIONS.length);
    setQuote(MOTIVATIONS[randomIdx]);
  };

  const logMood = (moodId: string) => {
    const newLog = { mood: moodId, timestamp: new Date().toISOString() };
    const updated = [newLog, ...moodLogs].slice(0, 30);
    setMoodLogs(updated);
    localStorage.setItem('mumaa_moods', JSON.stringify(updated));
  };

  const handleWaterChange = (change: number) => {
    const val = Math.max(0, waterCount + change);
    setWaterCount(val);
    localStorage.setItem('mumaa_water_' + new Date().toDateString(), val.toString());
  };

  const toggleChecklistItem = (id: number) => {
    const updated = checklist.map(item => item.id === id ? { ...item, done: !item.done } : item);
    setChecklist(updated);
    localStorage.setItem('mumaa_selfcare_list', JSON.stringify(updated));
  };

  // Calculate self-care wellness index percentage
  const calculateWellnessIndex = () => {
    const checklistScore = (checklist.filter(item => item.done).length / checklist.length) * 50;
    const hydrationScore = Math.min((waterCount / 8) * 50, 50);
    return Math.round(checklistScore + hydrationScore);
  };

  const getBreathingStyle = () => {
    switch (breathingState) {
      case 'inhale': return { color: 'text-rose-500', stroke: '#F43F5E', label: 'Inhale Slowly' };
      case 'hold1': return { color: 'text-amber-500', stroke: '#F59E0B', label: 'Hold Breath' };
      case 'exhale': return { color: 'text-sky-500', stroke: '#0EA5E9', label: 'Exhale Slowly' };
      case 'hold2': return { color: 'text-purple-500', stroke: '#A855F7', label: 'Rest & Hold' };
      default: return { color: 'text-stone-400', stroke: '#E2E8F0', label: 'Ready' };
    }
  };

  const activeBreathStyle = getBreathingStyle();
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  // Determine scaling dynamically for smooth visual scale transitions
  const getScale = () => {
    if (breathingState === 'inhale') return 1.35;
    if (breathingState === 'hold1') return 1.35;
    if (breathingState === 'exhale') return 0.95;
    if (breathingState === 'hold2') return 0.95;
    return 1.0;
  };

  const wellnessPercentage = calculateWellnessIndex();

  return (
    <div className="h-full overflow-y-auto chat-scroll p-4 md:p-8 bg-[#FFFDFB]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-850 flex items-center gap-3">
              <span className="p-2 bg-rose-50 rounded-2xl text-rose-500 shadow-sm">
                <HeartHandshake className="w-7 h-7" />
              </span>
              Mother's Care
            </h1>
            <p className="text-stone-500 font-semibold mt-1">Nurturing the nurturer. Take a moment to log your wellness, practice breathing, and reset.</p>
          </div>
        </div>

        {/* Cohesive Wellness Dashboard Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Breathing Sanctuary centerpiece (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-stone-150/40 shadow-sm flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400" />
              
              <div className="w-full text-center md:text-left flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-stone-850 tracking-tight flex items-center justify-center md:justify-start gap-2">
                    <Compass className="w-5 h-5 text-rose-550" />
                    Box Breathing Reset
                  </h2>
                  <p className="text-stone-500 text-xs font-semibold mt-1.5 leading-relaxed max-w-sm">
                    A clinical stress-reduction practice. Sets the nervous system back to peace.
                  </p>
                </div>

                <div className="mx-auto md:mx-0">
                  {breathingState === 'idle' ? (
                    <button
                      onClick={() => {
                        setBreathingState('inhale');
                        setBreathingSeconds(4);
                      }}
                      className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-rose-100 btn-press cursor-pointer"
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={() => setBreathingState('idle')}
                      className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all btn-press cursor-pointer"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Jitter-Free Animated Circle Visualizer */}
              <div className="relative w-52 h-52 flex items-center justify-center my-6 shrink-0">
                {/* Visual smooth scale transition cloud */}
                <motion.div
                  animate={{ scale: getScale() }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 bg-rose-50/50 rounded-full border border-rose-100/30"
                />

                <svg className="w-full h-full transform -rotate-90 z-10">
                  {/* Track base */}
                  <circle
                    cx="104"
                    cy="104"
                    r={radius}
                    stroke="#F6F4F2"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Animated stroke dash offset synchronized on state change */}
                  {breathingState !== 'idle' && (
                    <motion.circle
                      key={breathingState}
                      cx="104"
                      cy="104"
                      r={radius}
                      stroke={activeBreathStyle.stroke}
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: circumference }}
                      transition={{ duration: 4, ease: "linear" }}
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Inner circle text */}
                <div className="absolute w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-sm z-20 border border-stone-100/50 text-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${activeBreathStyle.color}`}>
                    {activeBreathStyle.label}
                  </span>
                  <span className="text-3xl font-black text-stone-850 mt-1">
                    {breathingState === 'idle' ? 'Ready' : `${breathingSeconds}s`}
                  </span>
                </div>
              </div>

              {/* Progress step indicators at bottom */}
              <div className="flex gap-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-t border-stone-50 w-full pt-4 justify-center">
                <span className={breathingState === 'inhale' ? 'text-rose-500 font-extrabold' : ''}>Inhale</span>
                <span className={breathingState === 'hold1' ? 'text-amber-500 font-extrabold' : ''}>Hold</span>
                <span className={breathingState === 'exhale' ? 'text-sky-500 font-extrabold' : ''}>Exhale</span>
                <span className={breathingState === 'hold2' ? 'text-purple-500 font-extrabold' : ''}>Hold</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-stone-850 uppercase tracking-wider flex items-center gap-2">
                  <BatteryCharging className="w-4.5 h-4.5 text-emerald-450" />
                  Self-Care Checklist
                </h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1 tracking-widest">Small milestones to support mental health</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-center gap-3 p-3 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-stone-100 transition-colors text-left group active:scale-98 cursor-pointer"
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.done 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-stone-300 group-hover:border-emerald-400'
                    }`}>
                      {item.done && (
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold leading-normal transition-all ${
                      item.done ? 'line-through text-stone-450' : 'text-stone-700'
                    }`}>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Log Center column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Wellness Score Card */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 flex items-center gap-5 justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block">Wellness Index</span>
                <h3 className="text-sm font-extrabold text-stone-850">Daily Progress</h3>
                <p className="text-[10px] text-stone-450 font-semibold leading-relaxed max-w-[140px]">Combines self-care goals and water intake.</p>
              </div>

              {/* Progress Ring showing index */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#F6F4F2"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#10B981"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - wellnessPercentage / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-xs font-black text-stone-800">{wellnessPercentage}%</div>
              </div>
            </div>

            {/* Interactive Filling Water Bottle Card */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 flex items-center gap-6 justify-between min-h-[170px]">
              <div className="space-y-2 flex-1">
                <h3 className="text-sm font-extrabold text-stone-850 uppercase tracking-wider flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-sky-400" />
                  Hydration Monitor
                </h3>
                <p className="text-[11px] text-stone-500 font-semibold">Today: <span className="font-extrabold text-stone-800">{waterCount}</span> of 8 glasses</p>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleWaterChange(-1)}
                    className="w-9 h-9 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 transition-colors btn-press cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleWaterChange(1)}
                    className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-sm shadow-sky-100 btn-press cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filling Water Glass Visual */}
              <div className="w-14 h-24 rounded-b-xl rounded-t-sm border-4 border-stone-200 relative overflow-hidden bg-stone-50/50 shadow-inner shrink-0">
                <div 
                  className="bg-sky-400 absolute bottom-0 left-0 right-0 transition-all duration-550 flex items-center justify-center"
                  style={{ height: `${Math.min((waterCount / 8) * 100, 100)}%` }}
                >
                  {waterCount > 0 && (
                    <span className="text-[10px] font-black text-white select-none">
                      {Math.round(Math.min((waterCount / 8) * 100, 100))}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mood Pulse */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-stone-100 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-stone-850 uppercase tracking-wider flex items-center gap-2">
                  <SmilePlus className="w-4 h-4 text-rose-455" />
                  Mood Check-in
                </h3>
              </div>

              <div className="flex justify-between gap-1.5">
                {MOODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => logMood(m.id)}
                    className="w-9 h-9 rounded-full bg-stone-50 border border-stone-150/60 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center text-lg transition-colors btn-press cursor-pointer"
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>

              {moodLogs.length > 0 && (
                <div className="border-t border-stone-50 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Latest:</span>
                    <span className="text-[10px] font-extrabold text-stone-700">
                      {MOODS.find(m => m.id === moodLogs[0].mood)?.emoji} {MOODS.find(m => m.id === moodLogs[0].mood)?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
