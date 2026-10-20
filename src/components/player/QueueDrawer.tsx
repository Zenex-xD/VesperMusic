import React from 'react';
import { X, Trash2, ArrowUp, ArrowDown, Play, ListMusic } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { formatDuration } from '../../utils/formatters';

export const QueueDrawer: React.FC = () => {
  const {
    currentSong,
    queue,
    queueIndex,
    isQueueOpen,
    setIsQueueOpen,
    playSong,
    removeFromQueue,
    reorderQueue,
    clearQueue,
  } = useMusicPlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-black border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base text-white">Play Queue</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              title="Clear Queue"
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors text-xs flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Currently Playing Section */}
        {currentSong && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2">
              Now Playing
            </h4>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-950/40 to-zinc-900 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <div className="flex items-end justify-center gap-[2.5px] h-4 w-5">
                  <span className="w-0.5 bg-purple-400 rounded-full animate-soundbar-1" />
                  <span className="w-0.5 bg-indigo-300 rounded-full animate-soundbar-2" />
                  <span className="w-0.5 bg-violet-400 rounded-full animate-soundbar-3" />
                  <span className="w-0.5 bg-purple-500 rounded-full animate-soundbar-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentSong.title}</p>
                <p className="text-xs text-purple-300 truncate">{currentSong.artist}</p>
              </div>
              <span className="text-xs font-mono text-purple-300">{formatDuration(currentSong.duration)}</span>
            </div>
          </div>
        )}

        {/* Up Next Section */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Up Next
          </h4>

          {queue.length <= 1 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Queue is empty. Songs you add will appear here.
            </div>
          ) : (
            <div className="space-y-1.5">
              {queue.map((song, idx) => {
                if (idx === queueIndex) return null; // Skip current
                const isUpcoming = idx > queueIndex;

                return (
                  <div
                    key={`${song.id}-${idx}`}
                    className={`group flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      isUpcoming
                        ? 'bg-white/[0.02] hover:bg-white/[0.06] border border-white/5'
                        : 'opacity-50 hover:opacity-80 bg-black/20'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => playSong(song, queue, idx)}
                    >
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-mono text-zinc-400 group-hover:text-purple-300 group-hover:border-purple-500/30 transition-all">
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block ml-0.5" />
                      </div>
                      <div className="truncate flex-1">
                        <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                          {song.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      {idx > 0 && (
                        <button
                          title="Move up"
                          onClick={() => reorderQueue(idx, idx - 1)}
                          className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < queue.length - 1 && (
                        <button
                          title="Move down"
                          onClick={() => reorderQueue(idx, idx + 1)}
                          className="p-1 rounded hover:bg-white/10 text-zinc-500 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        title="Remove"
                        onClick={() => removeFromQueue(idx)}
                        className="p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
