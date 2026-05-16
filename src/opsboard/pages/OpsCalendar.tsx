import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO,
  addDays,
  startOfDay,
  isBefore
} from 'date-fns';
import { ChevronLeft, ChevronRight, Filter, Plus, Calendar as CalendarIcon, CheckSquare, Briefcase, CalendarDays, X, LayoutList, Grid } from 'lucide-react';
import OpsLayout from '../components/OpsLayout';
import { useOpsData } from '../hooks/useOpsData';
import TaskModal from '../components/TaskModal';
import ProjectModal from '../components/ProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateEventModal from '../components/CreateEventModal';
import EventModal from '../components/EventModal';

const OpsCalendar: React.FC = () => {
  const { tasks, projects, teams, events, users, user, loading, updateTask, updateProject, createTask, createEvent, updateEvent, deleteEvent, addComment, fetchComments } = useOpsData();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Month' | 'Agenda'>('Month');
  const [filterMode, setFilterMode] = useState<'All' | 'My'>('All');
  const [typeFilters, setTypeFilters] = useState({ tasks: true, projects: true, events: true });
  
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedDateForCreate, setSelectedDateForCreate] = useState<Date | null>(null);
  const [fabOpenDate, setFabOpenDate] = useState<string | null>(null);

  // --- Date Math ---
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const agendaDays = eachDayOfInterval({ start: startOfDay(new Date()), end: addDays(startOfDay(new Date()), 14) });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // --- Event Aggregation & Sorting ---
  const calendarEvents = useMemo(() => {
    let allEvents: any[] = [];

    const filteredTasks = filterMode === 'My' ? tasks.filter(t => t.assignees?.includes(user?.id) || t.owner_id === user?.id) : tasks;
    const filteredProjects = filterMode === 'My' ? projects.filter(p => p.owner_id === user?.id) : projects;
    const filteredEvents = filterMode === 'My' ? events.filter((e: any) => e.attendees?.includes(user?.id) || e.created_by === user?.id) : events;

    if (typeFilters.tasks) {
      filteredTasks.forEach(task => {
        if (task.status === 'Archived') return;
        if (task.deadline) {
          allEvents.push({
            id: `task-${task.id}`,
            rawId: task.id,
            type: 'task',
            title: task.title,
            date: parseISO(task.deadline),
            raw: task,
            status: task.status,
            priority: task.priority,
            sortTime: new Date(task.deadline).getTime()
          });
        }
      });
    }

    if (typeFilters.projects) {
      filteredProjects.forEach(project => {
        if (project.status === 'Completed' || project.status === 'Archived') return;
        if (project.deadline) {
          allEvents.push({
            id: `proj-${project.id}`,
            rawId: project.id,
            type: 'project',
            title: project.name,
            date: parseISO(project.deadline),
            raw: project,
            status: project.status,
            sortTime: new Date(project.deadline).getTime()
          });
        }
      });
    }

    if (typeFilters.events) {
      filteredEvents.forEach((evt: any) => {
        if (evt.start_time) {
          allEvents.push({
            id: `evt-${evt.id}`,
            rawId: evt.id,
            type: 'event',
            title: evt.title,
            date: parseISO(evt.start_time),
            raw: evt,
            status: 'Active',
            sortTime: new Date(evt.start_time).getTime()
          });
        }
      });
    }

    // Chronological Sort
    return allEvents.sort((a, b) => a.sortTime - b.sortTime);
  }, [tasks, projects, events, user, filterMode, typeFilters]);

  // --- Drag & Drop ---
  const onDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: item.rawId, type: item.type, raw: item.raw }));
  };

  const onDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      const targetDateStr = format(targetDate, 'yyyy-MM-dd');
      
      if (data.type === 'task') {
        await updateTask(data.id, { deadline: targetDateStr });
      } else if (data.type === 'project') {
        await updateProject(data.id, { deadline: targetDateStr });
      } else if (data.type === 'event') {
        const startObj = parseISO(data.raw.start_time);
        const endObj = parseISO(data.raw.end_time);
        const newStart = new Date(`${targetDateStr}T${format(startObj, 'HH:mm:ss')}`).toISOString();
        const newEnd = new Date(`${targetDateStr}T${format(endObj, 'HH:mm:ss')}`).toISOString();
        await updateEvent(data.id, { start_time: newStart, end_time: newEnd });
      }
    } catch (err) {
      console.error('Failed to reschedule:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
      case 'Medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'Low': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30';
      default: return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30';
    }
  };

  if (loading) {
    return (
      <OpsLayout user={user}>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </OpsLayout>
    );
  }

  return (
    <OpsLayout user={user}>
      <main className="p-4 md:p-8 flex flex-col h-full space-y-6 animate-in fade-in duration-500 text-slate-800 dark:text-slate-100">
        
        {/* Header Controls */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight min-w-[200px]">
              {viewMode === 'Month' ? format(currentDate, 'MMMM yyyy') : 'Upcoming'}
            </h2>
            {viewMode === 'Month' && (
              <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-white/10">
                <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={goToToday} className="px-4 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Today
                </button>
                <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('Month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'Month' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Grid size={14} /> Month
              </button>
              <button 
                onClick={() => setViewMode('Agenda')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'Agenda' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <LayoutList size={14} /> Agenda
              </button>
            </div>

            {/* Type Filters */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1 shadow-sm h-[36px]">
              <label className="flex items-center gap-1.5 px-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors">
                <input type="checkbox" checked={typeFilters.tasks} onChange={e => setTypeFilters(p => ({...p, tasks: e.target.checked}))} className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/50" />
                Tasks
              </label>
              <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
              <label className="flex items-center gap-1.5 px-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-fuchsia-500 transition-colors">
                <input type="checkbox" checked={typeFilters.events} onChange={e => setTypeFilters(p => ({...p, events: e.target.checked}))} className="rounded border-slate-300 text-fuchsia-500 focus:ring-fuchsia-500/50" />
                Events
              </label>
              <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
              <label className="flex items-center gap-1.5 px-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">
                <input type="checkbox" checked={typeFilters.projects} onChange={e => setTypeFilters(p => ({...p, projects: e.target.checked}))} className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500/50" />
                Projects
              </label>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 hidden sm:block mx-1" />

            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button 
                onClick={() => setFilterMode('All')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'All' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                All Scope
              </button>
              <button 
                onClick={() => setFilterMode('My')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterMode === 'My' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                My Schedule
              </button>
            </div>
            
            <button 
              onClick={() => { setSelectedDateForCreate(new Date()); setIsCreateTaskOpen(true); }}
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-black shadow-sm hover:opacity-90 transition-opacity text-sm ml-auto"
            >
              <Plus size={16} /> Quick Add
            </button>
          </div>
        </div>

        {/* View Rendering */}
        {viewMode === 'Month' ? (
          <div className="flex-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Cells */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr">
              {calendarDays.map((day, i) => {
                const formattedDate = format(day, 'd');
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);
                const isFabOpen = fabOpenDate === day.toISOString();

                const dayEvents = calendarEvents.filter(e => isSameDay(e.date, day));

                return (
                  <div 
                    key={day.toString()} 
                    onClick={() => setFabOpenDate(day.toISOString())}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => onDrop(e, day)}
                    className={`relative min-h-[120px] p-2 border-r border-b border-slate-100 dark:border-white/5 group transition-colors ${
                      !isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/20 text-slate-400' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 cursor-pointer">
                      <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                        isTodayDate 
                          ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' 
                          : 'group-hover:bg-slate-200 dark:group-hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {formattedDate}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 mt-2 overflow-hidden max-h-[80px]">
                      {dayEvents.map(evt => (
                        <div 
                          key={evt.id}
                          draggable
                          onDragStart={e => onDragStart(e, evt)}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (evt.type === 'task') setSelectedTask(evt.raw);
                            else if (evt.type === 'project') setSelectedProject(evt.raw);
                            else if (evt.type === 'event') setSelectedEvent(evt.raw);
                          }}
                          className={`px-2 py-1.5 rounded-lg text-xs font-bold truncate cursor-grab active:cursor-grabbing transition-transform hover:scale-[1.02] border ${
                            evt.type === 'project' 
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30'
                              : evt.type === 'event'
                                ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-500/30'
                                : evt.status === 'Completed' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                  : getPriorityColor(evt.priority)
                          }`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            {evt.type === 'project' ? <Briefcase size={10} className="shrink-0" /> : evt.type === 'event' ? <CalendarDays size={10} className="shrink-0" /> : <CheckSquare size={10} className="shrink-0" />}
                            <span className="truncate">{evt.type === 'event' && format(parseISO(evt.raw.start_time), 'h:mm a') + ' - '}{evt.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FAB Menu Popup */}
                    {isFabOpen && (
                      <div 
                        className="absolute z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-2 w-48 mt-2 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                        style={{ top: '30px', left: '10px' }}
                      >
                        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add to {format(day, 'MMM d')}</span>
                          <button onClick={() => setFabOpenDate(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X size={12} />
                          </button>
                        </div>
                        <button 
                          onClick={() => { setSelectedDateForCreate(day); setIsCreateTaskOpen(true); setFabOpenDate(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left text-sm font-bold text-slate-700 dark:text-slate-200"
                        >
                          <CheckSquare size={14} className="text-cyan-500" /> New Task
                        </button>
                        <button 
                          onClick={() => { setSelectedDateForCreate(day); setIsCreateEventOpen(true); setFabOpenDate(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left text-sm font-bold text-slate-700 dark:text-slate-200"
                        >
                          <CalendarDays size={14} className="text-fuchsia-500" /> Event / Meeting
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-sm overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
            {agendaDays.map(day => {
              const dayEvents = calendarEvents.filter(e => isSameDay(e.date, day));
              if (dayEvents.length === 0) return null; // Only show days with events
              
              return (
                <div key={day.toString()} className="flex flex-col md:flex-row gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="md:w-32 shrink-0 border-b md:border-b-0 border-slate-200 dark:border-white/10 pb-2 md:pb-0">
                    <h3 className={`text-2xl font-black ${isToday(day) ? 'text-cyan-500' : 'text-slate-900 dark:text-white'}`}>{format(day, 'dd')}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{format(day, 'EEEE')}</p>
                    <p className="text-xs text-slate-500 mt-1">{format(day, 'MMM yyyy')}</p>
                  </div>
                  <div className="flex-1 space-y-3">
                    {dayEvents.map(evt => (
                      <div 
                        key={evt.id}
                        onClick={() => {
                          if (evt.type === 'task') setSelectedTask(evt.raw);
                          else if (evt.type === 'project') setSelectedProject(evt.raw);
                          else if (evt.type === 'event') setSelectedEvent(evt.raw);
                        }}
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${
                          evt.type === 'project' 
                            ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                            : evt.type === 'event'
                              ? 'bg-fuchsia-50/50 dark:bg-fuchsia-900/10 border-fuchsia-100 dark:border-fuchsia-500/20 hover:border-fuchsia-300 dark:hover:border-fuchsia-500/50'
                              : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            evt.type === 'project' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                            : evt.type === 'event' ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400'
                            : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400'
                          }`}>
                            {evt.type === 'project' ? <Briefcase size={20} /> : evt.type === 'event' ? <CalendarDays size={20} /> : <CheckSquare size={20} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {evt.title}
                            </h4>
                            <p className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                              {evt.type === 'event' && <span className="text-fuchsia-600 dark:text-fuchsia-400">{format(parseISO(evt.raw.start_time), 'h:mm a')} - {format(parseISO(evt.raw.end_time), 'h:mm a')}</span>}
                              {evt.type === 'task' && <span className="text-cyan-600 dark:text-cyan-400">Due EOD</span>}
                              {evt.type === 'project' && <span className="text-indigo-600 dark:text-indigo-400">Project Deadline</span>}
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                              <span className="uppercase text-[10px] tracking-widest font-black">{evt.type}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {calendarEvents.filter(e => isBefore(new Date(), e.date) && isBefore(e.date, addDays(new Date(), 14))).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                  <CalendarDays size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Clear Schedule</h3>
                  <p className="text-slate-500 text-sm mt-1">No upcoming events or tasks in the next 14 days.</p>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modals */}
      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onUpdate={updateTask}
          onAddComment={addComment}
          fetchComments={fetchComments}
          currentUser={user}
          users={users}
          projects={projects}
          teams={teams}
        />
      )}
      {selectedProject && (
        <ProjectModal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          onUpdate={updateProject}
          tasks={tasks}
          users={users}
          teams={teams}
        />
      )}
      {isCreateTaskOpen && (
        <CreateTaskModal
          isOpen={isCreateTaskOpen}
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={createTask}
          teams={teams}
          users={users}
          projects={projects}
          initialDate={selectedDateForCreate}
        />
      )}
      {isCreateEventOpen && (
        <CreateEventModal
          isOpen={isCreateEventOpen}
          onClose={() => setIsCreateEventOpen(false)}
          onCreate={createEvent}
          users={users}
          initialDate={selectedDateForCreate}
        />
      )}
      {selectedEvent && (
        <EventModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          users={users}
        />
      )}
    </OpsLayout>
  );
};

export default OpsCalendar;
