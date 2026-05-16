import React, { useState } from 'react';
import { X, Users, AlignLeft, Shield, Check } from 'lucide-react';
import type { Team } from '../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (teamData: Partial<Team>) => Promise<void>;
  users: any[];
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreate, users }) => {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    lead_id: '',
    members: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Team name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onCreate({
        name: formData.name,
        purpose: formData.purpose,
        lead_id: formData.lead_id,
        members: formData.members.join(',')
      });
      setFormData({ name: '', purpose: '', lead_id: '', members: [] });
      onClose();
    } catch (err) {
      setError('Failed to create team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Create New Team</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">Setup a new group</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-2xl border border-rose-100 dark:border-rose-500/20">
              {error}
            </div>
          )}

          {/* Name & Lead Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Users size={12} /> Team Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold"
                placeholder="e.g. Frontend Engineering"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Shield size={12} /> Team Lead
              </label>
              <select
                value={formData.lead_id}
                onChange={e => setFormData({ ...formData, lead_id: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium appearance-none"
              >
                <option value="">Select a team lead...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <AlignLeft size={12} /> Team Purpose
            </label>
            <textarea
              value={formData.purpose}
              onChange={e => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-medium min-h-[100px] resize-none"
              placeholder="Describe what this team is responsible for..."
            />
          </div>

          {/* Members Initial Assignment */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Users size={12} /> Assign Initial Members
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {users.map(u => {
                const isSelected = formData.members.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleMember(u.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-500/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isSelected ? <Check size={14} /> : u.full_name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-cyan-900 dark:text-cyan-100' : 'text-slate-900 dark:text-white'}`}>
                        {u.full_name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{u.role || u.email}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Team'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTeamModal;
