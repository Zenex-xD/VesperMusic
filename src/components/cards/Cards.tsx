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
      className="group relative flex-shrink-0 w-44 md:w-52 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-purple-500/30 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-black shadow-lg shadow-black/40">
        <img
          src={album.artwork}
          alt={album.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-purple-500">
          <button title="Play Album" onClick={handleQuickPlay} className="w-full h-full flex items-center justify-center">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-medium text-zinc-300 flex items-center gap-1">
          <Disc className="w-3 h-3 text-purple-400" />
          ALBUM
        </div>
      </div>

      <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-white line-clamp-1">
        {album.title}
      </h4>
      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
        {album.artist} • {album.releaseYear}
      </p>
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
      className="group relative flex-shrink-0 w-36 md:w-44 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-indigo-500/30 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
    >
      <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-3 bg-black shadow-xl shadow-black/50 border-2 border-white/5 group-hover:border-indigo-500/40 transition-colors">
        <img
          src={artist.artwork}
          alt={artist.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex items-center gap-1 justify-center w-full px-1">
        <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-white truncate">
          {artist.name}
        </h4>
        {artist.verified && (
          <UserCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        )}
      </div>
      <p className="text-xs text-zinc-400 mt-0.5">
        {artist.monthlyListeners ? `${formatPlayCount(artist.monthlyListeners)} listeners` : 'Verified Artist'}
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
      className="group relative flex-shrink-0 w-44 md:w-52 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-black shadow-lg shadow-black/40 border border-white/5">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg';
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-4 text-center">
            <span className="text-xl font-bold tracking-tight text-white/80">{playlist.title.slice(0, 2).toUpperCase()}</span>
          </div>
        )}

        <div className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-zinc-200">
          <button title="Play Playlist" onClick={handleQuickPlay} className="w-full h-full flex items-center justify-center">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      <h4 className="font-semibold text-sm text-zinc-100 group-hover:text-white line-clamp-1">
        {playlist.title}
      </h4>
      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
        By {playlist.ownerName} • {playlist.tracks.length} tracks
      </p>
    </div>
  );
};
