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
      className="group relative flex-shrink-0 w-36 sm:w-44 p-2.5 rounded-xl bg-transparent hover:bg-white/[0.04] transition-all duration-200 cursor-pointer flex flex-col"
      onClick={handlePlayClick}
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.06] shadow-sm">
        <img
          src={song.artwork}
          alt={song.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://i.ytimg.com/vi/BddP6PYo2gs/hqdefault.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Play Overlay Button */}
        <div
          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            isPlayingCurrent
              ? 'bg-purple-600 text-white scale-100 opacity-100'
              : isCurrent
              ? 'bg-purple-600 text-white scale-100 opacity-100'
              : 'bg-white text-black opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
          }`}
          onClick={handlePlayClick}
        >
          {isPlayingCurrent ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </div>

        {/* Lossless Tag */}
        {song.isLossless && (
          <div className="absolute top-1.5 left-1.5 px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-semibold tracking-wider text-zinc-300">
            LOSSLESS
          </div>
        )}
      </div>

      {/* Title & Artist */}
      <div className="flex flex-col mt-2 min-w-0">
        <h4
          className={`font-medium text-xs sm:text-sm truncate leading-tight ${
            isCurrent ? 'text-purple-400' : 'text-zinc-100 group-hover:text-white'
          }`}
        >
          {cleanSongTitle(song.title)}
        </h4>
        <p
          className="text-[11px] sm:text-xs text-zinc-400 truncate mt-0.5 hover:text-zinc-200 transition-colors cursor-pointer"
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
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
        isCurrent
          ? 'bg-purple-950/20 text-purple-200'
          : 'hover:bg-white/[0.04] text-zinc-300 hover:text-zinc-100'
      }`}
    >
      {/* Index or Play icon */}
      {showIndex && (
        <div className="w-5 text-center text-xs font-mono text-zinc-400 flex-shrink-0 flex items-center justify-center">
          {isPlayingCurrent ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-3 bg-purple-400 animate-pulse" />
              <span className="w-0.5 h-2 bg-purple-400 animate-pulse delay-75" />
              <span className="w-0.5 h-2.5 bg-purple-400 animate-pulse delay-150" />
            </div>
          ) : isCurrent ? (
            <span className="text-purple-400 text-sm">▶</span>
          ) : (
            <span className="group-hover:hidden">{index !== undefined ? index + 1 : '•'}</span>
          )}
          {!isCurrent && (
            <Play className="w-3.5 h-3.5 fill-current hidden group-hover:block text-zinc-200 ml-0.5" />
          )}
        </div>
      )}

      {/* Thumbnail Artwork */}
      <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/[0.06]">
        <img
          src={song.artwork}
          alt={song.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Artist */}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <h4
          className={`font-medium text-xs sm:text-sm truncate ${
            isCurrent ? 'text-purple-300' : 'text-zinc-100 group-hover:text-white'
          }`}
        >
          {cleanSongTitle(song.title)}
        </h4>
        <span
          className="text-xs text-zinc-400 truncate hover:text-zinc-200 transition-colors cursor-pointer"
          onClick={(e) => {
            if (onNavigateArtist && (song.artistId || song.artist)) {
              e.stopPropagation();
              onNavigateArtist(song.artistId || song.artist);
            }
          }}
        >
          {song.artist}
        </span>
      </div>

      {/* Album Title (Desktop Only) */}
      {showAlbum && (
        <div
          className="hidden md:block w-1/3 min-w-0 text-xs text-zinc-400 truncate hover:text-zinc-200 transition-colors"
          onClick={(e) => {
            if (onNavigateAlbum && (song.albumId || song.album)) {
              e.stopPropagation();
              onNavigateAlbum(song.albumId || song.album);
            }
          }}
        >
          {song.album || '—'}
        </div>
      )}

      {/* Duration & Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          id={`fav-btn-${song.id}`}
          title="Favorite"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song.id);
          }}
          className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
            favorited
              ? 'text-pink-500 fill-pink-500'
              : 'text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-200'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-pink-500' : ''}`} />
        </button>

        <span className="text-xs text-zinc-400 font-mono w-10 text-right">
          {formatDuration(song.duration)}
        </span>

        {/* Options dropdown */}
        <div className="relative">
          <button
            id={`menu-btn-${song.id}`}
            title="More options"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-200 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#141418] border border-white/10 shadow-2xl p-1.5 z-50 text-xs text-zinc-200 space-y-0.5"
                onClick={(e) => e.stopPropagation()}
              >
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
  );
};
