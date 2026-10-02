import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Play,
  Shuffle,
  Disc,
  Clock,
  Heart,
  Share2,
  Sparkles,
  Radio,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  Music2,
  Volume2
} from 'lucide-react';
import { Album, Song } from '../types/music';
import { CURATED_ALBUMS } from '../services/curatedCatalog';
import { musicService } from '../services/musicService';
import { SongRow } from '../components/cards/SongCard';
import { BannerSkeleton } from '../components/skeletons/MusicSkeletons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { formatDuration } from '../utils/formatters';

interface AlbumViewProps {
  albumId?: string;
  onNavigate: (view: string, params?: { id?: string }) => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({ albumId, onNavigate }) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullNote, setShowFullNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const [moreAlbums, setMoreAlbums] = useState<Album[]>([]);

  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useAuthAndStorage();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setShowFullNote(false);

    const targetId = albumId || CURATED_ALBUMS[0].id;
    musicService
      .getAlbum(targetId)
      .then(res => {
        if (isMounted) {
          const loadedAlbum = res || CURATED_ALBUMS[0];
          setAlbum(loadedAlbum);
          setLoading(false);

          // Find more albums by artist or related
          const related = CURATED_ALBUMS.filter(
            a => a.id !== loadedAlbum.id && (a.artistId === loadedAlbum.artistId || a.artist.includes(loadedAlbum.artist.split(' ')[0]))
          );
          if (related.length < 3) {
            const others = CURATED_ALBUMS.filter(a => a.id !== loadedAlbum.id && !related.some(r => r.id === a.id));
            setMoreAlbums([...related, ...others].slice(0, 4));
          } else {
            setMoreAlbums(related.slice(0, 4));
          }
        }
      })
      .catch(err => {
        console.warn('Error loading album:', err);
        if (isMounted) {
          setAlbum(CURATED_ALBUMS[0]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [albumId]);

  if (loading || !album) {
    return <BannerSkeleton />;
  }

  const totalDuration = album.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  const isAlbumPlaying =
    isPlaying && currentSong && album.tracks.some(t => t.id === currentSong.id || t.youtubeId === currentSong.youtubeId);

  const handlePlayAll = () => {
    if (album.tracks.length > 0) {
      playSong(album.tracks[0], album.tracks, 0);
    }
  };

  const handleShuffleAll = () => {
    if (album.tracks.length > 0) {
      const shuffled = [...album.tracks].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled, 0);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isAlbumSaved = album.tracks.length > 0 && album.tracks.every(t => isFavorite(t.id));
  const toggleSaveAlbum = () => {
    album.tracks.forEach(track => {
      toggleFavorite(track.id);
    });
  };

  // Apple Music style editorial notes fallback
  const editorNote =
    album.description ||
    `Experience the complete soundscape of "${album.title}". Featuring pristine mixing, emotional melodies, and captivating vocal arrangements crafted with state-of-the-art studio acoustic mastering.`;

  return (
    <div className="relative pb-36 animate-in fade-in duration-300">
      {/* Dynamic Apple Music Ambient Mesh Backdrop */}
      <div className="absolute -top-12 -left-8 -right-8 h-[520px] overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-25 dark:opacity-30 blur-[100px] scale-125 transform-gpu transition-all duration-700"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(250, 45, 72, 0.4), transparent 70%), url(${album.artwork})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
      </div>

      {/* Top Navigation & Controls */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white backdrop-blur-md transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            title="Share Album"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-medium text-zinc-300 hover:text-white backdrop-blur-md transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Apple Music Hero Showcase */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 pt-2 pb-8 border-b border-white/[0.06]">
        {/* Apple 3D Floating Master Cover */}
        <div className="relative group flex-shrink-0">
          <div
            className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border border-white/15 bg-black relative transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              src={album.artwork}
              alt={album.title}
              referrerPolicy="no-referrer"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg';
              }}
              className="w-full h-full object-cover select-none"
            />

            {/* Apple Music Live Playing Glow Overlay */}
            {isAlbumPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white">
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1 bg-[#fa2d48] rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-1 bg-[#fa2d48] rounded-full animate-[bounce_1s_infinite_300ms] h-3/4" />
                  <span className="w-1 bg-[#fa2d48] rounded-full animate-[bounce_1s_infinite_200ms] h-1/2" />
                  <span className="w-1 bg-[#fa2d48] rounded-full animate-[bounce_1s_infinite_400ms] h-5/6" />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-200">Playing Album</span>
              </div>
            )}
          </div>

          {/* Under-glow reflection */}
          <div
            className="absolute -bottom-4 left-4 right-4 h-8 rounded-full blur-xl opacity-50 pointer-events-none -z-10"
            style={{
              backgroundImage: `url(${album.artwork})`,
              backgroundSize: 'cover',
            }}
          />
        </div>

        {/* Apple Album Details & Badges */}
        <div className="flex-1 text-center md:text-left space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {album.title}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span
                onClick={() => album.artistId && onNavigate('artist', { id: album.artistId })}
                className="text-base sm:text-lg font-bold text-[#fa2d48] hover:text-[#ff4f67] hover:underline cursor-pointer transition-colors"
              >
                {album.artist}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-400">
              {album.genre || 'Soundtrack'} • {album.releaseYear} • {album.tracks.length} Songs, {totalMinutes} min
            </p>
          </div>

          {/* Apple Music Format & Audio Quality Badges */}
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pt-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-bold tracking-wider uppercase text-zinc-300">
              <Volume2 className="w-3 h-3 text-[#fa2d48]" />
              <span>Lossless</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-bold tracking-wider uppercase text-zinc-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Apple Digital Master</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-bold tracking-wider uppercase text-zinc-300">
              <Sliders className="w-3 h-3 text-purple-400" />
              <span>Spatial Audio</span>
            </div>
          </div>

          {/* Apple Action Pill Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-3 pt-2 flex-wrap">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#fa2d48] hover:bg-[#ff3d56] active:scale-95 text-white font-bold text-sm shadow-xl shadow-[#fa2d48]/25 transition-all"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play</span>
            </button>

            <button
              onClick={handleShuffleAll}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/10 text-white font-semibold text-sm backdrop-blur-md transition-all shadow-sm"
            >
              <Shuffle className="w-4 h-4 text-zinc-300" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={toggleSaveAlbum}
              title={isAlbumSaved ? 'Remove from favorites' : 'Save all to favorites'}
              className={`p-3 rounded-full border transition-all active:scale-95 backdrop-blur-md ${
                isAlbumSaved
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] border-white/10 text-zinc-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isAlbumSaved ? 'fill-pink-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Apple Music Editor's Notes Box */}
      <div className="my-8 p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm relative">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#fa2d48] flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5" />
            Editor’s Notes
          </span>
        </div>
        <p className={`text-xs sm:text-sm text-zinc-300 leading-relaxed ${showFullNote ? '' : 'line-clamp-2 sm:line-clamp-3'}`}>
          {editorNote}
        </p>
        {editorNote.length > 120 && (
          <button
            onClick={() => setShowFullNote(!showFullNote)}
            className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <span>{showFullNote ? 'LESS' : 'MORE'}</span>
            {showFullNote ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Apple Music Minimalist Tracklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center font-mono">#</span>
            <span>Track Title</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </div>
        </div>

        <div className="divide-y divide-white/[0.03]">
          {album.tracks.map((track, idx) => (
            <SongRow
              key={`${track.id}-${track.youtubeId || ''}-${idx}`}
              song={track}
              index={idx}
              playlistContext={album.tracks}
              showAlbum={false}
              showIndex={true}
              onNavigateArtist={id => onNavigate('artist', { id })}
              onNavigateAlbum={id => onNavigate('album', { id })}
            />
          ))}
        </div>
      </section>

      {/* Apple Music Bottom Credits & Record Label Footer */}
      <div className="mt-12 pt-6 border-t border-white/[0.06] space-y-1.5 text-xs text-zinc-400">
        <p className="font-semibold text-zinc-300">
          Released: {album.releaseYear} • {album.tracks.length} Songs, {totalMinutes} Minutes
        </p>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          ℗ {album.releaseYear} {album.artist} / Yash Raj Films / Super Cassettes Industries Private Limited
        </p>
        <p className="text-[10px] text-zinc-400">
          Apple Digital Master • High-Resolution Lossless Audio (24-bit/192kHz)
        </p>
      </div>

      {/* More By Artist / Recommended Albums Carousel */}
      {moreAlbums.length > 0 && (
        <section className="mt-14 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              More by {album.artist.split(',')[0].split('&')[0]}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moreAlbums.map(otherAlbum => (
              <div
                key={otherAlbum.id}
                onClick={() => onNavigate('album', { id: otherAlbum.id })}
                className="group p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all duration-300 cursor-pointer space-y-2.5"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 shadow-md relative">
                  <img
                    src={otherAlbum.artwork}
                    alt={otherAlbum.title}
                    referrerPolicy="no-referrer"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#fa2d48] text-white flex items-center justify-center shadow-lg shadow-[#fa2d48]/40 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 group-hover:text-[#fa2d48] transition-colors">
                    {otherAlbum.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    {otherAlbum.releaseYear} • {otherAlbum.genre || 'Album'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

