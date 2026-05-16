import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import { useOpsData } from '../hooks/useOpsData';
import { Loader2, AlertCircle, Briefcase, Calendar, CheckSquare, Clock, Plus } from 'lucide-react';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectModal from '../components/ProjectModal';

const OpsProjects: React.FC = () => {
  const { projects, tasks, users, teams, loading, error, createProject, updateProject } = useOpsData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setUser(JSON.parse(session));
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading project portfolios...</p>
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

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.project_id === projectId);
    const completed = projectTasks.filter(t => t.status === 'Completed').length;
    const active = projectTasks.length - completed;
    const progress = projectTasks.length === 0 ? 0 : Math.round((completed / projectTasks.length) * 100);
    return { total: projectTasks.length, completed, active, progress };
  };

  return (
    <OpsLayout user={user} onAddClick={() => setIsModalOpen(true)}>
      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 min-h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Portfolios</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Track high-level initiatives and their execution progress.</p>
          </div>
          <div className="flex gap-3 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
              <Briefcase size={16} />
              <span className="font-black">{projects.length} Active Projects</span>
            </span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-black shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => {
            const stats = getProjectStats(project.id);
            const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'Completed';

            return (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm dark:shadow-[0_4px_20px_rgba(2,6,23,0.3)] border border-slate-200 dark:border-white/10 flex flex-col group hover:shadow-md hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{project.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">{project.status}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-6 line-clamp-2 min-h-[40px]">
                  {project.description || 'No detailed description provided for this project.'}
                </p>

                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Execution Progress</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{stats.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stats.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500 dark:bg-indigo-400'}`} 
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-3 border border-transparent dark:border-white/5">
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                        <CheckSquare size={12} /> Tasks
                      </span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{stats.active} <span className="text-xs text-slate-500 font-medium tracking-normal">active</span></span>
                    </div>
                    <div className={`rounded-2xl p-3 border ${isOverdue ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' : 'bg-slate-50 dark:bg-white/5 border-transparent dark:border-white/5'}`}>
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-1 ${isOverdue ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        <Calendar size={12} /> Deadline
                      </span>
                      <span className={`text-sm font-black ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      {project.owner_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Lead</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">{project.owner_name || 'Unassigned'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/opsboard?project=${project.id}`);
                    }}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black dark:hover:bg-slate-200 transition-all shadow-sm"
                  >
                    View Tasks
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
              <Briefcase size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No active projects</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Create a new project to get started.</p>
          </div>
        )}
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createProject}
        users={users}
      />

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        tasks={tasks}
        users={users}
        teams={teams}
        onUpdate={updateProject}
      />
    </OpsLayout>
  );
};

export default OpsProjects;
