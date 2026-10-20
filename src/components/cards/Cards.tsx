import React from 'react';
import { Play, Disc, UserCheck } from 'lucide-react';
import { Album, Artist, Playlist } from '../../types/music';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { formatPlayCount } from '../../utils/formatters';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  const { playSong } = useMusicPlayer();

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (album.tracks && album.tracks.length > 0) {
      playSong(album.tracks[0], album.tracks, 0);
    }
  };

  return (
    <div
      id={`album-card-${album.id}`}
      onClick={onClick}
      className="group relative flex-shrink-0 w-36 sm:w-44 p-2.5 rounded-xl bg-transparent hover:bg-white/[0.04] transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.06] shadow-sm">
        <img
          src={album.artwork}
          alt={album.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
          <button
            title="Play Album"
            onClick={handleQuickPlay}
            className="w-full h-full flex items-center justify-center"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 min-w-0">
        <h4 className="font-medium text-xs sm:text-sm text-zinc-100 group-hover:text-white truncate">
          {album.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 truncate">
          {album.artist} • {album.releaseYear || 'Album'}
        </p>
      </div>
    </div>
  );
};

interface ArtistCardProps {
  artist: Artist;
  onClick: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  return (
    <div
      id={`artist-card-${artist.id}`}
      onClick={onClick}
      className="group relative flex-shrink-0 w-32 sm:w-36 p-2 rounded-xl bg-transparent hover:bg-white/[0.04] transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-white/20 transition-colors shadow-md">
        <img
          src={artist.artwork}
          alt={artist.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-2 w-full px-1 flex items-center justify-center gap-1">
        <h4 className="font-medium text-xs sm:text-sm text-zinc-100 group-hover:text-white truncate">
          {artist.name}
        </h4>
        {artist.verified && (
          <UserCheck className="w-3 h-3 text-blue-400 flex-shrink-0" />
        )}
      </div>
      <p className="text-[11px] text-zinc-400 mt-0.5">
        {artist.monthlyListeners
          ? `${formatPlayCount(artist.monthlyListeners)} listeners`
          : 'Artist'}
      </p>
    </div>
  );
};

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  const { playSong } = useMusicPlayer();

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.tracks && playlist.tracks.length > 0) {
      playSong(playlist.tracks[0], playlist.tracks, 0);
    }
  };

  return (
    <div
      id={`playlist-card-${playlist.id}`}
      onClick={onClick}
      className="group relative flex-shrink-0 w-36 sm:w-44 p-2.5 rounded-xl bg-transparent hover:bg-white/[0.04] transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.06] shadow-sm">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg';
            }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center p-3 text-center">
            <span className="text-lg font-bold tracking-tight text-white/70">
              {playlist.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
          <button
            title="Play Playlist"
            onClick={handleQuickPlay}
            className="w-full h-full flex items-center justify-center"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 min-w-0">
        <h4 className="font-medium text-xs sm:text-sm text-zinc-100 group-hover:text-white truncate">
          {playlist.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 truncate">
          {playlist.tracks?.length || 0} tracks
        </p>
      </div>
    </div>
  );
};
