import React, { useEffect, useState, useMemo } from 'react';
import OpsLayout from '../components/OpsLayout';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useOpsData } from '../hooks/useOpsData';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, parseISO, isToday, addDays } from 'date-fns';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Loader2,
  Plus,
  Filter,
  ListTodo,
  Sparkles,
  Layers3,
  CalendarDays
} from 'lucide-react';

const OpsDashboard: React.FC = () => {
  const {
    tasks,
    projects,
    teams,
    events,
    users,
    employee,
    loading,
    error,
    createTask,
    updateTask,
    addComment,
    fetchComments
  } = useOpsData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('mine');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilterLocal, setStatusFilterLocal] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dashboardViewMode, setDashboardViewMode] = useState<'calendar' | 'schedule'>('calendar');

  const calendarEvents = useMemo(() => {
    let items: any[] = [];
    
    tasks.forEach(t => {
      if (t.deadline) {
        items.push({ id: t.id, title: t.title, type: 'task', date: parseISO(t.deadline) });
      }
    });
    
    events.forEach((e: any) => {
      if (e.start_time) {
        items.push({ id: e.id, title: e.title, type: 'event', date: parseISO(e.start_time) });
      }
    });
    
    return items;
  }, [tasks, events]);

  const miniCalendarDays = useMemo(() => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(addDays(start, 28)); // 4 weeks
    return eachDayOfInterval({ start, end });
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setUser(JSON.parse(session));
    }
  }, [navigate]);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!loading && !employee && session) {
       localStorage.removeItem('ops_session');
       navigate('/opsboard/auth');
    }
  }, [employee, loading, navigate]);

  const handleTaskClick = (task: any) => {
    setSelectedTaskId(task.id);
    setIsModalOpen(true);
  };

  const selectedTask = useMemo(
    () => tasks.find(task => task.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  useEffect(() => {
    if (isModalOpen && selectedTaskId && !tasks.some(task => task.id === selectedTaskId)) {
      setIsModalOpen(false);
      setSelectedTaskId(null);
    }
  }, [isModalOpen, selectedTaskId, tasks]);

  const filteredTasks = tasks.filter((t) => {
    if (viewMode === 'mine') {
      const isAssigned = t.assigned_to === user?.id || t.assignees?.split(',').includes(user?.id);
      if (!isAssigned) return false;
    }
    if (teamFilter !== 'All' && t.team_id !== teamFilter) return false;
    if (projectFilter !== 'All' && t.project_id !== projectFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (statusFilterLocal !== 'All' && t.status !== statusFilterLocal) return false;
    if (searchTerm && !(`${t.title} ${t.id}`.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  const avgCompletion = filteredTasks.length ? Math.round(filteredTasks.reduce((s, x) => s + (x.progress || 0), 0) / filteredTasks.length) : 0;
  const openCount = filteredTasks.filter(t => t.status !== 'Completed' && t.status !== 'Archived').length;
  const dueSoonCount = filteredTasks.filter(t => {
    if (!t.deadline) return false;
    const deadline = new Date(t.deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3 && t.status !== 'Completed';
  }).length;
  const teamsInvolvedCount = new Set(filteredTasks.map(t => t.team_id).filter(Boolean)).size;

  const recentActivity = [...filteredTasks].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 6);

  const upcomingAgenda = useMemo(() => {
    let items: any[] = [];
    const now = new Date();
    
    tasks.forEach(t => {
      if (t.deadline && t.status !== 'Completed' && t.status !== 'Archived') {
        const d = new Date(t.deadline);
        if (d >= now) {
          items.push({ id: t.id, title: t.title, type: 'task', date: d });
        }
      }
    });
    
    events.forEach((e: any) => {
      if (e.start_time) {
        const d = new Date(e.start_time);
        if (d >= now) {
          items.push({ id: e.id, title: e.title, type: 'event', date: d });
        }
      }
    });
    
    return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
  }, [tasks, events]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-cyan-500 dark:text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading operational data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl shadow-xl dark:shadow-[0_24px_80px_rgba(2,6,23,0.45)] border border-slate-200 dark:border-white/10 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 py-3 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-cyan-50 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <OpsLayout user={user}>
      <main className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 space-y-6 text-slate-800 dark:text-slate-100 bg-transparent min-h-full">
          <section className="relative overflow-hidden rounded-[2rem] bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_70px_rgba(2,6,23,0.35)] backdrop-blur-xl mb-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.14),_transparent_42%)] pointer-events-none" />
            <div className="relative p-5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {viewMode === 'mine' ? "Here is your personalized summary." : "Here is the overall operational summary."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-end">
                <div className="flex bg-slate-200 dark:bg-white/10 p-1 rounded-xl mr-2">
                  <button 
                    onClick={() => setViewMode('all')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    All Tasks
                  </button>
                  <button 
                    onClick={() => setViewMode('mine')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'mine' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    My Tasks
                  </button>
                </div>

                <div className="flex gap-4 items-center mr-4">
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 dark:text-white">{openCount}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Open Tasks</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="text-right">
                    <p className="text-xl font-black text-rose-500 dark:text-rose-400">{dueSoonCount}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Due Soon</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-500 dark:text-emerald-400">{avgCompletion}%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Avg Progress</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => setIsCreateModalOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-md text-sm">
                    <Plus size={16} /> New task
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[2.5fr_0.9fr] gap-6 items-start">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 shadow-lg dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] p-4 md:p-5 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  <select className="w-full h-12 text-sm border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 px-4 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-none" value={teamFilter} onChange={e => setTeamFilter(e.target.value)}>
                    <option value="All">All teams</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <select className="w-full h-12 text-sm border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 px-4 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-none" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
                    <option value="All">All projects</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select className="w-full h-12 text-sm border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 px-4 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-none" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                    <option value="All">All priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <select className="w-full h-12 text-sm border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 px-4 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-none" value={statusFilterLocal} onChange={e => setStatusFilterLocal(e.target.value)}>
                    <option value="All">All status</option>
                    <option value="Draft">Draft</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
                  <div className="relative flex-1 max-w-2xl">
                    <input type="text" placeholder="Search tasks, ids, or tags..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-12 pl-4 pr-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:ring-4 focus:ring-cyan-500/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm dark:shadow-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { navigator.clipboard?.writeText(JSON.stringify(filteredTasks)); }} className="px-4 h-12 rounded-2xl bg-white dark:bg-white/8 text-slate-800 dark:text-slate-100 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/12 transition-all border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">Export</button>
                    <button onClick={() => { setTeamFilter('All'); setProjectFilter('All'); setPriorityFilter('All'); setStatusFilterLocal('All'); setSearchTerm(''); }} className="px-4 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-bold hover:bg-slate-800 dark:hover:bg-cyan-50 transition-all shadow-sm">Reset</button>
                  </div>
                </div>
              </div>

              <TaskTable tasks={filteredTasks} users={users} onTaskClick={handleTaskClick} />
            </div>

            <aside className="space-y-6">
              <div className="rounded-[1.75rem] border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 shadow-lg dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Status</p>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Quick view</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> Live
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-white/5 px-4 py-3 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{tasks.filter(t => t.status === 'Completed').length}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-white/5 px-4 py-3 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Blocked</span>
                    <span className="text-sm font-black text-rose-500 dark:text-rose-300">{tasks.filter(t => t.status === 'Blocked').length}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] font-black text-slate-500 dark:text-slate-400 mb-2">
                      <span>Overall progress</span>
                      <span>{avgCompletion}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-white/8 overflow-hidden border border-slate-300 dark:border-white/10">
                      <div className="h-full rounded-full bg-cyan-500 dark:bg-cyan-400 transition-all duration-500" style={{ width: `${avgCompletion}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-950/60 shadow-lg dark:shadow-[0_18px_50px_rgba(2,6,23,0.3)] p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Schedule</p>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Upcoming</h3>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-white/10 p-0.5 rounded-lg text-xs">
                    <button 
                      onClick={() => setDashboardViewMode('calendar')}
                      className={`px-2 py-1 rounded-md font-bold transition-all ${dashboardViewMode === 'calendar' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Cal
                    </button>
                    <button 
                      onClick={() => setDashboardViewMode('schedule')}
                      className={`px-2 py-1 rounded-md font-bold transition-all ${dashboardViewMode === 'schedule' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      List
                    </button>
                  </div>
                </div>

                {dashboardViewMode === 'schedule' ? (
                  <div className="space-y-3">
                    {upcomingAgenda.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming items.</p>
                    ) : upcomingAgenda.map(item => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 shadow-sm dark:shadow-none">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate flex-1">{item.title}</p>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.type === 'event' ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400' : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {format(item.date, 'MMM d, h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-400 mb-1">
                      {['S','M','T','W','T','F','S'].map((d, i) => <div key={i}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {miniCalendarDays.map((day, i) => {
                        const dayEvents = calendarEvents.filter(e => isSameDay(e.date, day));
                        const isCurrentMonth = isSameMonth(day, new Date());
                        const isTodayDate = isToday(day);
                        
                        return (
                          <div key={i} className="relative group cursor-pointer">
                            <div className={`w-10 h-10 mx-auto flex items-center justify-center text-xs font-bold rounded-full transition-all ${
                              isTodayDate ? 'bg-cyan-500 text-white shadow-sm' : 
                              isCurrentMonth ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-slate-300 dark:text-slate-700'
                            }`}>
                              {format(day, 'd')}
                            </div>
                            {dayEvents.length > 0 && (
                              <div className="flex justify-center gap-0.5 mt-0.5 absolute bottom-0 left-0 right-0">
                                {dayEvents.slice(0, 3).map((e, idx) => (
                                  <div key={idx} className={`w-1 h-1 rounded-full ${
                                    e.type === 'event' ? 'bg-fuchsia-500' : 'bg-cyan-500'
                                  }`} />
                                ))}
                              </div>
                            )}
                            
                            {/* Tooltip on Hover */}
                            {dayEvents.length > 0 && (
                              <div className="absolute z-30 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 p-3 text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 scale-95 group-hover:scale-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{format(day, 'MMMM d')}</p>
                                <div className="space-y-1.5">
                                  {dayEvents.slice(0, 4).map(e => (
                                    <div key={e.id} className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${e.type === 'event' ? 'bg-fuchsia-500' : 'bg-cyan-500'}`} />
                                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate flex-1">
                                        {e.title}
                                      </p>
                                    </div>
                                  ))}
                                  {dayEvents.length > 4 && <p className="text-[10px] text-slate-500 font-bold mt-1">+{dayEvents.length - 4} more items</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </section>
        </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTaskId(null);
        }} 
        task={selectedTask} 
        onUpdate={updateTask}
        onAddComment={addComment}
        fetchComments={fetchComments}
        currentUser={user}
        users={users}
        projects={projects}
        teams={teams}
      />

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createTask}
        teams={teams}
        projects={projects}
        users={users}
      />
    </OpsLayout>
  );
};

export default OpsDashboard;
