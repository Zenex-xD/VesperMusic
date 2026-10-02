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
  Disc3,
  Sparkles,
  Tv,
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

const clientArtworkCache = new Map<string, string>();

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
    isLyricsOpen,
    isQueueOpen,
    lyricsData,
    currentLyricIndex,
    isLyricsLoading,
    audioFrequencyData,
    playbackEngine,
    isVideoMode,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
    setIsFullScreenOpen,
    setIsLyricsOpen,
    setIsQueueOpen,
    setIsVideoMode,
    playSong,
    openModal,
    addToQueue,
  } = useMusicPlayer();

  const { isFavorite, toggleFavorite } = useAuthAndStorage();
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics'>('player');
  const [resolvedArtwork, setResolvedArtwork] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Automatically upgrade YouTube thumbnails to original high-res official album cover
  useEffect(() => {
    if (!currentSong) return;
    const art = currentSong.artwork || '';
    const cleanKey = `${currentSong.title.toLowerCase().trim()}||${currentSong.artist.toLowerCase().trim()}`;

    // Instant local memory cache lookup
    if (clientArtworkCache.has(cleanKey)) {
      setResolvedArtwork(clientArtworkCache.get(cleanKey)!);
      return;
    }

    // If it's already an official Apple Music or Deezer artwork, no resolution needed
    if (art.includes('mzstatic.com') || art.includes('dzcdn.net')) {
      setResolvedArtwork(art);
      clientArtworkCache.set(cleanKey, art);
      return;
    }

    if (art.includes('ytimg.com') || art.includes('hqdefault') || art.includes('mqdefault')) {
      fetch(`/api/artwork/resolve?title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artist)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.artwork) {
            clientArtworkCache.set(cleanKey, data.artwork);
            setResolvedArtwork(data.artwork);
            currentSong.artwork = data.artwork;
          }
        })
        .catch(() => {});
    }
  }, [currentSong?.id, currentSong?.title, currentSong?.artist]);

  const displayArtwork = resolvedArtwork || currentSong?.artwork || '';

  // Auto-scroll lyrics container when active lyric changes
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black text-zinc-100 flex flex-col justify-between select-none animate-in fade-in zoom-in-95 duration-300"
    >
      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 pt-5 pb-3 flex items-center justify-between">
        <button
          id="fullscreen-close-btn"
          title="Minimize"
          onClick={() => setIsFullScreenOpen(false)}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-zinc-300 hover:text-white"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400">
            {activeTab === 'lyrics' ? 'Synchronized Lyrics' : 'Playing Now'}
          </span>
          <span className="text-xs text-purple-300 font-medium truncate max-w-[200px] mt-0.5">
            {currentSong.album || currentSong.artist}
          </span>
        </div>

        <div className="relative">
          <button
            id="fullscreen-menu-btn"
            title="Options"
            onClick={() => setShowOptions(!showOptions)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-zinc-300 hover:text-white"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-2 z-50 text-xs text-zinc-200 space-y-1">
                <button
                  onClick={() => {
                    openModal('playlist', currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors"
                >
                  <Plus className="w-4 h-4 text-purple-400" />
                  Add to Playlist
                </button>
                <button
                  onClick={() => {
                    addToQueue(currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors"
                >
                  <ListPlus className="w-4 h-4 text-indigo-400" />
                  Add to Queue
                </button>
                <button
                  onClick={() => {
                    openModal('share', currentSong);
                    setShowOptions(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors"
                >
                  <Share2 className="w-4 h-4 text-blue-400" />
                  Share Track Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg w-full mx-auto px-6 py-2">
        {activeTab === 'player' ? (
          <>
            {/* Full Artwork with ambient backdrop - Pura dikhe bina kate & Original Cover */}
            <div className="relative my-auto flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] rounded-3xl overflow-hidden shadow-2xl shadow-black/90 bg-[#121217] border border-white/10 flex items-center justify-center group">
                {/* Ambient dynamic blurred background that organically matches the artwork */}
                <img
                  src={displayArtwork}
                  alt=""
                  aria-hidden="true"
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-40 pointer-events-none select-none"
                />
                <div
                  className="absolute inset-0 opacity-30 blur-3xl pointer-events-none transition-opacity duration-1000"
                  style={{ backgroundColor: currentSong.color || '#8b5cf6' }}
                />

                {/* The Full Artwork - object-contain ensures 100% of the image is shown without ANY cropping */}
                <img
                  src={displayArtwork}
                  alt={currentSong.title}
                  loading="eager"
                  decoding="async"
                  className="relative z-10 max-w-full max-h-full w-full h-full object-contain rounded-2xl shadow-lg transition-transform duration-500 select-none"
                />
              </div>
            </div>

            {/* Song Meta (Title, Artist, Heart, Badges) */}
            <div className="w-full mt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white truncate">
                    {currentSong.title}
                  </h2>
                  <p className="text-base text-zinc-400 font-medium truncate mt-1">
                    {currentSong.artist}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 tracking-wider">
                      LOSSLESS
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 tracking-wider">
                      APPLE DIGITAL MASTER
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    id="fullscreen-playlist-btn"
                    title="Save to Playlist"
                    onClick={() => openModal('playlist', currentSong)}
                    className="p-3 rounded-full hover:bg-white/10 text-zinc-400 hover:text-purple-300 transition-transform active:scale-90 flex-shrink-0"
                  >
                    <FolderPlus className="w-6 h-6" />
                  </button>

                  <button
                    id="fullscreen-fav-btn"
                    title="Favorite"
                    onClick={() => toggleFavorite(currentSong.id)}
                    className={`p-3 rounded-full hover:bg-white/10 transition-transform active:scale-90 flex-shrink-0 ${
                      favorited ? 'text-pink-500' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Heart className={`w-7 h-7 ${favorited ? 'fill-pink-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Playback Error Warning Banner if unverified */}
              {playbackError && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs text-amber-200 font-medium truncate">Playback source unavailable for this track</span>
                  </div>
                  <button
                    onClick={retryPlayback}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 active:scale-95 transition-all flex-shrink-0"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Seek Bar & Timestamps */}
            <div className="w-full mt-5">
              <div className="relative py-2 group cursor-pointer flex items-center">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 rounded-full transition-all"
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

              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mt-1">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatRemaining(currentTime, duration)}</span>
              </div>
            </div>

            {/* Playback Controls matching IMG_6118.jpeg */}
            <div className="w-full flex items-center justify-between px-2 mt-4 mb-2">
              {/* Shuffle */}
              <button
                id="fullscreen-shuffle-btn"
                title="Shuffle"
                onClick={toggleShuffle}
                className={`p-3 rounded-full hover:bg-white/10 transition-colors ${
                  isShuffle ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              {/* Previous */}
              <button
                id="fullscreen-prev-btn"
                title="Previous"
                onClick={previous}
                className="p-3 rounded-full hover:bg-white/10 text-zinc-200 hover:text-white transition-transform active:scale-90"
              >
                <SkipBack className="w-7 h-7 fill-current" />
              </button>

              {/* Large Play/Pause Circle */}
              <div className="relative">
                {isPlaying && (
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse pointer-events-none"
                    style={{ backgroundColor: currentSong.color || '#a855f7' }}
                  />
                )}
                {playbackError ? (
                  <button
                    id="fullscreen-play-btn"
                    title="Retry Playback"
                    onClick={retryPlayback}
                    className="relative w-16 h-16 rounded-full bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center shadow-2xl transition-transform active:scale-90"
                  >
                    <RotateCcw className="w-7 h-7" />
                  </button>
                ) : (
                  <button
                    id="fullscreen-play-btn"
                    title={isPlaying ? 'Pause' : 'Play'}
                    onClick={togglePlay}
                    className="relative w-16 h-16 rounded-full bg-white text-black hover:bg-zinc-100 flex items-center justify-center shadow-2xl shadow-purple-500/30 transition-transform active:scale-90"
                  >
                    {isBuffering || isResolvingPlayback ? (
                      <Loader2 className="w-7 h-7 text-black animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </button>
                )}
              </div>

              {/* Next */}
              <button
                id="fullscreen-next-btn"
                title="Next"
                onClick={next}
                className="p-3 rounded-full hover:bg-white/10 text-zinc-200 hover:text-white transition-transform active:scale-90"
              >
                <SkipForward className="w-7 h-7 fill-current" />
              </button>

              {/* Repeat */}
              <button
                id="fullscreen-repeat-btn"
                title={`Repeat: ${repeatMode}`}
                onClick={toggleRepeat}
                className={`p-3 rounded-full hover:bg-white/10 transition-colors ${
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

            {/* Bottom Row: Lyrics, AirPlay/Cast, Queue */}
            <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 border-t border-white/5 mt-2">
              <button
                id="fullscreen-lyrics-bottom-btn"
                title="Synchronized Lyrics"
                onClick={() => setActiveTab('lyrics')}
                className="p-2.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Mic2 className="w-5 h-5" />
                <span className="text-xs font-medium">Lyrics</span>
              </button>

              <button
                id="fullscreen-cast-btn"
                title="AirPlay / Speaker"
                onClick={() => {}}
                className="p-2.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <Cast className="w-5 h-5" />
              </button>

              <button
                id="fullscreen-queue-bottom-btn"
                title="Playing Next / Queue"
                onClick={() => setIsQueueOpen(true)}
                className="p-2.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ListMusic className="w-5 h-5" />
                <span className="text-xs font-medium">Queue</span>
              </button>
            </div>
          </>
        ) : (
          /* Synchronized Lyrics Screen (matching 3rd device in IMG_6118.jpeg) */
          <div className="w-full flex-1 flex flex-col justify-between py-2">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {lyricsData?.source || 'Synchronized Stream'}
              </span>
              <button
                onClick={() => setActiveTab('player')}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Back to Player
              </button>
            </div>

            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto py-8 space-y-7 text-center scroll-smooth px-2 max-h-[50vh]"
            >
              {isLyricsLoading ? (
                <div className="py-20 text-zinc-500 animate-pulse text-sm">
                  Fetching synchronized lyrics...
                </div>
              ) : lyricsData && lyricsData.lines && lyricsData.lines.length > 0 ? (
                lyricsData.lines.map((line, idx) => {
                  const isActive = idx === currentLyricIndex;
                  return (
                    <p
                      key={idx}
                      id={`lyric-line-${idx}`}
                      onClick={() => seek(line.time)}
                      className={`cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-200 scale-105 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                          : 'text-lg sm:text-xl font-medium text-zinc-500/80 hover:text-zinc-300'
                      }`}
                    >
                      {line.text}
                    </p>
                  );
                })
              ) : (
                <div className="py-24 text-center">
                  <Mic2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-base font-semibold text-zinc-300">Lyrics Unavailable</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Synchronized lyrics aren't available for this song yet.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom mini bar inside lyrics mode */}
            <div
              onClick={() => setActiveTab('player')}
              className="mt-3 p-3 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={displayArtwork}
                  alt={currentSong.title}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="truncate">
                  <p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
                  <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow"
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
