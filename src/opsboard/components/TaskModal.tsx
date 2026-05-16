import React, { useState, useEffect } from 'react';
import { X, Tag, Paperclip, MessageSquare, Loader2, Pencil, Check, Clock, Calendar, User, AlignLeft, Activity, LayoutList, ExternalLink, Briefcase, Users, Hash, ChevronDown, Plus } from 'lucide-react';
import type { Task, TaskStatus, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onAddComment: (taskId: string, content: string) => Promise<void>;
  fetchComments: (taskId: string) => Promise<any[]>;
  currentUser?: any;
  users?: any[];
  projects?: any[];
  teams?: any[];
}

const getProgressFromStatus = (status: TaskStatus) => {
  switch (status) {
    case 'Draft': return 0;
    case 'Assigned': return 10;
    case 'In Progress': return 50;
    case 'Review': return 80;
    case 'Changes Requested': return 65;
    case 'Blocked': return 50;
    case 'Completed': return 100;
    default: return 0;
  }
};

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  onUpdate,
  onAddComment,
  fetchComments,
  currentUser,
  users = [],
  projects = [],
  teams = []
}) => {
  const [localStatus, setLocalStatus] = useState<TaskStatus>('Draft');
  const [localPriority, setLocalPriority] = useState<Priority>('Medium');
  const [isUpdating, setIsUpdating] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
  const [editData, setEditData] = useState({ 
    title: '', 
    description: '', 
    assigned_to: '', 
    assignees: '', 
    project_id: '',
    team_id: '',
    deadline: '',
    start_date: '',
    estimated_hours: 0,
    actual_hours: 0,
    tags: '',
    drive_links: '',
    remarks: ''
  });

  const [activeTab, setActiveTab] = useState<'info' | 'threads'>('info');

  useEffect(() => {
    if (task && isOpen) {
      setLocalStatus(task.status);
      setLocalPriority(task.priority);
      setEditData({
        title: task.title,
        description: task.description || '',
        assigned_to: task.assigned_to || '',
        assignees: task.assignees || '',
        project_id: task.project_id || '',
        team_id: task.team_id || '',
        deadline: task.deadline || '',
        start_date: task.start_date || '',
        estimated_hours: task.estimated_hours || 0,
        actual_hours: task.actual_hours || 0,
        tags: task.tags || '',
        drive_links: task.drive_links || '',
        remarks: task.remarks || ''
      });
      loadComments();
    }
  }, [task, isOpen]);


  const loadComments = async () => {
    if (task) {
      const data = await fetchComments(task.id);
      setComments(data);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    setIsPosting(true);
    try {
      await onAddComment(task.id, newComment);
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleStatusChange = async (status: TaskStatus) => {
    setLocalStatus(status);
    setIsUpdating(true);
    await onUpdate(task!.id, { status, progress: getProgressFromStatus(status), updated_by: currentUser?.id });
    setIsUpdating(false);
  };

  const handlePriorityChange = async (priority: Priority) => {
    setLocalPriority(priority);
    setIsUpdating(true);
    await onUpdate(task!.id, { priority });
    setIsUpdating(false);
  };

  const handleSaveTaskDetails = async () => {
    setIsUpdating(true);
    await onUpdate(task!.id, { ...editData, updated_by: currentUser?.id });
    setIsUpdating(false);
    setIsEditingTask(false);
  };

  if (!task) return null;

  const isCreator = task?.assigned_by === currentUser?.id;
  const isAssignee = task?.assigned_to === currentUser?.id;
  const canEditStatus = isCreator || isAssignee;
  const canEditPriority = isCreator;

  const renderDriveLinks = (links: string) => {
    if (!links) return <p className="text-sm text-slate-400">No resources attached.</p>;
    const urlList = links.split(',').map(l => l.trim()).filter(Boolean);
    return (
      <div className="flex flex-wrap gap-2">
        {urlList.map((url, idx) => {
          let domain = 'Resource Link';
          try {
            const u = new URL(url);
            domain = u.hostname.replace('www.', '');
          } catch(e) {}
          return (
            <a key={idx} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 transition-colors text-sm font-semibold border border-cyan-200 dark:border-cyan-500/20 shadow-sm">
              <ExternalLink size={14} />
              {domain}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[90vw] lg:w-[85vw] xl:w-[1300px] bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <header className="px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider border border-cyan-200 dark:border-cyan-500/20">{task.id.slice(0, 8)}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20">{task.status}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">{task.priority}</span>
            </div>
            {isEditingTask ? (
              <input
                className="w-full text-2xl md:text-3xl font-black text-slate-900 dark:text-white bg-transparent border-b-2 border-cyan-400 pb-1 outline-none transition-colors"
                value={editData.title}
                onChange={e => setEditData({ ...editData, title: e.target.value })}
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white break-words">{task.title}</h2>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCreator && !isEditingTask && (
              <button onClick={() => setIsEditingTask(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm border border-slate-200 dark:border-white/10">
                <Pencil size={16} /> Edit
              </button>
            )}
            {canEditStatus && task.status !== 'Completed' && (
              <button onClick={() => handleStatusChange('Completed')} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white dark:text-slate-950 font-bold hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors text-sm shadow-sm">
                <Check size={16} /> Complete
              </button>
            )}
            {isEditingTask && (
              <button onClick={handleSaveTaskDetails} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white font-bold hover:bg-cyan-700 dark:hover:bg-cyan-400 transition-colors text-sm disabled:opacity-50 shadow-sm">
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save
              </button>
            )}
            <button onClick={onClose} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:text-white/50 dark:hover:bg-white/10 hover:bg-slate-100 transition-colors ml-2"><X size={24} /></button>
          </div>
        </header>

        <div className="md:hidden flex border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shrink-0">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Info & Details</button>
          <button onClick={() => setActiveTab('threads')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'threads' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Threads</button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50 dark:bg-slate-950">
          
          {/* Left Side: Info & Properties */}
          <div className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 ${activeTab === 'info' ? 'block' : 'hidden md:block'}`}>
            
            <div className="space-y-4">
              {/* Card 1: Core Details */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-5 uppercase tracking-wider"><LayoutList size={14} /> Core Details</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignees</span>
                    {isEditingTask ? (
                      <div className="relative">
                        <button onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)} className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-left text-slate-800 dark:text-slate-100 outline-none flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <span className="truncate">{editData.assignees ? editData.assignees.split(',').length + ' Assigned' : 'Select Assignees'}</span>
                          <ChevronDown size={14} />
                        </button>
                        {isAssignDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {users.map(u => {
                              const isSelected = editData.assignees?.split(',').includes(u.id);
                              return (
                                <button
                                  key={u.id}
                                  onClick={() => {
                                    const current = editData.assignees ? editData.assignees.split(',').filter(Boolean) : [];
                                    const updated = isSelected ? current.filter(id => id !== u.id) : [...current, u.id];
                                    setEditData({ ...editData, assignees: updated.join(','), assigned_to: updated[0] || '' });
                                  }}
                                  className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between ${isSelected ? 'font-bold text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                  <span className="truncate mr-2">{u.full_name}</span>
                                  {isSelected && <Check size={12} className="shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {task.assignees ? task.assignees.split(',').map(id => {
                            const user = users.find(u => u.id === id);
                            return (
                              <div key={id} className="flex items-center gap-1.5 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded-md border border-cyan-100 dark:border-cyan-800/30">
                                <div className="w-4 h-4 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-[8px] font-bold text-cyan-700 dark:text-cyan-300 shrink-0">
                                  {(user?.full_name || '?').charAt(0)}
                                </div>
                                <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[80px]" title={user?.full_name}>{user?.full_name || 'Unknown'}</span>
                              </div>
                            );
                          }) : (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-white/80 shrink-0">?</div>
                              <span className="text-xs font-semibold text-slate-500 truncate">Unassigned</span>
                            </div>
                          )}
                          <button 
                            onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)} 
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors border border-slate-200 dark:border-white/5"
                          >
                            <Plus size={10} /> Assign
                          </button>
                        </div>
                        
                        {isAssignDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto left-0 top-full">
                            {users.map(u => {
                              const isSelected = task.assignees?.split(',').includes(u.id);
                              return (
                                <button
                                  key={u.id}
                                  onClick={async () => {
                                    const current = task.assignees ? task.assignees.split(',').filter(Boolean) : [];
                                    const updated = isSelected ? current.filter(id => id !== u.id) : [...current, u.id];
                                    await onUpdate(task.id, { assignees: updated.join(','), assigned_to: updated[0] || '' });
                                  }}
                                  className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between ${isSelected ? 'font-bold text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                  <span className="truncate mr-2">{u.full_name}</span>
                                  {isSelected && <Check size={12} className="shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created By</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-white/80 shrink-0">
                        {(users.find(u => u.id === task.assigned_by)?.full_name || 'S').charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{users.find(u => u.id === task.assigned_by)?.full_name || 'System'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</span>
                    {isEditingTask ? (
                      <select className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" value={editData.project_id} onChange={e => setEditData({ ...editData, project_id: e.target.value })}>
                        <option value="">None</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    ) : (
                      task.project_id ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300 w-max max-w-full">
                          <Briefcase size={12} className="shrink-0"/> <span className="text-xs font-bold truncate">{projects.find(p => p.id === task.project_id)?.name}</span>
                        </div>
                      ) : <span className="text-sm font-semibold text-slate-500">Standalone</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team</span>
                    {isEditingTask ? (
                      <select className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" value={editData.team_id} onChange={e => setEditData({ ...editData, team_id: e.target.value })}>
                        <option value="">None</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    ) : (
                      task.team_id ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:border-fuchsia-500/20 dark:text-fuchsia-300 w-max max-w-full">
                          <Users size={12} className="shrink-0"/> <span className="text-xs font-bold truncate">{teams.find(t => t.id === task.team_id)?.name}</span>
                        </div>
                      ) : <span className="text-sm font-semibold text-slate-500">Cross-functional</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                    <select disabled={isUpdating || !canEditStatus} className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50" value={localStatus} onChange={e => handleStatusChange(e.target.value as TaskStatus)}>
                      <option value="Draft">Draft</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Changes Requested">Changes Requested</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</span>
                    <select disabled={isUpdating || !canEditPriority} className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50" value={localPriority} onChange={e => handlePriorityChange(e.target.value as Priority)}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: Tracking & Dates */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-5 uppercase tracking-wider"><Clock size={14} /> Tracking & Dates</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</span>
                    {isEditingTask ? (
                      <input type="date" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" value={editData.start_date} onChange={e => setEditData({ ...editData, start_date: e.target.value })} />
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"><Calendar size={14} className="text-slate-400" /> {task.start_date ? new Date(task.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deadline</span>
                    {isEditingTask ? (
                      <input type="date" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" value={editData.deadline} onChange={e => setEditData({ ...editData, deadline: e.target.value })} />
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"><Clock size={14} className="text-rose-400" /> {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'None'}</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Hours</span>
                    {isEditingTask ? (
                      <input type="number" step="0.5" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" value={editData.estimated_hours} onChange={e => setEditData({ ...editData, estimated_hours: parseFloat(e.target.value) || 0 })} />
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"><Clock size={14} className="text-slate-400" /> {task.estimated_hours || 0}h</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actual Hours</span>
                    {isEditingTask ? (
                      <input type="number" step="0.5" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500" value={editData.actual_hours} onChange={e => setEditData({ ...editData, actual_hours: parseFloat(e.target.value) || 0 })} />
                    ) : (
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"><Activity size={14} className="text-slate-400" /> {task.actual_hours || 0}h</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created At</span>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200"><Calendar size={14} className="text-slate-400" /> {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags</span>
                    {isEditingTask ? (
                      <input
                        className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Comma separated tags"
                        value={editData.tags}
                        onChange={e => setEditData({ ...editData, tags: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {task.tags ? task.tags.split(',').map(tag => <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">{tag.trim()}</span>) : <span className="text-sm font-semibold text-slate-500">None</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3 uppercase tracking-wider"><AlignLeft size={14} /> Description</h3>
              {isEditingTask ? (
                <textarea
                  className="w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                  value={editData.description}
                  onChange={e => setEditData({ ...editData, description: e.target.value })}
                />
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{task.description || 'No description provided.'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resources */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3 uppercase tracking-wider"><Paperclip size={14} /> Resources</h3>
                {isEditingTask ? (
                  <div className="space-y-4">
                    <input
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-100"
                      placeholder="URLs (comma separated)"
                      value={editData.drive_links}
                      onChange={e => setEditData({ ...editData, drive_links: e.target.value })}
                    />
                  </div>
                ) : (
                  <div>
                    {renderDriveLinks(task.drive_links || '')}
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div className="bg-amber-50 dark:bg-amber-500/5 rounded-2xl p-5 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3 uppercase tracking-wider"><MessageSquare size={14} /> Remarks</h3>
                {isEditingTask ? (
                  <textarea
                    className="w-full min-h-[80px] rounded-xl border border-amber-200 dark:border-amber-500/20 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                    placeholder="Internal remarks..."
                    value={editData.remarks}
                    onChange={e => setEditData({ ...editData, remarks: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-amber-700 dark:text-amber-200 whitespace-pre-wrap">{task.remarks || 'No special remarks.'}</p>
                )}
              </div>
            </div>

            {/* Execution Progress */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 uppercase tracking-wider"><Activity size={14} /> Execution Progress</h3>
                <span className="text-xl font-black text-slate-900 dark:text-white">{getProgressFromStatus(localStatus)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${getProgressFromStatus(localStatus)}%` }} /></div>
            </div>

          </div>

          {/* Right Side: Threads / Comments */}
          <div className={`w-full md:w-[380px] lg:w-[450px] bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 flex flex-col shadow-inner shrink-0 ${activeTab === 'threads' ? 'block' : 'hidden md:flex'}`}>
            <div className="p-5 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2"><MessageSquare size={16} /> Activity & Threads</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No activity yet.</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start the conversation below.</p>
                </div>
              ) : comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-2xl bg-cyan-100 dark:bg-white/10 flex items-center justify-center text-sm font-bold text-cyan-700 dark:text-slate-200 border border-cyan-200 dark:border-white/5 shadow-sm">{comment.user_name?.charAt(0) || '?'}</div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1.5 gap-2">
                      <span className="text-sm font-bold text-slate-800 dark:text-white truncate">{comment.user_name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-slate-100 dark:border-white/5">
                      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shrink-0">
              <form onSubmit={handleAddComment} className="relative">
                <textarea
                  rows={3}
                  placeholder="Write a message..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500 resize-none pr-14 text-slate-800 dark:text-slate-100 shadow-sm transition-all"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <button type="submit" disabled={isPosting || !newComment.trim()} className="absolute right-3 bottom-3 p-3 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white flex items-center justify-center disabled:opacity-50 hover:bg-cyan-700 dark:hover:bg-cyan-400 transition-all shadow-sm">
                  {isPosting ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default TaskModal;
