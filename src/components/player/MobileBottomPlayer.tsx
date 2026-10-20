import React from 'react';
import { Play, Pause, ChevronUp, ListMusic, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export const MobileBottomPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    isResolvingPlayback,
    playbackError,
    retryPlayback,
    togglePlay,
    setIsFullScreenOpen,
    setIsQueueOpen,
    isQueueOpen,
  } = useMusicPlayer();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const isLoading = isBuffering || isResolvingPlayback;

  return (
    <div
      id="mobile-mini-player"
      className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+58px)] left-2 right-2 z-40"
      onClick={() => setIsFullScreenOpen(true)}
    >
      <div className="relative rounded-xl bg-[#141418]/95 backdrop-blur-md border border-white/[0.08] p-2 shadow-xl flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition-all overflow-hidden">
        {/* Left: Lightweight Audio Indicator + Title + Artist */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#181820] to-[#0f0f14] border border-white/[0.08] flex items-center justify-center shadow-inner">
            {isPlaying ? (
              <div className="flex items-end justify-center gap-[2px] h-4 w-5">
                <span className="w-0.5 bg-purple-400 rounded-full animate-soundbar-1" />
                <span className="w-0.5 bg-indigo-300 rounded-full animate-soundbar-2" />
                <span className="w-0.5 bg-violet-400 rounded-full animate-soundbar-3" />
                <span className="w-0.5 bg-purple-500 rounded-full animate-soundbar-4" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-purple-400/30 flex items-center justify-center text-purple-300">
                <span className="text-[9px] font-bold">
                  {currentSong.title.charAt(0).toUpperCase() || '♪'}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="text-xs font-semibold text-white truncate">
                {currentSong.title}
              </h4>
              {playbackError && (
                <span className="flex-shrink-0 text-[10px] text-amber-300 font-medium">
                  Unavailable
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Right: Play/Pause/Retry & Queue */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {playbackError ? (
            <button
              id="mobile-retry-btn"
              title="Retry Playback"
              onClick={retryPlayback}
              className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center transition-transform active:scale-90"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="mobile-play-toggle-btn"
              title={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow transition-transform active:scale-90"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
          )}

          <button
            id="mobile-queue-btn"
            title="Queue"
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar directly along the bottom of the card */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.08]">
          <div
            className="h-full bg-purple-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
