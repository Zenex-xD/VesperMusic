import React, { useEffect, useState } from 'react';
import { Search, X, Clock, Play } from 'lucide-react';
import { musicService } from '../services/musicService';
import { SearchResults, Song } from '../types/music';
import { cleanSongTitle, formatDuration } from '../utils/formatters';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { SongRow } from '../components/cards/SongCard';
import { AlbumCard, ArtistCard, PlaylistCard } from '../components/cards/Cards';

interface SearchViewProps {
  onNavigate: (view: string, params?: { id?: string }) => void;
}

const BROWSE_CATEGORIES = [
  { name: 'Bollywood Hits', query: 'Bollywood Hits', bg: 'bg-amber-950/40 border-amber-800/30' },
  { name: 'Punjabi Pop', query: 'Punjabi Hits', bg: 'bg-emerald-950/40 border-emerald-800/30' },
  { name: 'Indian Indie', query: 'Indian Indie', bg: 'bg-sky-950/40 border-sky-800/30' },
  { name: 'Romantic Hindi', query: 'Romantic Hindi', bg: 'bg-rose-950/40 border-rose-800/30' },
  { name: 'Lo-Fi & Chill', query: 'Ambient Chill', bg: 'bg-violet-950/40 border-violet-800/30' },
  { name: 'Global Top 50', query: 'Top Hits', bg: 'bg-blue-950/40 border-blue-800/30' },
  { name: 'South & Tollywood', query: 'Tollywood Hits', bg: 'bg-orange-950/40 border-orange-800/30' },
  { name: 'Acoustic Unplugged', query: 'Acoustic Hindi', bg: 'bg-teal-950/40 border-teal-800/30' },
];

export const SearchView: React.FC<SearchViewProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ songs: [], artists: [], albums: [], playlists: [] });
  const [loading, setLoading] = useState(false);

  const { currentSong, isPlaying, playSong } = useMusicPlayer();
  const { isFavorite } = useAuthAndStorage();

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vesper_search_history');
      return saved ? JSON.parse(saved) : ['Saiyaara', 'Arijit Singh', 'Kesariya', 'Diljit Dosanjh', 'The Weeknd'];
    } catch {
      return ['Saiyaara', 'Arijit Singh', 'Kesariya', 'Diljit Dosanjh', 'The Weeknd'];
    }
  });

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [], playlists: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      musicService.search(query, 'songs').then((res) => {
        setResults(res);
        setLoading(false);

        if (query.trim().length > 2) {
          setSearchHistory((prev) => {
            const nextHist = [
              query.trim(),
              ...prev.filter((q) => q.toLowerCase() !== query.trim().toLowerCase()),
            ].slice(0, 8);
            try {
              localStorage.setItem('vesper_search_history', JSON.stringify(nextHist));
            } catch {}
            return nextHist;
          });
        }
      });
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  const clearHistoryItem = (itemToClear: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory((prev) => {
      const next = prev.filter((item) => item !== itemToClear);
      try {
        localStorage.setItem('vesper_search_history', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const hasResults = results.songs.length > 0 || results.artists.length > 0 || results.albums.length > 0;

  return (
    <div className="space-y-7 pb-36 max-w-5xl mx-auto select-none">
      {/* 1. Search Bar */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Search
        </h1>

        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, artists, or albums..."
            className="w-full bg-[#141418] border border-white/[0.08] focus:border-white/20 rounded-lg pl-10 pr-9 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
            autoFocus={false}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. When query is empty: Recent searches & Browse Categories */}
      {!query.trim() ? (
        <div className="space-y-7">
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Recent Searches
                </span>
                <button
                  onClick={() => {
                    setSearchHistory([]);
                    localStorage.removeItem('vesper_search_history');
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, idx) => (
                  <button
                    key={`hist-${idx}`}
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1a1a22] border border-white/[0.06] text-xs text-zinc-300 hover:text-white transition-colors group"
                  >
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{item}</span>
                    <span
                      onClick={(e) => clearHistoryItem(item, e)}
                      className="p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Browse Categories */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Browse All
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {BROWSE_CATEGORIES.map((cat, idx) => (
                <div
                  key={`cat-${idx}`}
                  onClick={() => setQuery(cat.query)}
                  className={`group relative h-20 rounded-xl p-3.5 border ${cat.bg} hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between overflow-hidden`}
                >
                  <span className="font-semibold text-sm text-white group-hover:translate-x-0.5 transition-transform">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Explore curated
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-xs text-zinc-500 animate-pulse">
          Searching catalog...
        </div>
      ) : hasResults ? (
        <div className="space-y-8">
          {/* Songs List */}
          {results.songs.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Songs
              </h2>
              <div className="divide-y divide-white/[0.03]">
                {results.songs.slice(0, 15).map((song, idx) => (
                  <SongRow
                    key={`search-song-${song.id}-${idx}`}
                    song={song}
                    index={idx}
                    playlistContext={results.songs}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Artists */}
          {results.artists.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-white tracking-tight">
                Artists
              </h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {results.artists.map((artist) => (
                  <ArtistCard
                    key={`search-art-${artist.id}`}
                    artist={artist}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Albums */}
          {results.albums.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-white tracking-tight">
                Albums
              </h2>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {results.albums.map((album) => (
                  <AlbumCard
                    key={`search-alb-${album.id}`}
                    album={album}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-sm font-medium text-zinc-300">No results found for "{query}"</p>
          <p className="text-xs text-zinc-400 mt-1">
            Check the spelling or try searching for another artist or song.
          </p>
        </div>
      )}
    </div>
  );
};
