import React, { useEffect, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  ChevronRight,
  MoreHorizontal,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Song } from '../types/music';
import { musicService } from '../services/musicService';
import { cleanSongTitle } from '../utils/formatters';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { AeroXLogo } from '../components/common/AeroXLogo';
import { SongCard } from '../components/cards/SongCard';

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

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Curated Quick Picks
  const quickPicks: Song[] = useMemo(() => {
    const priorityIds = [
      'vesper-masakali-2',
      'vesper-calm-down',
      'vesper-snooze',
      'vesper-one-dance',
      'vesper-blinding-lights',
      'itunes-track-1440871441',
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

  // Real-time Recently Played list
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

  // Jump Back In shelf (Top 6 most accessible tracks)
  const jumpBackInSongs: Song[] = useMemo(() => {
    const combined = [...recentlyPlayed, ...quickPicks];
    const seen = new Set<string>();
    const res: Song[] = [];
    for (const s of combined) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        res.push(s);
      }
      if (res.length >= 6) break;
    }
    return res;
  }, [recentlyPlayed, quickPicks]);

  // Editorial Curated Mixes
  const madeForYouMixes: MixItem[] = [
    {
      id: 'mix-daily-1',
      title: 'Daily Mix 1',
      subtitle: 'The Weeknd, Rema, Arijit Singh',
      gradient: 'from-[#1c142b] to-[#120f1c]',
      accentColor: '#a855f7',
      songIds: ['vesper-blinding-lights', 'vesper-masakali-2', 'vesper-calm-down'],
    },
    {
      id: 'mix-chill',
      title: 'Chill Mix',
      subtitle: 'SZA, Rema, Drake',
      gradient: 'from-[#0e1d24] to-[#0c1216]',
      accentColor: '#06b6d4',
      songIds: ['vesper-snooze', 'vesper-ctrl', 'vesper-calm-down'],
    },
    {
      id: 'mix-focus',
      title: 'Deep Focus',
      subtitle: 'Ambient, Instrumentals, Lo-Fi',
      gradient: 'from-[#1b1528] to-[#110e1a]',
      accentColor: '#d946ef',
      songIds: ['vesper-after-hours', 'vesper-deluxe-x', 'vesper-dawn-fm'],
    },
    {
      id: 'mix-late-night',
      title: 'Late Night Vibes',
      subtitle: 'Drake, The Weeknd, Melodies',
      gradient: 'from-[#11192e] to-[#0c101d]',
      accentColor: '#3b82f6',
      songIds: ['vesper-one-dance', 'vesper-blinding-lights', 'vesper-after-hours'],
    },
    {
      id: 'mix-bollywood',
      title: 'Bollywood Hits',
      subtitle: 'Arijit Singh, Pritam, Atif Aslam',
      gradient: 'from-[#261710] to-[#140e0b]',
      accentColor: '#f97316',
      songIds: ['vesper-masakali-2', 'curated-kesariya', 'curated-saiyaara'],
    },
    {
      id: 'mix-acoustic',
      title: 'Acoustic Soul',
      subtitle: 'Unplugged guitar, gentle vocals',
      gradient: 'from-[#10221c] to-[#0b1411]',
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

  return (
    <div className="space-y-8 pb-36 max-w-6xl mx-auto select-none">
      {/* 1. Desktop Header Bar */}
      <header className="hidden md:flex items-center justify-between pb-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          <div
            onClick={() => onNavigate('search')}
            className="w-80 bg-[#141418] hover:bg-[#1a1a20] border border-white/[0.08] hover:border-white/[0.14] rounded-lg py-2 px-3 flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer transition-colors shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search tracks, artists, albums...</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            title="Notifications"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => openModal('profile')}
            title="User Profile"
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[#141418] hover:bg-[#1a1a20] border border-white/[0.08] transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-zinc-200">
              {currentUser.name}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Editorial Greeting & Jump Back In Grid */}
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Pick up where you left off.
          </p>
        </div>

        {/* High-density 2-row Jump Back In Shelf (authentic commercial design pattern) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {jumpBackInSongs.map((song, idx) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div
                key={`jump-${song.id}-${idx}`}
                onClick={() => {
                  if (currentSong?.id === song.id) {
                    togglePlay();
                  } else {
                    playSong(song, jumpBackInSongs, idx);
                  }
                }}
                className="group relative flex items-center gap-3 p-2 rounded-lg bg-[#141418]/60 hover:bg-[#1c1c24] border border-white/[0.05] hover:border-white/[0.12] transition-colors cursor-pointer overflow-hidden"
              >
                <div className="w-12 h-12 rounded-md overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/[0.06]">
                  <img
                    src={song.artwork}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-white truncate leading-tight group-hover:text-purple-300 transition-colors">
                    {cleanSongTitle(song.title)}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>

                {/* Instant Hover Play Button */}
                <div
                  className={`w-8 h-8 rounded-full bg-white text-black flex items-center justify-center mr-2 shadow-md transition-all flex-shrink-0 ${
                    isThisPlaying
                      ? 'opacity-100 scale-100 bg-purple-600 text-white'
                      : 'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                >
                  {isThisPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Quick Picks Shelf */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Quick Picks
            </h2>
            <p className="text-xs text-zinc-400">
              Curated tracks based on your taste
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5 font-medium transition-colors"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {quickPicks.map((song, idx) => (
            <SongCard
              key={`qp-${song.id}-${idx}`}
              song={song}
              playlistContext={quickPicks}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* 4. Recently Played Shelf (Real-time synced) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Recently Played
            </h2>
            <p className="text-xs text-zinc-400">
              Your real-time listening history
            </p>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-0.5 font-medium transition-colors"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {recentlyPlayed.map((song, idx) => (
            <SongCard
              key={`rp-${song.id}-${idx}`}
              song={song}
              playlistContext={recentlyPlayed}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* 5. Editorial "Made For You" Mixes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Made For You
            </h2>
            <p className="text-xs text-zinc-400">
              Custom mixes tailored to your listening moods
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {madeForYouMixes.map((mix) => (
            <div
              key={mix.id}
              onClick={() => handlePlayMix(mix)}
              className={`group relative rounded-xl p-3 bg-gradient-to-br ${mix.gradient} border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 cursor-pointer flex flex-col justify-between aspect-square`}
            >
              <div className="w-7 h-7 rounded-md bg-white/[0.08] flex items-center justify-center text-white/80">
                <Sparkles className="w-3.5 h-3.5" />
              </div>

              <div>
                <div className="flex items-end justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">
                      {mix.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {mix.subtitle}
                    </p>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md flex-shrink-0">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
