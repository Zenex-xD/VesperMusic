import React, { useEffect, useRef } from 'react';
import { X, Sparkles, Mic2 } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export const LyricsDrawer: React.FC = () => {
  const { currentSong, isLyricsOpen, setIsLyricsOpen, lyricsData, currentLyricIndex, isLyricsLoading, seek } = useMusicPlayer();
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLyricsOpen && currentLyricIndex >= 0) {
      const activeEl = document.getElementById(`drawer-lyric-${currentLyricIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLyricIndex, isLyricsOpen]);

  if (!isLyricsOpen || !currentSong) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-zinc-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base text-white">Lyrics</h3>
          {lyricsData?.isSynced && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900/60 border border-purple-500/30 text-purple-300">
              SYNCED
            </span>
          )}
        </div>
        <button
          onClick={() => setIsLyricsOpen(false)}
          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Song Header Meta */}
      <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
        <img src={currentSong.artwork} alt={currentSong.title} className="w-12 h-12 rounded-xl object-cover" />
        <div className="truncate">
          <p className="text-sm font-semibold text-white truncate">{currentSong.title}</p>
          <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Lyrics Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-center scroll-smooth">
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
                id={`drawer-lyric-${idx}`}
                onClick={() => seek(line.time)}
                className={`cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-200 scale-105 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-sm font-medium text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {line.text}
              </p>
            );
          })
        ) : (
          <div className="py-24 text-center">
            <Mic2 className="w-9 h-9 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-300">Lyrics Unavailable</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
              Synchronized lyrics aren't available for this song yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
