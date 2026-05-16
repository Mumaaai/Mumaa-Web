import React, { useState } from 'react';
import { X, Calendar, User, Flag, Briefcase, Tag, Paperclip, Sparkles } from 'lucide-react';
import type { TaskStatus, Priority } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => Promise<void>;
  teams: any[];
  projects: any[];
  users: any[];
  initialDate?: Date | null;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  teams,
  projects,
  users,
  initialDate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    assignees: '',
    team_id: '',
    project_id: '',
    priority: 'Medium' as Priority,
    start_date: initialDate ? initialDate.toISOString().split('T')[0] : '',
    deadline: initialDate ? initialDate.toISOString().split('T')[0] : '',
    estimated_hours: 0,
    tags: '',
    drive_links: '',
    status: 'Assigned' as TaskStatus
  });

  // Re-initialize if opened with new initialDate
  React.useEffect(() => {
    if (isOpen && initialDate) {
      const dateStr = initialDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        start_date: dateStr,
        deadline: dateStr
      }));
    }
  }, [isOpen, initialDate]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const templates = [
    { id: 'tpl1', title: 'Bug Fix', description: 'Investigate and resolve reported bug. Add steps to reproduce and expected behavior.' },
    { id: 'tpl2', title: 'Design Review', description: 'Prepare design assets and schedule review with stakeholders.' },
    { id: 'tpl3', title: 'Documentation', description: 'Write or update documentation for the feature or process.' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        title: '',
        description: '',
        assigned_to: '',
        assignees: '',
        team_id: '',
        project_id: '',
        priority: 'Medium',
        start_date: '',
        deadline: '',
        estimated_hours: 0,
        tags: '',
        drive_links: '',
        status: 'Assigned'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-[96vw] max-w-[92rem] rounded-[2rem] shadow-[0_28px_90px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-white/30">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.24em] flex items-center gap-2"><Sparkles size={12} /> New task</p>
            <h2 className="text-2xl font-black text-gray-950 tracking-tight mt-1">Create task</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1 space-y-5 overflow-y-auto max-h-[74vh] bg-white">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Task title</label>
            <input 
              required
              type="text"
              placeholder="e.g., Update API documentation"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Description</label>
            <textarea 
              rows={4}
              placeholder="Provide context and requirements..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Templates</p>
            <div className="flex gap-2 flex-wrap">
              {templates.map(t => (
                <button key={t.id} type="button" onClick={() => setFormData({...formData, title: t.title, description: t.description})} className="text-xs px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-colors">{t.title}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                <User size={14} /> Assignees
              </label>
              <div className="w-full max-h-32 overflow-y-auto bg-gray-50 border border-gray-200 rounded-2xl p-2.5 flex flex-wrap gap-2 custom-scrollbar">
                {users.map(u => {
                  const isSelected = formData.assignees ? formData.assignees.split(',').includes(u.id) : false;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        const current = formData.assignees ? formData.assignees.split(',').filter(Boolean) : [];
                        const updated = isSelected ? current.filter(id => id !== u.id) : [...current, u.id];
                        setFormData({...formData, assignees: updated.join(','), assigned_to: updated[0] || ''});
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {u.full_name}
                    </button>
                  );
                })}
                {users.length === 0 && <p className="text-xs text-gray-400 p-2">No users available</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                <Flag size={14} /> Priority
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                <Briefcase size={14} /> Project
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.project_id}
                onChange={e => setFormData({...formData, project_id: e.target.value})}
              >
                <option value="">None (Standalone)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                Team
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.team_id}
                onChange={e => setFormData({...formData, team_id: e.target.value})}
              >
                <option value="">Cross-functional</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                <Calendar size={14} /> Start Date
              </label>
              <input 
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                <Calendar size={14} /> Deadline
              </label>
              <input 
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2">
                Est. Hours
              </label>
              <input 
                type="number"
                step="0.5"
                min="0"
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                value={formData.estimated_hours || ''}
                onChange={e => setFormData({...formData, estimated_hours: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2"><Tag size={14} /> Tags</label>
              <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="comma separated tags" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-blue-50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em] flex items-center gap-2"><Paperclip size={14} /> Drive Link</label>
              <input value={formData.drive_links} onChange={e => setFormData({...formData, drive_links: e.target.value})} placeholder="https://drive.google.com/..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-4 focus:ring-blue-50" />
            </div>
          </div>
          </form>

          <aside className="w-full lg:w-[34rem] p-6 lg:p-8 bg-gray-50/80 border-l border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-gray-800 tracking-wide uppercase">Live Preview</h3>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">Preview</span>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-[1.4rem] border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Task</p>
                    <h4 className="font-black text-gray-900 text-2xl leading-tight">{formData.title || 'Untitled task'}</h4>
                    <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{formData.description || 'No description yet'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-[1.2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Status</p>
                  <p className="mt-2 text-sm font-black text-gray-800">{formData.status}</p>
                </div>
                <div className="bg-white p-4 rounded-[1.2rem] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Priority</p>
                  <p className="mt-2 text-sm font-black text-gray-800">{formData.priority}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[1.2rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Tags</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {formData.tags ? formData.tags.split(',').map(t => (
                    <span key={t} className="text-[12px] px-2.5 py-1 rounded-full bg-stone-100 text-gray-700 font-semibold">{t.trim()}</span>
                  )) : (
                    <p className="text-xs text-gray-400">No tags</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-[1.2rem] border border-gray-100 shadow-sm space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.22em]">Meta</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-bold text-gray-800">Project:</span> {projects.find(p => p.id === formData.project_id)?.name || 'Standalone'}</p>
                  <p><span className="font-bold text-gray-800">Team:</span> {teams.find(t => t.id === formData.team_id)?.name || 'Cross-functional'}</p>
                  <p><span className="font-bold text-gray-800">Assignees:</span> {formData.assignees ? formData.assignees.split(',').map(id => users.find(u => u.id === id)?.full_name).join(', ') : 'Unassigned'}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-[1.2rem] text-white shadow-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/55">Drive Link</p>
                <p className="text-sm mt-2 break-all text-white/90">{formData.drive_links || 'No drive link added yet'}</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title}
            className="px-8 py-2.5 text-sm font-bold text-white bg-slate-950 hover:bg-black rounded-2xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
