import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Shuffle, ListMusic, Trash2, Edit3, Check, X, Clock, Search, Plus, CheckCircle2, Music } from 'lucide-react';
import { FEATURED_PLAYLISTS, CURATED_SONGS } from '../services/curatedCatalog';
import { SongRow } from '../components/cards/SongCard';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatDuration } from '../utils/formatters';
import { musicService } from '../services/musicService';
import { Song } from '../types/music';

interface PlaylistViewProps {
  playlistId?: string;
  onNavigate: (view: string, params?: { id?: string }) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId, onNavigate }) => {
  const { currentUser, renamePlaylist, deletePlaylist, removeSongFromPlaylist, addSongToPlaylist } = useAuthAndStorage();
  const { playSong } = useMusicPlayer();

  const userPl = currentUser.playlists.find(p => p.id === playlistId);
  const featuredPl = FEATURED_PLAYLISTS.find(p => p.id === playlistId);
  const playlist = userPl || featuredPl || FEATURED_PLAYLISTS[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(playlist.title);
  const [editDesc, setEditDesc] = useState(playlist.description || '');

  // Add songs to playlist search state
  const [songSearch, setSongSearch] = useState('');
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
  const [isSearchingSongs, setIsSearchingSongs] = useState(false);

  useEffect(() => {
    if (!songSearch.trim()) {
      setSearchedSongs([]);
      setIsSearchingSongs(false);
      return;
    }

    setIsSearchingSongs(true);
    const handler = setTimeout(() => {
      musicService.search(songSearch, 'songs').then(res => {
        setSearchedSongs(res.songs || []);
        setIsSearchingSongs(false);
      }).catch(() => {
        setIsSearchingSongs(false);
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [songSearch]);

  const isCustom = !!userPl;
  const totalDuration = playlist.tracks.reduce((acc, t) => acc + (t.duration || 0), 0);

  // Suggested songs from catalog that are not yet in this playlist
  const suggestedSongs = CURATED_SONGS.filter(
    s => !playlist.tracks.some(t => t.id === s.id)
  ).slice(0, 6);

  const songsToDisplayForAdding = songSearch.trim() ? searchedSongs : suggestedSongs;

  const handleSaveEdit = () => {
    if (userPl && editTitle.trim()) {
      renamePlaylist(userPl.id, editTitle, editDesc);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (userPl && confirm(`Delete "${playlist.title}"?`)) {
      deletePlaylist(userPl.id);
      onNavigate('library');
    }
  };

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playSong(playlist.tracks[0], playlist.tracks, 0);
    }
  };

  const handleShuffleAll = () => {
    if (playlist.tracks.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
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
        <span>Back</span>
      </button>

      {/* Playlist Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-[#121216]/80 border border-white/[0.08]">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden shadow-xl bg-zinc-900 flex-shrink-0 border border-white/[0.08]">
            {playlist.coverUrl ? (
              <img src={playlist.coverUrl} alt={playlist.title} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${playlist.gradient || 'from-purple-900 to-indigo-900'} flex items-center justify-center p-4 text-center`}>
                <span className="text-3xl font-bold tracking-tight text-white/90">
                  {playlist.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center justify-center sm:justify-start gap-1">
              <ListMusic className="w-4 h-4" />
              PLAYLIST • {isCustom ? 'Personal Mix' : 'Curated by AeroX'}
            </span>

            {isEditing ? (
              <div className="space-y-2 max-w-md">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xl font-bold text-white focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-zinc-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {playlist.title}
                </h1>
                <p className="text-xs text-zinc-400 max-w-xl">
                  {playlist.description || `${playlist.tracks.length} tracks`}
                </p>
                <p className="text-xs text-purple-300 font-medium">
                  By {playlist.ownerName} • {playlist.tracks.length} tracks • {formatDuration(totalDuration)}
                </p>
              </>
            )}

            {/* Play controls & Manage */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-100 shadow-xl shadow-white/10 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play All</span>
              </button>
              <button
                onClick={handleShuffleAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all"
              >
                <Shuffle className="w-4 h-4" />
                <span>Shuffle</span>
              </button>

              {isCustom && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    title="Edit Playlist"
                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    title="Delete Playlist"
                    className="p-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tracks list */}
      <section>
        <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-white/5 mb-2">
          <span># Title</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" /> Duration
          </span>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-sm">
            This playlist has no tracks yet. Use search or explore songs to add tracks.
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.tracks.map((track, idx) => (
              <div key={`${track.id}-${idx}`} className="group relative flex items-center">
                <div className="flex-1">
                  <SongRow
                    song={track}
                    index={idx}
                    playlistContext={playlist.tracks}
                    onNavigateArtist={id => onNavigate('artist', { id })}
                    onNavigateAlbum={id => onNavigate('album', { id })}
                  />
                </div>
                {isCustom && (
                  <button
                    title="Remove from playlist"
                    onClick={() => removeSongFromPlaylist(playlist.id, track.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Songs to this Playlist section */}
      {isCustom && (
        <section className="pt-8 border-t border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-400" />
                <span>Add Songs to this Playlist</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {songSearch.trim()
                  ? `Search results for "${songSearch}"`
                  : 'Recommended tracks you can add with one click'}
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={songSearch}
                onChange={e => setSongSearch(e.target.value)}
                placeholder="Search songs to add..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {songSearch && (
                <button
                  onClick={() => setSongSearch('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Songs results or recommendations list */}
          {isSearchingSongs ? (
            <div className="py-8 text-center text-xs text-zinc-400 animate-pulse">
              Searching for songs...
            </div>
          ) : songsToDisplayForAdding.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              {songSearch.trim()
                ? `No songs found for "${songSearch}". Try another search term.`
                : 'All recommended tracks have already been added to this playlist! Search above for any other songs.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {songsToDisplayForAdding.map(song => {
                const isAlreadyIn = playlist.tracks.some(t => t.id === song.id);

                return (
                  <div
                    key={`suggested-add-${song.id}`}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10 shadow-sm">
                        <img
                          src={song.artwork}
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => playSong(song, songsToDisplayForAdding, 0)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                        </button>
                      </div>

                      <div className="truncate flex-1">
                        <p className="text-xs font-semibold text-white truncate">{song.title}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-[11px] font-mono text-zinc-500">
                        {formatDuration(song.duration)}
                      </span>
                      {isAlreadyIn ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => addSongToPlaylist(playlist.id, song)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
