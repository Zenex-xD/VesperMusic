import React, { useState, useRef } from 'react';
import {
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Cast,
  Heart,
  Loader2,
  AlertCircle,
  RotateCcw,
  Mic2,
  ListMusic,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { formatDuration } from '../../utils/formatters';

// 46-bar acoustic waveform heights normalized (0.15 to 1.0)
const WAVEFORM_BARS = [
  0.22, 0.40, 0.32, 0.55, 0.78, 0.65, 0.38, 0.50, 0.72, 0.88,
  0.58, 0.75, 0.96, 0.62, 0.42, 0.68, 0.82, 0.48, 0.36, 0.62,
  0.78, 0.92, 0.58, 0.72, 0.84, 0.68, 0.48, 0.64, 0.86, 0.72,
  0.52, 0.38, 0.58, 0.76, 0.66, 0.48, 0.62, 0.44, 0.34, 0.48,
  0.38, 0.28, 0.22, 0.18, 0.14, 0.10
];

interface GlassmorphicPlayerCardProps {
  onOpenLyrics?: () => void;
  onOpenQueue?: () => void;
  className?: string;
}

export const GlassmorphicPlayerCard: React.FC<GlassmorphicPlayerCardProps> = ({
  onOpenLyrics,
  onOpenQueue,
  className = '',
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isBuffering,
    isResolvingPlayback,
    playbackError,
    retryPlayback,
    isShuffle,
    repeatMode,
    audioFrequencyData,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleRepeat,
  } = useMusicPlayer();

  const { isFavorite, toggleFavorite } = useAuthAndStorage();
  const [artworkError, setArtworkError] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPercent, setScrubPercent] = useState<number | null>(null);

  if (!currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const activePercent = isScrubbing && scrubPercent !== null ? scrubPercent : progressPercent;
  const activeCurrentTime = isScrubbing && scrubPercent !== null ? (scrubPercent / 100) * duration : currentTime;
  const currentBarIndex = Math.min(
    WAVEFORM_BARS.length - 1,
    Math.floor((activePercent / 100) * WAVEFORM_BARS.length)
  );

  return (
    <div className="w-full max-w-[580px] flex flex-col items-center select-none relative">
      {/* Soft ambient aura so the glass card melts organically into the background */}
      <div className="absolute -inset-3 bg-gradient-to-b from-orange-500/12 via-amber-600/4 to-transparent rounded-[46px] blur-2xl opacity-60 pointer-events-none" />

      {/* 1. Sleek Smoked Glass Card: Flawlessly Blended with UI */}
      <div
        className={`relative w-full rounded-[32px] sm:rounded-[36px] p-6 sm:py-7 sm:px-7 
        bg-gradient-to-b from-white/[0.06] via-[#151210]/45 to-[#0b0a09]/55 
        backdrop-blur-2xl sm:backdrop-blur-3xl 
        border border-white/[0.07] border-t-white/[0.14] border-b-black/30 
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.09),inset_0_0_24px_rgba(255,255,255,0.015)] 
        transition-all ${className}`}
      >
        <div className="flex items-center gap-5 sm:gap-7">
          {/* Square Album Artwork */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-[24px] overflow-hidden flex-shrink-0 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)] border border-white/[0.08] bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#ea580c]">
            {!artworkError && currentSong.artwork ? (
              <img
                src={currentSong.artwork}
                alt={currentSong.title}
                onError={() => setArtworkError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Warm Golden Hour desert dunes & sunrise illustration */
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#ffb088] via-[#f97316] to-[#c2410c]">
                <div className="absolute top-4 w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-b from-[#fff7ed] to-[#fed7aa] shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full"
                >
                  <path
                    d="M0,60 Q30,45 60,65 T100,55 L100,100 L0,100 Z"
                    fill="#ea580c"
                    opacity="0.85"
                  />
                  <path
                    d="M0,72 Q45,55 80,75 T100,68 L100,100 L0,100 Z"
                    fill="#c2410c"
                  />
                  <path
                    d="M0,82 Q35,70 70,86 T100,80 L100,100 L0,100 Z"
                    fill="#9a3412"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Right Column: NOW PLAYING Header, Title, Subtitle, Waveform */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            {/* Top Row: NOW PLAYING Header + Elevated Squircle Heart */}
            <div className="flex items-center justify-between">
              {/* Animated Soundbars + NOW PLAYING text */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[2px] h-3">
                  <span
                    className={`w-[2.5px] bg-[#f97316] rounded-full transition-all duration-150 ${
                      isPlaying ? 'animate-soundbar-1' : 'h-1.5'
                    }`}
                    style={{ height: isPlaying ? undefined : '4px' }}
                  />
                  <span
                    className={`w-[2.5px] bg-[#f97316] rounded-full transition-all duration-150 ${
                      isPlaying ? 'animate-soundbar-2' : 'h-3'
                    }`}
                    style={{ height: isPlaying ? undefined : '10px' }}
                  />
                  <span
                    className={`w-[2.5px] bg-[#f97316] rounded-full transition-all duration-150 ${
                      isPlaying ? 'animate-soundbar-3' : 'h-2'
                    }`}
                    style={{ height: isPlaying ? undefined : '6px' }}
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-[#f97316] uppercase">
                  Now Playing
                </span>
              </div>

              {/* Seamless Dark Glass Squircle Heart Button */}
              <button
                onClick={() => toggleFavorite(currentSong.id)}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] 
                border border-white/[0.07] 
                shadow-sm backdrop-blur-md
                flex items-center justify-center text-[#f97316] flex-shrink-0 
                hover:scale-105 active:scale-95 transition-all"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    favorited ? 'fill-[#f97316] text-[#f97316]' : 'text-[#f97316]'
                  }`}
                />
              </button>
            </div>

            {/* Song Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate mt-1.5">
              {currentSong.title}
            </h2>

            {/* Subtitle */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 font-medium truncate mt-0.5">
              <span className="truncate">{currentSong.artist}</span>
              <span className="text-zinc-600 font-bold">·</span>
              <span className="truncate">{currentSong.album || 'Single'}</span>
            </div>

            {/* Acoustic Waveform Visualizer (Passive progressive fill with live music pulse) */}
            <div
              className="relative mt-3.5 sm:mt-4 py-1.5 flex items-center justify-between gap-[2px] sm:gap-[2.5px] h-7 sm:h-8 select-none pointer-events-none"
            >
              {WAVEFORM_BARS.map((heightRatio, idx) => {
                const isPlayed = idx <= currentBarIndex;
                const bounce = isPlaying
                  ? Math.sin(idx * 0.4 + currentTime * 3) * 0.12 * (audioFrequencyData || 0.5)
                  : 0;
                const barHeightPct = Math.max(16, Math.min(100, (heightRatio + bounce) * 100));

                return (
                  <div
                    key={idx}
                    className="relative flex-1 flex items-center justify-center h-full"
                  >
                    <span
                      className={`w-[2.5px] sm:w-[3px] rounded-full transition-all duration-150 ${
                        isPlayed
                          ? 'bg-gradient-to-t from-[#ea580c] to-[#f97316]'
                          : 'bg-white/[0.08]'
                      }`}
                      style={{ height: `${barHeightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Timestamps */}
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-400 mt-0.5">
              <span>{formatDuration(activeCurrentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
        </div>

        {/* Playback Error Warning if any */}
        {playbackError && (
          <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 truncate">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Playback issue. Tap to retry.</span>
            </div>
            <button
              onClick={retryPlayback}
              className="px-2 py-0.5 rounded bg-amber-500 text-black font-semibold text-[11px] hover:bg-amber-400"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* 2. Controls Section (Matching Image: Linear Timeline + Controls + Capsule Buttons) */}
      <div className="w-full max-w-[500px] mt-8 sm:mt-10 flex flex-col items-center">
        {/* Top Timeline Bar: Thicker Line with Glowing Knob for Forward/Backward Song Seeking */}
        <div className="w-full px-2">
          <div className="relative py-2.5 group cursor-pointer flex items-center">
            {/* Thicker Background Track: h-[6px] sm:h-[7px] */}
            <div className="w-full h-[6px] sm:h-[7px] bg-white/[0.18] dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#fb923c] rounded-full transition-all duration-75"
                style={{ width: `${activePercent}%` }}
              />
            </div>

            {/* Glowing Orange Scrubber Thumb Knob */}
            <div
              className="absolute w-4 h-4 rounded-full bg-[#f97316] ring-[3px] ring-white dark:ring-[#161413] shadow-[0_2px_10px_rgba(249,115,22,0.9)] -translate-x-1/2 pointer-events-none transition-all duration-75"
              style={{ left: `${activePercent}%` }}
            />

            {/* Transparent range input for silky smooth desktop & mobile drag seeking */}
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={isNaN(activePercent) ? 0 : activePercent}
              onMouseDown={() => setIsScrubbing(true)}
              onTouchStart={() => setIsScrubbing(true)}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setScrubPercent(val);
                seek((val / 100) * duration);
              }}
              onMouseUp={() => {
                setIsScrubbing(false);
                setScrubPercent(null);
              }}
              onTouchEnd={() => {
                setIsScrubbing(false);
                setScrubPercent(null);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              title="Drag or click to seek song forward / backward"
            />
          </div>

          {/* Timestamps directly below the timeline */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 dark:text-zinc-500 px-0.5 mt-0.5">
            <span>{formatDuration(activeCurrentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Playback Controls Row (Shuffle, Prev, Hero Button [NO GLOW], Next, Cast) */}
        <div className="w-full flex items-center justify-between px-3 sm:px-6 mt-5 sm:mt-6">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            title="Shuffle"
            className={`p-2 rounded-xl transition-all hover:bg-white/5 active:scale-95 ${
              isShuffle ? 'text-[#f97316]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Previous */}
          <button
            onClick={previous}
            title="Previous Track"
            className="p-2 rounded-xl text-zinc-200 hover:text-white hover:bg-white/5 transition-transform active:scale-90"
          >
            <SkipBack className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
          </button>

          {/* Hero Play / Pause Button with Concentric Outer Ring - NO GLOW */}
          {playbackError ? (
            <button
              onClick={retryPlayback}
              title="Retry"
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center transition-transform active:scale-95"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          ) : (
            <div className="relative p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <button
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#e05328] to-[#c2410c] border border-white/20 flex items-center justify-center text-white transition-transform active:scale-95 hover:brightness-105"
              >
                {isBuffering || isResolvingPlayback ? (
                  <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white ml-0.5" />
                )}
              </button>
            </div>
          )}

          {/* Next */}
          <button
            onClick={next}
            title="Next Track"
            className="p-2 rounded-xl text-zinc-200 hover:text-white hover:bg-white/5 transition-transform active:scale-90"
          >
            <SkipForward className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
          </button>

          {/* Cast / Repeat */}
          <button
            onClick={toggleRepeat}
            title={`Repeat: ${repeatMode}`}
            className={`p-2 rounded-xl transition-all hover:bg-white/5 active:scale-95 ${
              repeatMode !== 'off' ? 'text-[#f97316]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cast className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Dual Capsule Pill Buttons: [ 🎤 Lyrics ]  [ 𝅘𝅥𝅮≡ Queue ] */}
        <div className="flex items-center justify-center gap-4 mt-7 sm:mt-8">
          {/* Lyrics Capsule Button */}
          <button
            id="card-lyrics-capsule-btn"
            title="Synchronized Lyrics"
            onClick={onOpenLyrics}
            className="px-6 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Mic2 className="w-4 h-4 text-[#f97316]" />
            <span>Lyrics</span>
          </button>

          {/* Queue Capsule Button */}
          <button
            id="card-queue-capsule-btn"
            title="Play Queue"
            onClick={onOpenQueue}
            className="px-6 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <ListMusic className="w-4 h-4 text-[#f97316]" />
            <span>Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
