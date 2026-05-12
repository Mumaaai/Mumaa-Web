import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayCircle, Heart, Share2, ChevronLeft, 
  ChevronDown, MessageCircle, 
  Volume2, VolumeX, Sparkles, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Reel {
  id: string;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  likes: string;
  comments: string;
  author: string;
  tags: string[];
}

const reelsData: Reel[] = [
  {
    id: '1',
    title: 'Newborn Bathing Guide',
    category: 'Care Techniques',
    description: 'Master the gentle art of newborn bathing with these expert tips on water temperature and safety.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mother-bathing-her-little-baby-in-a-bathtub-41334-large.mp4',
    thumbnail: 'https://images.pexels.com/photos/3845492/pexels-photo-3845492.jpeg',
    likes: '1.2k',
    comments: '240',
    author: 'Dr. Sarah Mitchell',
    tags: ['Bathing', 'Newborn', 'Safety']
  },
  {
    id: '2',
    title: 'The "Magic" Burping Hold',
    category: 'Quick Ideas',
    description: 'Struggling with a gassy baby? Try this specialized hold designed by pediatricians to release air fast.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mother-holding-her-baby-in-her-arms-and-kissing-him-41328-large.mp4',
    thumbnail: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
    likes: '2.5k',
    comments: '412',
    author: 'Expert Nanny Joy',
    tags: ['Feeding', 'Gassiness', 'Quick Tip']
  },
  {
    id: '3',
    title: 'Safe Sleep ABCs',
    category: 'Expert Tips',
    description: 'Learn the latest SIDS prevention guidelines: Alone, Back, Crib. Essential for every new parent.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-baby-sleeping-peacefully-in-his-crib-41330-large.mp4',
    thumbnail: 'https://images.pexels.com/photos/3770582/pexels-photo-3770582.jpeg',
    likes: '8.9k',
    comments: '1.1k',
    author: 'Mumaa Safety Team',
    tags: ['Sleep', 'Safety', 'Essential']
  }
];

export default function Reels() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      setActiveIndex(index);
    }
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col md:flex-row">
      
      {/* Mobile Back Button */}
      <button 
        onClick={() => navigate('/chat')}
        className="absolute top-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Sidebar Navigation (Desktop) */}
      <div className="hidden md:flex w-80 h-full bg-stone-900 border-r border-stone-800 flex-col p-8 space-y-10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <PlayCircle className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-black text-white tracking-tight">Video Guidance</h1>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Visual</span>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-widest px-2">Categories</h3>
            <div className="space-y-2">
                {['Expert Tips', 'Care Techniques', 'Quick Ideas', 'Safety First'].map((cat) => (
                    <button key={cat} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left ${reelsData[activeIndex].category === cat ? 'bg-white/10 text-white' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}>
                        <div className={`w-2 h-2 rounded-full ${reelsData[activeIndex].category === cat ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-stone-700'}`} />
                        <span className="text-sm font-bold">{cat}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-auto bg-stone-800/50 p-6 rounded-[2rem] border border-stone-800/50">
            <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-stone-300 uppercase tracking-widest">Pro Tip</span>
            </div>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
                Save your favorite guides to access them instantly from your dashboard.
            </p>
        </div>
      </div>

      {/* Reels Feed */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black relative"
      >
        {reelsData.map((reel, index) => (
          <div key={reel.id} className="h-full w-full snap-start relative flex items-center justify-center">
            
            {/* Background Video */}
            <video 
              autoPlay 
              loop 
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-100"
              poster={reel.thumbnail}
            >
              <source src={reel.videoUrl} type="video/mp4" />
            </video>

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-end p-6 md:p-12">
              <div className="max-w-xl space-y-6">
                
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {reel.category}
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-xs font-bold">
                        <Award className="w-3 h-3" />
                        Expert Curated
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                        {reel.title}
                    </h2>
                    <p className="text-stone-300 font-medium text-sm md:text-base leading-relaxed max-w-md">
                        {reel.description}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md p-0.5 border border-white/20 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${reel.author}&background=random`} alt={reel.author} className="w-full h-full rounded-full" />
                    </div>
                    <div>
                        <div className="text-xs font-black text-white">{reel.author}</div>
                        <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Certified Specialist</div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    {reel.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-black text-white/40 uppercase tracking-widest px-3 py-1 border border-white/10 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Interaction Sidebar */}
            <div className="absolute right-6 bottom-32 flex flex-col gap-6 items-center">
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-rose-500 group-hover:border-rose-500 transition-all">
                        <Heart className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{reel.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-sky-500 group-hover:border-sky-500 transition-all">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{reel.comments}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Share</span>
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
                >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
            </div>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: index === activeIndex ? '100%' : '0%' }}
                    transition={{ duration: index === activeIndex ? 30 : 0, ease: "linear" }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none opacity-50">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Swipe Up</span>
          <ChevronDown className="w-4 h-4 text-white animate-bounce" />
      </div>
    </div>
  );
}
