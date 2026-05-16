import React, { useState, useEffect } from 'react';
import { X, Users, ChevronDown, Check, LayoutList, Shield, User, Mail } from 'lucide-react';
import type { Team } from '../types';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onUpdate: (id: string, updates: Partial<Team>) => Promise<void>;
  users: any[];
  tasks: any[];
}

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose, team, onUpdate, users, tasks }) => {
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);

  useEffect(() => {
    if (team && isOpen) {
      setIsMemberDropdownOpen(false);
    }
  }, [team, isOpen]);

  if (!isOpen || !team) return null;

  const toggleMember = async (userId: string) => {
    const currentMembers = team.members ? team.members.split(',') : [];
    const isSelected = currentMembers.includes(userId);
    const updated = isSelected 
      ? currentMembers.filter(id => id !== userId) 
      : [...currentMembers, userId];
    
    await onUpdate(team.id, { members: updated.join(',') });
  };

  const teamTasks = tasks.filter(t => t.team_id === team.id && t.status !== 'Archived');
  const activeTasks = teamTasks.filter(t => t.status !== 'Completed').length;
  const completedTasks = teamTasks.filter(t => t.status === 'Completed').length;
  
  const lead = users.find(u => u.id === team.lead_id);
  const memberIds = team.members ? team.members.split(',') : [];
  const teamMembers = memberIds.map(id => users.find(u => u.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{team.name}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">Team ID: {team.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)} 
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-xl transition-all shadow-sm"
              >
                <Users size={16} /> Add Members <ChevronDown size={14} />
              </button>
              {isMemberDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50">
                  <div className="p-2 border-b border-slate-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md">
                    <p className="text-xs font-bold text-slate-500 uppercase px-2 py-1">Select Members</p>
                  </div>
                  {users.map(u => {
                    const isSelected = memberIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        onClick={() => toggleMember(u.id)}
                        className={`w-full px-4 py-3 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between border-b border-slate-50 dark:border-white/5 last:border-0 transition-colors ${isSelected ? 'bg-cyan-50/50 dark:bg-cyan-900/20' : ''}`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${isSelected ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                            {u.full_name.charAt(0)}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className={`truncate font-bold ${isSelected ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-200'}`}>{u.full_name}</span>
                            <span className="text-[10px] text-slate-400 truncate">{u.email}</span>
                          </div>
                        </div>
                        {isSelected && <Check size={16} className="shrink-0 text-cyan-600 dark:text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <button onClick={onClose} className="p-2 ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Purpose */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purpose</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {team.purpose || 'No purpose specified.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Lead */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Shield size={12} /> Team Lead</h3>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/30 flex items-center justify-center text-sm font-black text-indigo-700 dark:text-indigo-300">
                  {(lead?.full_name || '?').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{lead?.full_name || 'Unassigned'}</p>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{lead?.role || 'No Role'}</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LayoutList size={12} /> Workload Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active</span>
                  <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{activeTasks}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Done</span>
                  <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">{completedTasks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={12} /> Members ({teamMembers.length})</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map(member => (
                <div key={member.id} className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:border-cyan-500/50 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 shrink-0">
                      {member.full_name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.full_name}</p>
                      <p className="text-[10px] font-bold text-slate-500 truncate flex items-center gap-1">
                        <Mail size={10} /> {member.email}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleMember(member.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Remove member"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="col-span-1 sm:col-span-2 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center">
                  <Users size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No members assigned to this team.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
