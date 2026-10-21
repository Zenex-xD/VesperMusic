import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Heart,
  Mic2,
  MoreVertical,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  ListPlus,
  Plus,
  Loader2,
  AlertCircle,
  RotateCcw,
  Cast,
  ListMusic,
  FolderPlus,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { formatDuration, formatRemaining } from '../../utils/formatters';
import { GlassmorphicPlayerCard } from './GlassmorphicPlayerCard';

export const FullScreenPlayerModal: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    isResolvingPlayback,
    playbackError,
    retryPlayback,
    repeatMode,
    isShuffle,
    isFullScreenOpen,
    lyricsData,
    currentLyricIndex,
    isLyricsLoading,
    audioFrequencyData,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
    setIsFullScreenOpen,
    setIsLyricsOpen,
    setIsQueueOpen,
    openModal,
    addToQueue,
  } = useMusicPlayer();

  const { isFavorite, toggleFavorite } = useAuthAndStorage();
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics'>('player');
  const [showOptions, setShowOptions] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll lyrics container
  useEffect(() => {
    if (activeTab === 'lyrics' && currentLyricIndex >= 0 && lyricsContainerRef.current) {
      const activeEl = document.getElementById(`lyric-line-${currentLyricIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIndex, activeTab]);

  if (!isFullScreenOpen || !currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seek(newTime);
  };

  return (
    <div
      id="fullscreen-player-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0807] text-zinc-100 flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Warm Ambient Backdrop matching reference screenshot */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a1a0d]/35 via-[#130f0d]/50 to-[#070605] pointer-events-none" />

      {/* Atmospheric center aura to naturally illuminate and blend the frosted glass card */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-full h-[320px] bg-gradient-to-b from-[#ea580c]/12 via-[#f97316]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Atmospheric Amber Ribbon Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-44 opacity-40 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 240" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,160 C300,80 600,240 900,120 C1050,60 1150,150 1200,180 L1200,240 L0,240 Z"
            fill="url(#amberWaveGrad)"
            opacity="0.6"
          />
          <path
            d="M0,200 C350,130 700,260 1000,160 C1100,130 1180,180 1200,200 L1200,240 L0,240 Z"
            fill="url(#amberWaveGrad2)"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="amberWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9a3412" stopOpacity="0" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="amberWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c2d12" stopOpacity="0" />
              <stop offset="40%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Navigation Header */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 pt-5 pb-2 flex items-center justify-between">
        <button
          id="fullscreen-close-btn"
          title="Minimize"
          onClick={() => setIsFullScreenOpen(false)}
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-zinc-400 hover:text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold text-zinc-400 tracking-wide truncate max-w-[240px]">
            {activeTab === 'lyrics' ? 'Synchronized Lyrics' : currentSong.album || currentSong.artist}
          </span>
        </div>

        <div className="relative">
          <button
            id="fullscreen-menu-btn"
            title="Options"
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-zinc-400 hover:text-white"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white/95 dark:bg-[#1a1715]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl p-1.5 z-50 text-xs text-[#1c1917] dark:text-zinc-200 space-y-0.5">
                <button
                  onClick={() => {
                    openModal('playlist', currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-left transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#ea580c]" />
                  Add to Playlist
                </button>
                <button
                  onClick={() => {
                    addToQueue(currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-left transition-colors"
                >
                  <ListPlus className="w-4 h-4 text-[#ea580c]" />
                  Add to Queue
                </button>
                <button
                  onClick={() => {
                    openModal('share', currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-left transition-colors"
                >
                  <Share2 className="w-4 h-4 text-[#78716c]" />
                  Share Track Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-2xl sm:max-w-3xl w-full mx-auto px-4 py-4 sm:py-6">
        {activeTab === 'player' ? (
          <div className="w-full flex flex-col items-center justify-center my-auto py-2">
            {/* Same-To-Same Neumorphic Glass Player Card with bottom controls and Lyric - Moon - Queue trio */}
            <GlassmorphicPlayerCard
              onOpenLyrics={() => setActiveTab('lyrics')}
              onOpenQueue={() => setIsQueueOpen(true)}
            />
          </div>
        ) : (
          /* Synchronized Lyrics Screen */
          <div className="w-full flex-1 flex flex-col justify-between py-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                {lyricsData?.source || 'Synchronized Lyrics'}
              </span>
              <button
                onClick={() => setActiveTab('player')}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Close Lyrics
              </button>
            </div>

            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto my-4 py-8 space-y-7 text-center no-scrollbar"
            >
              {isLyricsLoading ? (
                <div className="py-24 text-zinc-500 animate-pulse text-sm">
                  Fetching lyrics...
                </div>
              ) : lyricsData?.lines && lyricsData.lines.length > 0 ? (
                lyricsData.lines.map((line, idx) => {
                  const isActive = idx === currentLyricIndex;
                  return (
                    <p
                      key={idx}
                      id={`lyric-line-${idx}`}
                      onClick={() => seek(line.time)}
                      className={`cursor-pointer transition-all duration-200 select-none ${
                        isActive
                          ? 'text-xl sm:text-2xl font-bold text-white scale-105'
                          : 'text-sm sm:text-base font-medium text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {line.text}
                    </p>
                  );
                })
              ) : (
                <div className="py-24 text-center">
                  <p className="text-sm font-medium text-zinc-400">
                    Synchronized lyrics unavailable for this track
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#181820] to-[#0f0f14] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <div className="flex items-end justify-center gap-[2px] h-3.5 w-4">
                    <span className="w-0.5 bg-purple-400 rounded-full animate-soundbar-1" />
                    <span className="w-0.5 bg-indigo-300 rounded-full animate-soundbar-2" />
                    <span className="w-0.5 bg-violet-400 rounded-full animate-soundbar-3" />
                  </div>
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate">{currentSong.title}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{currentSong.artist}</p>
                </div>
              </div>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center ml-2 flex-shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
