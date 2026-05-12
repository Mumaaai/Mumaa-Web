import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, ChevronRight, X, Award
} from 'lucide-react';
import { api } from '../../../api';

interface Milestone {
  id: string;
  milestone_name: string;
  age_range: string;
  badge: string;
  description: string;
  status: 'pending' | 'achieved';
  achieved_date?: string;
  created_at: string;
}

interface MilestonesViewProps {
  user: any;
  babyProfile: any;
}

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const suggestedMilestones = [
  { name: 'First Social Smile', age: '0-3 months', badge: '😊', desc: 'Baby smiles in response to your smile' },
  { name: 'Follows Objects', age: '0-3 months', badge: '👀', desc: 'Tracks moving objects with eyes' },
  { name: 'Coos and Gurgles', age: '0-3 months', badge: '🗣️', desc: 'Makes cooing sounds' },
  { name: 'Holds Head Up', age: '0-3 months', badge: '💪', desc: 'Can hold head up briefly during tummy time' },
  { name: 'Rolls Over', age: '3-6 months', badge: '🔄', desc: 'Rolls from tummy to back or vice versa' },
  { name: 'Sits with Support', age: '3-6 months', badge: '🪑', desc: 'Can sit when propped up' },
  { name: 'Babbling', age: '6-9 months', badge: '💬', desc: 'Makes repetitive consonant sounds' },
  { name: 'Crawling', age: '9-12 months', badge: '🚶', desc: 'Moves around on hands and knees' }
];

export default function MilestonesView({ user, babyProfile }: MilestonesViewProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', age: '', badge: '✨', desc: '' });

  useEffect(() => {
    fetchMilestones();
  }, [user?.id]);

  const fetchMilestones = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await api.get(`/milestones/${user.id}`);
      if (Array.isArray(data)) {
        setMilestones(data);
      }
    } catch (e) {
      console.error("Failed to fetch milestones", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = async (milestone: Milestone) => {
    try {
      const newStatus = milestone.status === 'achieved' ? 'pending' : 'achieved';
      const achievedDate = newStatus === 'achieved' ? new Date().toISOString().split('T')[0] : null;
      
      await api.put(`/milestones/${milestone.id}`, {
        status: newStatus,
        achievedDate: achievedDate
      });
      
      setMilestones(milestones.map(m => 
        m.id === milestone.id ? { ...m, status: newStatus, achieved_date: achievedDate || undefined } : m
      ));
    } catch (e) {
      console.error("Failed to update milestone", e);
    }
  };

  const handleAddMilestone = async (e?: React.FormEvent, suggestion?: any) => {
    if (e) e.preventDefault();
    const payload = suggestion ? {
      babyId: babyProfile.id,
      name: suggestion.name,
      ageRange: suggestion.age,
      badge: suggestion.badge,
      description: suggestion.desc,
      status: 'pending'
    } : {
      babyId: babyProfile.id,
      name: newMilestone.name,
      ageRange: newMilestone.age,
      badge: newMilestone.badge,
      description: newMilestone.desc,
      status: 'pending'
    };

    if (!payload.name || !babyProfile?.id) return;

    try {
      const resp = await api.post('/milestones', payload);
      if (resp && resp.id) {
        // Refetch to get correct sorting from backend
        fetchMilestones();
        setShowAddModal(false);
        setNewMilestone({ name: '', age: '', badge: '✨', desc: '' });
      }
    } catch (e) {
      console.error("Failed to add milestone", e);
    }
  };

  const stats = {
    total: milestones.length,
    achieved: milestones.filter(m => m.status === 'achieved').length
  };

  const progress = stats.total > 0 ? Math.round((stats.achieved / stats.total) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10 bg-[#FAF9F6]">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black text-stone-800 tracking-tight">Milestones</h1>
                <p className="text-stone-500 font-bold mt-1">Celebrate every new leap.</p>
            </div>
            <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-stone-700 transition-all shadow-lg active:scale-95"
            >
                <Plus className="w-4 h-4" />
                New Milestone
            </button>
        </div>

        {/* Development Map Card */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-gradient-to-br from-white to-orange-50/30 rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />
            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8 relative z-10">
                <div className="space-y-6 flex-1">
                    <div>
                        <h2 className="text-2xl font-black text-stone-900">Development Map</h2>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-200">
                            Age: {babyProfile?.dob ? Math.floor((new Date().getTime() - new Date(babyProfile.dob).getTime()) / (1000 * 60 * 60 * 24 * 30.44)) : 0} months
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Trophy Case</div>
                        <div className="flex flex-wrap gap-2.5">
                            {milestones.filter(m => m.status === 'achieved').length > 0 ? (
                                milestones.filter(m => m.status === 'achieved').map(m => (
                                    <div key={m.id} className="flex items-center gap-2 bg-white border border-amber-200 px-4 py-2.5 rounded-2xl text-[11px] font-black text-amber-800 shadow-sm transition-all hover:scale-105 hover:bg-amber-50">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        <span>{m.milestone_name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-stone-400 font-bold text-sm italic py-2">No trophies yet. Keep growing!</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative w-36 h-36">
                        <svg className="w-36 h-36 transform -rotate-90">
                            <circle cx="72" cy="72" r="64" fill="none" stroke="#F5F5F4" strokeWidth="14" />
                            <circle cx="72" cy="72" r="64" fill="none" stroke="#F97316" strokeWidth="14" 
                                    strokeDasharray={402} 
                                    strokeDashoffset={402 - (402 * (progress / 100))} 
                                    strokeLinecap="round" 
                                    className="transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-stone-900 leading-none">{progress}%</span>
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Complete</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Checkpoints Section */}
        <div className="space-y-6">
            <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em]">Current Stage Checkpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white h-32 rounded-3xl border border-stone-100 animate-pulse"></div>
                    ))
                ) : milestones.length > 0 ? (
                    milestones.map((m, i) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`group relative bg-white border p-6 rounded-[2.5rem] flex items-center gap-6 transition-all hover:shadow-xl ${m.status === 'achieved' ? 'border-emerald-200 bg-emerald-50/20 shadow-emerald-50' : 'border-stone-200 shadow-sm'}`}
                        >
                            <button 
                                onClick={() => toggleMilestone(m)}
                                className={`w-12 h-12 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${m.status === 'achieved' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 hover:border-emerald-400 bg-stone-50'}`}
                            >
                                {m.status === 'achieved' ? <Check className="w-6 h-6" /> : <div className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-emerald-400 transition-colors" />}
                            </button>

                            <div className="flex-1 min-w-0 text-left">
                                <h4 className="text-lg font-black text-stone-900 truncate mb-0.5">{m.milestone_name}</h4>
                                <p className="text-[13px] text-stone-600 font-bold leading-snug line-clamp-2">{m.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded-md">{m.age_range}</span>
                                    {m.status === 'achieved' && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-md">Achieved</span>}
                                </div>
                            </div>

                            <div className="text-4xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0 grayscale group-hover:grayscale-0">
                                {m.badge}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-stone-200">
                        <p className="text-stone-400 font-bold">No milestones yet. Click "New Milestone" to add one.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-4xl rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-stone-800">Add Achievement</h3>
                    <p className="text-stone-400 font-bold text-sm">Follow the development map or record a custom moment.</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Common Leaps</h4>
                      <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto pr-2 chat-scroll">
                         {suggestedMilestones.map((mil, idx) => (
                           <button
                             key={idx}
                             onClick={() => handleAddMilestone(undefined, mil)}
                             disabled={milestones.some(m => m.milestone_name === mil.name)}
                             className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-100 rounded-[1.5rem] text-left hover:border-orange-300 hover:bg-orange-50 transition-all group disabled:opacity-40"
                           >
                             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                               {mil.badge}
                             </div>
                             <div className="flex-1">
                               <div className="text-sm font-black text-stone-800">{mil.name}</div>
                               <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{mil.age}</div>
                             </div>
                             {milestones.some(m => m.milestone_name === mil.name) ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                             ) : (
                                <ChevronRight className="w-4 h-4 text-stone-300 group-hover:translate-x-1 transition-transform" />
                             )}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Custom Moment</h4>
                      <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-2">Achievement</label>
                            <input 
                                placeholder="e.g. First word"
                                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold outline-none focus:border-orange-500 transition-all"
                                value={newMilestone.name}
                                onChange={e => setNewMilestone({...newMilestone, name: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-2">Age / Period</label>
                                <input 
                                    placeholder="e.g. 10 months"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold outline-none focus:border-orange-500 transition-all"
                                    value={newMilestone.age}
                                    onChange={e => setNewMilestone({...newMilestone, age: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-2">Icon (Emoji)</label>
                                <input 
                                    placeholder="✨"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-center text-xl outline-none focus:border-orange-500 transition-all"
                                    value={newMilestone.badge}
                                    onChange={e => setNewMilestone({...newMilestone, badge: e.target.value})}
                                />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-2">Description</label>
                            <textarea 
                                placeholder="Describe the moment..."
                                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold outline-none focus:border-orange-500 transition-all h-24 resize-none"
                                value={newMilestone.desc}
                                onChange={e => setNewMilestone({...newMilestone, desc: e.target.value})}
                            />
                          </div>
                          <button 
                            onClick={(e) => handleAddMilestone(e)}
                            disabled={!newMilestone.name}
                            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-orange-100 transition-all active:scale-95"
                          >
                            Save Achievement
                          </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
