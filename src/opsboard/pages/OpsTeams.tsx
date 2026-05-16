import React, { useState } from 'react';
import { Users, LayoutList, CheckCircle2, AlertCircle, Plus, Search, ChevronRight } from 'lucide-react';
import OpsLayout from '../components/OpsLayout';
import TeamModal from '../components/TeamModal';
import CreateTeamModal from '../components/CreateTeamModal';
import { useOpsData } from '../hooks/useOpsData';
import type { Team } from '../types';

const OpsTeams: React.FC = () => {
  const { teams, tasks, users, user, loading, updateTeam, createTeam } = useOpsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <OpsLayout user={user}>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </OpsLayout>
    );
  }

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    team.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeamStats = (teamId: string) => {
    const teamTasks = tasks.filter(t => t.team_id === teamId && t.status !== 'Archived');
    const completed = teamTasks.filter(t => t.status === 'Completed').length;
    const active = teamTasks.length - completed;
    const blocked = teamTasks.filter(t => t.status === 'Blocked').length;
    return { total: teamTasks.length, completed, active, blocked };
  };

  return (
    <OpsLayout user={user}>
      <main className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 min-h-full text-slate-800 dark:text-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Teams</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage groups, departments, and cross-functional teams.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 w-full md:w-64"
              />
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-black shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> New Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const stats = getTeamStats(team.id);
            const lead = users.find(u => u.id === team.lead_id);

            const memberCount = team.members ? team.members.split(',').filter(Boolean).length : 0;

            return (
              <div 
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-sm dark:shadow-[0_4px_20px_rgba(2,6,23,0.3)] border border-slate-200 dark:border-white/10 flex flex-col group hover:shadow-md hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{team.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">ID: {team.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Users size={14} /> {memberCount}
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 min-h-[40px] font-medium">
                  {team.purpose || 'No purpose specified for this team.'}
                </p>

                <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-black text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    {(lead?.full_name || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Lead</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{lead?.full_name || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-white/10 pt-5">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900 dark:text-white">{stats.active}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1 mt-1"><LayoutList size={10} /> Active</p>
                  </div>
                  <div className="text-center border-l border-r border-slate-200 dark:border-white/10">
                    <p className="text-xl font-black text-emerald-500 dark:text-emerald-400">{stats.completed}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1 mt-1"><CheckCircle2 size={10} /> Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-rose-500 dark:text-rose-400">{stats.blocked}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1 mt-1"><AlertCircle size={10} /> Blocked</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTeams.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <Users size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No teams found</h3>
            <p className="text-sm">Try adjusting your search query.</p>
          </div>
        )}
      </main>
      <TeamModal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        team={selectedTeam ? teams.find(t => t.id === selectedTeam.id) || null : null}
        onUpdate={updateTeam}
        users={users}
        tasks={tasks}
      />
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createTeam}
        users={users}
      />
    </OpsLayout>
  );
};

export default OpsTeams;
