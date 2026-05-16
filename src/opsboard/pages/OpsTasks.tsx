import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useOpsData } from '../hooks/useOpsData';
import { 
  Plus, 
  Search, 
  ListTodo, 
  Loader2, 
  AlertCircle,
  GripHorizontal,
  Clock,
  User as UserIcon
} from 'lucide-react';

const COLUMNS = ['Draft', 'Assigned', 'In Progress', 'Review', 'Blocked', 'Completed'];

const OpsTasks: React.FC = () => {
  const { 
    tasks, 
    users, 
    projects, 
    teams, 
    loading, 
    error, 
    updateTask, 
    createTask, 
    addComment, 
    fetchComments 
  } = useOpsData();
  
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // States
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setUser(JSON.parse(session));
    }
  }, [navigate]);

  const selectedTask = useMemo(
    () => tasks.find(t => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Archived tasks usually don't belong on the main kanban board
      if (t.status === 'Archived') return false;
      
      if (viewMode === 'mine' && (!t.assignees || !t.assignees.split(',').includes(user?.id || ''))) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!t.title.toLowerCase().includes(query) && 
            !t.id.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, viewMode, user, searchQuery]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    // Slight delay to allow the drag image to capture before we might add styling
    setTimeout(() => {
      e.target && (e.target as HTMLElement).classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    (e.target as HTMLElement).classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault();
    if (dragOverColumn !== columnStatus) {
      setDragOverColumn(columnStatus);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only reset if we actually leave the column container
    // handled carefully so nested elements don't trigger it wildly
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (taskId && draggedTaskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== targetStatus) {
        // Optimistic UI handled in hook, just fire the API
        await updateTask(taskId, { status: targetStatus, updated_by: user?.id });
      }
    }
    setDraggedTaskId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl shadow-xl border border-rose-100 dark:border-rose-900/30 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <OpsLayout user={user} onAddClick={() => setIsCreateModalOpen(true)}>
      <main className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-500 flex flex-col h-full min-h-screen max-w-full overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Task Board</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Drag and drop tasks to update workflow status.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex bg-slate-200 dark:bg-white/10 p-1 rounded-xl">
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

            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 h-10 rounded-xl font-black shadow-sm transition-colors"
            >
              <Plus size={16} /> Create Task
            </button>
          </div>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 snap-x">
          <div className="flex h-full gap-4 md:gap-6 min-w-max items-stretch px-1">
            {COLUMNS.map(column => {
              const columnTasks = filteredTasks.filter(t => t.status === column);
              const isDragOver = dragOverColumn === column;
              
              return (
                <div 
                  key={column}
                  onDragOver={(e) => handleDragOver(e, column)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column)}
                  className={`flex flex-col w-72 md:w-[320px] h-[80vh] min-h-[500px] snap-start rounded-[1.5rem] bg-slate-200/60 dark:bg-slate-800/50 border-2 transition-all ${isDragOver ? 'border-indigo-400 dark:border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-transparent'}`}
                >
                  {/* Column Header */}
                  <div className="p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        column === 'Completed' ? 'bg-emerald-500' :
                        column === 'Blocked' ? 'bg-rose-500' :
                        column === 'Review' ? 'bg-amber-400' :
                        'bg-blue-500'
                      }`} />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{column}</h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 overflow-y-auto p-3 pt-0 space-y-3 min-h-[150px] custom-scrollbar">
                    {columnTasks.map(task => {
                      const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Completed';
                      const isUrgent = task.priority === 'Urgent' || task.priority === 'High';
                      const assigneesList = task.assignees ? task.assignees.split(',') : [];
                      const project = projects.find(p => p.id === task.project_id);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all group ${
                            isOverdue 
                              ? 'border-rose-200 dark:border-rose-900/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                              : 'border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/40'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                              {project?.name || 'No Project'}
                            </span>
                            <GripHorizontal size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab" />
                          </div>
                          
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {isUrgent && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[9px] font-black uppercase tracking-wider">
                                {task.priority}
                              </span>
                            )}
                            {isOverdue && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                <Clock size={10} /> Overdue
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center -space-x-1.5">
                              {assigneesList.length > 0 ? (
                                assigneesList.slice(0, 3).map(id => {
                                  const user = users.find(u => u.id === id);
                                  return (
                                    <div key={id} className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 z-10" title={user?.full_name}>
                                      <span className="text-[9px] font-black text-indigo-700 dark:text-indigo-400">
                                        {(user?.full_name || '?').charAt(0)}
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10" title="Unassigned">
                                  <UserIcon size={10} className="text-slate-400" />
                                </div>
                              )}
                              {assigneesList.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/10 z-0">
                                  <span className="text-[9px] font-black text-slate-500">+{assigneesList.length - 3}</span>
                                </div>
                              )}
                            </div>
                            
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              #{task.id.split('-')[0]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modals */}
      <TaskModal 
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
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
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 4px;
        }
      `}</style>
    </OpsLayout>
  );
};

export default OpsTasks;
