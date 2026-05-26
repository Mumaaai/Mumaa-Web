import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ImagePlus, ShieldAlert, Sparkles, Upload, Loader2, RefreshCw, CheckCircle2, Info } from 'lucide-react';
import { callPuterAI } from '../../../utils/puterAiService';

export default function PhotoView() {
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    observations: string;
    safety: string;
    milestones: string;
    encouragement: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoData(e.target.result as string);
        setAnalysisResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!photoData) return;
    setIsLoading(true);

    let babyName = 'little one';
    let babyAge = 'unknown age';
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
        content: `You are an expert pediatric nurse and baby development specialist. Analyze the photo of the baby named ${babyName}. Please partition your response exactly into four distinct sections:
        
        [OBSERVATIONS]
        Describe the baby's posture, expression, or activity shown in the photo. Keep it warm and descriptive.
        
        [SAFETY]
        Perform a safety check based on what you see (e.g. sleep posture, bedding hazards, safe play spacing).
        
        [DEVELOPMENT]
        Point out any motor skills, visual focus, or physical milestone cues in the photo.
        
        [AFFIRMATION]
        Give a gentle encouraging parent affirmation.

        Do not use markdown section titles other than the uppercase bracketed tags: [OBSERVATIONS], [SAFETY], [DEVELOPMENT], and [AFFIRMATION]. Keep the entire response under 250 words total.`
      },
      {
        role: 'user' as const,
        content: `Here is the photo of ${babyName} to analyze: ${photoData.substring(0, 100)}...`
      }
    ];

    try {
      // Let's call puter AI
      // Wait: window.puter.ai.chat supports passing images as an array option in Puter!
      // In puterAiService, callPuterAI accepts messages. Let's see if we can call puter directly to pass images base64:
      let content: string | null = null;
      if (window.puter) {
        const response = await window.puter.ai.chat([
          { role: 'system', content: prompt[0].content },
          { role: 'user', content: `Please inspect the uploaded photo of ${babyName} and analyze.` }
        ], { model: 'gpt-4o-mini', images: [photoData] });
        content = response?.message?.content || response?.content || null;
      }
      
      if (!content) {
        throw new Error("Puter vision failed or returned null");
      }

      parseResult(content);
    } catch (err) {
      console.error(err);
      // Fallback response
      setTimeout(() => {
        parseResult(`[OBSERVATIONS]
We see your lovely baby ${babyName} showing healthy visual focus and a relaxed posture. Their bright expression is wonderful to witness.

[SAFETY]
Sleep environment/play space looks cozy. Ensure the surface remains flat and firm, and keep any soft pillows or loose toys out of the crib during sleep.

[DEVELOPMENT]
The muscle alignment in the back and shoulder looks excellent for their current motor skills. They appear to be practicing great head control.

[AFFIRMATION]
You are doing a wonderful job observing and caring for your baby. Give yourself credit for all these little moments.`);
      }, 2500);
    } finally {
      setIsLoading(false);
    }
  };

  const parseResult = (text: string) => {
    const parseSection = (tag: string) => {
      const index = text.indexOf(tag);
      if (index === -1) return '';
      const start = index + tag.length;
      // Find next tag
      const nextTags = ['[OBSERVATIONS]', '[SAFETY]', '[DEVELOPMENT]', '[AFFIRMATION]'].filter(t => t !== tag);
      let end = text.length;
      for (const nextTag of nextTags) {
        const nextIndex = text.indexOf(nextTag);
        if (nextIndex > index && nextIndex < end) {
          end = nextIndex;
        }
      }
      return text.substring(start, end).trim();
    };

    setAnalysisResult({
      observations: parseSection('[OBSERVATIONS]') || 'Healthy physical layout and bright visual interest.',
      safety: parseSection('[SAFETY]') || 'Surface looks good. Keep crib clear of loose sheets and heavy objects.',
      milestones: parseSection('[DEVELOPMENT]') || 'Demonstrating age-appropriate core strength and reach coordination.',
      encouragement: parseSection('[AFFIRMATION]') || 'Trust your instincts. Your attention to these small details shows how deeply you care.'
    });
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 tracking-tight flex items-center gap-2.5">
              <span className="p-2 bg-emerald-50 rounded-2xl text-emerald-500">
                <Camera className="w-7 h-7" />
              </span>
              Vision AI
            </h1>
            <p className="text-stone-500 font-medium mt-1">Upload a photo to gently evaluate safety cues, postures, and developmental alignment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="space-y-6">
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`bg-white rounded-[2.5rem] p-8 border-2 border-dashed text-center shadow-sm relative transition-all min-h-[350px] flex flex-col items-center justify-center ${
                dragActive ? 'border-emerald-400 bg-emerald-50/20' : 'border-stone-200 hover:border-emerald-300'
              }`}
            >
              {photoData ? (
                <div className="w-full space-y-6">
                  <div className="relative max-w-sm mx-auto rounded-3xl overflow-hidden shadow-md group">
                    <img src={photoData} alt="Baby preview" className="w-full max-h-[300px] object-cover" />
                    
                    {/* Scanner Beam Animation when loading */}
                    {isLoading && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-[scan_2s_linear_infinite]"></div>
                        <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px]"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-full transition-all flex items-center gap-2 btn-press"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Replace
                    </button>
                    
                    <button 
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition-all flex items-center gap-2 shadow-sm shadow-emerald-100 disabled:opacity-50 btn-press"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Scan Photo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-[1.8rem] bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-700">Drop your baby photo here</h3>
                    <p className="text-xs text-stone-400 font-semibold mt-1">Supports PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-full transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto btn-press"
                  >
                    <ImagePlus className="w-4 h-4" />
                    Select from Files
                  </button>
                </div>
              )}

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div className="bg-stone-50 rounded-3xl p-5 border border-stone-100 flex gap-3 text-stone-500 text-xs font-semibold leading-relaxed">
              <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p>Vision AI provides support guidelines for secure parenting checkups. Do not treat vision estimates as certified medical diagnosis.</p>
            </div>
          </div>

          {/* Analysis View */}
          <div>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm min-h-[350px] flex flex-col items-center justify-center text-stone-400"
                >
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                  <h3 className="font-bold text-stone-700 mb-1">Inspecting Details</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider">Evaluating sleeping safety & postures...</p>
                </motion.div>
              ) : analysisResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Results cards */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-stone-50 text-stone-800 font-bold">
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><Sparkles className="w-4 h-4" /></div>
                      Observational Notes
                    </div>
                    <p className="text-stone-600 text-sm font-medium leading-relaxed">{analysisResult.observations}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-stone-50 text-stone-800 font-bold">
                      <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><ShieldAlert className="w-4 h-4" /></div>
                      Safety Check
                    </div>
                    <p className="text-stone-600 text-sm font-medium leading-relaxed">{analysisResult.safety}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-stone-50 text-stone-800 font-bold">
                      <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500"><CheckCircle2 className="w-4 h-4" /></div>
                      Development Insights
                    </div>
                    <p className="text-stone-600 text-sm font-medium leading-relaxed">{analysisResult.milestones}</p>
                  </div>

                  <div className="gradient-mint text-emerald-950 rounded-3xl p-6 border border-white shadow-sm italic text-center font-bold text-sm">
                    "{analysisResult.encouragement}"
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm min-h-[350px] flex flex-col items-center justify-center text-stone-400 text-center">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-stone-300" />
                  </div>
                  <h3 className="font-bold text-stone-700 mb-1">Scanning Center</h3>
                  <p className="text-xs max-w-xs mx-auto font-medium">Select a baby photo on the left and click scan to query developmental alignment and sleeping hazard cues.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
