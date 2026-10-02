import React, { useEffect, useState } from 'react';
import { Search, X, Music, Clock, Compass, Sparkles, Play, MoreVertical, Heart, ListPlus, FolderPlus } from 'lucide-react';
import { musicService } from '../services/musicService';
import { SearchResults, Song } from '../types/music';
import { cleanSongTitle, formatDuration } from '../utils/formatters';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';

interface SearchViewProps {
  onNavigate: (view: string, params?: { id?: string }) => void;
}

const BROWSE_CATEGORIES = [
  { name: 'Bollywood Hits', query: 'Bollywood Hits', color: 'from-amber-500/10 to-transparent' },
  { name: 'Punjabi & Pop', query: 'Punjabi Hits', color: 'from-emerald-500/10 to-transparent' },
  { name: 'Indian Indie', query: 'Indian Indie', color: 'from-sky-500/10 to-transparent' },
  { name: 'Romantic Hindi', query: 'Romantic Hindi', color: 'from-rose-500/10 to-transparent' },
  { name: 'Chill & Ambient', query: 'Ambient Chill', color: 'from-violet-500/10 to-transparent' },
  { name: 'Global Top Tracks', query: 'Top Hits', color: 'from-blue-500/10 to-transparent' },
  { name: 'Tollywood & South', query: 'Tollywood Hits', color: 'from-orange-500/10 to-transparent' },
  { name: 'Acoustic & Unplugged', query: 'Acoustic Hindi', color: 'from-teal-500/10 to-transparent' },
];

/**
 * Ensures high-resolution square album artwork (preferring 1000x1000 or 600x600).
 */
function getHighResArtwork(url?: string): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
  }
  return url
    .replace(/\/\d+x\d+bb\./, '/1000x1000bb.')
    .replace(/\/\d+x\d+\./, '/1000x1000.');
}

export const SearchView: React.FC<SearchViewProps> = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ songs: [], artists: [], albums: [], playlists: [] });
  const [loading, setLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { currentSong, isPlaying, playSongFromSearch, addToQueue, playNextInQueue, openModal } = useMusicPlayer();
  const { isFavorite, toggleFavorite } = useAuthAndStorage();

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vesper_search_history');
      return saved ? JSON.parse(saved) : ['Saiyaara', 'Ek Tha Tiger', 'Arijit Singh', 'Kesariya', 'Diljit Dosanjh', 'Brown Munde'];
    } catch {
      return ['Saiyaara', 'Ek Tha Tiger', 'Arijit Singh', 'Kesariya', 'Diljit Dosanjh', 'Brown Munde'];
    }
  });

  // Debounced search querying the canonical music engine
  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [], playlists: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      musicService.search(query, 'songs').then(res => {
        setResults(res);
        setLoading(false);

        // Save to history if query is meaningful
        if (query.trim().length > 2) {
          setSearchHistory(prev => {
            const nextHist = [
              query.trim(),
              ...prev.filter(q => q.toLowerCase() !== query.trim().toLowerCase()),
            ].slice(0, 8);
            try {
              const cleanHistory = nextHist.map(item => String(item || ''));
              localStorage.setItem('vesper_search_history', JSON.stringify(cleanHistory));
            } catch {}
            return nextHist;
          });
        }
      });
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  const clearHistoryItem = (itemToClear: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory(prev => {
      const next = prev.filter(item => item !== itemToClear);
      try {
        const cleanList = next.map(item => String(item || ''));
        localStorage.setItem('vesper_search_history', JSON.stringify(cleanList));
      } catch {}
      return next;
    });
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('vesper_search_history');
    } catch {}
  };

  return (
    <div className="space-y-8 pb-36 max-w-5xl mx-auto">
      {/* 1. Search Header & Input Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Search
          </h1>
        </div>

        {/* Large Clean Search Bar */}
        <div className="relative group max-w-2xl">
          <div className="relative flex items-center h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] focus-within:border-white/30 focus-within:bg-white/[0.07] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <Search className="absolute left-4 w-5 h-5 text-zinc-400 group-focus-within:text-white transition-colors pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search songs, artists, or paste a link..."
              className="w-full h-full pl-12 pr-12 rounded-2xl bg-transparent text-white text-base placeholder-zinc-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                title="Clear Search"
                className="absolute right-3.5 w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-zinc-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. When Query is Empty: Recent Searches & Browse Categories */}
      {!query.trim() && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Recent Searches
                  </h3>
                </div>
                <button
                  onClick={clearAllHistory}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, idx) => (
                  <div
                    key={`hist-${idx}`}
                    onClick={() => setQuery(item)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer transition-all group"
                  >
                    <span>{item}</span>
                    <button
                      onClick={e => clearHistoryItem(item, e)}
                      title={`Remove ${item}`}
                      className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Browse Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Browse Categories
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {BROWSE_CATEGORIES.map((cat, idx) => (
                <div
                  key={`cat-${idx}`}
                  onClick={() => setQuery(cat.query)}
                  className="group relative p-4 rounded-2xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/20 hover:bg-zinc-900/80 cursor-pointer transition-all duration-300 shadow-sm flex flex-col justify-between h-24 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-30 group-hover:opacity-60 transition-opacity`}
                  />
                  <span className="relative z-10 text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                  <div className="relative z-10 flex items-center justify-end">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Loading Skeletons */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`search-skel-${i}`}
              className="flex items-center gap-4 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.06] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-48 h-3.5 bg-white/[0.08] rounded" />
                <div className="w-32 h-3 bg-white/[0.05] rounded" />
                <div className="w-24 h-2.5 bg-white/[0.03] rounded" />
              </div>
              <div className="w-10 h-3 bg-white/[0.04] rounded hidden sm:block" />
            </div>
          ))}
        </div>
      )}

      {/* 4. Results View: Direct Clean Song List */}
      {!loading && query.trim() && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {results.songs.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <p className="text-zinc-300 text-lg font-medium">
                No results found for “{query}”
              </p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Check your spelling, or try searching for a different song or artist.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Clean Songs Header - No counts or numbers */}
              <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
                <Music className="w-4 h-4 text-zinc-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Songs
                </h2>
              </div>

              {/* Clean Apple Music-Style Song Rows */}
              <div className="space-y-1">
                {results.songs.map((song, idx) => {
                  // Strictly ensure all metadata fields are rendered from the SAME song object
                  const isCurrent = currentSong?.id === song.id;
                  const isPlayingThis = isCurrent && isPlaying;
                  const favorited = isFavorite(song.id);
                  const isMenuOpen = activeMenuId === song.id;
                  const displayArtwork = getHighResArtwork(song.artwork);
                  const displayTitle = cleanSongTitle(song.title);
                  const hasAlbum = Boolean(
                    song.album &&
                    song.album.trim().length > 0 &&
                    song.album.toLowerCase() !== 'unknown'
                  );

                  return (
                    <div
                      key={`search-song-${song.id}-${idx}`}
                      onClick={() => playSongFromSearch(song, results.songs)}
                      className={`group relative flex items-center gap-3.5 sm:gap-4 px-3 sm:px-4 py-2.5 rounded-2xl cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-white/[0.08] border border-white/10'
                          : 'hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]'
                      }`}
                    >
                      {/* [Artwork] - Starts directly with artwork, absolutely no numbers */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/[0.08] shadow-md">
                        <img
                          src={displayArtwork}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
                          }}
                        />

                        {/* Playing / Hover Play Overlay */}
                        <div
                          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                            isPlayingThis
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isPlayingThis ? (
                            <div className="flex items-end gap-0.5 h-3.5">
                              <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                              <span className="w-0.5 h-2 bg-white rounded-full animate-pulse delay-75" />
                              <span className="w-0.5 h-3.5 bg-white rounded-full animate-pulse delay-150" />
                            </div>
                          ) : (
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          )}
                        </div>
                      </div>

                      {/* Song Title, Artist, Album - Rendered consistently from THIS track */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <p
                          className={`text-sm sm:text-base font-semibold truncate leading-tight transition-colors ${
                            isCurrent
                              ? 'text-purple-300 font-bold'
                              : 'text-zinc-100 group-hover:text-white'
                          }`}
                        >
                          {displayTitle}
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-400 truncate mt-0.5">
                          {song.artist}
                        </p>
                        {hasAlbum && (
                          <p className="text-[11px] sm:text-xs text-zinc-500 truncate mt-0.5">
                            {song.album}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      <span className="text-xs sm:text-sm font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors flex-shrink-0">
                        {formatDuration(song.duration || 180)}
                      </span>

                      {/* Options Menu (⋮) & Quick Add */}
                      <div
                        className="relative flex-shrink-0 flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          title="Save to Playlist"
                          onClick={() => openModal('playlist', song)}
                          className="p-1.5 sm:p-2 rounded-full text-zinc-400 hover:text-purple-300 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                        >
                          <FolderPlus className="w-4 h-4" />
                        </button>

                        <button
                          title="More options"
                          onClick={() =>
                            setActiveMenuId(isMenuOpen ? null : song.id)
                          }
                          className="p-1.5 sm:p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-zinc-950 border border-white/10 shadow-2xl p-1.5 z-50 text-xs text-zinc-200 space-y-0.5">
                              <button
                                onClick={() => {
                                  openModal('playlist', song);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors text-purple-300 hover:text-purple-200"
                              >
                                <FolderPlus className="w-4 h-4 text-purple-400" />
                                Add to Playlist
                              </button>
                              <button
                                onClick={() => {
                                  addToQueue(song);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                              >
                                <ListPlus className="w-4 h-4 text-zinc-400" />
                                Add to Queue
                              </button>
                              <button
                                onClick={() => {
                                  playNextInQueue(song);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                              >
                                <Play className="w-4 h-4 text-zinc-400" />
                                Play Next
                              </button>
                              <button
                                onClick={() => {
                                  toggleFavorite(song.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors"
                              >
                                <Heart
                                  className={`w-4 h-4 ${
                                    favorited
                                      ? 'fill-red-500 text-red-500'
                                      : 'text-zinc-400'
                                  }`}
                                />
                                {favorited ? 'Favorited' : 'Favorite'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
