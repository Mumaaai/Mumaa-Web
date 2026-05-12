import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Info, Plus, Trash2,
  ChevronRight, Calendar
} from 'lucide-react';
import { api } from '../../../api';

interface Vaccination {
  id: string;
  vaccine_name: string;
  due_date: string;
  administered_date?: string;
  status: 'pending' | 'scheduled' | 'completed';
}

interface VaccinationViewProps {
  user: any;
  babyProfile: any;
}

const commonVaccines = [
  { name: 'Influenza', desc: 'Annual flu protection' },
  { name: 'COVID-19 Booster', desc: 'Viral protection' },
  { name: 'Chickenpox', desc: 'Varicella protection' },
  { name: 'MMR Booster', desc: 'Measles, Mumps, Rubella' },
  { name: 'Hepatitis A', desc: 'Liver protection' },
  { name: 'Typhoid', desc: 'Bacterial protection' }
];

export default function VaccinationView({ user, babyProfile }: VaccinationViewProps) {
  const [vaccines, setVaccines] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVax, setNewVax] = useState({ name: '', date: '' });

  useEffect(() => {
    fetchVaccinations();
  }, [user?.id]);

  const fetchVaccinations = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await api.get(`/vaccinations/${user.id}`);
      if (Array.isArray(data)) {
        setVaccines(data);
      }
    } catch (e) {
      console.error("Failed to fetch vaccinations", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (vaccine: Vaccination) => {
    try {
      const newStatus = vaccine.status === 'completed' ? 'pending' : 'completed';
      const adminDate = newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null;
      
      await api.put(`/vaccinations/${vaccine.id}`, {
        status: newStatus,
        administeredDate: adminDate
      });
      
      setVaccines(vaccines.map(v => 
        v.id === vaccine.id ? { ...v, status: newStatus, administered_date: adminDate || undefined } : v
      ));
    } catch (e) {
      console.error("Failed to update vaccine", e);
    }
  };

  const handleAddVaccine = async (e?: React.FormEvent, selectedName?: string) => {
    if (e) e.preventDefault();
    const name = selectedName || newVax.name;
    const date = newVax.date || new Date().toISOString().split('T')[0];
    
    if (!name || !date || !babyProfile?.id) return;

    try {
      const resp = await api.post('/vaccinations', {
        babyId: babyProfile.id,
        name: name,
        dueDate: date,
        status: 'pending'
      });

      if (resp.id) {
        const addedVax: Vaccination = {
          id: resp.id,
          vaccine_name: name,
          due_date: date,
          status: 'pending'
        };

        setVaccines([...vaccines, addedVax].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
        
        setNewVax({ name: '', date: '' });
        setShowAddModal(false);
      }
    } catch (e) {
      console.error("Failed to add vaccine", e);
    }
  };

  const deleteVaccine = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vaccination?")) return;
    try {
      await api.delete(`/vaccinations/${id}`);
      setVaccines(vaccines.filter(v => v.id !== id));
    } catch (e) {
      console.error("Failed to delete vaccine", e);
    }
  };

  const filteredVaccines = vaccines.filter(v => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const stats = {
    total: vaccines.length,
    completed: vaccines.filter(v => v.status === 'completed').length
  };

  const getDueDateLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dateStr);
    due.setHours(0,0,0,0);
    
    if (due < today) return { label: 'DUE NOW!', color: 'text-rose-500 bg-rose-50' };
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return { label: `IN ${diffDays} DAYS`, color: 'text-orange-500 bg-orange-50' };
    
    return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-stone-400 bg-stone-50' };
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10 bg-[#FAF9F6]">
      <div className="p-4 md:p-10 max-w-[90rem] mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black text-stone-800 tracking-tight">Vaccination Tracker</h1>
                <p className="text-stone-500 font-bold mt-2">Manage {babyProfile?.name || 'your baby'}'s health roadmap.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex bg-stone-100 p-1.5 rounded-2xl">
                    {(['all', 'pending', 'completed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filter === f ? 'bg-white text-stone-800 shadow-md' : 'text-stone-400 hover:text-stone-600'
                        }`}
                    >
                        {f}
                    </button>
                    ))}
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-stone-700 transition-all shadow-lg active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Add Vaccine
                </button>
            </div>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl flex items-center gap-8">
                <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="#F5F5F4" strokeWidth="10" />
                        <circle cx="48" cy="48" r="42" fill="none" stroke="#6366F1" strokeWidth="10" 
                                strokeDasharray={264} 
                                strokeDashoffset={264 - (264 * (stats.total > 0 ? stats.completed / stats.total : 0))} 
                                strokeLinecap="round" 
                                className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-indigo-600">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </div>
                </div>
                <div>
                    <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Overall Protection</div>
                    <div className="text-3xl font-black text-stone-800">{stats.completed} <span className="text-stone-300">/</span> {stats.total}</div>
                    <p className="text-xs font-bold text-stone-400 mt-1 uppercase">Doses completed</p>
                </div>
            </div>

            <div className="lg:col-span-8 bg-sky-50 p-8 rounded-[3rem] border border-sky-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-sky-500 shadow-sm shrink-0">
                    <Info className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="font-black text-stone-800 text-lg">Pediatric Guidelines</h4>
                    <p className="text-[14px] text-stone-500 font-medium leading-relaxed mt-1">
                        This schedule is based on standard pediatric programs. For specific concerns or varied schedules, please consult your baby's doctor directly.
                    </p>
                </div>
            </div>
        </div>

        {/* Grid of Cards */}
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-[2px] flex-1 bg-stone-100"></div>
                <h3 className="text-xs font-black text-stone-300 uppercase tracking-[0.3em]">Immunization List</h3>
                <div className="h-[2px] flex-1 bg-stone-100"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white h-64 rounded-[2.5rem] border border-stone-100 animate-pulse"></div>
                    ))
                ) : filteredVaccines.length > 0 ? (
                    filteredVaccines.map((v, i) => {
                        const dueInfo = getDueDateLabel(v.due_date);
                        return (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className={`group relative bg-white border border-stone-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center transition-all hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-2 ${v.status === 'completed' ? 'border-emerald-100 bg-emerald-50/5' : ''}`}
                            >
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-inner ${v.status === 'completed' ? 'bg-emerald-100 text-emerald-500' : 'bg-stone-50 text-stone-300 group-hover:text-indigo-400 group-hover:bg-indigo-50 transition-colors'}`}>
                                    {v.status === 'completed' ? <CheckCircle2 className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                                </div>

                                <h4 className="text-xl font-black text-stone-800 line-clamp-2 mb-2 min-h-[3.5rem]">{v.vaccine_name}</h4>
                                
                                <div className="space-y-4 w-full">
                                    <div className={`inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${dueInfo.color}`}>
                                        {v.status === 'completed' ? 'COMPLETED' : dueInfo.label}
                                    </div>

                                    <div className="flex items-center justify-center gap-2 text-stone-400 font-bold text-[11px]">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(v.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>

                                    <button 
                                        onClick={() => toggleStatus(v)}
                                        className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 ${
                                        v.status === 'completed' 
                                            ? 'bg-stone-50 text-stone-400 hover:bg-stone-100' 
                                            : 'bg-white border-2 border-stone-100 text-stone-800 hover:border-emerald-500 hover:text-emerald-600'
                                        }`}
                                    >
                                        {v.status === 'completed' ? 'UNDO' : 'MARK DONE'}
                                    </button>
                                </div>

                                <button onClick={() => deleteVaccine(v.id)} className="absolute top-6 right-6 p-2 opacity-0 group-hover:opacity-100 text-stone-200 hover:text-rose-500 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <p className="text-stone-400 font-bold">No vaccinations match your criteria.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-4xl rounded-[4rem] p-8 md:p-12 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-stone-800">New Vaccination</h3>
                    <p className="text-stone-400 font-bold text-sm">Follow the standard schedule or add your own.</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors">
                    <Plus className="w-8 h-8 rotate-45" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Standard Schedule</h4>
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-3 chat-scroll">
                         {commonVaccines.map((vax, idx) => (
                           <button
                             key={idx}
                             onClick={() => handleAddVaccine(undefined, vax.name)}
                             className="flex items-center gap-5 p-5 bg-stone-50 border border-stone-100 rounded-[2rem] text-left hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                           >
                             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                               <ShieldCheck className="w-6 h-6" />
                             </div>
                             <div className="flex-1">
                               <div className="text-base font-black text-stone-800">{vax.name}</div>
                               <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{vax.desc}</div>
                             </div>
                             <ChevronRight className="w-5 h-5 text-stone-300 group-hover:translate-x-1 transition-transform" />
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="flex flex-col justify-between py-2">
                      <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Custom Vaccine</h4>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 px-2">Vaccine Name</label>
                                <input 
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Flu Booster"
                                    className="w-full bg-stone-50 border-2 border-stone-50 rounded-[1.5rem] px-6 py-5 text-stone-800 font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                                    value={newVax.name}
                                    onChange={e => setNewVax({...newVax, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 px-2">Due Date</label>
                                <input 
                                    type="date"
                                    className="w-full bg-stone-50 border-2 border-stone-50 rounded-[1.5rem] px-6 py-5 text-stone-800 font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                                    value={newVax.date}
                                    onChange={e => setNewVax({...newVax, date: e.target.value})}
                                />
                            </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleAddVaccine(e)}
                        disabled={!newVax.name || !newVax.date}
                        className="w-full mt-8 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 disabled:opacity-50 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                      >
                        Add to Schedule
                      </button>
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
