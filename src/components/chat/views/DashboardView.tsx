import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Milk, Baby, MoonStar, Star, Plus, 
  Utensils, List,
  ShieldCheck, LayoutDashboard
} from 'lucide-react';
import { api } from '../../../api';

interface DashboardData {
  babyName: string;
  babyDob: string;
  todayStats: {
    feedings: number;
    diapers: number;
    sleepHours: number;
  };
  recentActivity: any[];
  nextVaccine: {
    vaccine_name: string;
    due_date: string;
  } | null;
  milestonesAchieved: number;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

interface DashboardViewProps {
  user: any;
  babyProfile: any;
  onTabChange: (tab: any) => void;
}

export default function DashboardView({ user, babyProfile, onTabChange }: DashboardViewProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const result = await api.get(`/dashboard/${user.id}`);
        if (result && !result.error) {
          setData(result);
        }
      } catch (e) {
        console.error("Dashboard fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-stone-500 font-bold animate-pulse">Loading today's care...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Feeds', value: data?.todayStats.feedings || 0, unit: 'Today', icon: Milk, color: 'orange', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
    { label: 'Diapers', value: data?.todayStats.diapers || 0, unit: 'Today', icon: Baby, color: 'sky', bg: 'bg-sky-50', iconBg: 'bg-sky-100', iconColor: 'text-sky-500' },
    { label: 'Sleep', value: `${data?.todayStats.sleepHours || 0}h`, unit: 'Today', icon: MoonStar, color: 'indigo', bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500' },
    { label: 'Leaps', value: data?.milestonesAchieved || 0, unit: 'Done', icon: Star, color: 'rose', bg: 'bg-rose-50', iconBg: 'bg-rose-100', iconColor: 'text-rose-500' },
  ];

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10 bg-[#FFF8F3]">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Greeting */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-2">
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">Today's Care</h1>
          <p className="text-stone-500 font-bold mt-1">A quick glance at {babyProfile?.name || 'your baby'}'s day.</p>
        </motion.div>

        {/* Today's Summary */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={fadeIn}
              className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-md transition-all group border border-stone-100 relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-70`}></div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} border border-white shadow-sm`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-black text-stone-800">{stat.value}</div>
                  <div className={`text-[10px] font-black ${stat.iconColor} uppercase`}>{stat.unit}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h3 className="text-[11px] font-black text-stone-400 mb-4 px-1 uppercase tracking-widest">Quick Log</h3>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <button 
              onClick={() => onTabChange('feeding')}
              className="bg-white border-2 border-stone-50 hover:border-orange-200 hover:bg-orange-50 text-stone-700 py-6 rounded-[2.5rem] text-sm font-black transition-all flex flex-col items-center gap-3 shadow-sm group"
            >
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <span>Log Feed</span>
            </button>
            <button 
              onClick={() => onTabChange('feeding')}
              className="bg-white border-2 border-stone-50 hover:border-sky-200 hover:bg-sky-50 text-stone-700 py-6 rounded-[2.5rem] text-sm font-black transition-all flex flex-col items-center gap-3 shadow-sm group"
            >
              <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <span>Log Diaper</span>
            </button>
            <button 
              onClick={() => onTabChange('feeding')}
              className="bg-white border-2 border-stone-50 hover:border-indigo-200 hover:bg-indigo-50 text-stone-700 py-6 rounded-[2.5rem] text-sm font-black transition-all flex flex-col items-center gap-3 shadow-sm group"
            >
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <span>Log Sleep</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Vaccinations */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-stone-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-stone-500 flex items-center gap-2 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                Next Vaccine
              </h3>
              <button 
                onClick={() => onTabChange('vaccination')}
                className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full transition-colors border border-emerald-100 uppercase tracking-wider"
              >
                View Schedule
              </button>
            </div>
            {data?.nextVaccine ? (
              <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-lg font-black text-stone-800">{data.nextVaccine.vaccine_name}</div>
                  <div className="text-sm font-bold text-emerald-600">Due: {new Date(data.nextVaccine.due_date).toLocaleDateString()}</div>
                </div>
              </div>
            ) : (
              <div className="text-stone-400 font-bold text-sm bg-stone-50/50 p-8 rounded-3xl flex-1 flex flex-col items-center justify-center border border-dashed border-stone-200 text-center gap-2">
                <LayoutDashboard className="w-8 h-8 opacity-20" />
                No upcoming vaccines found
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-stone-100 flex flex-col"
          >
            <h3 className="text-xs font-black text-stone-500 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]"></div>
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-[180px] overflow-y-auto chat-scroll pr-2 flex-1">
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((log, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-2xl transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      log.activity_type === 'feeding' ? 'bg-orange-100 text-orange-500' :
                      log.activity_type === 'diaper' ? 'bg-sky-100 text-sky-500' :
                      'bg-indigo-100 text-indigo-500'
                    }`}>
                      {log.activity_type === 'feeding' ? <Utensils className="w-5 h-5" /> :
                       log.activity_type === 'diaper' ? <Baby className="w-5 h-5" /> :
                       <MoonStar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-stone-800 capitalize">{log.activity_type}: {log.detail}</div>
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-tight">
                        {new Date(log.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {log.notes && (
                      <div className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        Notes
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-stone-400 text-sm font-bold text-center py-12 bg-stone-50/50 border border-dashed border-stone-200 rounded-3xl flex flex-col items-center gap-2">
                  <List className="w-8 h-8 opacity-20" />
                  No recent activity logged
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
