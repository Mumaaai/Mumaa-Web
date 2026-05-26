import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, User, Baby, MoonStar, Milk, Thermometer, Footprints, AudioWaveform, Plus, PlayCircle } from 'lucide-react';
import { api } from '../../../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    puter: any;
  }
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isStreaming?: boolean;
}

interface AIChatViewProps {
  user: any;
  babyProfile: any;
  sessionId: string;
  onSessionChange: (id: string) => void;
  onHistoryRefresh?: (title?: string, sessionId?: string) => void;
}

export default function AIChatView({ user, babyProfile, sessionId, onSessionChange, onHistoryRefresh }: AIChatViewProps) {
  const calculateAge = (dob: string) => {
    if (!dob) return "Newborn";
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    
    if (months < 1) {
      const days = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 3600 * 24));
      return `${days} days old`;
    }
    if (months < 12) return `${months} months old`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} year${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''} old`;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const prevSessionIdRef = useRef<string | null>(null);

  // Load history when sessionId changes
  useEffect(() => {
    const isBrandNewSession = !prevSessionIdRef.current && sessionId;
    const hasInitialMessages = messages.length > 0;

    // Reset suggestions when switching sessions
    if (sessionId !== prevSessionIdRef.current) {
      setFollowUpSuggestions([]);
      
      // Load cached suggestions for this session if they exist
      if (sessionId) {
        const cached = localStorage.getItem(`mumaa_suggestions_${sessionId}`);
        if (cached) {
          try {
            setFollowUpSuggestions(JSON.parse(cached));
          } catch (e) {
            console.error("Failed to parse cached suggestions", e);
          }
        }
      }
    }

    if (sessionId && sessionId !== prevSessionIdRef.current) {
      // If it's a brand new session started locally, don't fetch (we already have the msg)
      if (!(isBrandNewSession && hasInitialMessages)) {
        fetchHistory(sessionId);
      }
      prevSessionIdRef.current = sessionId;
    } else if (!sessionId) {
      setMessages([]);
      setSessionTitle('');
      prevSessionIdRef.current = null;
    }
  }, [sessionId]);

  const fetchHistory = async (id: string) => {
    setIsHistoryLoading(true);
    try {
      const history = await api.get(`/chat/history/${id}`);
      if (history && Array.isArray(history)) {
        setMessages(history.map((m: any) => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'ai',
          text: m.content
        })));
      }
      
      // Also fetch session details to get the title
      const sessions = await api.get(`/chat/sessions/${user.id}`);
      const currentSession = sessions.find((s: any) => (s.session_id === id || s.id === id));
      if (currentSession) {
        setSessionTitle(currentSession.title);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const streamResponse = async (fullText: string) => {
    const words = fullText.split(' ');
    let currentText = '';
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setStreamingText(currentText);
      await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
    }
    return currentText;
  };

  const generateFollowUps = async (msgs: Message[]) => {
    if (!window.puter) return;
    try {
      const context = msgs.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n');
      const response = await window.puter.ai.chat([
        { 
          role: 'system', 
          content: 'Based on the conversation, generate 3 very short, empathetic follow-up questions. Keep each under 7 words. Return them separated ONLY by a pipe (|) character. No numbering. Example: Question 1? | Question 2? | Question 3?' 
        },
        { role: 'user', content: `Context:\n${context}` }
      ], { model: 'gpt-4o-mini' });
      const content = response?.message?.content;
      if (content) {
        const suggestions = content.split(/[|]/).map((s: string) => s.trim().replace(/^[-0-9.\s]+/, '')).filter((s: string) => s.length > 2);
        const slicedSuggestions = suggestions.slice(0, 3);
        setFollowUpSuggestions(slicedSuggestions);
        
        // Cache suggestions for this specific session
        const currentId = sessionId || prevSessionIdRef.current;
        if (currentId) {
          localStorage.setItem(`mumaa_suggestions_${currentId}`, JSON.stringify(slicedSuggestions));
        }
      }
    } catch (e) {
      console.error("Failed to generate follow-ups", e);
    }
  };

  const generateTitle = async (msgs: Message[]) => {
    if (!window.puter) return null;
    try {
      const context = msgs.map(m => `${m.sender}: ${m.text}`).join('\n');
      const response = await window.puter.ai.chat([
        { 
          role: 'system', 
          content: 'Generate a short, warm, 2-3 word title for a parenting chat based on the context. If the context is just greetings or too brief to determine a topic, return exactly "Saheli Chat". No quotes, just the title.' 
        },
        { role: 'user', content: `Context:\n${context}` }
      ], { model: 'gpt-4o-mini' });
      const title = response?.message?.content?.replace(/["']/g, '').trim();
      return title || null;
    } catch (e) {
      return null;
    }
  };

  const handleSend = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    let activeSessionId = sessionId;
    const isNewSession = !activeSessionId;
    
    if (isNewSession) {
      activeSessionId = crypto.randomUUID();
      onSessionChange(activeSessionId);
    }

    // 1. Immediate UI Update
    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    const messagesForContext = [...messages, newUserMsg];
    setMessages(messagesForContext);
    setInput('');
    setFollowUpSuggestions([]); // Clear immediately on send
    if (activeSessionId) {
      localStorage.removeItem(`mumaa_suggestions_${activeSessionId}`);
    }
    setIsLoading(true);
    setIsFabOpen(false);

    // 2. Background Persistence & AI Response
    (async () => {
      try {
        // Save user message in background
        api.post('/chat/message', {
          userId: user.id,
          sessionId: activeSessionId,
          role: 'user',
          content: userText
        }).catch(err => console.error("Failed to save user message", err));

        // Background title handling
        const isGenericTitle = !sessionTitle || sessionTitle === 'New Chat' || sessionTitle === 'Chat Session' || sessionTitle === 'Saheli Session' || sessionTitle === 'New Parenting Chat';
        if (isGenericTitle) {
          generateTitle(messagesForContext).then(async (properTitle) => {
            if (properTitle && properTitle !== "Saheli Session" && properTitle !== "New Parenting Chat") {
              setSessionTitle(properTitle);
              await api.put(`/chat/session/${activeSessionId}`, { title: properTitle });
              onHistoryRefresh?.(properTitle, activeSessionId);
            } else if (isNewSession) {
              setSessionTitle("Saheli Chat");
              await api.put(`/chat/session/${activeSessionId}`, { title: "Saheli Chat" });
              onHistoryRefresh?.("Saheli Chat", activeSessionId);
            }
          }).catch(err => console.error("Title generation background error", err));
        } else {
          onHistoryRefresh?.(sessionTitle, activeSessionId);
        }

        // 3. AI Response Flow
        if (window.puter) {
          const chatContext = messages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }));

          const response = await window.puter.ai.chat([
            { 
              role: 'system', 
              content: `You are MUMAA, a calm, peaceful, and gentle AI parenting companion. 
              You speak with warmth and empathy. Keep your advice practical but non-judgmental. 
              User's name: ${babyProfile?.mom_name || user?.name || 'Mumaa'}${babyProfile?.mom_condition ? ` (Note: Mom has health condition: ${babyProfile.mom_condition})` : ''}.
              User's baby name: ${babyProfile?.name || 'Baby'}.
              User's baby precise age: ${calculateAge(babyProfile?.date_of_birth)}.
              Birth details: ${babyProfile?.delivery_type || 'Normal'} delivery, Birth weight: ${babyProfile?.birth_weight || 'unknown'} kg.
              Medical conditions: ${babyProfile?.medical_conditions || 'None reported'}.
              Parenting setup: ${babyProfile?.parenting_type || 'Dual Parent'}.
              Preferred Language: ${babyProfile?.preferred_language || 'Hinglish'}.
              AI Personality: ${babyProfile?.ai_detail || 'Balanced'}.
              
              SENSITIVITY RULES:
              - If Mom has a health condition (${babyProfile?.mom_condition}), check in on her wellbeing gently.
              - If it was a C-Section, be mindful of recovery advice.
              - Tailor support to their parenting setup (${babyProfile?.parenting_type}).
              
              CRITICAL CONTEXT RULES:
              - ALWAYS tailor your advice to the baby's SPECIFIC age: ${calculateAge(babyProfile?.date_of_birth)}.
              - Focus ONLY on what is relevant for a ${calculateAge(babyProfile?.date_of_birth)} baby.
              
              FORMATTING RULES:
              - Use Markdown, bold key advice, use emojis for warmth.
              
              Use the baby's name occasionally. Be supportive and maternal.` 
            },
            ...chatContext,
            { role: 'user', content: userText }
          ], { model: 'gpt-4o-mini' });

          const aiText = response?.message?.content || "I am here for you, dear.";
          setIsLoading(false);
          const streamedText = await streamResponse(aiText);
          
          const aiResponse: Message = { 
            id: (Date.now() + 1).toString(), 
            sender: 'ai', 
            text: streamedText
          };
          setMessages(prev => [...prev, aiResponse]);
          setStreamingText('');
          
          // Generate follow-ups based on the NEW message history
          generateFollowUps([...messagesForContext, aiResponse]);

          // Save AI response in background
          api.post('/chat/message', {
            userId: user.id,
            sessionId: activeSessionId,
            role: 'assistant',
            content: streamedText
          }).then(() => onHistoryRefresh?.(sessionTitle, activeSessionId))
            .catch(err => console.error("Failed to save AI response", err));

        }
      } catch (err) {
        console.error('Chat handleSend background error:', err);
        setIsLoading(false);
      }
    })();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) {
      setInput(prev => prev + (prev ? ' ' : '') + text);
      return;
    }
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const val = input;
    const newValue = val.substring(0, start) + text + val.substring(end);
    setInput(newValue);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + text.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
    setIsFabOpen(false);
  };

  const gridCards = [
    { 
      id: 'feeding', 
      label: "Feeding", 
      icon: <Milk className="w-6 h-6" />, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50', 
      borderColor: 'hover:border-orange-200 hover:bg-orange-50/50',
      prompt: "Can you help me with a feeding schedule?" 
    },
    { 
      id: 'sleep', 
      label: "Sleep", 
      icon: <MoonStar className="w-6 h-6" />, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50', 
      borderColor: 'hover:border-indigo-200 hover:bg-indigo-50/50',
      prompt: "My baby won't sleep, what should I do?" 
    },
    { 
      id: 'health', 
      label: "Health", 
      icon: <Thermometer className="w-6 h-6" />, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50', 
      borderColor: 'hover:border-emerald-200 hover:bg-emerald-50/50',
      prompt: "What are the essential health tips for my baby?" 
    },
    { 
      id: 'milestones', 
      label: "Milestones", 
      icon: <Footprints className="w-6 h-6" />, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50', 
      borderColor: 'hover:border-rose-200 hover:bg-rose-50/50',
      prompt: "What are the normal milestones for their age?" 
    },
  ];

  const suggestionChips = [
    { label: "🍼 Feeding Help", prompt: "Can you help me with a feeding schedule?" },
    { label: "😴 Sleep Advice", prompt: "My baby won't sleep, what should I do?" },
    { label: "🌱 Growth Leaps", prompt: "What are the normal milestones for their age?" },
    { label: "🍲 Mom's Diet", prompt: "Healthy recipes for a nursing mom" }
  ];

  return (
    <div className="flex flex-col h-full w-full absolute inset-0 bg-[#FFF8F3]">
      {/* Session Title Header - Added for better context */}
      <AnimatePresence>
        {messages.length > 0 && sessionTitle && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-3 px-6 bg-white/50 backdrop-blur-sm border-b border-stone-100 flex items-center justify-center gap-2 z-10 shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-sm font-bold text-stone-600 tracking-tight">{sessionTitle}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered Scrollable Area */}
      <div className="flex-1 overflow-y-auto chat-scroll no-scrollbar" onClick={() => setIsFabOpen(false)}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col min-h-full">
          
          <AnimatePresence mode="wait">
            {isHistoryLoading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="my-auto flex flex-col items-center justify-center py-20 text-stone-400"
              >
                <Loader2 className="w-8 h-8 animate-spin text-orange-400 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Opening your conversation...</p>
              </motion.div>
            ) : messages.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="my-auto text-center"
              >
                <div className="w-28 h-28 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="images/MumaaAIlogo.png" alt="MUMAA Logo" className="w-16 h-16" />
                </div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight text-stone-800">Namaste.</h3>
                <p className="text-stone-600 text-sm md:text-base max-w-sm mx-auto leading-relaxed mb-10 font-medium">
                  I am your peaceful parenting companion. How can I support you and your little one today?
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {gridCards.map((card) => (
                    <button 
                      key={card.id} 
                      onClick={() => insertAtCursor(card.prompt)}
                      className={`p-5 bg-white border border-stone-100 ${card.borderColor} rounded-3xl text-[15px] font-bold text-stone-700 transition-all flex flex-col items-center justify-center gap-3 btn-press soft-shadow group`}
                    >
                      <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform shrink-0`}>
                        {card.icon}
                      </div>
                      <span>{card.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="messages"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-12 pb-12"
              >
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-6 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-stone-100 ${msg.sender === 'user' ? 'bg-stone-800 text-stone-200' : 'bg-white text-orange-500'}`}>
                      {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className={`flex-1 min-w-0 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block text-left relative group/msg ${msg.sender === 'user' ? 'bg-stone-100 px-5 py-3 rounded-2xl text-stone-700' : 'w-full'}`}>
                        <div className="markdown-content text-[16px] leading-relaxed font-medium text-stone-800">
                          {msg.sender === 'ai' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Streaming Response */}
                {streamingText && (
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-stone-100 bg-white text-orange-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="markdown-content text-[16px] leading-relaxed font-medium text-stone-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingText}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && !streamingText && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-stone-100 bg-white text-orange-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="flex items-center text-stone-400 italic text-sm">
                      Mumaa is thinking...
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Input Area (Claude-style) */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2 z-20">
        <div className="relative group">
          
          {/* Quick Helpers Popover */}
          <AnimatePresence>
            {isFabOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsFabOpen(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-4 bottom-full mb-3 w-64 bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Quick Helpers</span>
                  </div>
                  <div className="p-2 space-y-1">
                    {gridCards.map((card, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          insertAtCursor(card.prompt);
                          setIsFabOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-orange-50 rounded-2xl transition-colors group text-left"
                      >
                        <div className={`w-7 h-7 rounded-lg bg-stone-50 group-hover:bg-orange-100 ${card.color} flex items-center justify-center transition-colors shrink-0`}>
                          {/* Clone icon with smaller class */}
                          {card.id === 'feeding' && <Milk className="w-4 h-4" />}
                          {card.id === 'sleep' && <MoonStar className="w-4 h-4" />}
                          {card.id === 'health' && <Thermometer className="w-4 h-4" />}
                          {card.id === 'milestones' && <Footprints className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-bold text-stone-600 group-hover:text-stone-800">{card.label}</span>
                      </button>
                    ))}
                    <div className="border-t border-stone-100 my-1 pt-1">
                      <Link 
                        to="/reels"
                        onClick={() => setIsFabOpen(false)}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-emerald-50 rounded-2xl transition-colors group text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-stone-50 group-hover:bg-emerald-100 text-emerald-500 flex items-center justify-center transition-colors shrink-0">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-stone-600 group-hover:text-emerald-700">Video Guidance</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>



          <form onSubmit={handleSend} className="bg-white rounded-[2rem] border border-stone-200/80 focus-within:border-orange-200 focus-within:ring-4 focus-within:ring-orange-100 transition-all flex items-center gap-1.5 p-1.5 soft-shadow">
            <button 
              type="button" 
              onClick={() => setIsFabOpen(!isFabOpen)}
              className={`p-2.5 rounded-full transition-all btn-press shrink-0 ${isFabOpen ? 'bg-orange-100 text-orange-600' : 'hover:bg-stone-50 text-stone-400 hover:text-orange-500'}`}
              title="Quick Helpers"
            >
              <Plus className={`w-5 h-5 transition-transform duration-300 ${isFabOpen ? 'rotate-45' : ''}`} />
            </button>

            <textarea 
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1} 
              placeholder="Ask Mumaa anything..." 
              className="flex-1 bg-transparent border-none outline-none text-stone-800 px-2 py-2 text-[14px] font-medium resize-none max-h-24 placeholder-stone-400 min-h-[38px] leading-relaxed self-center"
            ></textarea>
            
            <button 
              type="button" 
              className="p-2.5 hover:bg-stone-50 text-stone-400 hover:text-orange-500 rounded-full transition-all btn-press shrink-0 self-center"
              title="Voice Input"
            >
              <AudioWaveform className="w-5 h-5" />
            </button>

            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || streamingText.length > 0} 
              className={`gradient-peach hover:opacity-90 p-3 rounded-full transition-all text-orange-900 shadow-sm border border-white btn-press shrink-0 flex items-center justify-center self-center ${
                !input.trim() || isLoading || streamingText.length > 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
