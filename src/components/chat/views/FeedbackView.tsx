import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, Trash2, Heart, Award, CheckCircle } from 'lucide-react';

interface FeedbackItem {
  text: string;
  rating: number;
  feature: string;
  date: string;
}

const APP_FEATURES = [
  'General Experience',
  'AI Chat Companion',
  'Growth & Milestones',
  'Log & Daily Tracker',
  'Diet & Play Guidelines',
  'Cry Translator & Sounds'
];

export default function FeedbackView() {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [feature, setFeature] = useState('General Experience');
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mumaa_feedbacks');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newItem: FeedbackItem = {
      text: text.trim(),
      rating,
      feature,
      date: new Date().toISOString()
    };

    const updated = [newItem, ...history].slice(0, 30);
    setHistory(updated);
    localStorage.setItem('mumaa_feedbacks', JSON.stringify(updated));

    setText('');
    setRating(5);
    setFeature('General Experience');
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  const handleDelete = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem('mumaa_feedbacks', JSON.stringify(updated));
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight flex items-center gap-2.5">
              <span className="p-2 bg-stone-100 rounded-2xl text-stone-600">
                <MessageSquare className="w-7 h-7" />
              </span>
              Feedback
            </h1>
            <p className="text-stone-500 font-medium mt-1">Help MUMAA grow. Share notes, report bugs, or vote on features you'd like to see.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Feedback Form Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-stone-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-300"></div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-800">Thank You!</h3>
                    <p className="text-sm font-semibold text-stone-500 max-w-xs mx-auto">
                      Your thoughts help us cultivate a gentler care environment for parents worldwide. 💌
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-stone-800">Share Your Experience</h3>
                      <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-1">We listen to every note closely</p>
                    </div>

                    {/* Feature selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Which area did you use?</label>
                      <select 
                        value={feature}
                        onChange={e => setFeature(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-stone-700 bg-white font-semibold outline-none focus:border-stone-300 focus:ring-4 focus:ring-stone-50 transition-all cursor-pointer"
                      >
                        {APP_FEATURES.map((feat, idx) => (
                          <option key={idx} value={feat}>{feat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Star Rating selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Satisfaction Rating</label>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starVal = i + 1;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setRating(starVal)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star 
                                className={`w-8 h-8 ${
                                  starVal <= rating 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-stone-250'
                                }`} 
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes textarea */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Your Feedback Note</label>
                      <textarea
                        rows={5}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="What features did you love? What can we make easier for you? Write it down gently..."
                        className="w-full px-4 py-3.5 rounded-2.5xl border border-stone-200 text-stone-700 bg-white font-medium outline-none focus:border-stone-300 focus:ring-4 focus:ring-stone-50 transition-all resize-none text-sm"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 btn-press cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Submit Notes
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="space-y-6">
            <div className="bg-stone-50 rounded-3xl p-5 border border-stone-100 flex gap-3 text-stone-500 text-xs font-semibold leading-relaxed">
              <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p>MUMAA is built for mothers. Your notes are kept local to your device storage to maintain strict safety & privacy standards.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm">
              <h3 className="text-sm font-bold text-stone-800 mb-4">Your Past Submissions</h3>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                {history.length > 0 ? (
                  history.map((item, idx) => (
                    <div key={idx} className="p-4 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-stone-100 shadow-sm text-left relative group">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold bg-white text-stone-500 px-2 py-0.5 rounded-md border border-stone-150 truncate max-w-[120px]">
                          {item.feature}
                        </span>
                        
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs font-medium text-stone-600 leading-relaxed whitespace-pre-line pr-6">"{item.text}"</p>
                      
                      <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-3">
                        {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      <button
                        onClick={() => handleDelete(idx)}
                        className="absolute right-3 bottom-3 p-1.5 text-stone-400 hover:text-rose-500 hover:bg-stone-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-stone-450 text-xs font-medium italic border border-dashed border-stone-200 rounded-[1.5rem]">
                    No submissions recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
