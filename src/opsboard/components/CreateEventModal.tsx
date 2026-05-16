import React, { useState } from 'react';
import { X, Calendar, AlignLeft, MapPin, Users, Clock, CalendarDays } from 'lucide-react';
import type { EventType } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: any) => Promise<void>;
  users: any[];
  initialDate?: Date | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate,
  users,
  initialDate
}) => {
  const defaultDate = initialDate ? initialDate.toISOString().split('T')[0] : '';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'Meeting' as EventType,
    start_date: defaultDate,
    start_time: '12:00',
    end_date: defaultDate,
    end_time: '13:00',
    location: '',
    attendees: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && initialDate) {
      const dateStr = initialDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        start_date: dateStr,
        end_date: dateStr
      }));
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.start_date || !formData.start_time) {
      setError('Title and start time are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`).toISOString();
      const endDateTime = formData.end_date && formData.end_time 
        ? new Date(`${formData.end_date}T${formData.end_time}`).toISOString()
        : startDateTime;

      await onCreate({
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        start_time: startDateTime,
        end_time: endDateTime,
        location: formData.location,
        attendees: formData.attendees.join(',')
      });
      onClose();
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAttendee = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(userId)
        ? prev.attendees.filter(id => id !== userId)
        : [...prev.attendees, userId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Schedule {formData.event_type}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">New Calendar Event</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <AlignLeft size={12} /> Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-bold"
                placeholder="e.g. Q3 Planning Sync"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Calendar size={12} /> Event Type
              </label>
              <select
                value={formData.event_type}
                onChange={e => setFormData({ ...formData, event_type: e.target.value as EventType })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium appearance-none"
              >
                <option value="Meeting">Meeting</option>
                <option value="Event">Event</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <MapPin size={12} /> Location / Link
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium"
                placeholder="e.g. Conf Room A or Zoom link"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Calendar size={12} /> Start Time <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-2/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium"
                />
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-1/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <Clock size={12} /> End Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-2/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium"
                />
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-1/3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <AlignLeft size={12} /> Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all font-medium min-h-[80px] resize-none"
              placeholder="Meeting agenda or event details..."
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <Users size={12} /> Attendees
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {users.map(u => {
                const isSelected = formData.attendees.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleAttendee(u.id)}
                    className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-500/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-fuchsia-500/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {u.full_name.charAt(0)}
                    </div>
                    <div className="truncate flex-1">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-fuchsia-900 dark:text-fuchsia-100' : 'text-slate-900 dark:text-white'}`}>
                        {u.full_name}
                      </p>
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
            disabled={isSubmitting || !formData.title.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-fuchsia-500 hover:bg-fuchsia-600 shadow-lg shadow-fuchsia-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Event'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateEventModal;
