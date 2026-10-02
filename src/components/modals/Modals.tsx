import React, { useState } from 'react';
import { X, Plus, Check, Share2, Copy, UserCheck, Sparkles, Music2, ListMusic, Search, CheckCircle2 } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { formatDuration } from '../../utils/formatters';

export const ModalsContainer: React.FC = () => {
  const { activeModal, modalTargetSong, closeModal, openModal } = useMusicPlayer();
  const {
    currentUser,
    allUsers,
    switchUser,
    createNewProfile,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  } = useAuthAndStorage();

  // Create Playlist Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [quickCreateTitle, setQuickCreateTitle] = useState('');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [playlistSearch, setPlaylistSearch] = useState('');

  // Profile creation state
  const [newProfileName, setNewProfileName] = useState('');

  // Share state
  const [copied, setCopied] = useState(false);

  if (!activeModal) return null;

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const pl = createPlaylist(newTitle, newDesc);
    if (modalTargetSong) {
      addSongToPlaylist(pl.id, modalTargetSong);
    }
    setNewTitle('');
    setNewDesc('');
    closeModal();
  };

  const handleQuickCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCreateTitle.trim() || !modalTargetSong) return;
    const pl = createPlaylist(quickCreateTitle.trim());
    addSongToPlaylist(pl.id, modalTargetSong);
    setQuickCreateTitle('');
    setShowQuickCreate(false);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createNewProfile(newProfileName);
    setNewProfileName('');
    closeModal();
  };

  const handleCopyLink = () => {
    if (!modalTargetSong) return;
    const shareUrl = `${window.location.origin}/#song=${modalTargetSong.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const filteredPlaylists = currentUser.playlists.filter(p =>
    p.title.toLowerCase().includes(playlistSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeModal} />

      {/* 1. Add to Playlist Modal */}
      {activeModal === 'playlist' && (
        <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-white/15 p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-bold text-lg text-white">Save to Playlist</h3>
              <p className="text-xs text-zinc-400">Select one or more playlists to add this song</p>
            </div>
            <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Target Song Info Preview */}
          {modalTargetSong && (
            <div className="flex items-center gap-3.5 my-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <img
                src={modalTargetSong.artwork}
                alt={modalTargetSong.title}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-md border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{modalTargetSong.title}</p>
                <p className="text-xs text-purple-300 truncate">{modalTargetSong.artist}</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">{formatDuration(modalTargetSong.duration)}</span>
            </div>
          )}

          {/* Quick Create Playlist Section */}
          <div className="mb-3">
            {showQuickCreate ? (
              <form onSubmit={handleQuickCreateAndAdd} className="space-y-2 p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                <input
                  type="text"
                  autoFocus
                  value={quickCreateTitle}
                  onChange={e => setQuickCreateTitle(e.target.value)}
                  placeholder="New playlist name..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-purple-400"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickCreate(false)}
                    className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!quickCreateTitle.trim()}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-purple-600/30"
                  >
                    Create & Add
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowQuickCreate(true)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-600/15 border border-purple-500/25 hover:bg-purple-600/25 text-purple-200 transition-colors font-medium text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Create New Playlist</span>
              </button>
            )}
          </div>

          {/* Playlist search if user has multiple playlists */}
          {currentUser.playlists.length > 3 && (
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={playlistSearch}
                onChange={e => setPlaylistSearch(e.target.value)}
                placeholder="Filter playlists..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Existing Playlists list */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {currentUser.playlists.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No playlists yet. Create your first playlist above!
              </div>
            ) : filteredPlaylists.length === 0 ? (
              <div className="py-6 text-center text-zinc-500 text-xs">
                No playlists match "{playlistSearch}"
              </div>
            ) : (
              filteredPlaylists.map(pl => {
                const hasSong = modalTargetSong && pl.tracks.some(t => t.id === modalTargetSong.id);
                return (
                  <div
                    key={pl.id}
                    onClick={() => {
                      if (!modalTargetSong) return;
                      if (hasSong) {
                        removeSongFromPlaylist(pl.id, modalTargetSong.id);
                      } else {
                        addSongToPlaylist(pl.id, modalTargetSong);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      hasSong
                        ? 'bg-purple-900/20 border-purple-500/40 hover:bg-purple-900/30'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10 shadow-sm">
                        {pl.coverUrl ? (
                          <img
                            src={pl.coverUrl}
                            alt={pl.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${pl.gradient || 'from-purple-800 to-indigo-900'} flex items-center justify-center text-white text-xs font-bold`}>
                            {pl.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-white truncate">{pl.title}</p>
                        <p className="text-xs text-zinc-400">{pl.tracks.length} tracks</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasSong ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Added</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium border border-white/10">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
            <button
              onClick={closeModal}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 2. Create Playlist Modal */}
      {activeModal === 'create-playlist' && (
        <form
          onSubmit={handleCreatePlaylist}
          className="relative w-full max-w-md rounded-3xl bg-black border border-white/10 p-6 shadow-2xl z-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-bold text-lg text-white">New Playlist</h3>
            <button type="button" onClick={closeModal} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Playlist Name
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g., Midnight Melodies"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="A collection of atmospheric tracks..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none text-white text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-2xl hover:bg-white/10 text-zinc-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30"
            >
              Create Playlist
            </button>
          </div>
        </form>
      )}

      {/* 3. Share Modal */}
      {activeModal === 'share' && modalTargetSong && (
        <div className="relative w-full max-w-md rounded-3xl bg-black border border-white/10 p-6 shadow-2xl z-10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-lg text-white">Share Song</h3>
            </div>
            <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-6 p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center gap-4">
            <img
              src={modalTargetSong.artwork}
              alt={modalTargetSong.title}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-base text-white truncate">{modalTargetSong.title}</h4>
              <p className="text-xs text-zinc-400 truncate">{modalTargetSong.artist}</p>
              <p className="text-[11px] text-purple-300 mt-1 font-mono">{modalTargetSong.genre}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-600/30"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Direct Song Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Profile modal is disabled/hidden as requested */}
    </div>
  );
};
