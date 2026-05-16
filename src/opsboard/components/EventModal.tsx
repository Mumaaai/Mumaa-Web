import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, AlignLeft, CalendarDays, Trash2, Edit2, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { EventType } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any | null;
  onUpdate: (id: string, updates: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  users: any[];
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onUpdate,
  onDelete,
  users
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !event) return null;

  const getAttendeesList = () => {
    if (!event.attendees) return [];
    const ids = event.attendees.split(',');
    return ids.map((id: string) => users.find(u => u.id === id)).filter(Boolean);
  };

  const attendeesList = getAttendeesList();

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const startDateTime = new Date(`${editForm.start_date}T${editForm.start_time}`).toISOString();
      const endDateTime = editForm.end_date && editForm.end_time 
        ? new Date(`${editForm.end_date}T${editForm.end_time}`).toISOString()
        : startDateTime;

      await onUpdate(event.id, {
        title: editForm.title,
        description: editForm.description,
        event_type: editForm.event_type,
        start_time: startDateTime,
        end_time: endDateTime,
        location: editForm.location,
        attendees: (editForm.attendees || []).join(',')
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      await onDelete(event.id);
      onClose();
    }
  };

  const toggleAttendee = (userId: string) => {
    setEditForm((prev: any) => {
      const currentAttendees = prev.attendees || [];
      return {
        ...prev,
        attendees: currentAttendees.includes(userId)
          ? currentAttendees.filter((id: string) => id !== userId)
          : [...currentAttendees, userId]
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-start justify-between bg-fuchsia-50/50 dark:bg-fuchsia-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
          
          <div className="flex gap-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 shrink-0 shadow-inner">
              <CalendarDays size={24} />
            </div>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xl font-black text-slate-900 dark:text-white outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{event.title}</h2>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 text-xs font-black uppercase tracking-wider">
                  {event.event_type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            {!isEditing && (
              <button 
                onClick={() => {
                  const startDateObj = parseISO(event.start_time);
                  const endDateObj = parseISO(event.end_time);
                  setEditForm({
                    title: event.title,
                    description: event.description || '',
                    event_type: event.event_type,
                    location: event.location || '',
                    start_date: format(startDateObj, 'yyyy-MM-dd'),
                    start_time: format(startDateObj, 'HH:mm'),
                    end_date: format(endDateObj, 'yyyy-MM-dd'),
                    end_time: format(endDateObj, 'HH:mm'),
                    attendees: event.attendees ? event.attendees.split(',') : []
                  });
                  setIsEditing(true);
                }} 
                className="p-2 text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm"
              >
                <Edit2 size={18} />
              </button>
            )}
            <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
              <Trash2 size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 dark:bg-transparent">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                <Clock size={14} /> Time
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="date" value={editForm.start_date} onChange={e => setEditForm({...editForm, start_date: e.target.value})} className="w-1/2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-900 border" />
                    <input type="time" value={editForm.start_time} onChange={e => setEditForm({...editForm, start_time: e.target.value})} className="w-1/2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-900 border" />
                  </div>
                  <div className="text-center text-xs text-slate-400">to</div>
                  <div className="flex gap-2">
                    <input type="date" value={editForm.end_date} onChange={e => setEditForm({...editForm, end_date: e.target.value})} className="w-1/2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-900 border" />
                    <input type="time" value={editForm.end_time} onChange={e => setEditForm({...editForm, end_time: e.target.value})} className="w-1/2 text-sm p-2 rounded bg-slate-50 dark:bg-slate-900 border" />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {format(parseISO(event.start_time), 'MMM d, yyyy • h:mm a')}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    to {format(parseISO(event.end_time), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                <MapPin size={14} /> Location / Link
              </div>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editForm.location} 
                  onChange={e => setEditForm({...editForm, location: e.target.value})} 
                  className="w-full text-sm p-2 rounded bg-slate-50 dark:bg-slate-900 border" 
                />
              ) : (
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 break-words">
                  {event.location || <span className="text-slate-400 italic font-normal">No location specified</span>}
                </p>
              )}
            </div>

          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              <AlignLeft size={14} /> Description
            </div>
            {isEditing ? (
              <textarea 
                value={editForm.description} 
                onChange={e => setEditForm({...editForm, description: e.target.value})} 
                className="w-full text-sm p-3 rounded bg-slate-50 dark:bg-slate-900 border min-h-[100px]" 
              />
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {event.description || <span className="text-slate-400 italic">No description provided</span>}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              <Users size={14} /> Attendees ({attendeesList.length})
            </div>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {users.map(u => {
                  const isSelected = (editForm.attendees || []).includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => toggleAttendee(u.id)}
                      className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-500/30' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {u.full_name.charAt(0)}
                      </div>
                      <p className={`text-sm font-bold truncate flex-1 ${isSelected ? 'text-fuchsia-900 dark:text-fuchsia-100' : 'text-slate-900 dark:text-white'}`}>
                        {u.full_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {attendeesList.map((u: any) => (
                  <div key={u.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-full pl-1 pr-3 py-1">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-slate-300">
                      {u.full_name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{u.full_name}</span>
                  </div>
                ))}
                {attendeesList.length === 0 && (
                  <span className="text-sm text-slate-400 italic">No attendees added.</span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        {isEditing && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating || !editForm.title.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-fuchsia-500 hover:bg-fuchsia-600 shadow-lg shadow-fuchsia-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Check size={16} />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventModal;
