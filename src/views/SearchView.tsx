import React, { useEffect, useState } from 'react';
import { Search, X, Clock, Trash2, ArrowUpRight } from 'lucide-react';
import { musicService } from '../services/musicService';
import { SearchResults } from '../types/music';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { SongRow } from '../components/cards/SongCard';
import { AlbumCard, ArtistCard } from '../components/cards/Cards';

interface SearchViewProps {
  onNavigate: (view: string, params?: { id?: string }) => void;
}

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

      {/* 2. When query is empty: Vertical Recent Searches List (Browse All removed) */}
      {!query.trim() ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              Recent Searches
            </span>
            {searchHistory.length > 0 && (
              <button
                onClick={() => {
                  setSearchHistory([]);
                  localStorage.removeItem('vesper_search_history');
                }}
                className="text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear all
              </button>
            )}
          </div>

          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item, idx) => (
                <div
                  key={`hist-${idx}`}
                  onClick={() => setQuery(item)}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#131318] hover:bg-[#1a1a24] border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] group-hover:bg-purple-500/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Clock className="w-4 h-4 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white truncate transition-colors">
                      {item}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="p-1 text-zinc-500 group-hover:text-purple-400 opacity-60 group-hover:opacity-100 transition-all">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <button
                      onClick={(e) => clearHistoryItem(item, e)}
                      title="Remove from history"
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl bg-[#131318]/50 border border-white/[0.04]">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-400 font-medium">No recent searches</p>
              <p className="text-xs text-zinc-600 mt-1">
                Type song, artist, or album name above to start listening.
              </p>
            </div>
          )}
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
