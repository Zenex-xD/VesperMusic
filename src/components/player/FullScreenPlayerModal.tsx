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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0c] text-zinc-100 flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Navigation Header */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 pt-5 pb-2 flex items-center justify-between">
        <button
          id="fullscreen-close-btn"
          title="Minimize"
          onClick={() => setIsFullScreenOpen(false)}
          className="p-2 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all text-zinc-400 hover:text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
            {activeTab === 'lyrics' ? 'Synchronized Lyrics' : 'Now Playing'}
          </span>
          <span className="text-xs text-zinc-300 font-medium truncate max-w-[200px] mt-0.5">
            {currentSong.album || currentSong.artist}
          </span>
        </div>

        <div className="relative">
          <button
            id="fullscreen-menu-btn"
            title="Options"
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-white/[0.08] active:scale-95 transition-all text-zinc-400 hover:text-white"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#141418] border border-white/10 shadow-2xl p-1.5 z-50 text-xs text-zinc-200 space-y-0.5">
                <button
                  onClick={() => {
                    openModal('playlist', currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                >
                  <Plus className="w-4 h-4 text-purple-400" />
                  Add to Playlist
                </button>
                <button
                  onClick={() => {
                    addToQueue(currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                >
                  <ListPlus className="w-4 h-4 text-indigo-400" />
                  Add to Queue
                </button>
                <button
                  onClick={() => {
                    openModal('share', currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                >
                  <Share2 className="w-4 h-4 text-zinc-400" />
                  Share Track Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md w-full mx-auto px-6 py-2">
        {activeTab === 'player' ? (
          <>
            {/* Ultra-lightweight Zero-Image Hi-Fi Audio Stage */}
            <div className="relative my-auto flex flex-col items-center justify-center py-2 sm:py-4">
              {/* Spinning Vinyl Turntable Disc (Pure SVG/CSS - zero network payload) */}
              <div className="relative aspect-square w-full max-w-[270px] sm:max-w-[320px] rounded-full shadow-2xl bg-[#0e0e12] border-2 border-white/[0.08] flex items-center justify-center select-none overflow-hidden group">
                <div
                  className={`absolute inset-0 rounded-full flex items-center justify-center transition-all ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                  style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                >
                  {/* Concentric Audiophile Grooves */}
                  <div className="absolute inset-3 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-7 rounded-full border border-white/[0.03]" />
                  <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
                  <div className="absolute inset-16 rounded-full border border-white/[0.03]" />
                  <div className="absolute inset-20 rounded-full border border-white/[0.04]" />

                  {/* Surface Light Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                  {/* Center Vinyl Core */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-900/60 via-zinc-900 to-indigo-950/60 border border-purple-500/30 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                    <span className="text-[9px] font-mono tracking-widest text-purple-400 font-semibold uppercase">
                      AeroX Hi-Fi
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[90px] mt-0.5">
                      {currentSong.title}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                      <span className="text-[9px] font-mono text-zinc-400">FLAC/HD</span>
                    </div>

                    {/* Center Spindle Hole */}
                    <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/20 mt-1.5 shadow-inner flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Soundwave Spectrum Bars beneath vinyl */}
              <div className="w-full max-w-[270px] sm:max-w-[320px] mt-5 flex items-end justify-between h-9 px-4 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                {Array.from({ length: 24 }).map((_, i) => {
                  const seed = (Math.sin(i * 0.7 + currentTime * 4) + 1) / 2;
                  const activeHeight = isPlaying
                    ? Math.max(15, Math.min(100, (seed * 0.6 + audioFrequencyData * 0.4) * 100))
                    : 15;
                  return (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        i % 3 === 0
                          ? 'bg-purple-400/80'
                          : i % 2 === 0
                          ? 'bg-indigo-400/70'
                          : 'bg-violet-300/60'
                      }`}
                      style={{ height: `${activeHeight}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Song Info (Title, Artist, Heart, Badges) */}
            <div className="w-full mt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                    {currentSong.title}
                  </h2>
                  <p className="text-sm text-zinc-400 font-medium truncate mt-0.5">
                    {currentSong.artist}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-400 tracking-wider">
                      LOSSLESS
                    </span>
                    {currentSong.album && (
                      <span className="text-[10px] text-zinc-400 truncate max-w-[180px]">
                        {currentSong.album}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    id="fullscreen-playlist-btn"
                    title="Save to Playlist"
                    onClick={() => openModal('playlist', currentSong)}
                    className="p-2.5 rounded-full hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <FolderPlus className="w-5 h-5" />
                  </button>

                  <button
                    id="fullscreen-fav-btn"
                    title="Favorite"
                    onClick={() => toggleFavorite(currentSong.id)}
                    className={`p-2.5 rounded-full hover:bg-white/[0.06] transition-colors ${
                      favorited ? 'text-pink-500' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorited ? 'fill-pink-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Playback Error Warning Banner if unverified */}
              {playbackError && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs text-amber-200 font-medium truncate">Playback source unavailable</span>
                  </div>
                  <button
                    onClick={retryPlayback}
                    className="px-2.5 py-1 rounded bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 active:scale-95 transition-all flex-shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Seek Bar & Timestamps */}
            <div className="w-full mt-4">
              <div className="relative py-2 group cursor-pointer flex items-center">
                <div className="w-full h-1 bg-white/[0.12] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-200 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isNaN(progressPercent) ? 0 : progressPercent}
                  onChange={handleSeekChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono tabular-nums">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatRemaining(currentTime, duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="w-full flex items-center justify-between px-2 mt-4 mb-2">
              <button
                id="fullscreen-shuffle-btn"
                title="Shuffle"
                onClick={toggleShuffle}
                className={`p-2.5 rounded-full hover:bg-white/[0.06] transition-colors ${
                  isShuffle ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                id="fullscreen-prev-btn"
                title="Previous"
                onClick={previous}
                className="p-2.5 rounded-full hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-transform active:scale-95"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              {/* Large Play/Pause */}
              {playbackError ? (
                <button
                  id="fullscreen-play-btn"
                  title="Retry Playback"
                  onClick={retryPlayback}
                  className="w-14 h-14 rounded-full bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              ) : (
                <button
                  id="fullscreen-play-btn"
                  title={isPlaying ? 'Pause' : 'Play'}
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white text-black hover:bg-zinc-200 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  {isBuffering || isResolvingPlayback ? (
                    <Loader2 className="w-6 h-6 text-black animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              )}

              <button
                id="fullscreen-next-btn"
                title="Next"
                onClick={next}
                className="p-2.5 rounded-full hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-transform active:scale-95"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>

              <button
                id="fullscreen-repeat-btn"
                title={`Repeat: ${repeatMode}`}
                onClick={toggleRepeat}
                className={`p-2.5 rounded-full hover:bg-white/[0.06] transition-colors ${
                  repeatMode !== 'off' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-5 h-5" />
                ) : (
                  <Repeat className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Bottom Row: Lyrics, AirPlay, Queue */}
            <div className="w-full flex items-center justify-between px-4 pt-3 pb-1 border-t border-white/[0.06] mt-2">
              <button
                id="fullscreen-lyrics-bottom-btn"
                title="Synchronized Lyrics"
                onClick={() => setActiveTab('lyrics')}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Mic2 className="w-4 h-4" />
                <span className="text-xs font-medium">Lyrics</span>
              </button>

              <button
                id="fullscreen-cast-btn"
                title="AirPlay / Speaker"
                onClick={() => {}}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
              >
                <Cast className="w-4 h-4" />
              </button>

              <button
                id="fullscreen-queue-bottom-btn"
                title="Playing Next / Queue"
                onClick={() => setIsQueueOpen(true)}
                className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ListMusic className="w-4 h-4" />
                <span className="text-xs font-medium">Queue</span>
              </button>
            </div>
          </>
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
