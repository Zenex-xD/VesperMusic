import React, { useState } from 'react';
import {
  X,
  User,
  Heart,
  ListMusic,
  History,
  Sparkles,
  Zap,
  Edit2,
  Check,
  Plus,
  Play,
  Trash2,
  Download,
  Upload,
  Crown,
  Radio,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Disc,
} from 'lucide-react';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { formatDuration } from '../../utils/formatters';
import { UserSettings } from '../../types/music';

// Curated aesthetic avatars
const AVATAR_PRESETS = [
  {
    id: 'mosam-default',
    name: 'Studio Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'neon-synth',
    name: 'Neon Violet',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'audiophile-chill',
    name: 'Sound Engineer',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'tokyo-night',
    name: 'Lo-Fi Vibe',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'street-headphones',
    name: 'Audiophile Pro',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'festival-aura',
    name: 'Festival Aura',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'minimal-3d',
    name: 'Digital 3D',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyber-producer',
    name: 'Neon Cyber',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  },
];

interface ProfileModalProps {
  onClose: () => void;
  onNavigate?: (view: string, params?: { id?: string }) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onNavigate }) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    createNewProfile,
    updateProfile,
    deleteProfile,
    clearHistory,
    updateSettings,
    exportData,
    importData,
    showToast,
  } = useAuthAndStorage();

  const { playSong } = useMusicPlayer();

  const [activeTab, setActiveTab] = useState<'overview' | 'avatars' | 'profiles' | 'preferences'>('overview');

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name || 'Mosam');

  // Custom Avatar URL
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  // New Profile State
  const [newProfileName, setNewProfileName] = useState('');
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);

  // Import JSON Modal/State
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editedName.trim()) return;
    updateProfile({ name: editedName.trim() });
    setIsEditingName(false);
  };

  const handleSelectAvatar = (url: string) => {
    updateProfile({ avatar: url });
  };

  const handleApplyCustomAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAvatarUrl.trim()) return;
    updateProfile({ avatar: customAvatarUrl.trim() });
    setCustomAvatarUrl('');
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createNewProfile(newProfileName.trim());
    setNewProfileName('');
    setShowNewProfileForm(false);
    showToast(`Profile "${newProfileName.trim()}" created!`, 'success');
  };

  const handleExportBackup = () => {
    try {
      const dataStr = exportData();
      navigator.clipboard.writeText(dataStr);
      showToast('Profile & Library backup copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy backup', 'error');
    }
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const ok = importData(importJsonText.trim());
    if (ok) {
      showToast('Library & Profiles restored successfully!', 'success');
      setShowImportBox(false);
      setImportJsonText('');
    } else {
      showToast('Invalid backup JSON data', 'error');
    }
  };

  // Calculate top culture / vibe
  const recentHist = currentUser.history || [];
  const topGenre = recentHist.length > 0 && recentHist[0]?.song?.genre 
    ? recentHist[0].song.genre 
    : 'Bollywood & Hindi Melodies';

  return (
    <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-[#121216] border border-white/[0.1] shadow-2xl z-50 overflow-hidden text-white animate-in zoom-in-95 duration-150">
      {/* Top Bar */}
      <div className="relative flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08] z-10">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
            User Profile
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300">
              Lossless
            </span>
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="relative flex-1 overflow-y-auto px-5 py-4 space-y-5 z-10 no-scrollbar">
        {/* Profile Card Header */}
        <div className="relative p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar with edit overlay */}
            <div className="relative group cursor-pointer flex-shrink-0" onClick={() => setActiveTab('avatars')}>
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/20 bg-zinc-800">
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                />
              </div>
              <div className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium gap-0.5">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Change</span>
              </div>
            </div>

            {/* User Info & Edit Name */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2 mb-2 max-w-xs">
                  <input
                    type="text"
                    value={editedName}
                    autoFocus
                    onChange={e => setEditedName(e.target.value)}
                    placeholder="Your name..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-purple-500/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(currentUser.name);
                      setIsEditingName(false);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="text-xl font-extrabold text-white tracking-tight truncate">
                    {currentUser.name}
                  </h3>
                  <button
                    onClick={() => {
                      setEditedName(currentUser.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-xs text-zinc-400 font-mono mb-2.5">
                mosamlovanshi54@gmail.com
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Verified Audiophile
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Lossless 320k
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => {
              if (onNavigate) {
                onNavigate('library');
                onClose();
              }
            }}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-pink-500/30 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Favorites</span>
              <Heart className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-extrabold text-white">{currentUser.favorites.length}</div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Liked Songs</p>
          </div>

          <div
            onClick={() => {
              if (onNavigate) {
                onNavigate('library');
                onClose();
              }
            }}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Playlists</span>
              <ListMusic className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl font-extrabold text-white">{currentUser.playlists.length}</div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Custom Mixes</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">History</span>
              <History className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-extrabold text-white">{currentUser.history.length}</div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Tracks Streamed</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Vibe</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs font-bold text-amber-300 truncate mt-1">{topGenre}</div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Primary Taste</p>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Overview & History
          </button>
          <button
            onClick={() => setActiveTab('avatars')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'avatars'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Avatars & Photo
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profiles'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Switch Profile ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'preferences'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & RECENT HISTORY                                */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Recently Played */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  Recently Streamed
                </h4>
                {currentUser.history.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear your recent listening history?')) {
                        clearHistory();
                        showToast('Listening history cleared', 'info');
                      }
                    }}
                    className="text-[11px] text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {currentUser.history.length === 0 ? (
                <div className="py-8 text-center rounded-2xl bg-white/[0.02] border border-white/5">
                  <Disc className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-spin-slow" />
                  <p className="text-xs text-zinc-400">No stream history yet.</p>
                  <p className="text-[11px] text-zinc-500">Play any song to see your listening trail here!</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {currentUser.history.slice(0, 10).map((h, i) => (
                    <div
                      key={`${h.song.id}-${h.timestamp}-${i}`}
                      onClick={() => {
                        playSong(h.song);
                        onClose();
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.02] hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                          <img
                            src={h.song.artwork}
                            alt={h.song.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                            {h.song.title}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">{h.song.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 text-right">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {formatDuration(h.song.duration)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Custom Playlists */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-purple-400" />
                  Your Playlists ({currentUser.playlists.length})
                </h4>
              </div>

              {currentUser.playlists.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No playlists created yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentUser.playlists.slice(0, 4).map(pl => (
                    <div
                      key={pl.id}
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('playlist', { id: pl.id });
                          onClose();
                        }
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-purple-900/40 flex-shrink-0 border border-white/10">
                        {pl.coverUrl ? (
                          <img src={pl.coverUrl} alt={pl.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-purple-200">
                            {pl.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="truncate flex-1">
                        <p className="text-xs font-bold text-white truncate">{pl.title}</p>
                        <p className="text-[10px] text-zinc-400">{pl.tracks.length} tracks</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: AVATAR GALLERY & CUSTOM PHOTO                            */}
        {/* ============================================================== */}
        {activeTab === 'avatars' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Pick an Aesthetic Avatar</h4>
              <p className="text-xs text-zinc-400 mb-4">
                Choose a stylish persona for your AeroX profile or paste your own picture URL.
              </p>

              <div className="grid grid-cols-4 gap-3">
                {AVATAR_PRESETS.map(preset => {
                  const isSelected = currentUser.avatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectAvatar(preset.url)}
                      className={`relative group rounded-2xl overflow-hidden border-2 transition-all p-1 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-900/30 ring-2 ring-purple-500/30'
                          : 'border-white/10 hover:border-white/30 bg-white/[0.02]'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-center text-zinc-300 truncate mt-1">
                        {preset.name}
                      </p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Option */}
            <form onSubmit={handleApplyCustomAvatar} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <label className="block text-xs font-semibold text-zinc-300">
                Or paste a Custom Avatar Photo URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={e => {
                    setCustomAvatarUrl(e.target.value);
                    setAvatarPreviewError(false);
                  }}
                  placeholder="https://images.unsplash.com/... or any image link"
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!customAvatarUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PROFILES SWITCHER & MULTI-USER                           */}
        {/* ============================================================== */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Switch Profiles</h4>
                <p className="text-xs text-zinc-400">Multiple profiles keep your library & taste organized</p>
              </div>
              <button
                onClick={() => setShowNewProfileForm(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Profile</span>
              </button>
            </div>

            {showNewProfileForm && (
              <form onSubmit={handleCreateProfile} className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <h5 className="text-xs font-bold text-purple-300">Create New Profile</h5>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  placeholder="Profile Name (e.g. Focus, Party, Gym, Family)..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-purple-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewProfileForm(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-md shadow-purple-600/30"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {allUsers.map(u => {
                const isActive = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-purple-900/25 border-purple-500/40'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white truncate">{u.name}</p>
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400">
                          {u.playlists.length} playlists • {u.favorites.length} favorites
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive ? (
                        <>
                          <button
                            onClick={() => switchUser(u.id)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                          >
                            Switch
                          </button>
                          {allUsers.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete profile "${u.name}"?`)) {
                                  deleteProfile(u.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                              title="Delete Profile"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-purple-400 text-xs font-semibold pr-2">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: AUDIO FIDELITY & PREFERENCES                            */}
        {/* ============================================================== */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            {/* Audio Quality */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Streaming Audio Fidelity</h4>
                  <p className="text-xs text-zinc-400">Lossless 320kbps CD Quality Audio Master</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold">
                  {currentUser.settings.audioQuality.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['lossless', 'high', 'normal'] as UserSettings['audioQuality'][]).map(q => (
                  <button
                    key={q}
                    onClick={() => updateSettings({ audioQuality: q })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      currentUser.settings.audioQuality === q
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {q === 'lossless' ? 'Lossless (320k)' : q === 'high' ? 'High (256k)' : 'Normal (128k)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart AutoMix DJ */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Smart AutoMix DJ</h4>
                <p className="text-xs text-zinc-400">Tempo-matched seamless beat crossfading between songs</p>
              </div>
              <button
                onClick={() => updateSettings({ autoMixEnabled: !currentUser.settings.autoMixEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  currentUser.settings.autoMixEnabled ? 'bg-purple-600' : 'bg-zinc-800 border border-white/10'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform absolute top-0.5 ${
                    currentUser.settings.autoMixEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Backup & Restore */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cloud & Local Backup</h4>
                <p className="text-xs text-zinc-400">Save or transfer your playlists, favorites, and history</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExportBackup}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copy Backup Data</span>
                </button>
                <button
                  onClick={() => setShowImportBox(prev => !prev)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>Restore from JSON</span>
                </button>
              </div>

              {showImportBox && (
                <div className="pt-2 space-y-2">
                  <textarea
                    rows={3}
                    value={importJsonText}
                    onChange={e => setImportJsonText(e.target.value)}
                    placeholder="Paste your backup JSON code here..."
                    className="w-full p-2.5 rounded-xl bg-black/80 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImportBox(false)}
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleImportBackup}
                      disabled={!importJsonText.trim()}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-semibold text-white"
                    >
                      Restore Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-black/40 z-10">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Profile: {currentUser.name}</span>
        </div>

        <button
          onClick={onClose}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
