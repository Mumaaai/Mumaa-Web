import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Mic } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function AIChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: "I completely understand. Parenting is a journey full of surprises. How can I help you today?" 
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full w-full absolute inset-0">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 chat-scroll flex flex-col pb-[2rem]">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto w-full my-auto flex flex-col justify-center pt-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center pb-8">
              <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500 bg-white">
                <img src="images/MumaaAIlogo.png" alt="MUMAA Logo" className="w-16 h-16 rounded-full" />
              </div>
              <h3 className="text-4xl font-bold mb-4 tracking-tight text-stone-800">Namaste.</h3>
              <p className="text-stone-600 text-sm md:text-base max-w-sm mx-auto leading-relaxed mb-10 font-medium">
                I am your peaceful parenting companion. How can I support you and your little one today?
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                <button onClick={() => quickPrompt("Can you help me with a feeding schedule?")} className="p-5 bg-white border border-stone-200 hover:border-orange-300 hover:bg-orange-50 rounded-3xl text-sm font-bold text-stone-700 transition-all flex flex-col items-center justify-center gap-3 btn-press shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🍼</span>
                  </div>
                  <span>Feeding</span>
                </button>
                <button onClick={() => quickPrompt("My baby won't sleep, what should I do?")} className="p-5 bg-white border border-stone-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-3xl text-sm font-bold text-stone-700 transition-all flex flex-col items-center justify-center gap-3 btn-press shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">😴</span>
                  </div>
                  <span>Sleep</span>
                </button>
                <button onClick={() => quickPrompt("Are these normal milestones for 4 months?")} className="p-5 bg-white border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-3xl text-sm font-bold text-stone-700 transition-all flex flex-col items-center justify-center gap-3 btn-press shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <span>Milestones</span>
                </button>
                <button onClick={() => quickPrompt("What should a postpartum diet look like?")} className="p-5 bg-white border border-stone-200 hover:border-rose-300 hover:bg-rose-50 rounded-3xl text-sm font-bold text-stone-700 transition-all flex flex-col items-center justify-center gap-3 btn-press shadow-sm group">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🍲</span>
                  </div>
                  <span>Diet</span>
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 w-full font-medium pb-8 pt-4">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white ${msg.sender === 'user' ? 'bg-stone-200 text-stone-600' : 'gradient-peach text-orange-600'}`}>
                  {msg.sender === 'user' ? 'P' : <Sparkles className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-[1.5rem] p-5 shadow-sm text-[15px] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-stone-800 text-white rounded-tr-sm' 
                    : 'bg-white border border-stone-200 text-stone-700 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-stone-200/60 bg-white/90 backdrop-blur-xl p-3 md:p-5 z-20 w-full shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Quick Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-1">
            <button onClick={() => quickPrompt("Can you give me a feeding schedule?")} className="flex-shrink-0 px-5 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold hover:bg-orange-50 hover:border-orange-200 transition-all text-stone-600 whitespace-nowrap btn-press shadow-sm">
              🍼 Feeding Help
            </button>
            <button onClick={() => quickPrompt("How to sleep train my baby?")} className="flex-shrink-0 px-5 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all text-stone-600 whitespace-nowrap btn-press shadow-sm">
              😴 Sleep Advice
            </button>
            <button onClick={() => quickPrompt("When should my baby start crawling?")} className="flex-shrink-0 px-5 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold hover:bg-rose-50 hover:border-rose-200 transition-all text-stone-600 whitespace-nowrap btn-press shadow-sm">
              🌱 Growth Leaps
            </button>
            <button onClick={() => quickPrompt("Healthy recipes for a nursing mom")} className="flex-shrink-0 px-5 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold hover:bg-emerald-50 hover:border-emerald-200 transition-all text-stone-600 whitespace-nowrap btn-press shadow-sm">
              🍲 Mom's Diet
            </button>
          </div>
          
          <form onSubmit={handleSend} className="bg-white rounded-[2rem] border-2 border-stone-100 focus-within:border-orange-200 focus-within:ring-4 focus-within:ring-orange-100 transition-all flex items-end gap-2 p-2 shadow-sm">
            <button type="button" className="p-3.5 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-orange-500 btn-press shrink-0">
              <Mic className="w-6 h-6" />
            </button>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1} 
              placeholder="Ask Mumaa anything..." 
              className="flex-1 bg-transparent border-none outline-none text-stone-800 px-2 py-4 text-[15px] font-medium resize-none max-h-32 placeholder-stone-400 min-h-[52px]"
            ></textarea>
            <button type="submit" disabled={!input.trim()} className="gradient-peach hover:opacity-90 p-4 rounded-full transition-all text-orange-900 shadow-md border border-white btn-press shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
