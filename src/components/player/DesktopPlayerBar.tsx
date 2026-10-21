import React, { useState } from 'react';
import {
  Heart,
  Maximize2,
  Mic2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Loader2,
  AlertCircle,
  RotateCcw,
  FolderPlus,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { formatDuration, formatRemaining } from '../../utils/formatters';

export const DesktopPlayerBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isBuffering,
    isResolvingPlayback,
    playbackError,
    retryPlayback,
    repeatMode,
    isShuffle,
    isLyricsOpen,
    isQueueOpen,
    audioFrequencyData,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsFullScreenOpen,
    setIsLyricsOpen,
    setIsQueueOpen,
    openModal,
  } = useMusicPlayer();

  const { isFavorite, toggleFavorite } = useAuthAndStorage();
  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState(0);

  if (!currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLoading = isBuffering || isResolvingPlayback;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seek(newTime);
  };

  const handleSeekMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverSeekTime(pos * duration);
  };

  return (
    <div
      id="desktop-player-bar"
      className="hidden md:flex fixed bottom-0 left-0 right-0 h-20 z-40 bg-[#0c0c0f]/95 backdrop-blur-md border-t border-white/[0.08] px-6 items-center justify-between select-none"
    >
      {/* Left Column: Track Artwork & Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[220px]">
        {/* Ultra-lightweight Audio Visualizer Badge (Zero image payload) */}
        <div
          className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#1c1815] to-[#12100e] border border-orange-500/20 flex-shrink-0 cursor-pointer group flex items-center justify-center shadow-sm hover:border-orange-500/50 transition-colors"
          onClick={() => setIsFullScreenOpen(true)}
          title="Open Player Stage"
        >
          {isPlaying ? (
            <div className="flex items-end justify-center gap-[3px] h-5 w-6">
              <span className="w-1 bg-[#ea580c] rounded-full animate-soundbar-1" />
              <span className="w-1 bg-[#f97316] rounded-full animate-soundbar-2" />
              <span className="w-1 bg-[#fdba74] rounded-full animate-soundbar-3" />
              <span className="w-1 bg-[#ea580c] rounded-full animate-soundbar-4" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-orange-500/40 flex items-center justify-center text-orange-400">
              <span className="text-[10px] font-bold tracking-tighter">
                {currentSong.title.charAt(0).toUpperCase() || '♪'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs sm:text-sm font-medium text-zinc-100 hover:text-[#ea580c] transition-colors cursor-pointer truncate"
              onClick={() => setIsFullScreenOpen(true)}
            >
              {currentSong.title}
            </span>
            {playbackError ? (
              <button
                onClick={retryPlayback}
                className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                title="Retry playback"
              >
                <AlertCircle className="w-2.5 h-2.5" />
                Retry
              </button>
            ) : currentSong.isLossless ? (
              <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-orange-500/15 text-orange-300 tracking-wider">
                LOSSLESS
              </span>
            ) : null}
          </div>
          <span className="text-xs text-zinc-400 truncate mt-0.5 hover:text-zinc-200 transition-colors">
            {currentSong.artist}
          </span>
        </div>

        <button
          id="player-favorite-btn"
          title="Favorite"
          onClick={() => toggleFavorite(currentSong.id)}
          className={`p-1.5 rounded-full hover:bg-white/[0.06] transition-colors ml-1 ${
            favorited ? 'text-[#ea580c]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-[#ea580c]' : ''}`} />
        </button>

        <button
          id="player-playlist-btn"
          title="Save to Playlist"
          onClick={() => openModal('playlist', currentSong)}
          className="p-1.5 rounded-full hover:bg-white/[0.06] transition-colors text-zinc-400 hover:text-zinc-200"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Center Column: Playback Controls & Timeline Scrubber */}
      <div className="flex flex-col items-center max-w-xl w-2/4 px-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-4 mb-1">
          {/* Shuffle */}
          <button
            id="player-shuffle-btn"
            title="Shuffle"
            onClick={toggleShuffle}
            className={`p-1.5 rounded-md hover:bg-white/[0.06] transition-colors ${
              isShuffle ? 'text-[#ea580c]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            id="player-prev-btn"
            title="Previous"
            onClick={previous}
            className="p-1.5 rounded-full hover:bg-white/[0.06] text-zinc-300 hover:text-white transition-transform active:scale-95"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Play / Pause Hero Button */}
          {playbackError ? (
            <button
              id="player-play-toggle-btn"
              title="Retry Playback"
              onClick={retryPlayback}
              className="w-10 h-10 rounded-full bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="player-play-toggle-btn"
              title={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-b from-[#ff7a50] to-[#ea580c] text-white flex items-center justify-center transition-transform active:scale-95 shadow-[0_6px_18px_rgba(234,88,12,0.45)] hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-white text-white" />
              ) : (
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              )}
            </button>
          )}

          {/* Next */}
          <button
            id="player-next-btn"
            title="Next"
            onClick={next}
            className="p-1.5 rounded-full hover:bg-white/[0.06] text-zinc-300 hover:text-white transition-transform active:scale-95"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Repeat */}
          <button
            id="player-repeat-btn"
            title={`Repeat: ${repeatMode}`}
            onClick={toggleRepeat}
            className={`p-1.5 rounded-md hover:bg-white/[0.06] transition-colors ${
              repeatMode !== 'off' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="w-full flex items-center gap-2.5 text-[11px] text-zinc-400 font-mono tabular-nums select-none">
          <span className="w-9 text-right">{formatDuration(currentTime)}</span>

          <div
            className="relative flex-1 py-1.5 cursor-pointer group flex items-center"
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
            onMouseMove={handleSeekMouseMove}
          >
            {/* Background track */}
            <div className="w-full h-1 group-hover:h-1.5 bg-white/[0.12] rounded-full overflow-hidden transition-all">
              <div
                className="h-full bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Slider thumb */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-[#ea580c] ring-2 ring-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-x-1/2 shadow-sm"
              style={{ left: `${progressPercent}%` }}
            />

            {/* Hover tooltip */}
            {isHoveringSeek && (
              <div
                className="absolute -top-6 px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-white border border-white/10 shadow pointer-events-none -translate-x-1/2"
                style={{ left: `${(hoverSeekTime / duration) * 100}%` }}
              >
                {formatDuration(hoverSeekTime)}
              </div>
            )}

            <input
              type="range"
              min={0}
              max={100}
              value={isNaN(progressPercent) ? 0 : progressPercent}
              onChange={handleSeekChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <span className="w-9 text-left">{formatRemaining(currentTime, duration)}</span>
        </div>
      </div>

      {/* Right Column: EQ, Lyrics, Queue, Volume, Fullscreen */}
      <div className="flex items-center justify-end gap-2 w-1/4 min-w-[220px]">
        {/* Subtle EQ Visualizer */}
        <div className="hidden lg:flex items-end gap-0.5 h-3 px-1 mr-1">
          <span
            className="w-0.5 bg-purple-400/80 rounded-full transition-all duration-150"
            style={{ height: isPlaying ? `${Math.max(3, audioFrequencyData * 12)}px` : '3px' }}
          />
          <span
            className="w-0.5 bg-indigo-400/80 rounded-full transition-all duration-150"
            style={{ height: isPlaying ? `${Math.max(3, (1 - audioFrequencyData * 0.7) * 11)}px` : '5px' }}
          />
          <span
            className="w-0.5 bg-pink-400/80 rounded-full transition-all duration-150"
            style={{ height: isPlaying ? `${Math.max(3, audioFrequencyData * 14)}px` : '3px' }}
          />
        </div>

        {/* Lyrics Button */}
        <button
          id="player-lyrics-btn"
          title="Synced Lyrics (L)"
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-1.5 rounded-md transition-colors ${
            isLyricsOpen
              ? 'bg-white/[0.1] text-purple-300'
              : 'hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Button */}
        <button
          id="player-queue-btn"
          title="Queue (Q)"
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-1.5 rounded-md transition-colors ${
            isQueueOpen
              ? 'bg-white/[0.1] text-purple-300'
              : 'hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-1.5">
          <button
            id="player-mute-btn"
            title="Mute (M)"
            onClick={toggleMute}
            className="p-1 rounded-full hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="w-16 sm:w-20 relative py-1.5 flex items-center">
            <div className="w-full h-1 bg-white/[0.12] rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-300 hover:bg-purple-400 rounded-full"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>

        {/* Fullscreen Expand Button */}
        <button
          id="player-fullscreen-btn"
          title="Full Screen Player (F)"
          onClick={() => setIsFullScreenOpen(true)}
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
