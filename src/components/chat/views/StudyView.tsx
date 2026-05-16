import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, Lightbulb, ShieldCheck, Shapes, 
  Sparkles, ChevronDown, Loader2 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

declare global {
  interface Window {
    puter: any;
  }
}

interface StudyViewProps {
  user: any;
  babyProfile: any;
}

export default function StudyView({ user, babyProfile }: StudyViewProps) {
  const [focusArea, setFocusArea] = useState('Motor Skills');
  const [difficulty, setDifficulty] = useState('Beginner / Introduction');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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

  const handleGenerate = async () => {
    if (!window.puter) {
      alert("AI services are not available right now.");
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    try {
      const age = babyProfile ? calculateAge(babyProfile.date_of_birth) : "unknown age";
      const babyName = babyProfile?.name || "the baby";
      
      const prompt = `As a warm, expert developmental coach for parents, suggest 3 safe, joyful, age-appropriate developmental play activities for a baby who is ${age} old (named ${babyName}). 
      Focus area: "${focusArea}". 
      Difficulty level: "${difficulty}". 
      
      Structure your response clearly:
      1. Activity Name & Short Description
      2. How to play (using simple household items)
      3. Specific developmental benefit
      4. Safety precautions
      
      Use a warm, encouraging tone. Blend modern developmental science with gentle parenting. Use Markdown for formatting.`;

      const response = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
      const content = response?.message?.content || response?.content || "I couldn't generate ideas right now. Please try again gently.";
      setResult(content);
    } catch (error) {
      console.error("Failed to generate study plan", error);
      setResult("Unable to fetch activities. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-transparent pb-20">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-[3rem] p-8 md:p-12 border border-stone-100 mb-8 text-center shadow-xl shadow-sky-900/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-blue-500"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-50 rounded-full opacity-50 blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-sky-50 flex items-center justify-center border border-sky-100 shadow-sm">
              <Puzzle className="w-10 h-10 text-sky-500" />
            </div>
            <h3 className="text-3xl font-extrabold mb-3 text-stone-800 tracking-tight">Play & Grow</h3>
            <p className="text-base font-medium text-stone-500 mb-10 max-w-lg mx-auto leading-relaxed">
              Safe, joyful developmental activities perfectly suited for {babyProfile?.name || 'your baby'}'s exact age and current stage.
            </p>

            <div className="bg-stone-50/50 p-6 md:p-10 rounded-[2.5rem] border border-stone-100 max-w-2xl mx-auto text-left backdrop-blur-sm">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Focus Area</label>
                  <div className="relative group">
                    <select 
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      className="w-full bg-white bg-none border border-stone-200 rounded-2xl px-5 pr-12 py-4 text-stone-800 font-bold appearance-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50 outline-none transition-all shadow-sm group-hover:border-stone-300 cursor-pointer"
                    >
                      <option value="Motor Skills">👐 Motor Skills</option>
                      <option value="Speech & Language">🗣️ Speech & Language</option>
                      <option value="Colors & Shapes">🎨 Colors & Shapes</option>
                      <option value="Numbers & Counting">🔢 Numbers & Counting</option>
                      <option value="Social Skills">🤝 Social Skills</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 group-hover:text-sky-500 transition-colors">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Difficulty</label>
                  <div className="relative group">
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-white bg-none border border-stone-200 rounded-2xl px-5 pr-12 py-4 text-stone-800 font-bold appearance-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50 outline-none transition-all shadow-sm group-hover:border-stone-300 cursor-pointer"
                    >
                      <option value="Beginner / Introduction">🟢 Gentle Start</option>
                      <option value="Practice / Improvement">🟡 Practice</option>
                      <option value="Advanced for age">🔴 Challenge</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 group-hover:text-sky-500 transition-colors">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-bold transition-all shadow-lg shadow-sky-100 border border-white/20 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Dreaming up ideas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Inspire Me</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 border border-stone-100 shadow-2xl shadow-sky-900/5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-stone-100 pb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-50 rounded-2xl text-sky-500">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-bold text-stone-800 tracking-tight">Play Ideas for {babyProfile?.name || 'Baby'}</h4>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-extrabold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 shadow-sm uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Age Safe
                </div>
              </div>

              <div className="markdown-content text-stone-600 leading-relaxed tracking-wide">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>

              <div className="mt-10 pt-8 border-t border-stone-50 flex justify-center">
                <button 
                  onClick={() => setResult(null)}
                  className="text-stone-400 font-bold text-sm hover:text-stone-600 transition-colors flex items-center gap-2"
                >
                  Clear and start over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 opacity-30 group"
          >
            <Shapes className="w-16 h-16 mx-auto mb-4 text-stone-400 group-hover:scale-110 transition-transform duration-500" />
            <p className="text-base font-bold text-stone-500">Select a focus area to get joyful play ideas.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
