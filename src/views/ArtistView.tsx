import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, Shuffle, UserCheck, Disc, Music, Sparkles } from 'lucide-react';
import { Artist, Song } from '../types/music';
import { musicService } from '../services/musicService';
import { SongRow } from '../components/cards/SongCard';
import { AlbumCard } from '../components/cards/Cards';
import { BannerSkeleton } from '../components/skeletons/MusicSkeletons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatPlayCount } from '../utils/formatters';

interface ArtistViewProps {
  artistId?: string;
  onNavigate: (view: string, params?: { id?: string }) => void;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId, onNavigate }) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'albums'>('all');
  const { playSong, playQueue } = useMusicPlayer();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (artistId) {
      musicService.getArtist(artistId).then(res => {
        if (isMounted) {
          setArtist(res);
          setLoading(false);
        }
      });
    } else {
      musicService.getTopArtists().then(artists => {
        if (isMounted && artists.length > 0) {
          musicService.getArtist(artists[0].id).then(res => {
            if (isMounted) {
              setArtist(res);
              setLoading(false);
            }
          });
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [artistId]);

  if (loading || !artist) {
    return <BannerSkeleton />;
  }

  const allTracks: Song[] = artist.topTracks || [];
  const popularTracks: Song[] = allTracks.slice(0, 10);

  const displayedTracks = activeTab === 'popular' ? popularTracks : allTracks;

  const handlePlayAll = () => {
    if (allTracks.length > 0) {
      playSong(allTracks[0], allTracks, 0);
    }
  };

  const handleShufflePlay = () => {
    if (allTracks.length > 0) {
      const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled, 0);
    }
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-300">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </button>

      {/* Artist Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-black border border-white/10 shadow-2xl">
        <div
          className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundImage: `url(${artist.bannerArtwork || artist.artwork})`, backgroundSize: 'cover' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
          <div className="relative flex-shrink-0">
            <img
              src={artist.artwork}
              alt={artist.name}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg';
              }}
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-full shadow-2xl shadow-black/80 object-cover border-4 border-purple-500/30"
            />
            <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-blue-500 text-white shadow-lg border-2 border-zinc-950">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                VERIFIED ARTIST
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {artist.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-medium">
              {artist.monthlyListeners ? `${formatPlayCount(artist.monthlyListeners)} monthly listeners` : 'Verified Creator'} • {allTracks.length} tracks
            </p>
            {artist.bio && (
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed pt-1">
                {artist.bio}
              </p>
            )}

            {/* Play controls */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-4">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-100 shadow-xl shadow-white/10 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play All ({allTracks.length})</span>
              </button>
              <button
                onClick={handleShufflePlay}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-sm border border-white/10 active:scale-95 transition-all"
              >
                <Shuffle className="w-4 h-4" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>All Tracks ({allTracks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('popular')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'popular'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Top Popular</span>
        </button>

        {artist.albums && artist.albums.length > 0 && (
          <button
            onClick={() => setActiveTab('albums')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'albums'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Albums ({artist.albums.length})</span>
          </button>
        )}
      </div>

      {/* Tracks List */}
      {activeTab !== 'albums' && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">
              {activeTab === 'popular' ? 'Popular Releases' : `Complete Discography (${displayedTracks.length} Songs)`}
            </h3>
          </div>
          <div className="space-y-1">
            {displayedTracks.map((song, idx) => (
              <SongRow
                key={`${song.id}-${song.youtubeId || ''}-${idx}`}
                song={song}
                index={idx}
                playlistContext={displayedTracks}
                onNavigateAlbum={id => onNavigate('album', { id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Albums / Discography */}
      {artist.albums && artist.albums.length > 0 && (
        <section className={activeTab === 'albums' ? 'block' : 'mt-10'}>
          <h3 className="text-base font-bold text-white mb-4">Featured Albums & Collections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artist.albums.map(album => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => onNavigate('album', { id: album.id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Similar Artists */}
      {artist.similarArtists && artist.similarArtists.length > 0 && (
        <section className="pt-6 border-t border-white/5">
          <h3 className="text-base font-bold text-white mb-4">Fans Also Listen To</h3>
          <div className="flex items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar">
            {artist.similarArtists.map(sim => (
              <div
                key={sim.id}
                onClick={() => onNavigate('artist', { id: sim.id })}
                className="group p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 cursor-pointer text-center w-36 flex flex-col items-center transition-all hover:scale-105"
              >
                <img
                  src={sim.artwork}
                  alt={sim.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://i.ytimg.com/vi/BddP6PYo2gs/hqdefault.jpg';
                  }}
                  className="w-24 h-24 rounded-full object-cover shadow-lg mb-2.5 border border-purple-500/20"
                />
                <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate w-full">
                  {sim.name}
                </p>
                <p className="text-[10px] text-zinc-500">Artist</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
