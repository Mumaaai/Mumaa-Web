import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Share2, ChevronLeft, 
  MessageCircle, Volume2, VolumeX, Sparkles, Award, Search, X, 
  Play, Bell, User, ChevronDown
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
    videoUrl: 'https://assets.mixkit.co/videos/27329/27329-720.mp4',
    thumbnail: 'https://images.pexels.com/photos/3845492/pexels-photo-3845492.jpeg',
    likes: '1.2k',
    comments: '240',
    author: 'Mumaa Expert',
    tags: ['Bathing', 'Newborn', 'Safety']
  },
  {
    id: '2',
    title: 'The "Magic" Burping Hold',
    category: 'Quick Ideas',
    description: 'Struggling with a gassy baby? Try this specialized hold designed by pediatricians to release air fast.',
    videoUrl: 'https://assets.mixkit.co/videos/34753/34753-720.mp4',
    thumbnail: 'https://media.istockphoto.com/id/1470471249/photo/mother-holding-her-newborn-baby-boy-and-playing-with-him-at-home.jpg?s=1024x1024&w=is&k=20&c=uAfqovmD6XJNfOfOXt_9Y6uq_KGiRPnynJJ9yph89OI=',
    likes: '2.5k',
    comments: '412',
    author: 'Mumaa Expert',
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
    author: 'Mumaa Expert',
    tags: ['Sleep', 'Safety', 'Essential']
  },
  {
    id: '4',
    title: 'Gentle Baby Massage',
    category: 'Care Techniques',
    description: 'Step-by-step techniques for a soothing baby massage to aid digestion and sleep.',
    videoUrl: 'https://assets.mixkit.co/videos/27329/27329-720.mp4',
    thumbnail: 'https://images.pexels.com/photos/3845240/pexels-photo-3845240.jpeg',
    likes: '4.3k',
    comments: '560',
    author: 'Mumaa Expert',
    tags: ['Massage', 'Relaxation', 'Sleep']
  },
  {
    id: '5',
    title: 'Tummy Time Fun',
    category: 'Quick Ideas',
    description: 'Make tummy time enjoyable with these simple toys and interaction ideas.',
    videoUrl: 'https://assets.mixkit.co/videos/34753/34753-720.mp4',
    thumbnail: 'https://images.pexels.com/photos/3845241/pexels-photo-3845241.jpeg',
    likes: '3.1k',
    comments: '290',
    author: 'Mumaa Expert',
    tags: ['Play', 'Development', 'TummyTime']
  },
  {
    id: '6',
    title: 'Swaddling Masterclass',
    category: 'Safety First',
    description: 'Different swaddling styles explained for better newborn sleep and hip health.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-baby-sleeping-peacefully-in-his-crib-41330-large.mp4',
    thumbnail: 'https://images.pexels.com/photos/3845242/pexels-photo-3845242.jpeg',
    likes: '12k',
    comments: '2.4k',
    author: 'Mumaa Expert',
    tags: ['Swaddle', 'Sleep', 'Safety']
  }
];

const CATEGORIES = ['All', 'Expert Tips', 'Care Techniques', 'Quick Ideas', 'Safety First'];

export default function Reels() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMuted, setIsMuted] = useState(true);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const filteredReels = useMemo(() => {
    return reelsData.filter(reel => {
      const matchesSearch = searchQuery.trim() === '' || 
        reel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase().replace('#', ''))) ||
        reel.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || reel.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleFullscreenScroll = () => {
    if (fullscreenContainerRef.current) {
      const index = Math.round(fullscreenContainerRef.current.scrollTop / window.innerHeight);
      if (index !== fullscreenIndex) setFullscreenIndex(index);
    }
  };

  // Sync scroll position when opening fullscreen
  const hasInitialScrolled = useRef(false);
  useEffect(() => {
    if (fullscreenIndex !== null && !hasInitialScrolled.current && fullscreenContainerRef.current) {
      fullscreenContainerRef.current.scrollTo({
        top: fullscreenIndex * window.innerHeight,
        behavior: 'instant'
      });
      hasInitialScrolled.current = true;
    }
    if (fullscreenIndex === null) {
      hasInitialScrolled.current = false;
    }
  }, [fullscreenIndex]);

  return (
    <div className="min-h-screen bg-[#FFF8F3] pb-20">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/chat')}
            className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-stone-800 tracking-tight">Video Guidance</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Expert Visual Reels</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        
        {/* 2. Search Bar */}
        <div className="max-w-2xl mx-auto w-full relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <input 
            type="text"
            placeholder="Search #hashtags or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-orange-100 rounded-[2rem] pl-16 pr-6 py-5 text-base font-bold text-stone-800 shadow-2xl shadow-orange-100/40 focus:outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all placeholder:text-stone-300"
          />
        </div>

        {/* 3. Categories */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-[1.25rem] whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-xl shadow-orange-200' : 'bg-white text-stone-500 border border-orange-100 hover:border-orange-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredReels.length > 0 ? filteredReels.map((reel, idx) => (
              <motion.div
                key={reel.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer"
                onClick={() => setFullscreenIndex(idx)}
              >
                <div 
                  className="relative aspect-[9/16] bg-stone-100 overflow-hidden"
                  onMouseEnter={() => setPreviewId(reel.id)}
                  onMouseLeave={() => setPreviewId(null)}
                >
                  {previewId === reel.id ? (
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src={reel.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white text-[9px] font-black uppercase tracking-widest">
                      {reel.category}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="text-white font-black text-sm sm:text-base leading-tight mb-2 drop-shadow-md">
                      {reel.title}
                    </h3>
                    <div className="hidden sm:flex flex-wrap gap-1.5">
                      {reel.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] font-black text-white/90 uppercase tracking-widest bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-5 flex items-center justify-between border-t border-orange-50 bg-stone-50/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-stone-400">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black">{reel.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black">{reel.comments}</span>
                    </div>
                  </div>
                  <Share2 className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-orange-200" />
                </div>
                <h3 className="text-xl font-black text-stone-800 mb-2">No matching reels</h3>
                <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-8 text-orange-500 font-black uppercase text-xs tracking-widest underline underline-offset-8">Clear Filters</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 5. Fullscreen Reel View Overlay */}
      <AnimatePresence>
        {fullscreenIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            {/* Close Button */}
            <button 
              onClick={() => setFullscreenIndex(null)}
              className="absolute top-8 left-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Mute Toggle */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-8 right-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            {/* Scrollable Container for Reels */}
            <div 
              ref={fullscreenContainerRef}
              onScroll={handleFullscreenScroll}
              className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            >
              {filteredReels.map((reel, index) => (
                <div key={reel.id} className="h-full w-full snap-start relative flex items-center justify-center">
                  <video 
                    autoPlay={index === fullscreenIndex}
                    loop 
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover md:w-auto md:aspect-[9/16] shadow-2xl"
                    poster={reel.thumbnail}
                  >
                    <source src={reel.videoUrl} type="video/mp4" />
                  </video>

                  {/* UI Overlays on Video */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  <div className="absolute bottom-12 left-6 right-20 pointer-events-none">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                        {reel.category}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-black uppercase tracking-widest">
                        <Award className="w-4 h-4 text-orange-400" />
                        Mumaa Verified
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-4">
                      {reel.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {reel.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-black text-white/90 uppercase tracking-widest px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vertical Interaction Sidebar */}
                  <div className="absolute right-6 bottom-32 flex flex-col gap-6 items-center z-30">
                    <button className="flex flex-col items-center gap-1.5 group pointer-events-auto">
                      <div className="w-14 h-14 rounded-[1.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 group-hover:bg-rose-500 group-hover:border-rose-500 transition-all shadow-xl">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{reel.likes}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 group pointer-events-auto">
                      <div className="w-14 h-14 rounded-[1.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all shadow-xl">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{reel.comments}</span>
                    </button>
                    <button className="w-14 h-14 rounded-[1.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl pointer-events-auto">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: index === fullscreenIndex ? '100%' : '0%' }}
                      transition={{ duration: index === fullscreenIndex ? 30 : 0, ease: "linear" }}
                      className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                    />
                  </div>

                  {/* Swipe Indicator */}
                  {index === fullscreenIndex && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                      <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Swipe Up</span>
                      <ChevronDown className="w-4 h-4 text-white animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
