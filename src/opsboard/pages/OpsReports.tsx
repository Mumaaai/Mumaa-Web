import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import { useOpsData } from '../hooks/useOpsData';
import { 
  Loader2, 
  AlertCircle, 
  Clock, 
  CheckSquare, 
  Download,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

const OpsReports: React.FC = () => {
  const { tasks, projects, teams, users, loading, error } = useOpsData();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Filters
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  


  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setCurrentUser(JSON.parse(session));
    }
  }, [navigate]);

  // Determine if user is admin.
  const isAdmin = currentUser?.role === 'Admin';
  const now = new Date();

  // Filter users based on role
  const displayUsers = useMemo(() => {
    if (!currentUser) return [];
    if (!isAdmin) {
      return users.filter(u => u.id === currentUser.id);
    }
    return users;
  }, [users, currentUser, isAdmin]);

  // Filter tasks by date range
  const dateFilteredTasks = useMemo(() => {
    if (dateRange === 'all') return tasks;
    const now = new Date();
    const cutoff = dateRange === '7days' ? subDays(now, 7) : subDays(now, 30);
    return tasks.filter(t => {
      if (!t.created_at) return false;
      return isAfter(new Date(t.created_at), cutoff);
    });
  }, [tasks, dateRange]);

  // Calculate reports per user
  const userReports = useMemo(() => {
    const now = new Date();
    
    return displayUsers.map(u => {
      const userTasks = dateFilteredTasks.filter(t => 
        t.assigned_to === u.id || t.assignees?.split(',').includes(u.id)
      );
      
      const completedTasks = userTasks.filter(t => t.status === 'Completed');
      const missedDeadlines = userTasks.filter(t => {
        if (!t.deadline || t.status === 'Completed') return false;
        return new Date(t.deadline) < now;
      });
      
      const totalEstHours = userTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);
      const totalActualHours = userTasks.reduce((acc, t) => acc + (t.actual_hours || 0), 0);
      const variance = totalEstHours - totalActualHours;
      const completionRate = userTasks.length ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

      return {
        user: u,
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        missedDeadlines: missedDeadlines.length,
        totalEstHours,
        totalActualHours,
        variance,
        completionRate,
        tasks: userTasks // For drill-down
      };
    }).filter(report => {
      if (!searchTerm) return true;
      return report.user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [displayUsers, dateFilteredTasks, searchTerm]);

  // CSV Export Function
  const exportToCSV = () => {
    let csv = "Employee,Total Tasks,Completed,Completion Rate,Missed Deadlines,Est Hours,Actual Hours,Variance\n";
    userReports.forEach(r => {
      csv += `${r.user.full_name},${r.totalTasks},${r.completedTasks},${r.completionRate}%,${r.missedDeadlines},${r.totalEstHours},${r.totalActualHours},${r.variance}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Ops_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <OpsLayout user={currentUser}>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </OpsLayout>
    );
  }

  if (error) {
    return (
      <OpsLayout user={currentUser}>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-rose-100 dark:border-rose-500/20 text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Connection Error</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          </div>
        </div>
      </OpsLayout>
    );
  }

  return (
    <OpsLayout user={currentUser}>
      <main className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-slate-800 dark:text-slate-100 bg-transparent min-h-full">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Performance Reports</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Accountability and effort tracking for operations.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">


            {/* Date Range */}
            <div className="relative flex items-center">
              <Calendar size={14} className="absolute left-3 text-slate-400" />
              <select 
                className="h-10 pl-9 pr-4 text-xs border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-slate-700 dark:text-slate-300 shadow-sm"
                value={dateRange}
                onChange={e => setDateRange(e.target.value as any)}
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Export Button */}
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Search */}
        {isAdmin && (
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search employee name..."
              className="w-full h-11 pl-12 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 dark:text-slate-300 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* The Reports Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
              <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4 text-center">Assigned</th>
                  <th className="px-6 py-4 text-center">Completed</th>
                  <th className="px-6 py-4 text-center">Completion %</th>
                  <th className="px-6 py-4 text-center">Missed Deadlines</th>
                  <th className="px-6 py-4 text-right">Actual Effort</th>
                  <th className="px-6 py-4 text-right">Variance</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {userReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500 font-medium">No data found matching criteria.</td>
                  </tr>
                ) : userReports.map(report => {
                  const isExpanded = expandedUserId === report.user.id;
                  const isTopPerformer = report.completionRate === 100 && report.totalTasks > 0;
                  const hasDelays = report.missedDeadlines > 0;

                  return (
                    <React.Fragment key={report.user.id}>
                      <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-700 dark:text-cyan-400 shrink-0">
                              {report.user.full_name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {report.user.full_name}
                                {isTopPerformer && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-md uppercase font-black">Top</span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">{report.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">{report.totalTasks}</td>
                        <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{report.completedTasks}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold">{report.completionRate}%</span>
                            <div className="w-16 h-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${report.completionRate}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 font-bold ${hasDelays ? 'text-rose-500' : 'text-slate-400'}`}>
                            {hasDelays && <AlertTriangle size={12} />}
                            {report.missedDeadlines}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">{report.totalActualHours}h</td>
                        <td className={`px-6 py-4 text-right font-bold ${report.variance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                          {report.variance >= 0 ? `+${report.variance}` : report.variance}h
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setExpandedUserId(isExpanded ? null : report.user.id)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Drill-Down Section */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detailed Task Breakdown</h4>
                              {report.tasks.length === 0 ? (
                                <p className="text-sm text-slate-500">No tasks found for this period.</p>
                              ) : (
                                <div className="space-y-2">
                                  {report.tasks.map(t => {
                                    const isMissed = t.deadline && new Date(t.deadline) < now && t.status !== 'Completed';
                                    return (
                                      <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5 text-sm">
                                        <div className="flex items-center gap-3">
                                          <span className={`w-2 h-2 rounded-full ${
                                            t.status === 'Completed' ? 'bg-emerald-500' : 
                                            isMissed ? 'bg-rose-500' : 'bg-amber-500'
                                          }`} />
                                          <div>
                                            <span className="font-bold text-slate-800 dark:text-white">{t.title}</span>
                                            <div className="text-xs text-slate-400">Due: {t.deadline ? format(new Date(t.deadline), 'MMM d, yyyy') : 'No deadline'}</div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold">
                                          <span className="text-slate-500">Est: {t.estimated_hours || 0}h</span>
                                          <span className="text-slate-900 dark:text-white">Act: {t.actual_hours || 0}h</span>
                                          <span className={`uppercase text-[10px] px-2 py-0.5 rounded-full ${
                                            t.status === 'Completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                          }`}>
                                            {t.status}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </OpsLayout>
  );
};

export default OpsReports;
