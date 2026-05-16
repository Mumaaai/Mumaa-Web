import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import { useOpsData } from '../hooks/useOpsData';
import { 
  Hash, 
  Lock, 
  Plus, 
  Search, 
  Send, 
  User, 
  Smile, 
  Paperclip,
  MoreVertical,
  Bell,
  BellOff,
  Star,
  Info,
  Edit2,
  X,
  MessageSquare,
  ThumbsUp,
  Heart,
  SmilePlus
} from 'lucide-react';
import { api } from '../../api';
import { format } from 'date-fns';
import CreateChannelModal from '../components/CreateChannelModal';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
  parent_id?: string;
  reactions?: string;
  is_edited?: number;
  channel_id?: string;
  receiver_id?: string;
  reply_count?: number;
}

interface Channel {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
}

const OpsChat: React.FC = () => {
  const { user, users } = useOpsData();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeDM, setActiveDM] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
  const [threadReplies, setThreadReplies] = useState<Record<string, Message[]>>({});
  const [fullyExpandedThreads, setFullyExpandedThreads] = useState<Record<string, boolean>>({});
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [mentionSearch, setMentionSearch] = useState<string | null>(null);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);
  const [infoTab, setInfoTab] = useState<'about' | 'members' | 'files'>('about');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getUserColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const renderMessageContent = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(@[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const name = part.substring(1);
        const colorClass = getUserColor(name);
        return (
          <span key={index} className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-bold text-xs ${colorClass} mx-0.5`}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const response = await api.get('/ops/notifications');
        if (Array.isArray(response)) {
          const counts: Record<string, number> = {};
          response.forEach((n: any) => {
            if (!n.is_read && n.type === 'Alert' && n.title.startsWith('New Message:')) {
              const parts = n.title.split(':');
              const type = parts[1]; // DM or Channel
              const id = parts[2];
              const key = `${type}:${id}`;
              counts[key] = (counts[key] || 0) + 1;
            }
          });
          setUnreadCounts(counts);
        }
      } catch (err) {
        console.error('Failed to fetch notifications for chat', err);
      }
    };

    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (type: 'DM' | 'Channel', id: string) => {
    try {
      const response = await api.get('/ops/notifications');
      if (Array.isArray(response)) {
        const toMark = response.filter((n: any) => 
          !n.is_read && 
          n.type === 'Alert' && 
          n.title === `New Message:${type}:${id}`
        );
        for (const n of toMark) {
          await api.put(`/ops/notifications/${n.id}/read`, {});
        }
        setUnreadCounts(prev => {
          const next = { ...prev };
          delete next[`${type}:${id}`];
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to mark chat as read', err);
    }
  };

  useEffect(() => {
    if (activeChannel) {
      markAsRead('Channel', activeChannel.name);
    } else if (activeDM) {
      markAsRead('DM', activeDM.full_name);
    }
  }, [activeChannel, activeDM]);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setCurrentUser(JSON.parse(session));
    }
  }, [navigate]);

  const fetchChannels = async () => {
    try {
      const res = await api.get('/ops/chat/channels');
      if (Array.isArray(res)) {
        setChannels(res);
        if (res.length > 0 && !activeChannel) setActiveChannel(res[0]);
      }
    } catch (err) {
      console.error('Failed to fetch channels', err);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChannel) {
        try {
          const res = await api.get(`/ops/chat/channels/${activeChannel.id}/messages`);
          if (Array.isArray(res)) {
            setMessages(res);
            // Auto expand threads with replies
            res.forEach((msg: Message) => {
              if (msg.reply_count && msg.reply_count > 0) {
                setExpandedThreads(prev => ({ ...prev, [msg.id]: true }));
                fetchReplies(msg.id);
              }
            });
          }
        } catch (err) {
          console.error('Failed to fetch messages', err);
        }
      } else if (activeDM) {
        try {
          const res = await api.get(`/ops/chat/direct/${activeDM.id}`);
          if (Array.isArray(res)) {
            setMessages(res);
            // Auto expand threads with replies
            res.forEach((msg: Message) => {
              if (msg.reply_count && msg.reply_count > 0) {
                setExpandedThreads(prev => ({ ...prev, [msg.id]: true }));
                fetchReplies(msg.id);
              }
            });
          }
        } catch (err) {
          console.error('Failed to fetch DM messages', err);
        }
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeChannel, activeDM]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payload = {
      content: newMessage,
      channel_id: activeChannel?.id || null,
      receiver_id: activeDM?.id || null
    };

    try {
      await api.post('/ops/chat/messages', payload);
      setNewMessage('');
      
      const tempMsg: Message = {
        id: Math.random().toString(),
        sender_id: currentUser?.id || '',
        sender_name: currentUser?.name || 'Me',
        content: newMessage,
        created_at: new Date().toISOString()
      };
      setMessages([...messages, tempMsg]);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const fetchReplies = async (messageId: string) => {
    try {
      const res = await api.get(`/ops/chat/messages/${messageId}/threads`);
      if (Array.isArray(res)) {
        setThreadReplies(prev => ({ ...prev, [messageId]: res }));
      }
    } catch (err) {
      console.error('Failed to fetch thread replies', err);
    }
  };

  const toggleThread = async (messageId: string) => {
    const isExpanded = expandedThreads[messageId];
    setExpandedThreads(prev => ({ ...prev, [messageId]: !isExpanded }));
    
    if (!isExpanded && !threadReplies[messageId]) {
      fetchReplies(messageId);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    try {
      await api.put(`/ops/chat/messages/${messageId}`, { content: editContent });
      setEditingMessage(null);
      setMessages(messages.map(m => m.id === messageId ? { ...m, content: editContent } : m));
    } catch (err) {
      console.error('Failed to edit message', err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/ops/chat/messages/${messageId}`);
      setMessages(messages.filter(m => m.id !== messageId));
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    try {
      const msg = messages.find(m => m.id === messageId);
      const reactions = msg?.reactions ? JSON.parse(msg.reactions) : [];
      const existing = reactions.find((r: any) => r.user_id === currentUser?.id && r.emoji === emoji);

      if (existing) {
        await api.delete(`/ops/chat/messages/${messageId}/reactions`, { data: { emoji } });
        setMessages(messages.map(m => {
          if (m.id === messageId) {
            const nextReactions = reactions.filter((r: any) => !(r.user_id === currentUser?.id && r.emoji === emoji));
            return { ...m, reactions: JSON.stringify(nextReactions) };
          }
          return m;
        }));
      } else {
        await api.post(`/ops/chat/messages/${messageId}/reactions`, { emoji });
        setMessages(messages.map(m => {
          if (m.id === messageId) {
            const nextReactions = [...reactions, { user_id: currentUser?.id, emoji }];
            return { ...m, reactions: JSON.stringify(nextReactions) };
          }
          return m;
        }));
      }
    } catch (err) {
      console.error('Failed to toggle reaction', err);
    }
  };

  return (
    <OpsLayout user={currentUser || user}>
      <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden">
        
        {/* Sidebar - Premium Dark Glassmorphism style */}
        <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 flex flex-col shadow-sm">
          
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
            <h1 className="font-bold text-xl text-slate-900 dark:text-white">Workspace</h1>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-cyan-500"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search channels or DMs..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-cyan-500/30 rounded-xl text-sm outline-none placeholder:text-slate-500 transition-all"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            <div>
              <div className="px-3 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Channels
              </div>
              <div className="space-y-0.5">
                {channels.map(channel => {
                  const unread = unreadCounts[`Channel:${channel.name}`] || 0;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => { setActiveChannel(channel); setActiveDM(null); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        activeChannel?.id === channel.id 
                          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 font-bold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {channel.is_private ? <Lock size={14} /> : <Hash size={14} />}
                        <span>{channel.name}</span>
                      </div>
                      {unread > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="px-3 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Direct Messages
              </div>
              <div className="space-y-0.5">
                {users.filter((u: any) => u.id !== currentUser?.id).map((u: any) => {
                  const unread = unreadCounts[`DM:${u.full_name}`] || 0;
                  return (
                    <button
                      key={u.id}
                      onClick={() => { setActiveDM(u); setActiveChannel(null); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        activeDM?.id === u.id 
                          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400 font-bold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                          {u.full_name?.charAt(0)}
                        </div>
                        <span>{u.full_name}</span>
                      </div>
                      {unread > 0 && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              {activeChannel ? (
                <>
                  {activeChannel.is_private ? <Lock size={20} className="text-slate-400" /> : <Hash size={20} className="text-slate-400" />}
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">{activeChannel.name}</h2>
                    {activeChannel.description && <p className="text-xs text-slate-500">{activeChannel.description}</p>}
                  </div>
                </>
              ) : activeDM ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                    {activeDM.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">{activeDM.full_name}</h2>
                    <p className="text-xs text-green-500">Active now</p>
                  </div>
                </>
              ) : (
                <h2 className="font-bold text-slate-900 dark:text-white">Select a chat</h2>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-slate-500">
              <button 
                onClick={() => setShowInfoPanel(!showInfoPanel)} 
                className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${showInfoPanel ? 'text-cyan-500' : ''}`}
              >
                <Info size={18} />
              </button>
            </div>
          </div>

          {/* Messages List - Reddit/Slack Hybrid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => {
              const prevMsg = messages[index - 1];
              const showCompact = prevMsg && prevMsg.sender_id === msg.sender_id && 
                                  (new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() < 5 * 60 * 1000);

              return (
                <div key={msg.id} className="group/msg">
                  <div className={`flex gap-4 p-2 -mx-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl transition-all ${showCompact ? 'pt-0.5' : 'mt-4'}`}>
                    
                    {/* Avatar */}
                    {!showCompact ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                        {msg.sender_avatar ? (
                          <img src={msg.sender_avatar} alt="" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          msg.sender_name?.charAt(0)
                        )}
                      </div>
                    ) : (
                      <div className="w-10 shrink-0 flex justify-end pr-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                        <span className="text-[10px] text-slate-400 mt-1">{format(new Date(msg.created_at), 'p')}</span>
                      </div>
                    )}
                    
                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                      {!showCompact && (
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900 dark:text-white text-sm hover:underline cursor-pointer">{msg.sender_name}</span>
                          <span className="text-xs text-slate-400 font-medium">
                            {format(new Date(msg.created_at), 'p')}
                          </span>
                        </div>
                      )}
                      
                      {editingMessage === msg.id ? (
                        <div className="mt-1">
                          <textarea 
                            className="w-full p-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white focus:border-cyan-500 outline-none transition-colors"
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-1">
                            <button onClick={() => setEditingMessage(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                            <button onClick={() => handleEditMessage(msg.id)} className="text-xs text-cyan-500 font-bold hover:text-cyan-600">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words cursor-pointer"
                          onClick={() => toggleThread(msg.id)}
                        >
                          {renderMessageContent(msg.content)}
                          {msg.is_edited === 1 && <span className="text-xs text-slate-400 ml-1 font-medium">(edited)</span>}
                        </div>
                      )}

                      {/* Reactions and Actions */}
                      <div className="flex items-center justify-between mt-1 h-6">
                        {/* Reactions */}
                        <div className="flex flex-wrap gap-1">
                          {msg.reactions && JSON.parse(msg.reactions).filter((r: any) => r.emoji).map((r: any, idx: number) => (
                            <button 
                              key={idx}
                              onClick={() => handleToggleReaction(msg.id, r.emoji)}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all ${
                                r.user_id === currentUser?.id 
                                  ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' 
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-white/10'
                              }`}
                            >
                              <span>{r.emoji}</span>
                            </button>
                          ))}
                          
                          <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex gap-1.5 ml-1 items-center">
                            <button onClick={() => handleToggleReaction(msg.id, '👍')} className="text-xl hover:scale-125 transition-transform cursor-pointer">👍</button>
                            <button onClick={() => handleToggleReaction(msg.id, '❤️')} className="text-xl hover:scale-125 transition-transform cursor-pointer">❤️</button>
                            <button className="text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer"><SmilePlus size={16} /></button>
                          </div>
                        </div>
                        
                        <div className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <button 
                            onClick={() => {
                              toggleThread(msg.id);
                              if (!msg.reply_count || msg.reply_count === 0) {
                                setActiveReplyBox(msg.id);
                              }
                            }} 
                            className="hover:text-cyan-500 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <MessageSquare size={14} /> 
                            {msg.reply_count && msg.reply_count > 0 ? `${msg.reply_count} Replies` : 'Reply'}
                          </button>
                          
                          {msg.sender_id === currentUser?.id && (
                            <>
                              <button 
                                onClick={() => { setEditingMessage(msg.id); setEditContent(msg.content); }} 
                                className="hover:text-cyan-500 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteMessage(msg.id)} 
                                className="hover:text-red-500 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                              >
                                <X size={14} /> Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Inline Replies (Reddit Style) */}
                      {expandedThreads[msg.id] && (
                        <div className="mt-3 ml-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700/50 space-y-3">
                          {threadReplies[msg.id]?.slice(0, fullyExpandedThreads[msg.id] ? undefined : 3).map(reply => (
                            <div key={reply.id} className="flex gap-3 group/reply p-1.5 -mx-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/20 rounded-lg transition-all">
                              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                {reply.sender_name?.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-slate-900 dark:text-white text-xs">{reply.sender_name}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{format(new Date(reply.created_at), 'p')}</span>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {renderMessageContent(reply.content)}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {threadReplies[msg.id] && threadReplies[msg.id]!.length > 3 && !fullyExpandedThreads[msg.id] && (
                            <button 
                              onClick={() => setFullyExpandedThreads(prev => ({ ...prev, [msg.id]: true }))}
                              className="text-xs text-cyan-500 font-bold hover:text-cyan-600 cursor-pointer py-1"
                            >
                              Show {threadReplies[msg.id]!.length - 3} more replies
                            </button>
                          )}
                          
                          {threadReplies[msg.id]?.length === 0 && (
                            <p className="text-xs text-slate-400 italic py-1">No replies yet. Be the first to reply!</p>
                          )}
                          
                          
                          {/* Inline Reply Input */}
                          {activeReplyBox !== msg.id ? (
                            <button 
                              onClick={() => setActiveReplyBox(msg.id)}
                              className="text-xs text-cyan-500 font-bold hover:text-cyan-600 cursor-pointer py-1 flex items-center gap-1"
                            >
                              <MessageSquare size={12} /> Reply to thread
                            </button>
                          ) : (
                            <form 
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const input = e.currentTarget.elements.namedItem('reply') as HTMLInputElement;
                                if (!input.value.trim()) return;
                                
                                const payload = {
                                  content: input.value,
                                  channel_id: msg.channel_id || null,
                                  receiver_id: msg.receiver_id || null,
                                  parent_id: msg.id
                                };
                                
                                try {
                                  await api.post('/ops/chat/messages', payload);
                                  input.value = '';
                                  setActiveReplyBox(null); // Hide after send
                                  const res = await api.get(`/ops/chat/messages/${msg.id}/threads`);
                                  if (Array.isArray(res)) {
                                    setThreadReplies(prev => ({ ...prev, [msg.id]: res }));
                                    setMessages(messages.map(m => m.id === msg.id ? { ...m, reply_count: (m.reply_count || 0) + 1 } : m));
                                  }
                                } catch (err) {
                                  console.error('Failed to send inline reply', err);
                                }
                              }} 
                              className="flex items-center gap-3 pt-1"
                            >
                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                              {currentUser?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input 
                                name="reply"
                                type="text" 
                                placeholder="Write a reply..." 
                                className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 text-xs py-1 outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
                              />
                              <button type="submit" className="text-xs text-cyan-500 font-bold hover:text-cyan-600 transition-colors">
                                Reply
                              </button>
                            </div>
                          </form>
                        )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input - Floating Style */}
          <div className="px-6 pb-6 shrink-0 relative">
            {/* Mention Popup */}
            {showMentionPopup && (
              <div className="absolute bottom-full left-6 mb-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl shadow-lg overflow-hidden z-10">
                <div className="p-2 max-h-48 overflow-y-auto space-y-0.5">
                  <button 
                    type="button"
                    onClick={() => {
                      const words = newMessage.split(/\s/);
                      words[words.length - 1] = '@all ';
                      setNewMessage(words.join(' '));
                      setShowMentionPopup(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-sm transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white font-bold">
                      A
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-slate-900 dark:text-white">@all</span>
                      <span className="text-[10px] text-slate-500">Mention everyone</span>
                    </div>
                  </button>
                  {users.filter((u: any) => u.full_name?.toLowerCase().includes(mentionSearch?.toLowerCase() || '')).map((u: any) => (
                    <button 
                      key={u.id}
                      type="button"
                      onClick={() => {
                        const words = newMessage.split(/\s/);
                        words[words.length - 1] = `@${u.full_name} `;
                        setNewMessage(words.join(' '));
                        setShowMentionPopup(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-sm transition-all cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {u.full_name?.charAt(0)}
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{u.full_name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/10 transition-all shadow-sm">
              <textarea 
                className="w-full bg-transparent p-4 text-sm outline-none resize-none placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
                placeholder={activeChannel ? `Message #${activeChannel.name}` : activeDM ? `Message ${activeDM.full_name}` : "Select a chat"}
                rows={2}
                value={newMessage}
                onChange={e => {
                  const val = e.target.value;
                  setNewMessage(val);
                  
                  const cursor = e.target.selectionStart;
                  const textBeforeCursor = val.substring(0, cursor);
                  const words = textBeforeCursor.split(/\s/);
                  const lastWord = words[words.length - 1];
                  
                  if (lastWord.startsWith('@')) {
                    setMentionSearch(lastWord.substring(1));
                    setShowMentionPopup(true);
                  } else {
                    setShowMentionPopup(false);
                    setMentionSearch(null);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3 text-slate-400">
                  <button type="button" className="hover:text-slate-600 dark:hover:text-white transition-colors"><Smile size={20} /></button>
                  <button type="button" className="hover:text-slate-600 dark:hover:text-white transition-colors"><Paperclip size={20} /></button>
                </div>
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${newMessage.trim() ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 shadow-md shadow-cyan-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Panel */}
        {showInfoPanel && (
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/5 flex flex-col shadow-sm">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
              <h2 className="font-bold text-slate-900 dark:text-white">{activeChannel ? 'Channel Info' : 'User Profile'}</h2>
              <button onClick={() => setShowInfoPanel(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col h-full overflow-hidden">
              {/* Tabs - Only show for Channels */}
              {activeChannel && (
                <div className="flex border-b border-slate-100 dark:border-white/5">
                  <button 
                    onClick={() => setInfoTab('about')} 
                    className={`flex-1 py-3 text-sm font-bold transition-colors cursor-pointer ${infoTab === 'about' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                  >
                    About
                  </button>
                  <button 
                    onClick={() => setInfoTab('members')} 
                    className={`flex-1 py-3 text-sm font-bold transition-colors cursor-pointer ${infoTab === 'members' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                  >
                    Members ({users.length})
                  </button>
                  <button 
                    onClick={() => setInfoTab('files')} 
                    className={`flex-1 py-3 text-sm font-bold transition-colors cursor-pointer ${infoTab === 'files' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-700 dark:hover:text-white'}`}
                  >
                    Files
                  </button>
                </div>
              )}

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {activeChannel ? (
                  <>
                    {infoTab === 'about' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Channel Name</h3>
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            {activeChannel.is_private ? <Lock size={14} /> : <Hash size={14} />}
                            {activeChannel.name}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                          <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                            {activeChannel.description || 'No description set.'}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Created by</span>
                              <span className="text-slate-900 dark:text-white font-medium">Admin</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Created on</span>
                              <span className="text-slate-900 dark:text-white font-medium">May 15, 2026</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                          <button className="w-full py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold transition-all cursor-pointer">
                            Leave Channel
                          </button>
                        </div>
                      </div>
                    )}

                    {infoTab === 'members' && (
                      <div className="space-y-4">
                        <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                          <Plus size={14} /> Add Members
                        </button>
                        <div className="space-y-3">
                          {users.map((u: any) => (
                            <div key={u.id} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 p-2 -mx-2 rounded-lg transition-all">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                {u.full_name?.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{u.full_name}</div>
                                <div className="text-xs text-slate-500">{u.role || 'Team Member'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {infoTab === 'files' && (
                      <div className="text-center text-slate-500 text-sm py-4">
                        No files shared in this channel yet.
                      </div>
                    )}
                  </>
                ) : activeDM ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                        {activeDM.full_name?.charAt(0)}
                      </div>
                      <h2 className="mt-4 font-bold text-xl text-slate-900 dark:text-white">{activeDM.full_name}</h2>
                      <p className="text-sm text-slate-500">{activeDM.role || 'Team Member'}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Email</span>
                            <span className="text-slate-900 dark:text-white font-medium">{activeDM.email || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Status</span>
                            <span className="text-green-500 font-medium">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-sm">Select a chat to see info.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateChannelModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        users={users}
        onChannelCreated={fetchChannels}
      />
    </OpsLayout>
  );
};

export default OpsChat;
