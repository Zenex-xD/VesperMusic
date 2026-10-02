import React, { useState } from 'react';
import { Heart, MoreVertical, Play, Pause, Plus, ListPlus, Share2, Disc3 } from 'lucide-react';
import { Song } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { formatDuration, cleanSongTitle } from '../../utils/formatters';

interface SongCardProps {
  song: Song;
  playlistContext?: Song[];
  index?: number;
  onNavigateArtist?: (artistId: string) => void;
  onNavigateAlbum?: (albumId: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  playlistContext,
  index,
  onNavigateArtist,
  onNavigateAlbum,
}) => {
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue, playNextInQueue, openModal } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useAuthAndStorage();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const favorited = isFavorite(song.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext, index);
    }
  };

  return (
    <div
      id={`song-card-${song.id}`}
      className="group relative flex-shrink-0 w-44 md:w-52 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-purple-500/30 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={handlePlayClick}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-black shadow-lg shadow-black/40">
        <img
          src={song.artwork}
          alt={song.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://i.ytimg.com/vi/BddP6PYo2gs/hqdefault.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient glow behind */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl pointer-events-none"
          style={{ backgroundColor: song.color || '#8b5cf6' }}
        />

        {/* Play Overlay Button */}
        <div
          className={`absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
            isPlayingCurrent
              ? 'bg-purple-500 text-white scale-100 opacity-100 shadow-purple-500/40'
              : isCurrent
              ? 'bg-purple-600 text-white scale-100 opacity-100'
              : 'bg-white text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
          }`}
          onClick={handlePlayClick}
        >
          {isPlayingCurrent ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </div>

        {/* Lossless/Hi-Res Badge */}
        {song.isLossless && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold tracking-wider text-purple-300">
            HI-RES
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-1">
          <h4
            className={`font-semibold text-sm line-clamp-1 ${
              isCurrent ? 'text-purple-400' : 'text-zinc-100 group-hover:text-white'
            }`}
          >
            {cleanSongTitle(song.title)}
          </h4>
        </div>
        <p
          className="text-xs text-zinc-400 line-clamp-1 hover:text-zinc-200 transition-colors mt-0.5 cursor-pointer"
          onClick={(e) => {
            if (onNavigateArtist && (song.artistId || song.artist)) {
              e.stopPropagation();
              onNavigateArtist(song.artistId || song.artist);
            }
          }}
        >
          {song.artist}
        </p>
      </div>

      {/* Action triggers */}
      <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-zinc-400 text-xs">
        <span className="text-[11px] text-zinc-500">{formatDuration(song.duration)}</span>
        
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <button
            id={`fav-btn-${song.id}`}
            title="Favorite"
            onClick={() => toggleFavorite(song.id)}
            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
              favorited ? 'text-pink-500 fill-pink-500' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-pink-500' : ''}`} />
          </button>

          <div className="relative">
            <button
              id={`menu-btn-${song.id}`}
              title="More options"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 bottom-full mb-1 w-44 rounded-xl bg-black border border-white/10 shadow-2xl p-1.5 z-50 text-xs text-zinc-200 space-y-0.5">
                  <button
                    onClick={() => {
                      addToQueue(song);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-zinc-400" />
                    Add to Queue
                  </button>
                  <button
                    onClick={() => {
                      playNextInQueue(song);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
                  >
                    <Disc3 className="w-3.5 h-3.5 text-zinc-400" />
                    Play Next
                  </button>
                  <button
                    onClick={() => {
                      openModal('playlist', song);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-zinc-400" />
                    Add to Playlist
                  </button>
                  <button
                    onClick={() => {
                      openModal('share', song);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                    Share Song
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SongRowProps {
  song: Song;
  index?: number;
  playlistContext?: Song[];
  showIndex?: boolean;
  showAlbum?: boolean;
  onNavigateArtist?: (artistId: string) => void;
  onNavigateAlbum?: (albumId: string) => void;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  playlistContext,
  showIndex = true,
  showAlbum = true,
  onNavigateArtist,
  onNavigateAlbum,
}) => {
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue, playNextInQueue, openModal } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useAuthAndStorage();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const favorited = isFavorite(song.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext, index);
    }
  };

  return (
    <div
      id={`song-row-${song.id}`}
      onClick={handleRowClick}
      className={`group relative flex items-center gap-3 md:gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? 'bg-purple-900/20 border border-purple-500/30 text-purple-200'
          : 'hover:bg-white/[0.04] border border-transparent text-zinc-300 hover:text-zinc-100'
      }`}
    >
      {/* Index or Play icon */}
      {showIndex && (
        <div className="w-6 text-center text-xs font-mono text-zinc-500 flex-shrink-0 flex items-center justify-center">
          {isPlayingCurrent ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 h-3 bg-purple-400 animate-pulse" />
              <span className="w-0.5 h-2 bg-purple-400 animate-pulse delay-75" />
              <span className="w-0.5 h-3.5 bg-purple-400 animate-pulse delay-150" />
            </div>
          ) : isCurrent ? (
            <span className="text-purple-400">●</span>
          ) : (
            <span className="group-hover:hidden">{index !== undefined ? index + 1 : '•'}</span>
          )}
          {!isCurrent && (
            <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block text-zinc-200 ml-0.5" />
          )}
        </div>
      )}

      {/* Thumbnail Artwork */}
      <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
        <img
          src={song.artwork}
          alt={song.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://i.ytimg.com/vi/BddP6PYo2gs/hqdefault.jpg';
          }}
        />
        {isCurrent && (
          <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[2px] flex items-center justify-center">
            {isPlayingCurrent ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            )}
          </div>
        )}
      </div>

      {/* Title & Artist info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium line-clamp-1 ${isCurrent ? 'text-purple-300 font-semibold' : 'text-zinc-100'}`}>
          {cleanSongTitle(song.title)}
        </h4>
        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
          <span
            className="hover:text-zinc-200 transition-colors line-clamp-1 cursor-pointer"
            onClick={e => {
              if (onNavigateArtist && (song.artistId || song.artist)) {
                e.stopPropagation();
                onNavigateArtist(song.artistId || song.artist);
              }
            }}
          >
            {song.artist}
          </span>
          {song.isLossless && (
            <span className="text-[9px] font-bold px-1 rounded bg-purple-950/80 border border-purple-800/40 text-purple-300">
              HD
            </span>
          )}
        </div>
      </div>

      {/* Album name if wide screen */}
      {showAlbum && (song.album || song.albumId) && (
        <div
          className="hidden md:block flex-1 text-xs text-zinc-400 line-clamp-1 hover:text-zinc-200 transition-colors cursor-pointer"
          onClick={e => {
            if (onNavigateAlbum) {
              e.stopPropagation();
              onNavigateAlbum(song.albumId || song.album || '');
            }
          }}
        >
          {song.album}
        </div>
      )}

      {/* Duration */}
      <div className="text-xs text-zinc-400 font-mono hidden sm:block">
        {formatDuration(song.duration)}
      </div>

      {/* Quick Add to Playlist Button */}
      <button
        title="Add to playlist"
        onClick={e => {
          e.stopPropagation();
          openModal('playlist', song);
        }}
        className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-purple-300 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Favorite Button */}
      <button
        title="Favorite"
        onClick={e => {
          e.stopPropagation();
          toggleFavorite(song.id);
        }}
        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
          favorited ? 'text-pink-500' : 'text-zinc-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart className={`w-4 h-4 ${favorited ? 'fill-pink-500' : ''}`} />
      </button>

      {/* More menu */}
      <div className="relative" onClick={e => e.stopPropagation()}>
        <button
          title="More options"
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-black border border-white/10 shadow-2xl p-1.5 z-50 text-xs text-zinc-200 space-y-0.5">
              <button
                onClick={() => {
                  addToQueue(song);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5 text-zinc-400" />
                Add to Queue
              </button>
              <button
                onClick={() => {
                  playNextInQueue(song);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
              >
                <Disc3 className="w-3.5 h-3.5 text-zinc-400" />
                Play Next
              </button>
              <button
                onClick={() => {
                  openModal('playlist', song);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-400" />
                Add to Playlist
              </button>
              <button
                onClick={() => {
                  openModal('share', song);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                Share Song
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
