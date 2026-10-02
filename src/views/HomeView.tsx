import React, { useEffect, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  Zap,
  Clock,
  Heart,
  ChevronRight,
  MoreHorizontal,
  Search,
  Radio,
  Bell,
  Waves,
  Sparkles,
} from 'lucide-react';
import { Song } from '../types/music';
import { musicService } from '../services/musicService';
import { cleanSongTitle } from '../utils/formatters';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';

interface HomeViewProps {
  onNavigate: (view: string, params?: { id?: string }) => void;
}

interface MixItem {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  accentColor: string;
  songIds: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuthAndStorage();
  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    openModal,
  } = useMusicPlayer();

  const [allSongs, setAllSongs] = useState<Song[]>([]);

  useEffect(() => {
    let mounted = true;
    musicService.getTrending(40).then((songs) => {
      if (mounted) {
        setAllSongs(songs);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Time-of-day greeting (matching "Good evening" in screenshot)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Continue Listening Hero Song (default to Blinding Lights from screenshot if not already active)
  const heroSong: Song = useMemo(() => {
    if (currentSong) return currentSong;
    const blindingLights = allSongs.find(
      (s) => s.id === 'vesper-blinding-lights' || s.title.includes('Blinding Lights')
    );
    return (
      blindingLights ||
      allSongs[0] || {
        id: 'vesper-blinding-lights',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg',
        duration: 200,
        playbackId: '4NRXx6U8ABQ',
        playbackSource: 'youtube',
      }
    );
  }, [currentSong, allSongs]);

  const isHeroPlaying = currentSong?.id === heroSong.id && isPlaying;

  // Screenshot Exact Quick Picks (+ additional top hits for smooth horizontal scroll):
  // 1. Masakali 2.0 - Arijit Singh
  // 2. Calm Down - Rema
  // 3. Snooze - SZA
  // 4. One Dance - Drake
  const quickPicks: Song[] = useMemo(() => {
    const priorityIds = [
      'vesper-masakali-2',
      'vesper-calm-down',
      'vesper-snooze',
      'vesper-one-dance',
      'vesper-blinding-lights',
      'itunes-track-1440871441', // Starboy
      'curated-kesariya',
      'curated-saiyaara',
      'curated-lover',
      'curated-dholna',
    ];

    const matched: Song[] = [];
    for (const id of priorityIds) {
      const found = allSongs.find((s) => s.id === id);
      if (found) matched.push(found);
    }

    // Default screenshot 4 tracks if catalog is still resolving
    const defaults: Song[] = [
      {
        id: 'vesper-masakali-2',
        title: 'Masakali 2.0',
        artist: 'Arijit Singh',
        album: 'Masakali 2.0',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/f6/3b/89/f63b89e7-5333-0489-2858-987d7c4c65d4/8903431773319_cover.jpg/600x600bb.jpg',
        duration: 213,
        playbackId: 'hQ6E1TkfzKA',
        playbackSource: 'youtube',
      },
      {
        id: 'vesper-calm-down',
        title: 'Calm Down',
        artist: 'Rema',
        album: 'Rave & Clout',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b2/b4/7c/b2b47cf9-d8e2-53f6-5c62-c974d665c95b/22UMGIM08994.rgb.jpg/600x600bb.jpg',
        duration: 219,
        playbackId: 'CQLsdm1ZYAw',
        playbackSource: 'youtube',
      },
      {
        id: 'vesper-snooze',
        title: 'Snooze',
        artist: 'SZA',
        album: 'SOS',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/600x600bb.jpg',
        duration: 201,
        playbackId: 'LDY_XyxBu8A',
        playbackSource: 'youtube',
      },
      {
        id: 'vesper-one-dance',
        title: 'One Dance',
        artist: 'Drake',
        album: 'Views',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f2/0d/8b/f20d8bff-a927-ae98-6784-20a1f51cb23e/16UMGIM27642.rgb.jpg/600x600bb.jpg',
        duration: 173,
        playbackId: 'FOqKN-ouAUE',
        playbackSource: 'youtube',
      },
    ];

    if (matched.length >= 4) {
      return matched;
    }

    // Merge matched with defaults, preserving priority order
    const seen = new Set<string>();
    const res: Song[] = [];
    for (const s of [...matched, ...defaults]) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        res.push(s);
      }
    }
    return res;
  }, [allSongs]);

  // REAL-TIME Recently Played:
  // Automatically responds whenever the user plays any song (via currentUser.history).
  // Defaults to the exact 4 screenshot tracks if history is fresh:
  // 1. After Hours - The Weeknd
  // 2. Ctrl - SZA
  // 3. ? (Deluxe) - XXXTENTACION
  // 4. Dawn FM - The Weeknd
  const recentlyPlayed: Song[] = useMemo(() => {
    const historySongs = (currentUser?.history || [])
      .map((h) => h?.song)
      .filter((s): s is Song => Boolean(s && s.id && s.title));

    const defaultIds = [
      'vesper-after-hours',
      'vesper-ctrl',
      'vesper-deluxe-x',
      'vesper-dawn-fm',
    ];

    const catalogDefaults = defaultIds
      .map((id) => allSongs.find((s) => s.id === id))
      .filter((s): s is Song => Boolean(s));

    const fallbackDefaults: Song[] = [
      {
        id: 'vesper-after-hours',
        title: 'After Hours',
        artist: 'The Weeknd',
        album: 'After Hours',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/600x600bb.jpg',
        duration: 361,
        playbackId: 'ygTZZpVkmKg',
        playbackSource: 'youtube',
      },
      {
        id: 'vesper-ctrl',
        title: 'Ctrl',
        artist: 'SZA',
        album: 'Ctrl',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a2/bc/ad/a2bcad46-b389-4be1-8bac-5a0959b0b8e4/886446548449.jpg/600x600bb.jpg',
        duration: 235,
        playbackId: '0Exxu8lsGYE',
        playbackSource: 'youtube',
      },
      {
        id: 'vesper-deluxe-x',
        title: '? (Deluxe)',
        artist: 'XXXTENTACION',
        album: '? (Deluxe)',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/93/49/bb/9349bb3b-317d-57c3-966a-71fa25247dc2/19UMGIM41705.rgb.jpg/600x600bb.jpg',
        duration: 166,
        playbackId: 'pgN-vvVVxMA',
        playbackSource: 'youtube',
      },
      {
        id: 'vesper-dawn-fm',
        title: 'Dawn FM',
        artist: 'The Weeknd',
        album: 'Dawn FM',
        artwork:
          'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/92/14/e3/9214e352-3322-3708-4903-cf5059c4985f/21UM1IM58861.rgb.jpg/600x600bb.jpg',
        duration: 220,
        playbackId: '_Tn_I4GVwxg',
        playbackSource: 'youtube',
      },
    ];

    const baseDefaults = catalogDefaults.length >= 4 ? catalogDefaults : fallbackDefaults;

    // Real-time playback history takes absolute priority at the front!
    const seen = new Set<string>();
    const list: Song[] = [];

    for (const song of historySongs) {
      if (!seen.has(song.id)) {
        seen.add(song.id);
        list.push(song);
      }
    }

    for (const song of baseDefaults) {
      if (!seen.has(song.id)) {
        seen.add(song.id);
        list.push(song);
      }
    }

    return list;
  }, [currentUser?.history, allSongs]);

  // Screenshot Exact "Made For You" Mix Cards (+ extra mixes for rich horizontal scrolling):
  // 1. Daily Mix 1 (Purple)
  // 2. Chill Mix (Teal/Cyan)
  // 3. Focus Music Mix (Magenta/Purple)
  // 4. Late Night Mix (Midnight Blue)
  const madeForYouMixes: MixItem[] = [
    {
      id: 'mix-daily-1',
      title: 'Daily Mix 1',
      subtitle: 'Made for you',
      gradient: 'from-indigo-950 via-purple-900/60 to-slate-950',
      accentColor: '#8b5cf6',
      songIds: ['vesper-blinding-lights', 'vesper-masakali-2', 'vesper-calm-down'],
    },
    {
      id: 'mix-chill',
      title: 'Chill Mix',
      subtitle: 'Made for you',
      gradient: 'from-cyan-950 via-teal-900/50 to-slate-950',
      accentColor: '#06b6d4',
      songIds: ['vesper-snooze', 'vesper-ctrl', 'vesper-calm-down'],
    },
    {
      id: 'mix-focus',
      title: 'Focus Music Mix',
      subtitle: 'Made for you',
      gradient: 'from-purple-950 via-fuchsia-900/40 to-slate-950',
      accentColor: '#d946ef',
      songIds: ['vesper-after-hours', 'vesper-deluxe-x', 'vesper-dawn-fm'],
    },
    {
      id: 'mix-late-night',
      title: 'Late Night Mix',
      subtitle: 'Made for you',
      gradient: 'from-blue-950 via-indigo-950/60 to-slate-950',
      accentColor: '#3b82f6',
      songIds: ['vesper-one-dance', 'vesper-blinding-lights', 'vesper-after-hours'],
    },
    {
      id: 'mix-bollywood-retro',
      title: 'Bollywood Pop',
      subtitle: 'Made for you',
      gradient: 'from-amber-950 via-orange-900/50 to-slate-950',
      accentColor: '#f59e0b',
      songIds: ['vesper-masakali-2', 'curated-kesariya', 'curated-saiyaara'],
    },
    {
      id: 'mix-acoustic',
      title: 'Acoustic Vibe',
      subtitle: 'Made for you',
      gradient: 'from-emerald-950 via-teal-900/50 to-slate-950',
      accentColor: '#10b981',
      songIds: ['curated-lover', 'vesper-snooze', 'vesper-ctrl'],
    },
  ];

  const handlePlayMix = (mix: MixItem) => {
    const mixSongs = mix.songIds
      .map((id) => allSongs.find((s) => s.id === id))
      .filter((s): s is Song => Boolean(s));

    if (mixSongs.length > 0) {
      playSong(mixSongs[0], mixSongs, 0);
    } else if (quickPicks.length > 0) {
      playSong(quickPicks[0], quickPicks, 0);
    }
  };

  // Hero Card Time Display
  const heroCurrentTime = isHeroPlaying && duration > 0 ? currentTime : 134; // 2:14
  const heroDuration = heroSong.duration || 200; // 3:20
  const heroProgress = Math.min(100, Math.max(0, (heroCurrentTime / heroDuration) * 100));

  const formatHeroTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-7 pb-36 max-w-4xl mx-auto animate-in fade-in duration-300 select-none">
      {/* 1. Header Bar (Desktop only, mobile handled by MobileHeader) */}
      <header className="hidden md:flex items-center justify-between pt-1 pb-2">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-[0.16em] text-white">
            VESPER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            title="Notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => openModal('profile')}
            title="User Profile"
            className="w-9 h-9 rounded-full overflow-hidden border border-white/20 ring-2 ring-purple-500/20 active:scale-95 transition-transform cursor-pointer"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt="Profile"
              className="w-full h-full object-cover grayscale"
            />
          </button>
        </div>
      </header>

      {/* 2. Greeting Section */}
      <section className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {greeting}
        </h2>
        <p className="text-sm text-zinc-400">
          Let's find something great to listen to.
        </p>
      </section>

      {/* 3. Search Bar */}
      <section>
        <div
          onClick={() => onNavigate('search')}
          className="group w-full bg-[#16161c] hover:bg-[#1c1c24] border border-white/[0.08] hover:border-white/20 rounded-full py-3.5 px-4 flex items-center gap-3 text-sm text-zinc-400 cursor-pointer transition-all shadow-inner"
        >
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
            Search songs, artists, albums...
          </span>
        </div>
      </section>

      {/* 4. "Continue Listening" Hero Card */}
      <section>
        <div
          onClick={() => {
            if (currentSong?.id === heroSong.id) {
              togglePlay();
            } else {
              playSong(heroSong, [heroSong, ...quickPicks], 0);
            }
          }}
          className="group relative rounded-3xl bg-gradient-to-br from-[#22132f]/90 via-[#181423] to-[#101015] border border-white/[0.08] hover:border-white/[0.18] p-5 shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
        >
          {/* Ambient background glow */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Card Top Label Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-600/50">
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">
                Continue Listening
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal('share_song', { song: heroSong });
              }}
              className="text-zinc-500 hover:text-white p-1 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Card Body: Artwork + Details + Play Button */}
          <div className="flex items-center gap-4">
            {/* Artwork */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-lg">
              <img
                src={heroSong.artwork}
                alt={heroSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Song Meta & Progress */}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                {heroSong.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 truncate mt-0.5">
                {heroSong.artist}
              </p>
              {heroSong.album && (
                <p className="text-[11px] sm:text-xs text-zinc-500 truncate mt-0.5">
                  {heroSong.album}
                </p>
              )}

              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${heroProgress}%` }}
                />
              </div>

              {/* Time stamps */}
              <p className="text-[11px] text-zinc-400 font-mono mt-1.5">
                {formatHeroTime(heroCurrentTime)} / {formatHeroTime(heroDuration)}
              </p>
            </div>

            {/* Big Circular Purple Play Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentSong?.id === heroSong.id) {
                  togglePlay();
                } else {
                  playSong(heroSong, [heroSong, ...quickPicks], 0);
                }
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-purple-600/40 transition-transform flex-shrink-0"
            >
              {isHeroPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 5. "⚡ Quick Picks" Section: Horizontal Card Carousel (card - card - card) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 fill-purple-400 text-purple-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Quick Picks
            </h3>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5 font-medium transition-colors"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Carousel of Cards (card - card - card) */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {quickPicks.map((song, idx) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;

            return (
              <div
                key={`qp-${song.id}-${idx}`}
                onClick={() => playSong(song, quickPicks, idx)}
                className="group cursor-pointer flex flex-col w-[105px] min-w-[105px] sm:w-[130px] sm:min-w-[130px] md:w-[150px] md:min-w-[150px] flex-shrink-0"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#16161c] border border-white/[0.08] group-hover:border-white/20 transition-all duration-300 shadow-md">
                  <img
                    src={song.artwork}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle hover play overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                      isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl">
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <p className="font-semibold text-xs sm:text-sm text-white truncate mt-2 group-hover:text-purple-300 transition-colors">
                  {cleanSongTitle(song.title)}
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-400 truncate mt-0.5">
                  {song.artist}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. "🕒 Recently Played" Section: REAL-TIME Horizontal Card Carousel (card - card - card) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Recently Played
            </h3>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5 font-medium transition-colors"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real-time Horizontal Carousel of Cards (card - card - card) */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {recentlyPlayed.map((song, idx) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;

            return (
              <div
                key={`rp-${song.id}-${idx}`}
                onClick={() => playSong(song, recentlyPlayed, idx)}
                className="group cursor-pointer flex flex-col w-[105px] min-w-[105px] sm:w-[130px] sm:min-w-[130px] md:w-[150px] md:min-w-[150px] flex-shrink-0"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#16161c] border border-white/[0.08] group-hover:border-white/20 transition-all duration-300 shadow-md">
                  <img
                    src={song.artwork}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle hover play overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                      isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl">
                      {isThisPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <p className="font-semibold text-xs sm:text-sm text-white truncate mt-2 group-hover:text-purple-300 transition-colors">
                  {cleanSongTitle(song.title)}
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-400 truncate mt-0.5">
                  {song.artist}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. "💜 Made For You" Section: Horizontal Card Carousel (card - card - card) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-purple-500 text-purple-500" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Made For You
            </h3>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5 font-medium transition-colors"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Carousel of Mix Cards (card - card - card) */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {madeForYouMixes.map((mix) => (
            <div
              key={mix.id}
              onClick={() => handlePlayMix(mix)}
              className={`group relative aspect-square w-[110px] min-w-[110px] sm:w-[135px] sm:min-w-[135px] md:w-[155px] md:min-w-[155px] flex-shrink-0 rounded-2xl p-2.5 sm:p-3 bg-gradient-to-br ${mix.gradient} border border-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-purple-900/20`}
            >
              {/* Background ambient soundwave watermark */}
              <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity flex items-center justify-center pointer-events-none">
                <Waves className="w-20 h-20 text-white" />
              </div>

              {/* Top Left: sound emblem */}
              <div className="relative z-10">
                <Sparkles className="w-4 h-4 text-white/70" />
              </div>

              {/* Bottom: Title, Subtitle, & Play Icon */}
              <div className="relative z-10 flex items-end justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight">
                    {mix.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate mt-0.5">
                    {mix.subtitle}
                  </p>
                </div>

                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-purple-600 flex items-center justify-center text-white transition-colors flex-shrink-0 shadow-sm">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
