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

type LibraryTab = 'playlists' | 'favorites' | 'history';

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
    <div className="space-y-8 pb-32 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Library
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Personal playlists, liked tracks, saved albums, and listening history.
          </p>
        </div>

        <button
          onClick={() => openModal('create-playlist')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 no-scrollbar">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'favorites'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Favorites ({favoriteSongs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'playlists'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>Playlists ({currentUser.playlists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'history'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-zinc-400 hover:text-white'
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
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayAllFavorites}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-100"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Play All</span>
                </button>
                <button
                  onClick={handleShuffleFavorites}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>
              </div>

              <div className="space-y-1">
                {favoriteSongs.map((song, idx) => (
                  <SongRow
                    key={`${song.id}-${song.youtubeId || ''}-${idx}`}
                    song={song}
                    index={idx}
                    playlistContext={favoriteSongs}
                    onNavigateArtist={id => onNavigate('artist', { id })}
                    onNavigateAlbum={id => onNavigate('album', { id })}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-zinc-500 text-sm">
              You haven't added any favorite songs yet. Click the heart on any track to save it here.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Playlists */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          {currentUser.playlists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentUser.playlists.map(pl => (
                <PlaylistCard
                  key={pl.id}
                  playlist={pl}
                  onClick={() => onNavigate('playlist', { id: pl.id })}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-500 text-sm">
              No custom playlists created yet. Click "New Playlist" above to start building your mix.
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
                  Last {currentUser.history.length} played tracks
                </span>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="space-y-1">
                {currentUser.history.map((item, idx) => (
                  <SongRow
                    key={`${item.song.id}-${idx}`}
                    song={item.song}
                    index={idx}
                    playlistContext={currentUser.history.map(h => h.song)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-zinc-500 text-sm">
              Your listening history is empty.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
