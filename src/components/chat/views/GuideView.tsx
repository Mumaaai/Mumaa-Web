import React, { useState } from 'react';
import { BookOpen, Sparkles, Library, Loader2 } from 'lucide-react';

export default function GuideView() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guideContent, setGuideContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateParentingGuide = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    setGuideContent(null);

    try {
      // TODO: Replace with actual backend API call
      // Example implementation:
      // const response = await fetch('/api/guide', { 
      //   method: 'POST', 
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ topic }) 
      // });
      // const data = await response.json();
      // setGuideContent(data.content);

      // Simulated network delay for testing UI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated response
      setGuideContent(`This is a generated guide for **${topic}**. \n\nHere you can provide gentle, age-specific advice blending modern pediatrics with trusted wisdom.\n\n• Point 1: Example advice.\n• Point 2: More gentle guidance.`);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch guide. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto chat-scroll pb-10">
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-[3rem] p-6 md:p-10 border border-stone-100 mb-8 text-center soft-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-purple-400"></div>

          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
            <BookOpen className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-bold mb-3 text-stone-800 tracking-tight">Parenting Library</h3>
          <p className="text-base font-medium text-stone-500 mb-10 max-w-lg mx-auto">
            Gentle, age-specific advice blending modern pediatrics with trusted Indian wisdom.
          </p>

          {/* Topic Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <button 
              onClick={() => generateParentingGuide('Behavior & Discipline')}
              className={`relative flex flex-col items-center justify-center p-6 bg-white border-2 rounded-[2rem] transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100 active:scale-95 active:shadow-inner
                ${selectedTopic === 'Behavior & Discipline' ? 'border-indigo-400 bg-indigo-50/50 shadow-md shadow-indigo-100 ring-4 ring-indigo-50 scale-[1.02]' : 'border-stone-100 hover:border-indigo-200 shadow-sm'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-50 to-transparent ${selectedTopic === 'Behavior & Discipline' ? '!opacity-100' : ''}`} />
              <div className={`relative z-10 text-4xl mb-3 transition-transform duration-300 ease-out group-active:scale-90 ${selectedTopic === 'Behavior & Discipline' ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-6'}`}>
                😇
              </div>
              <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors ${selectedTopic === 'Behavior & Discipline' ? 'text-indigo-700' : 'text-stone-600 group-hover:text-indigo-600'}`}>
                Behavior
              </span>
            </button>
            <button 
              onClick={() => generateParentingGuide('Tantrums & Crying')}
              className={`relative flex flex-col items-center justify-center p-6 bg-white border-2 rounded-[2rem] transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100 active:scale-95 active:shadow-inner
                ${selectedTopic === 'Tantrums & Crying' ? 'border-rose-400 bg-rose-50/50 shadow-md shadow-rose-100 ring-4 ring-rose-50 scale-[1.02]' : 'border-stone-100 hover:border-rose-200 shadow-sm'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-rose-50 to-transparent ${selectedTopic === 'Tantrums & Crying' ? '!opacity-100' : ''}`} />
              <div className={`relative z-10 text-4xl mb-3 transition-transform duration-300 ease-out group-active:scale-90 ${selectedTopic === 'Tantrums & Crying' ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
                😭
              </div>
              <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors ${selectedTopic === 'Tantrums & Crying' ? 'text-rose-700' : 'text-stone-600 group-hover:text-rose-600'}`}>
                Tantrums
              </span>
            </button>
            <button 
              onClick={() => generateParentingGuide('Sleep Training')}
              className={`relative flex flex-col items-center justify-center p-6 bg-white border-2 rounded-[2rem] transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100 active:scale-95 active:shadow-inner
                ${selectedTopic === 'Sleep Training' ? 'border-sky-400 bg-sky-50/50 shadow-md shadow-sky-100 ring-4 ring-sky-50 scale-[1.02]' : 'border-stone-100 hover:border-sky-200 shadow-sm'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-sky-50 to-transparent ${selectedTopic === 'Sleep Training' ? '!opacity-100' : ''}`} />
              <div className={`relative z-10 text-4xl mb-3 transition-transform duration-300 ease-out group-active:scale-90 ${selectedTopic === 'Sleep Training' ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}`}>
                😴
              </div>
              <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors ${selectedTopic === 'Sleep Training' ? 'text-sky-700' : 'text-stone-600 group-hover:text-sky-600'}`}>
                Sleep
              </span>
            </button>
            <button 
              onClick={() => generateParentingGuide('Potty Training')}
              className={`relative flex flex-col items-center justify-center p-6 bg-white border-2 rounded-[2rem] transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100 active:scale-95 active:shadow-inner
                ${selectedTopic === 'Potty Training' ? 'border-emerald-400 bg-emerald-50/50 shadow-md shadow-emerald-100 ring-4 ring-emerald-50 scale-[1.02]' : 'border-stone-100 hover:border-emerald-200 shadow-sm'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-50 to-transparent ${selectedTopic === 'Potty Training' ? '!opacity-100' : ''}`} />
              <div className={`relative z-10 text-4xl mb-3 transition-transform duration-300 ease-out group-active:scale-90 ${selectedTopic === 'Potty Training' ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}`}>
                🚽
              </div>
              <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors ${selectedTopic === 'Potty Training' ? 'text-emerald-700' : 'text-stone-600 group-hover:text-emerald-600'}`}>
                Potty
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-stone-100 soft-shadow mt-8 flex flex-col items-center justify-center min-h-[200px]">
             <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
             <p className="text-stone-500 font-medium">Generating guide for {selectedTopic}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-rose-100 soft-shadow mt-8 text-center">
             <p className="text-rose-500 font-bold">{error}</p>
          </div>
        )}

        {/* Content State */}
        {!isLoading && guideContent && (
          <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-stone-100 soft-shadow mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8 border-b border-stone-100 pb-5">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <Sparkles className="w-6 h-6 text-indigo-500" />
              </div>
              <h4 className="text-2xl font-bold text-stone-800">{selectedTopic} Guide</h4>
            </div>
            <div className="text-base text-stone-600 font-medium space-y-5 leading-relaxed tracking-wide whitespace-pre-wrap">
              {guideContent}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedTopic && !isLoading && !guideContent && (
          <div className="text-center py-16 opacity-50">
            <Library className="w-16 h-16 mx-auto mb-4 text-stone-400" />
            <p className="text-base font-bold text-stone-500">Select a topic above to explore.</p>
          </div>
        )}
      </div>
    </div>
  );
}
