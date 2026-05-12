import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, ShieldCheck, Calendar, Clock, 
  CheckCircle2, Info, Plus
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

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

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

  const handleAddVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVax.name || !newVax.date || !babyProfile?.id) return;

    try {
      const resp = await api.post('/vaccinations', {
        babyId: babyProfile.id,
        name: newVax.name,
        dueDate: newVax.date,
        status: 'pending'
      });

      if (resp.id) {
        const addedVax: Vaccination = {
          id: resp.id,
          vaccine_name: newVax.name,
          due_date: newVax.date,
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
    completed: vaccines.filter(v => v.status === 'completed').length,
    pending: vaccines.filter(v => v.status === 'pending').length
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10 bg-[#FAFAFA]">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight">Vaccination Tracker</h1>
            <p className="text-stone-500 font-bold mt-1">Keep {babyProfile?.name || 'your baby'}'s health on track.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 w-fit">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="p-3 bg-white border border-stone-200 rounded-2xl text-stone-600 hover:bg-stone-50 transition-all shadow-sm flex items-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden md:inline text-xs font-black uppercase tracking-widest">Add New</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Completion</div>
            <div className="text-2xl font-black text-stone-800">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000" 
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Completed</div>
            <div className="text-2xl font-black text-emerald-500">{stats.completed}</div>
            <div className="text-[10px] font-bold text-stone-400 mt-1">Doses administered</div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-white p-5 rounded-[2rem] border border-stone-100 shadow-sm">
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Upcoming</div>
            <div className="text-2xl font-black text-orange-500">{stats.pending}</div>
            <div className="text-[10px] font-bold text-stone-400 mt-1">Remaining doses</div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-indigo-500 p-5 rounded-[2rem] border border-indigo-400 shadow-lg text-white">
            <div className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Next Visit</div>
            <div className="text-xl font-black truncate">
              {vaccines.find(v => v.status === 'pending')?.due_date 
                ? new Date(vaccines.find(v => v.status === 'pending')!.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'All Done!'}
            </div>
            <div className="text-[10px] font-bold text-indigo-100 mt-1">Stay protected</div>
          </motion.div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-stone-200">
              <div className="w-10 h-10 border-4 border-stone-100 border-t-orange-500 rounded-full animate-spin mb-4"></div>
              <p className="text-stone-400 font-bold">Loading schedule...</p>
            </div>
          ) : filteredVaccines.length > 0 ? (
            <div className="grid gap-3">
              {filteredVaccines.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group bg-white p-5 rounded-[2rem] border transition-all hover:shadow-md flex items-center gap-4 ${
                    v.status === 'completed' ? 'border-emerald-100 bg-emerald-50/10' : 'border-stone-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    v.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-50 text-stone-400'
                  }`}>
                    {v.status === 'completed' ? <ShieldCheck className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-stone-800 truncate">{v.vaccine_name}</h4>
                      {v.status === 'completed' && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-[11px] font-bold text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Due: {new Date(v.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      {v.administered_date && (
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Given: {new Date(v.administered_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleStatus(v)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        v.status === 'completed' 
                          ? 'bg-stone-100 text-stone-400 hover:bg-stone-200' 
                          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-100'
                      }`}
                    >
                      {v.status === 'completed' ? 'Undo' : 'Mark Done'}
                    </button>
                    
                    {/* Only allow deleting if it's not a standard vaccine (optional logic, but here let's allow it) */}
                    <button 
                      onClick={() => deleteVaccine(v.id)}
                      className="p-2.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-stone-200">
              <Stethoscope className="w-16 h-16 text-stone-200 mx-auto mb-4" />
              <h3 className="text-stone-800 font-black text-lg">No vaccines found</h3>
              <p className="text-stone-400 font-bold max-w-xs mx-auto mt-1">We couldn't find any vaccination records for this filter.</p>
            </div>
          )}
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
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-orange-500"></div>
                <h3 className="text-2xl font-black text-stone-800 mb-6">Add Vaccination</h3>
                
                <form onSubmit={handleAddVaccine} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Vaccine Name</label>
                    <input 
                      autoFocus
                      type="text"
                      placeholder="e.g. Influenza Booster"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all"
                      value={newVax.name}
                      onChange={e => setNewVax({...newVax, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Due Date</label>
                    <input 
                      type="date"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 font-bold outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all"
                      value={newVax.date}
                      onChange={e => setNewVax({...newVax, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-stone-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!newVax.name || !newVax.date}
                      className="flex-2 py-4 px-8 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-orange-100 transition-all"
                    >
                      Add to Schedule
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Info Box */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="bg-sky-50 p-6 rounded-[2.5rem] border border-sky-100 flex gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-sm shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-stone-800 text-[15px]">Medical Disclaimer</h4>
            <p className="text-[13px] text-stone-500 font-medium leading-relaxed mt-1">
              This schedule is a general guide based on pediatric standards. Always follow the specific advice and dates provided by your baby's pediatrician.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
