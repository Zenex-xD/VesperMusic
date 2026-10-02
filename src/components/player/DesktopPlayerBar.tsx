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
  Sparkles,
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
      className="hidden md:flex fixed bottom-0 left-0 right-0 h-24 z-40 bg-black border-t border-white/[0.08] px-6 items-center justify-between shadow-2xl"
    >
      {/* Left Column: Track Artwork & Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[220px]">
        <div
          className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-black/50 bg-black flex-shrink-0 cursor-pointer group"
          onClick={() => setIsFullScreenOpen(true)}
        >
          <img
            src={currentSong.artwork}
            alt={currentSong.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="w-4 h-4 text-white drop-shadow" />
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold text-zinc-100 hover:text-purple-300 transition-colors cursor-pointer truncate"
              onClick={() => setIsFullScreenOpen(true)}
            >
              {currentSong.title}
            </span>
            {playbackError ? (
              <button
                onClick={retryPlayback}
                className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 tracking-wider hover:bg-amber-500/30 transition-colors"
                title="Click to retry resolution"
              >
                <AlertCircle className="w-2.5 h-2.5" />
                UNAVAILABLE • RETRY
              </button>
            ) : currentSong.isLossless ? (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/40 text-purple-300 tracking-wider">
                LOSSLESS
              </span>
            ) : null}
          </div>
          <span className="text-xs text-zinc-400 truncate mt-0.5 hover:text-zinc-200 transition-colors">
            {currentSong.artist}
          </span>
        </div>

        <button
          id="player-playlist-btn"
          title="Save to Playlist"
          onClick={() => openModal('playlist', currentSong)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-purple-300 ml-1"
        >
          <FolderPlus className="w-4 h-4" />
        </button>

        <button
          id="player-favorite-btn"
          title="Favorite"
          onClick={() => toggleFavorite(currentSong.id)}
          className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
            favorited ? 'text-pink-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-pink-500' : ''}`} />
        </button>
      </div>

      {/* Center Column: Controls & Scrub Bar */}
      <div className="flex flex-col items-center max-w-xl w-2/4 px-4">
        {/* Buttons */}
        <div className="flex items-center gap-4 mb-2">
          {/* Shuffle */}
          <button
            id="player-shuffle-btn"
            title="Shuffle"
            onClick={toggleShuffle}
            className={`p-2 rounded-full hover:bg-white/10 transition-all relative ${
              isShuffle ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
            )}
          </button>

          {/* Previous */}
          <button
            id="player-prev-btn"
            title="Previous"
            onClick={previous}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-transform active:scale-95"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause with glowing halo */}
          <div className="relative">
            {isPlaying && (
              <div
                className="absolute inset-0 rounded-full blur-md opacity-70 animate-pulse pointer-events-none"
                style={{
                  backgroundColor: currentSong.color || '#a855f7',
                  transform: `scale(${1 + audioFrequencyData * 0.25})`,
                }}
              />
            )}
            {playbackError ? (
              <button
                id="player-play-toggle-btn"
                title="Retry Playback"
                onClick={retryPlayback}
                className="relative w-11 h-11 rounded-full bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center shadow-xl transition-all duration-200 active:scale-95 hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            ) : (
              <button
                id="player-play-toggle-btn"
                title={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlay}
                className="relative w-11 h-11 rounded-full bg-white text-black hover:bg-zinc-100 flex items-center justify-center shadow-xl shadow-purple-500/20 transition-all duration-200 active:scale-95 hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-black animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            )}
          </div>

          {/* Next */}
          <button
            id="player-next-btn"
            title="Next"
            onClick={next}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-transform active:scale-95"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            id="player-repeat-btn"
            title={`Repeat: ${repeatMode}`}
            onClick={toggleRepeat}
            className={`p-2 rounded-full hover:bg-white/10 transition-all relative ${
              repeatMode !== 'off' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
            )}
          </button>
        </div>

        {/* Progress Bar & Time */}
        <div className="w-full flex items-center gap-3 text-xs text-zinc-400 font-mono select-none">
          <span className="w-10 text-right text-[11px]">{formatDuration(currentTime)}</span>

          <div
            className="relative flex-1 py-2 cursor-pointer group flex items-center"
            onMouseEnter={() => setIsHoveringSeek(true)}
            onMouseLeave={() => setIsHoveringSeek(false)}
            onMouseMove={handleSeekMouseMove}
          >
            {/* Background track */}
            <div className="w-full h-1 bg-white/10 group-hover:h-1.5 rounded-full overflow-hidden transition-all relative">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Slider thumb */}
            <div
              className="absolute w-3 h-3 rounded-full bg-white shadow-md shadow-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-x-1/2"
              style={{ left: `${progressPercent}%` }}
            />

            {/* Hover tooltip */}
            {isHoveringSeek && (
              <div
                className="absolute -top-7 px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-white border border-white/10 shadow-lg pointer-events-none -translate-x-1/2"
                style={{ left: `${(hoverSeekTime / duration) * 100}%` }}
              >
                {formatDuration(hoverSeekTime)}
              </div>
            )}

            {/* Invisible native range input for accessibility */}
            <input
              type="range"
              min={0}
              max={100}
              value={isNaN(progressPercent) ? 0 : progressPercent}
              onChange={handleSeekChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <span className="w-11 text-left text-[11px]">{formatRemaining(currentTime, duration)}</span>
        </div>
      </div>

      {/* Right Column: EQ Visualizer, Lyrics, Queue, Volume, Fullscreen */}
      <div className="flex items-center justify-end gap-2.5 w-1/4 min-w-[220px]">
        {/* Subtle EQ Visualizer */}
        <div className="hidden lg:flex items-end gap-0.5 h-4 px-2 mr-2">
          <span
            className="w-1 bg-purple-400/80 rounded-full transition-all duration-150"
            style={{ height: isPlaying ? `${Math.max(4, audioFrequencyData * 16)}px` : '4px' }}
          />
          <span
            className="w-1 bg-indigo-400/80 rounded-full transition-all duration-150"
            style={{ height: isPlaying ? `${Math.max(4, (1 - audioFrequencyData * 0.7) * 14)}px` : '6px' }}
          />
          <span
            className="w-1 bg-pink-400/80 rounded-full transition-all duration-150"
            style={{ height: isPlaying ? `${Math.max(4, audioFrequencyData * 18)}px` : '3px' }}
          />
        </div>

        {/* Lyrics Button */}
        <button
          id="player-lyrics-btn"
          title="Synced Lyrics (L)"
          onClick={() => setIsLyricsOpen(!isLyricsOpen)}
          className={`p-2 rounded-xl transition-all ${
            isLyricsOpen
              ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue Button */}
        <button
          id="player-queue-btn"
          title="Queue (Q)"
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-xl transition-all ${
            isQueueOpen
              ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-1.5 group/vol">
          <button
            id="player-mute-btn"
            title="Mute (M)"
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="w-20 relative py-2 flex items-center">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>

        {/* Fullscreen Expand Button */}
        <button
          id="player-fullscreen-btn"
          title="Full Screen Player"
          onClick={() => setIsFullScreenOpen(true)}
          className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
