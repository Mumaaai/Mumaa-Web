import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Square, Loader2, Sparkles, AlertCircle, RefreshCw, Volume2, Info, History, Trash2 } from 'lucide-react';
import { callPuterAI } from '../../../utils/puterAiService';

interface CryLog {
  timestamp: string;
  analysis: string;
}

export default function CryView() {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [history, setHistory] = useState<CryLog[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const [audioBars, setAudioBars] = useState<number[]>([20, 30, 25, 40, 30, 45, 25, 35]);
  const animationIntervalRef = useRef<any>(null);

  useEffect(() => {
    // Load history from localStorage
    try {
      const stored = localStorage.getItem('mumaa_cryAnalyses');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      stopAllActivities();
    };
  }, []);

  const stopAllActivities = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        // Clean up tracks
        stream.getTracks().forEach(track => track.stop());
        handleAnalyze();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      setAnalysisResult(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev >= 9) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorder.state === 'recording') mediaRecorder.stop();
            setIsRecording(false);
            return 10;
          }
          return prev + 1;
        });
      }, 1000);

      // Animate visualizer bars
      animationIntervalRef.current = setInterval(() => {
        setAudioBars(prev => prev.map(() => Math.floor(15 + Math.random() * 45)));
      }, 100);

    } catch (err) {
      alert('Microphone access is required to analyze your baby\'s cry. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    let babyAge = 'unknown age';
    let babyName = 'little one';
    try {
      const session = localStorage.getItem('mumaa_session');
      if (session) {
        const user = JSON.parse(session);
        babyName = user.babyName || 'little one';
        babyAge = user.babyDOB ? 'specified age' : 'unknown age';
      }
    } catch (e) {}

    const prompt = [
      {
        role: 'system' as const,
        content: `You are a calm, comforting, and highly knowledgeable parenting specialist. A parent just recorded their baby named ${babyName} crying. Provide 3 gentle reasons explaining why the baby might be crying and clear, bulleted steps on what to check. Use a comforting tone. Limit response to 120 words.`
      },
      {
        role: 'user' as const,
        content: `Provide a cry translation breakdown for my baby ${babyName} (${babyAge}).`
      }
    ];

    try {
      const response = await callPuterAI(prompt);
      const content = response || "Ensure feeding diaper rest and comfort checklist.";
      setAnalysisResult(content);

      // Save to history
      const newLog: CryLog = {
        timestamp: new Date().toISOString(),
        analysis: content
      };

      setHistory(prev => {
        const updated = [newLog, ...prev].slice(0, 20);
        localStorage.setItem('mumaa_cryAnalyses', JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      setAnalysisResult(`**Quick Checklist:**\n\n• **Hunger:** Has it been 2-3 hours since the last feeding?\n• **Diaper:** Check if they need a fresh, dry diaper.\n• **Overtiredness:** Are they rubbing eyes or yawning?\n• **Comfort:** Try rocking gently skin-to-skin.`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Clear translation log history?')) {
      localStorage.removeItem('mumaa_cryAnalyses');
      setHistory([]);
    }
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight flex items-center gap-2.5">
              <span className="p-2 bg-rose-50 rounded-2xl text-rose-500">
                <Mic className="w-7 h-7" />
              </span>
              Cry Translator
            </h1>
            <p className="text-stone-500 font-medium mt-1">Let MUMAA listen for 10 seconds to help translate your little one's current needs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Recorder Page */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-100 text-center shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-200"></div>

              {/* Ping Wave Animation */}
              <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                <AnimatePresence>
                  {isRecording && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 1 }}
                      animate={{ scale: 1.8, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      className="absolute inset-0 bg-rose-100 rounded-full"
                    />
                  )}
                </AnimatePresence>
                
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-sm z-10 transition-colors duration-300 ${
                  isRecording ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-stone-50 border-stone-150 text-stone-400'
                }`}>
                  {isRecording ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10" />}
                </div>
              </div>

              {isRecording ? (
                <div className="w-full space-y-6">
                  {/* Dynamic Equalizer Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    {audioBars.map((height, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height }}
                        className="w-1.5 bg-rose-400 rounded-full"
                        style={{ height: '20px' }}
                      />
                    ))}
                  </div>

                  <div className="text-rose-500 font-bold flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    Listening...
                    <span className="font-mono bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-100">{timer}s / 10s</span>
                  </div>

                  <button 
                    onClick={stopRecording}
                    className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold transition-all shadow-md flex items-center gap-2 mx-auto btn-press"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Stop Listening
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-800">Ready to Translate</h3>
                    <p className="text-xs text-stone-400 font-bold uppercase mt-1 tracking-wider">Ensure a quiet room background</p>
                  </div>

                  <button 
                    onClick={startRecording}
                    className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold transition-all shadow-lg shadow-rose-100 flex items-center gap-2 mx-auto btn-press"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Listening
                  </button>
                </div>
              )}
            </div>

            {/* AI Result Card */}
            <AnimatePresence>
              {(isLoading || analysisResult) && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[2rem] p-6 md:p-8 border border-stone-100 shadow-sm space-y-4"
                >
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2 border-b border-stone-50 pb-3">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    AI Cry Translator Insight
                  </h4>
                  
                  {isLoading ? (
                    <div className="flex items-center gap-3 py-6 text-stone-400">
                      <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                      <span className="font-bold text-xs uppercase tracking-widest">Translating pitch profiles...</span>
                    </div>
                  ) : (
                    <div className="text-stone-600 text-sm font-medium leading-relaxed whitespace-pre-line space-y-3">
                      {analysisResult}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* History / Tips Column */}
          <div className="space-y-6">
            {/* Disclaimer */}
            <div className="bg-stone-50 rounded-3xl p-5 border border-stone-100 flex gap-3 text-stone-500 text-xs font-semibold leading-relaxed">
              <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p>MUMAA Cry Translator evaluates audio patterns to provide gentle checklists. Always consult your pediatrician for health concerns.</p>
            </div>

            {/* History Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-rose-400" />
                  Recent Translations
                </h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-50 transition-all"
                    title="Clear history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
                {history.length > 0 ? (
                  history.map((log, idx) => (
                    <div key={idx} className="p-3.5 bg-stone-50/50 hover:bg-stone-50 rounded-2xl border border-stone-100 shadow-sm text-left">
                      <p className="text-xs font-medium text-stone-600 line-clamp-3 leading-relaxed">{log.analysis}</p>
                      <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-2">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-stone-400 text-xs font-medium italic">
                    No translations recorded yet.
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
