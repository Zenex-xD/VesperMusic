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

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 40;
  const isLoading = isBuffering || isResolvingPlayback;

  return (
    <div
      id="mobile-mini-player"
      className="md:hidden fixed bottom-[calc(env(safe-area-inset-bottom,0px)+64px)] left-3 right-3 z-40"
      onClick={() => setIsFullScreenOpen(true)}
    >
      <div className="relative rounded-2xl bg-[#121217]/95 backdrop-blur-xl border border-white/[0.08] p-2.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] transition-all">
        {/* Left: Expand Chevron & Cover Art */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            title="Expand Full Screen"
            className="text-zinc-400 hover:text-white p-1 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreenOpen(true);
            }}
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-black border border-white/10">
            <img
              src={currentSong.artwork}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">
                {currentSong.title}
              </h4>
              {playbackError && (
                <span className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-medium border border-amber-500/30">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Unavailable
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate mt-0.5">
              {currentSong.artist}
            </p>
            {/* Progress Bar directly underneath title & artist */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Play/Pause/Retry & Queue List */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {playbackError ? (
            <button
              id="mobile-retry-btn"
              title="Retry Playback"
              onClick={retryPlayback}
              className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center transition-transform active:scale-90"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="mobile-play-toggle-btn"
              title={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform active:scale-90 relative"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-black animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          )}

          <button
            id="mobile-queue-btn"
            title="Queue"
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

