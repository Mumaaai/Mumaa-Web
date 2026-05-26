import { useState, useEffect, useRef } from 'react';
import { 
  Moon, Music, Volume2, VolumeX, Play, Pause, 
  SkipForward, SkipBack, RotateCcw, Disc 
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  desc: string;
  lang: 'hindi' | 'english';
  coverImage: string;
  audioUrl: string;
}

const TRACKS: Track[] = [
  {
    id: "chanda_mama",
    title: "Chanda Mama Door Ke",
    desc: "Timeless Indian Bedtime Classic",
    lang: "hindi",
    coverImage: "/images/indian_lullaby_album.png",
    audioUrl: "https://cdn.musicgpt.com/conversions/web/standard/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17.mp3"
  },
  {
    id: "lalla_lori",
    title: "Lalla Lalla Lori",
    desc: "Traditional Indian Night Melody",
    lang: "hindi",
    coverImage: "/images/indian_lullaby_album.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "surmai",
    title: "Surmai Akhiyon Mein",
    desc: "Calming Indian Sleep Rhyme",
    lang: "hindi",
    coverImage: "/images/indian_lullaby_album.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "brahms",
    title: "Brahms Lullaby",
    desc: "Classical Sleep Masterpiece",
    lang: "english",
    coverImage: "/images/western_sleep_album.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    desc: "Piano Nursery Instrumental",
    lang: "english",
    coverImage: "/images/western_sleep_album.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "sweet_dreams",
    title: "Sweet Dreams Little One",
    desc: "Warm & Gentle Western Rhyme",
    lang: "english",
    coverImage: "/images/western_sleep_album.png",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function LullabyView() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'hindi' | 'english'>('all');
  
  // Audio playback state
  const [currentTrack, setCurrentTrack] = useState<Track | null>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up and stop playing audio completely
  const cleanupAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.ontimeupdate = null;
        audioRef.current.ondurationchange = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        
        audioRef.current.src = "";
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      } catch (e) {
        console.error("Audio cleanup error:", e);
      }
      audioRef.current = null;
    }
  };

  // Sync volume level to current audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Clean up audio instance on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const handleTrackSelect = (track: Track) => {
    cleanupAudio();

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);

    const audio = new Audio(track.audioUrl);
    audio.volume = isMuted ? 0 : volume;
    audio.loop = isRepeating;
    audioRef.current = audio;

    // Track status and progression
    audio.ontimeupdate = () => {
      if (audioRef.current === audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.ondurationchange = () => {
      if (audioRef.current === audio && audio.duration) {
        setDuration(audio.duration);
      }
    };

    audio.onended = () => {
      if (audioRef.current === audio) {
        if (isRepeating) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          handleNext();
        }
      }
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        console.warn("Audio load failed. Fetching fallback cdn track...");
        audio.src = "https://cdn.musicgpt.com/conversions/web/standard/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17.mp3";
        audio.play().catch(e => console.error(e));
      }
    };

    audio.play().catch(err => {
      console.warn("Playback blocked. Loading fallback stream...", err);
      if (audioRef.current === audio) {
        audio.src = "https://cdn.musicgpt.com/conversions/web/standard/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17.mp3";
        audio.play().catch(e => console.error(e));
      }
    });
  };

  const handleTogglePlay = () => {
    if (!currentTrack) return;

    if (!audioRef.current) {
      handleTrackSelect(currentTrack);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Play error, falling back...", err);
        if (audioRef.current) {
          audioRef.current.src = "https://cdn.musicgpt.com/conversions/web/standard/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17/f0dc4fe6-c5e3-46cc-9280-1e31bd458b17.mp3";
          audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
        }
      });
    }
  };

  // Filtered tracks list
  const filteredTracks = TRACKS.filter(track => {
    if (activeFilter === 'all') return true;
    return track.lang === activeFilter;
  });

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % filteredTracks.length;
      handleTrackSelect(filteredTracks[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + filteredTracks.length) % filteredTracks.length;
      handleTrackSelect(filteredTracks[prevIndex]);
    }
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleRepeat = () => {
    const nextRepeat = !isRepeating;
    setIsRepeating(nextRepeat);
    if (audioRef.current) {
      audioRef.current.loop = nextRepeat;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="h-full overflow-y-auto chat-scroll p-4 md:p-8 bg-[#FFFDFB] pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Modern Pill Headers */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-stone-100">
          <span className="text-xs font-extrabold text-stone-400 uppercase tracking-widest mr-2">Filters:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeFilter === 'all' 
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('hindi')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeFilter === 'hindi' 
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            Hindi Lullabies
          </button>
          <button
            onClick={() => setActiveFilter('english')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              activeFilter === 'english' 
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            English Lullabies
          </button>
        </div>

        {/* Listen Again / Grid of Square Track Cards */}
        <div>
          <h2 className="text-xl font-extrabold text-stone-850 tracking-tight mb-6">Featured Tracks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {filteredTracks.map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <div key={track.id} className="space-y-3">
                  <button
                    onClick={() => handleTrackSelect(track)}
                    className="w-full aspect-square rounded-[2rem] overflow-hidden border border-stone-150 bg-stone-50 shadow-sm hover:shadow-md transition-all duration-300 relative group text-left"
                  >
                    <img 
                      src={track.coverImage} 
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Play Overlay indicator */}
                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="w-12 h-12 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-lg transition-transform active:scale-90">
                        {isActive && isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="px-1">
                    <h3 className={`font-extrabold text-sm truncate transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-stone-850'
                    }`}>
                      {track.title}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-bold mt-0.5 uppercase tracking-wide">
                      {track.lang === 'hindi' ? 'Hindi' : 'English'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* YouTube Music Styled Dark Player Controls Footer */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-[#0F0F0F] text-white border-t border-[#1F1F1F] px-4 py-4 md:px-8 shadow-2xl z-40">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left Section: Playing track details */}
            <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
              <img 
                src={currentTrack.coverImage} 
                alt="cover" 
                className="w-11 h-11 object-cover rounded-md border border-stone-800 shrink-0"
              />
              <div className="text-left min-w-0">
                <h4 className="font-extrabold text-white text-xs truncate">{currentTrack.title}</h4>
                <p className="text-[10px] text-stone-400 font-bold truncate mt-0.5">
                  {currentTrack.lang === 'hindi' ? 'Hindi Lullaby' : 'English Lullaby'}
                </p>
              </div>
            </div>

            {/* Center Section: Primary Playback controls */}
            <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
              
              {/* Playback Buttons */}
              <div className="flex items-center gap-5">
                <button
                  onClick={handlePrev}
                  className="p-1 rounded-full text-stone-400 hover:text-white transition-colors active:scale-90"
                  title="Previous"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className="w-9 h-9 rounded-full bg-white text-stone-900 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="p-1 rounded-full text-stone-400 hover:text-white transition-colors active:scale-90"
                  title="Next"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={handleToggleRepeat}
                  className={`p-1 rounded-full transition-colors active:scale-90 ${
                    isRepeating ? 'text-indigo-400' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Repeat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Seek Bar */}
              <div className="flex items-center gap-2.5 w-full">
                <span className="text-[10px] text-stone-400 font-bold select-none min-w-[30px] text-right">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleProgressBarChange}
                  className="flex-1 h-1 rounded-full bg-stone-800 appearance-none outline-none accent-indigo-500 cursor-pointer overflow-hidden"
                />

                <span className="text-[10px] text-stone-400 font-bold select-none min-w-[30px]">
                  {formatTime(duration)}
                </span>
              </div>

            </div>

            {/* Right Section: Volume setting */}
            <div className="flex items-center justify-end gap-2.5 w-full md:w-1/4">
              <button
                onClick={handleToggleMute}
                className="p-1 rounded-full text-stone-455 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1 bg-stone-850 rounded-full appearance-none outline-none accent-indigo-500 cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
