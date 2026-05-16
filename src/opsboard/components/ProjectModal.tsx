import React, { useMemo, useState, useEffect } from 'react';
import { 
  X, Briefcase, Calendar, CheckSquare, Clock, 
  Users, Layers3, TrendingUp, AlertCircle, PlayCircle, Edit2, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any | null;
  tasks: any[];
  users: any[];
  teams: any[];
  onUpdate?: (id: string, updates: any) => Promise<void>;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  tasks,
  users,
  teams,
  onUpdate
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setEditData({
        name: project.name || '',
        description: project.description || '',
        owner_id: project.owner_id || '',
        status: project.status || 'Active',
        start_date: project.start_date || '',
        deadline: project.deadline || ''
      });
      setIsEditing(false);
    }
  }, [project]);

  const handleSave = async () => {
    if (!onUpdate || !project) return;
    setIsSaving(true);
    try {
      await onUpdate(project.id, editData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const {
    projectTasks,
    completedTasks,
    blockedTasks,
    activeTasks,
    progress,
    involvedTeams,
    involvedUsers,
    recentTasks
  } = useMemo(() => {
    if (!project) return { projectTasks: [], completedTasks: 0, blockedTasks: 0, activeTasks: 0, progress: 0, involvedTeams: [], involvedUsers: [], recentTasks: [] };

    const pTasks = tasks.filter(t => t.project_id === project.id);
    const completed = pTasks.filter(t => t.status === 'Completed').length;
    const blocked = pTasks.filter(t => t.status === 'Blocked').length;
    const active = pTasks.length - completed;
    const prog = pTasks.length === 0 ? 0 : Math.round((completed / pTasks.length) * 100);

    const teamIds = Array.from(new Set(pTasks.map(t => t.team_id).filter(Boolean)));
    const iTeams = teams.filter(t => teamIds.includes(t.id));

    const userIds = Array.from(new Set(pTasks.map(t => t.assigned_to).filter(Boolean)));
    const iUsers = users.filter(u => userIds.includes(u.id));

    const recent = [...pTasks].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5);

    return {
      projectTasks: pTasks,
      completedTasks: completed,
      blockedTasks: blocked,
      activeTasks: active,
      progress: prog,
      involvedTeams: iTeams,
      involvedUsers: iUsers,
      recentTasks: recent
    };
  }, [project, tasks, teams, users]);

  if (!isOpen || !project) return null;

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl h-[90vh] flex flex-col bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
        
        {/* Header */}
        <div className="px-6 py-5 md:px-8 md:py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isEditing ? (
                  <select 
                    value={editData.status} 
                    onChange={e => setEditData({...editData, status: e.target.value})}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/20 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {project.status}
                  </span>
                )}
                {isOverdue && !isEditing && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-500 dark:text-rose-400">
                    Overdue
                  </span>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData({...editData, name: e.target.value})}
                  className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none bg-transparent border-b border-indigo-500 outline-none w-full max-w-sm"
                  placeholder="Project Name"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {project.name}
                </h2>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button disabled={isSaving} onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">Cancel</button>
                <button disabled={isSaving} onClick={handleSave} className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm">
                  <Check size={14} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors" title="Edit Project">
                <Edit2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors ml-2">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details & Teams */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About */}
              <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Project Overview</h3>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={e => setEditData({...editData, description: e.target.value})}
                    placeholder="Project description..."
                    rows={3}
                    className="w-full text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                ) : (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {project.description || 'No description provided.'}
                  </p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col justify-center min-h-[70px]">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-1">Lead</p>
                    {isEditing ? (
                      <select
                        value={editData.owner_id}
                        onChange={e => setEditData({...editData, owner_id: e.target.value})}
                        className="text-sm font-bold text-slate-900 dark:text-white bg-transparent outline-none w-full border-b border-slate-300 dark:border-slate-700"
                      >
                        <option value="" className="dark:bg-slate-800">Unassigned</option>
                        {users.map(u => <option key={u.id} value={u.id} className="dark:bg-slate-800">{u.full_name}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{project.owner_name || 'Unassigned'}</p>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col justify-center min-h-[70px]">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-1">Start Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.start_date ? new Date(editData.start_date).toISOString().split('T')[0] : ''}
                        onChange={e => setEditData({...editData, start_date: e.target.value})}
                        className="text-sm font-bold text-slate-900 dark:text-white bg-transparent outline-none w-full border-b border-slate-300 dark:border-slate-700 [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 flex flex-col justify-center min-h-[70px]">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-1">Deadline</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.deadline ? new Date(editData.deadline).toISOString().split('T')[0] : ''}
                        onChange={e => setEditData({...editData, deadline: e.target.value})}
                        className="text-sm font-bold text-slate-900 dark:text-white bg-transparent outline-none w-full border-b border-slate-300 dark:border-slate-700 [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    ) : (
                      <p className={`text-sm font-bold truncate ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-1">Created</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </section>

              {/* Tasks Preview */}
              <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Recent Tasks</h3>
                  <button 
                    onClick={() => navigate(`/opsboard?project=${project.id}`)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    View All in Dashboard <TrendingUp size={12}/>
                  </button>
                </div>
                
                {recentTasks.length > 0 ? (
                  <div className="space-y-2">
                    {recentTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === 'Completed' ? 'bg-emerald-500' :
                            task.status === 'Blocked' ? 'bg-rose-500' :
                            'bg-blue-500'
                          }`} />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{task.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {users.find(u => u.id === task.assigned_to)?.full_name || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-sm font-medium text-slate-500">No tasks linked to this project yet.</p>
                  </div>
                )}
              </section>

            </div>

            {/* Right Column: Analytics & Mappings */}
            <div className="space-y-6">
              
              {/* Progress Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Tracking</h3>
                
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">Overall Progress</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500 dark:bg-indigo-400'}`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                      <PlayCircle size={14}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{activeTasks}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 mb-1">
                      <CheckSquare size={14}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Done</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{completedTasks}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 mb-1">
                      <AlertCircle size={14}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Blocked</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{blockedTasks}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 mb-1">
                      <Clock size={14}/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{projectTasks.length}</span>
                  </div>
                </div>
              </div>

              {/* Involved Teams */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                  <Layers3 size={14}/> Connected Teams
                </h3>
                {involvedTeams.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {involvedTeams.map(t => (
                      <span key={t.id} className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-500/20">
                        {t.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 font-medium">No teams involved yet.</p>
                )}
              </div>

              {/* Involved Users */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                  <Users size={14}/> Core Members
                </h3>
                {involvedUsers.length > 0 ? (
                  <div className="space-y-3">
                    {involvedUsers.map(u => (
                      <div key={u.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{u.full_name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{u.designation || u.role || 'Member'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 font-medium">No members assigned to tasks.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
