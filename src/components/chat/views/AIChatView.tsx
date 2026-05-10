import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, User, Plus, Baby, Moon, Utensils, Volume2, VolumeX } from 'lucide-react';
import ProfileSetupModal from '../ProfileSetupModal';
import { api } from '../../../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  onProfileUpdate: (data: any) => void;
  sessionId: string;
  onSessionChange: (id: string) => void;
}

const ELEVEN_LABS_API_KEY = 'sk_3dfc3e5b5d9474423467e39d24a42dcaea1783acf50bcbce';
const VOICE_ID = 'pNInz6obpgnuM0sLAsFl'; // Rachel - warm, maternal voice

export default function AIChatView({ user, babyProfile, onProfileUpdate, sessionId, onSessionChange }: AIChatViewProps) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load history when sessionId changes
  useEffect(() => {
    if (sessionId) {
      fetchHistory(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const fetchHistory = async (id: string) => {
    try {
      const history = await api.get(`/chat/history/${id}`);
      if (history && Array.isArray(history)) {
        setMessages(history.map((m: any) => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'ai',
          text: m.content
        })));
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  useEffect(() => {
    if (!babyProfile) {
      const timer = setTimeout(() => setIsModalOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [babyProfile]);

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

  const speak = async (text: string, id: string) => {
    if (currentlySpeakingId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentlySpeakingId(null);
      return;
    }

    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Stop browser TTS just in case
    window.speechSynthesis.cancel();
    
    setCurrentlySpeakingId(id);
    setIsAudioLoading(true);
    
    try {
      // Clean markdown for speech
      const cleanText = text.replace(/[#*`_~]/g, '').trim();

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=3`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_turbo_v2', // Faster and better
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Eleven Labs Error: ${errorData.detail?.message || response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onplay = () => {
        setIsAudioLoading(false);
      };

      audio.onended = () => {
        setCurrentlySpeakingId(null);
        URL.revokeObjectURL(url);
      };
      
      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        setCurrentlySpeakingId(null);
        setIsAudioLoading(false);
      };

      await audio.play();
    } catch (error) {
      console.error('Speech error:', error);
      setCurrentlySpeakingId(null);
      setIsAudioLoading(false);
      alert("Voice service unavailable. Please check your Eleven Labs API key or limit.");
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    let activeSessionId = sessionId;
    
    if (!activeSessionId) {
      activeSessionId = crypto.randomUUID();
      onSessionChange(activeSessionId);
    }

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);
    setIsFabOpen(false);

    try {
      await api.post('/chat/message', {
        userId: user.id,
        sessionId: activeSessionId,
        role: 'user',
        content: userText
      });
    } catch (e) {
      console.error("Failed to save user message", e);
    }

    try {
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
            User's name: ${babyProfile?.mom_name || user?.name || 'Mumaa'}.
            User's baby name: ${babyProfile?.name || 'Baby'}.
            User's baby precise age: ${calculateAge(babyProfile?.date_of_birth)}.
            Preferred Language: ${babyProfile?.preferred_language || 'Hinglish'}.
            AI Personality: ${babyProfile?.ai_detail || 'Balanced'}.
            
            CRITICAL CONTEXT RULES:
            - ALWAYS tailor your advice to the baby's SPECIFIC age: ${calculateAge(babyProfile?.date_of_birth)}.
            - Do NOT provide general ranges (e.g., "0-6 months"). 
            - Focus ONLY on what is relevant for a ${calculateAge(babyProfile?.date_of_birth)} baby.
            - If the user asks for a schedule or diet, provide it specifically for their baby's age.
            
            FORMATTING RULES:
            - Use Markdown for structure.
            - Use bold text for key advice.
            - Use bullet points for lists.
            - Use subheaders (##) for different sections.
            - Keep paragraphs short and breathable.
            - Use emojis gently to add warmth.
            
            Use the baby's name occasionally. Be supportive and maternal.` 
          },
          ...chatContext,
          { role: 'user', content: userText }
        ], { model: 'gpt-4o-mini' });

        const aiText = response?.message?.content || "I am here for you, dear. Let's try that again.";
        
        setIsLoading(false);
        const streamedText = await streamResponse(aiText);
        
        const aiResponse: Message = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai', 
          text: streamedText
        };
        setMessages(prev => [...prev, aiResponse]);
        setStreamingText('');

        await api.post('/chat/message', {
          userId: user.id,
          sessionId: activeSessionId,
          role: 'assistant',
          content: streamedText
        });

      } else {
        throw new Error('Puter not loaded');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setIsLoading(false);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: "I'm having a quiet moment. Could you repeat that for me, please?" 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
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

  const quickPrompts = [
    { icon: <Utensils className="w-4 h-4" />, text: "Feeding schedule", prompt: "Can you help me with a feeding schedule?" },
    { icon: <Moon className="w-4 h-4" />, text: "Sleep tips", prompt: "My baby won't sleep, what should I do?" },
    { icon: <Baby className="w-4 h-4" />, text: "Milestones", prompt: "What are the normal milestones for their age?" },
    { icon: <Sparkles className="w-4 h-4" />, text: "Mom's Diet", prompt: "Healthy recipes for a nursing mom" },
  ];

  return (
    <div className="flex flex-col h-full w-full absolute inset-0 bg-[#FFF8F3]">
      {/* Centered Scrollable Area */}
      <div className="flex-1 overflow-y-auto chat-scroll no-scrollbar" onClick={() => setIsFabOpen(false)}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col min-h-full">
          
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="my-auto text-center"
              >
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white bg-white rotate-3">
                  <img src="images/MumaaAIlogo.png" alt="MUMAA Logo" className="w-12 h-12 rounded-full" />
                </div>
                <h3 className="text-4xl font-bold mb-4 tracking-tight text-stone-800">Namaste.</h3>
                <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed mb-12 font-medium">
                  I am MUMAA, your peaceful parenting companion. How can I support you and your little one today?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                  {quickPrompts.map((p, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => insertAtCursor(p.prompt)}
                      className="p-4 bg-white/50 border border-stone-200 hover:border-orange-200 hover:bg-white rounded-2xl text-sm font-bold text-stone-600 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors shrink-0">
                        {p.icon}
                      </div>
                      <span>{p.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-12 pb-12">
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
                        
                        {msg.sender === 'ai' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(msg.text, msg.id);
                            }}
                            disabled={isAudioLoading && currentlySpeakingId === msg.id}
                            className={`absolute -right-12 top-0 p-2 rounded-full transition-all border shadow-sm ${currentlySpeakingId === msg.id ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-white border-stone-100 text-stone-400 hover:text-orange-500 opacity-0 group-hover/msg:opacity-100'}`}
                          >
                            {isAudioLoading && currentlySpeakingId === msg.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : currentlySpeakingId === msg.id ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
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

                {isLoading && (
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
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Input Area (Claude-style) */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-8 pt-2 z-20">
        <div className="relative group">
          
          {/* FAB Menu */}
          <AnimatePresence>
            {isFabOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 bottom-full mb-4 w-64 bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden"
              >
                <div className="p-3 border-b border-stone-50 bg-stone-50/50">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Quick Helpers</span>
                </div>
                <div className="p-2 space-y-1">
                  {quickPrompts.map((p, idx) => (
                    <button 
                      key={idx}
                      onClick={() => insertAtCursor(p.prompt)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-2xl transition-colors group text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-orange-100 text-stone-400 group-hover:text-orange-500 flex items-center justify-center transition-colors">
                        {p.icon}
                      </div>
                      <span className="text-sm font-bold text-stone-600 group-hover:text-stone-800">{p.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="bg-white rounded-[2.5rem] border border-stone-200 shadow-2xl shadow-orange-900/5 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100/50 transition-all flex items-end gap-2 p-3">
            <button 
              type="button" 
              onClick={() => setIsFabOpen(!isFabOpen)}
              className={`p-3 rounded-full transition-all btn-press shrink-0 ${isFabOpen ? 'bg-orange-100 text-orange-600' : 'hover:bg-stone-50 text-stone-400 hover:text-orange-500'}`}
            >
              <Plus className={`w-6 h-6 transition-transform duration-300 ${isFabOpen ? 'rotate-45' : ''}`} />
            </button>
            <textarea 
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1} 
              placeholder="Message Mumaa..." 
              className="flex-1 bg-transparent border-none outline-none text-stone-800 px-2 py-3 text-[16px] font-medium resize-none max-h-48 placeholder-stone-400 min-h-[48px]"
            ></textarea>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || streamingText.length > 0} 
              className={`p-3.5 rounded-full transition-all border shadow-sm btn-press shrink-0 ${
                !input.trim() || isLoading || streamingText.length > 0
                  ? 'bg-stone-50 text-stone-300 border-stone-100 cursor-not-allowed'
                  : 'bg-stone-800 text-white border-stone-900 hover:bg-stone-900 shadow-xl'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <div className="flex justify-center gap-4 mt-3 px-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              AI companion for mindful parenting
            </span>
          </div>
        </div>
      </div>

      <ProfileSetupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={async (data) => {
          try {
            const response = await api.post('/baby', { ...data, userId: user.id });
            if (response && !response.error) {
              const updated = await api.get(`/baby/${user.id}`);
              onProfileUpdate(updated);
            }
          } catch (e) {
            console.error("Failed to save profile", e);
          }
        }}
        initialData={babyProfile}
      />
    </div>
  );
}
