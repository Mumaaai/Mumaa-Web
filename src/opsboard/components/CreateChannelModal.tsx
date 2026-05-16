import React, { useState } from 'react';
import { X, Hash, Lock, UserPlus } from 'lucide-react';
import { api } from '../../api';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: any[];
  onChannelCreated: () => void;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose, users, onChannelCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post('/ops/chat/channels', {
        name,
        description,
        is_private: isPrivate,
        members: selectedMembers
      });
      onChannelCreated();
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setIsPrivate(false);
      setSelectedMembers([]);
    } catch (err) {
      console.error('Failed to create channel', err);
      alert('Failed to create channel');
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Create a channel</h2>
            <p className="text-sm text-slate-500 mt-1">Channels are where your team communicates.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Name</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {isPrivate ? <Lock size={16} /> : <Hash size={16} />}
              </div>
              <input 
                type="text" 
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-white"
                placeholder="e.g. marketing"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description (Optional)</label>
            <input 
              type="text" 
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-white"
              placeholder="What is this channel about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Make Private</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">When a channel is private, it can only be viewed or joined by invitation.</p>
            </div>
            <div className="relative inline-block w-10 h-6">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                id="private-toggle" 
                checked={isPrivate}
                onChange={e => setIsPrivate(e.target.checked)}
              />
              <label htmlFor="private-toggle" className="absolute inset-0 bg-slate-300 dark:bg-slate-700 rounded-full cursor-pointer transition-colors peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4"></label>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Add Members</label>
            <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-white/5 rounded-xl divide-y divide-slate-100 dark:divide-white/5">
              {users?.map((u: any) => (
                <div 
                  key={u.id} 
                  className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => toggleMember(u.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {u.full_name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{u.full_name}</div>
                      <div className="text-xs text-slate-500">{u.role}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedMembers.includes(u.id) ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {selectedMembers.includes(u.id) && <UserPlus size={12} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="h-11 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="h-11 px-6 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-cyan-500/10"
            >
              Create Channel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateChannelModal;
