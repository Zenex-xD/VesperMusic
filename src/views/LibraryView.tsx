import React, { useState } from 'react';
import { Heart, ListMusic, Clock, Plus, Trash2, Play, Shuffle } from 'lucide-react';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { CURATED_SONGS } from '../services/curatedCatalog';
import { SongRow } from '../components/cards/SongCard';
import { PlaylistCard } from '../components/cards/Cards';

interface LibraryViewProps {
  onNavigate: (view: string, params?: { id?: string }) => void;
}

type LibraryTab = 'favorites' | 'playlists' | 'history';

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigate }) => {
  const { currentUser, clearHistory } = useAuthAndStorage();
  const { playSong, openModal } = useMusicPlayer();
  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');

  // Resolve favorite songs
  const favoriteSongs = CURATED_SONGS.filter(s => currentUser.favorites.includes(s.id));

  const handlePlayAllFavorites = () => {
    if (favoriteSongs.length > 0) {
      playSong(favoriteSongs[0], favoriteSongs, 0);
    }
  };

  const handleShuffleFavorites = () => {
    if (favoriteSongs.length > 0) {
      const shuffled = [...favoriteSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled, 0);
    }
  };

  return (
    <div className="space-y-6 pb-36 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Personal playlists, liked tracks, and listening history.
          </p>
        </div>

        <button
          onClick={() => openModal('create-playlist')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-white/[0.1] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Liked Songs ({favoriteSongs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'playlists'
              ? 'bg-white/[0.1] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>Playlists ({currentUser.playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white/[0.1] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>History ({currentUser.history.length})</span>
        </button>
      </div>

      {/* Tab 1: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteSongs.length > 0 ? (
            <>
              {/* Play All Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAllFavorites}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Play All</span>
                </button>
                <button
                  onClick={handleShuffleFavorites}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141418] hover:bg-[#1c1c24] border border-white/[0.06] text-zinc-300 hover:text-white font-medium text-xs transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
              </div>

              {/* Tracks List */}
              <div className="divide-y divide-white/[0.03]">
                {favoriteSongs.map((song, idx) => (
                  <SongRow
                    key={`fav-${song.id}-${idx}`}
                    song={song}
                    index={idx}
                    playlistContext={favoriteSongs}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">No Liked Songs Yet</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Songs you favorite while listening will appear here for instant offline-like access.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Playlists */}
      {activeTab === 'playlists' && (
        <div className="space-y-4">
          {currentUser.playlists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {currentUser.playlists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onClick={() => onNavigate('playlist', { id: playlist.id })}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <ListMusic className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">No Playlists Created</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
                Create custom playlists to organize your favorite albums, vibes, and tracks.
              </p>
              <button
                onClick={() => openModal('create-playlist')}
                className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors"
              >
                Create Your First Playlist
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {currentUser.history.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {currentUser.history.length} songs played recently
                </span>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="divide-y divide-white/[0.03]">
                {currentUser.history.map((hist, idx) => (
                  <SongRow
                    key={`hist-row-${hist.song.id}-${idx}`}
                    song={hist.song}
                    index={idx}
                    playlistContext={currentUser.history.map(h => h.song)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">Listening History Empty</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Play any track to start recording your personal listening trail.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
