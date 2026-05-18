import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Mic, Heart, Clock3, Play, Pause, Search, X, Trash2 } from 'lucide-react';
import { useScale } from '../../../context/ScaleContext';
import { api } from '../../../api';

interface Memory {
  id: string;
  type: 'text' | 'voice_transcript';
  content: string;
  audioData?: string; // Base64 audio
  timestamp: string;
}

const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [src]);

  const updateProgress = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration > 0 && !isNaN(duration)) {
        setProgress((currentTime / duration) * 100);
      }
    }
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <button 
        onClick={togglePlay}
        className="w-12 h-12 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-200 transition-colors shadow-sm btn-press"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
      </button>
      <div className="flex-1 h-3 bg-indigo-50 rounded-full overflow-hidden relative border border-indigo-100/50">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-indigo-400 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const highlight = (text: string, query: string) => {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-200 text-stone-800 rounded px-0.5">{part}</mark>
          : part
      )}
    </>
  );
};

const ExpandableText = ({ text, searchQuery = '' }: { text: string; searchQuery?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 150;
  const forceExpand = searchQuery.trim() !== '' && text.toLowerCase().includes(searchQuery.toLowerCase());
  const showFull = expanded || forceExpand;

  return (
    <div className="text-stone-600 font-medium leading-relaxed text-base whitespace-pre-wrap">
      {showFull ? highlight(text, searchQuery) : (isLong ? highlight(text.slice(0, 150) + '...', searchQuery) : highlight(text, searchQuery))}
      {isLong && !forceExpand && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-indigo-500 hover:text-indigo-700 font-bold ml-2 text-sm inline-block btn-press"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default function JournalView({ user }: { user?: any }) {
  const { isCompensated } = useScale();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [textMemory, setTextMemory] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [pendingAudioData, setPendingAudioData] = useState<string | undefined>(undefined);
  const timerRef = useRef<any>(null);

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscriptStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptStr += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscriptStr) {
          setTranscript(prev => prev + finalTranscriptStr + ' ');
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          stopRecording();
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("SpeechRecognition API not supported in this browser.");
    }
  }, []);

  const loadMemories = async () => {
    if (user?.id) {
      try {
        const data = await api.get(`/journal/${user.id}`);
        if (data && !data.error) {
          const mapped: Memory[] = data.map((e: any) => ({
            id: e.id,
            type: e.type,
            content: e.description || '',
            audioData: e.media_url || e.audio_data || undefined,
            timestamp: e.created_at || e.recorded_date || new Date().toISOString()
          }));
          setMemories(mapped);
          return;
        }
      } catch (e) {
        console.error("Failed to fetch memories from backend:", e);
      }
    }
    
    const saved = localStorage.getItem('temp_memories_json');
    if (saved) {
      try {
        setMemories(JSON.parse(saved));
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadMemories();
  }, [user?.id]);

  const saveToStorage = (newMemories: Memory[]) => {
    setMemories(newMemories);
    try {
      localStorage.setItem('temp_memories_json', JSON.stringify(newMemories, null, 2));
    } catch (e) {
      console.error("Failed to save to localStorage. It might be full due to large audio files.");
      alert("Local storage is full. Please download your JSON data and clear it.");
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const startRecording = async () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const b64 = await blobToBase64(audioBlob);
        setPendingAudioData(b64);
      };

      mediaRecorder.start();

      setTranscript('');
      setInterimTranscript('');
      setPendingAudioData(undefined);
      setIsRecording(true);
      setIsEditing(false);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      recognitionRef.current.start();
    } catch (e) {
      console.error("Microphone access denied or error:", e);
      alert("Could not access the microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsEditing(true); // Switch to review/editing mode
  };

  const saveTranscriptMemory = async () => {
    if (!transcript.trim() && !pendingAudioData) {
      setIsEditing(false);
      return;
    }
    
    const content = transcript.trim();

    if (user?.id) {
      try {
        const response = await api.post('/journal', {
          userId: user.id,
          type: 'voice_transcript',
          description: content,
          audioData: pendingAudioData
        });
        if (response && !response.error) {
          await loadMemories();
          setTranscript('');
          setInterimTranscript('');
          setPendingAudioData(undefined);
          setIsEditing(false);
          return;
        }
      } catch (e) {
        console.error("Failed to save voice memory:", e);
      }
    }

    const newMemory: Memory = {
      id: crypto.randomUUID(),
      type: 'voice_transcript',
      content,
      audioData: pendingAudioData,
      timestamp: new Date().toISOString()
    };
    saveToStorage([newMemory, ...memories]);
    setTranscript('');
    setInterimTranscript('');
    setPendingAudioData(undefined);
    setIsEditing(false);
  };

  const saveTextMemory = async () => {
    if (!textMemory.trim()) return;
    const content = textMemory.trim();

    if (user?.id) {
      try {
        const response = await api.post('/journal', {
          userId: user.id,
          type: 'text',
          description: content
        });
        if (response && !response.error) {
          await loadMemories();
          setTextMemory('');
          return;
        }
      } catch (e) {
        console.error("Failed to save text memory:", e);
      }
    }

    const newMemory: Memory = {
      id: crypto.randomUUID(),
      type: 'text',
      content,
      timestamp: new Date().toISOString()
    };
    saveToStorage([newMemory, ...memories]);
    setTextMemory('');
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(memories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mumaa_memories_temp.json';
    a.click();
  };

  const clearMemories = async () => {
    if (window.confirm("Are you sure you want to clear all memories?")) {
      if (user?.id) {
        try {
          const response = await api.delete(`/journal/all/${user.id}`);
          if (response && !response.error) {
            await loadMemories();
            return;
          }
        } catch (e) {
          console.error("Failed to clear memories:", e);
        }
      }
      setMemories([]);
      localStorage.removeItem('temp_memories_json');
    }
  };

  const deleteSingleMemory = async (memoryId: string) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      if (user?.id) {
        try {
          const response = await api.delete(`/journal/${memoryId}`);
          if (response && !response.error) {
            await loadMemories();
            return;
          }
        } catch (e) {
          console.error("Failed to delete memory:", e);
        }
      }
      
      const newMems = memories.filter(m => m.id !== memoryId);
      saveToStorage(newMems);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  const filteredMemories = useMemo(() => {
    if (!searchQuery.trim()) return memories;
    const q = searchQuery.toLowerCase();
    return memories.filter(m => m.content.toLowerCase().includes(q));
  }, [memories, searchQuery]);

  return (
    <div className="h-full overflow-y-auto chat-scroll absolute inset-0 pb-10">
      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8">

        <div className="mb-2 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 tracking-tight">Memory Journal</h1>
              <p className="text-stone-500 font-medium mt-1">Save the little moments forever.</p>
            </div>
        </div>

        <div className="bg-white rounded-[3rem] p-6 md:p-8 border border-stone-100 soft-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 gradient-lavender"></div>

          {/* Record New Memory (Voice/Text Input) */}
          <div className="flex flex-col gap-6">
            {!isRecording && !isEditing ? (
                <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-100 flex flex-col sm:flex-row gap-5 items-center">
                    <div className="flex-1 w-full text-left">
                        <h3 className="text-base font-bold text-stone-800 mb-1 flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-100 text-indigo-500 rounded-lg">
                              <Mic className="w-4 h-4" />
                            </div>
                            Voice Memory
                        </h3>
                        <p className="text-sm font-medium text-stone-500 mt-1">Record a milestone, a babble, or just your thoughts.</p>
                    </div>
                    <button 
                      onClick={startRecording} 
                      className="w-full sm:w-auto bg-white border border-stone-200 text-stone-700 hover:border-indigo-300 hover:bg-indigo-50 px-8 py-4 rounded-2xl font-bold transition-colors btn-press flex items-center justify-center gap-2 shadow-sm"
                    >
                        Start Recording
                    </button>
                </div>
            ) : null}

            {isRecording ? (
               <div 
                 onClick={stopRecording}
                 className="bg-indigo-50/80 border border-indigo-100 rounded-full py-5 px-8 flex items-center justify-center gap-3 cursor-pointer transition-all shadow-sm animate-pulse"
               >
                 <Mic className="w-5 h-5 text-indigo-600" />
                 <span className="text-indigo-600 font-bold text-lg">Capturing moment...</span>
                 <span className="bg-white text-indigo-600 px-3 py-1 rounded-lg font-bold shadow-sm ml-2">{recordingTime} s</span>
               </div>
            ) : null}

            {/* Transcription & Editing UI */}
            {(isRecording || isEditing) && (
              <div className="bg-white rounded-[2rem] p-6 border border-indigo-100 shadow-sm transition-all">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`text-indigo-600 font-bold text-sm ${isRecording ? 'recording-pulse' : ''} flex items-center gap-2`}>
                    {isRecording ? '🎙️ Listening & Transcribing...' : '📝 Review & Edit Transcript'}
                  </div>
                </div>
                
                {isEditing && pendingAudioData && (
                  <div className="mb-6 bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <AudioPlayer src={pendingAudioData} />
                  </div>
                )}

                <textarea 
                  rows={4}
                  className={`w-full bg-stone-50 rounded-2xl px-5 py-4 text-stone-700 text-base font-medium focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all border ${isRecording ? 'border-transparent cursor-not-allowed' : 'border-stone-200'}`}
                  value={isRecording ? transcript + interimTranscript : transcript}
                  onChange={(e) => {
                    if (isEditing) {
                       setTranscript(e.target.value);
                    }
                  }}
                  readOnly={isRecording}
                  placeholder="Start speaking..."
                ></textarea>

                {isEditing && (
                  <div className="flex gap-3 mt-5 justify-end">
                     <button onClick={() => { setIsEditing(false); setTranscript(''); setInterimTranscript(''); setPendingAudioData(undefined); }} className="px-6 py-3 rounded-2xl font-bold text-stone-500 hover:bg-stone-100 transition-colors btn-press">Cancel</button>
                     <button onClick={saveTranscriptMemory} className="px-8 py-3 rounded-2xl font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-md btn-press">Save Memory</button>
                  </div>
                )}
              </div>
            )}

            {/* Text Memory Input */}
            {!isRecording && !isEditing && (
              <div className="relative">
                  <textarea 
                    rows={3} 
                    placeholder="Write a quick thought about today..."
                    className="w-full bg-white border border-stone-100 rounded-[2rem] px-8 py-6 text-stone-600 text-lg font-medium focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all shadow-sm"
                    value={textMemory}
                    onChange={(e) => setTextMemory(e.target.value)}
                  ></textarea>
                  <button 
                    onClick={saveTextMemory}
                    className="absolute bottom-5 right-5 bg-purple-100 hover:bg-purple-200 text-indigo-900 p-3.5 rounded-2xl transition-colors btn-press shadow-sm"
                    title="Save Note"
                  >
                      <Heart className="w-6 h-6 fill-indigo-900" />
                  </button>
              </div>
            )}
          </div>
        </div>

        {/* Memory List Timeline */}
        <div className="bg-white rounded-[3rem] p-6 md:p-8 border border-stone-100 soft-shadow">
            <div className="flex flex-col gap-4 mb-6 px-2 border-b border-stone-100 pb-5">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock3 className="w-5 h-5 text-stone-400" /> TIMELINE
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearMemories}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-rose-100 btn-press"
                  >
                    Clear Data
                  </button>
                  <button 
                    onClick={downloadJson}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 btn-press"
                  >
                    Download JSON
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transcripts & notes..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-11 pr-10 py-3 text-stone-700 text-sm font-medium focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 btn-press"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs text-stone-400 font-medium px-1">
                  {filteredMemories.length === 0 ? 'No results found' : `${filteredMemories.length} result${filteredMemories.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                </p>
              )}
            </div>
            
            <div className="space-y-8 max-h-[50vh] overflow-y-auto chat-scroll relative before:absolute before:inset-y-2 before:left-[0.8rem] before:w-[2px] before:bg-stone-100 pl-8 pr-2">
                {memories.length === 0 ? (
                  <div className="text-stone-400 text-sm font-medium text-center py-10 bg-white border border-dashed border-stone-200 rounded-[2rem] ml-4">
                    No memories yet. Start capturing moments!
                  </div>
                ) : filteredMemories.length === 0 ? (
                  <div className="text-stone-400 text-sm font-medium text-center py-10 bg-white border border-dashed border-stone-200 rounded-[2rem] ml-4">
                    No matches found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  filteredMemories.map((memory) => (
                    <div key={memory.id} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[2.35rem] top-6 w-3.5 h-3.5 rounded-full bg-indigo-400 border-[3px] border-white box-content shadow-sm z-10"></div>
                      
                      {/* Memory Card */}
                      <div className="bg-stone-50/70 hover:bg-stone-50 rounded-[2.5rem] p-7 border border-stone-100 relative transition-colors shadow-sm">
                        <div className="flex justify-between items-center mb-5">
                          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                            {formatDate(memory.timestamp)} • {formatTime(memory.timestamp)}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full tracking-wider uppercase">
                              {memory.type === 'voice_transcript' ? 'VOICE' : 'TEXT'}
                            </span>
                            <button
                              onClick={() => deleteSingleMemory(memory.id)}
                              className="text-stone-400 hover:text-rose-500 transition-colors p-1 rounded-lg hover:bg-rose-50 btn-press"
                              title="Delete Memory"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {memory.type === 'voice_transcript' && (
                          <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
                               <Mic className="w-5 h-5" />
                               <span>Voice recording saved</span>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-5 items-start">
                              {memory.audioData && (
                                <div className="w-full md:w-72 shrink-0 bg-white rounded-3xl p-5 border border-stone-100 shadow-sm">
                                  <AudioPlayer src={memory.audioData} />
                                </div>
                              )}
                              <div className="flex-1 w-full bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                                <ExpandableText text={memory.content} searchQuery={searchQuery} />
                              </div>
                            </div>
                          </div>
                        )}

                        {memory.type === 'text' && (
                          <div className="text-stone-700 font-medium leading-relaxed text-lg whitespace-pre-wrap px-1">
                            {highlight(memory.content, searchQuery)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
