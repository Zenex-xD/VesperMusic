import React, { useState } from 'react';
import {
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
  Crown,
  Disc,
  ShieldCheck,
  Download,
  Upload,
  ArrowLeft,
  Music,
} from 'lucide-react';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { formatDuration } from '../utils/formatters';

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
];

interface ProfileViewProps {
  onNavigate: (view: string, params?: { id?: string }) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    createNewProfile,
    updateProfile,
    deleteProfile,
    clearHistory,
    showToast,
  } = useAuthAndStorage();

  const { playSong, openModal } = useMusicPlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || 'Mosam');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [showNewProfile, setShowNewProfile] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name: name.trim() });
    setIsEditing(false);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    createNewProfile(newProfileName.trim());
    setNewProfileName('');
    setShowNewProfile(false);
  };

  return (
    <div className="min-h-[85vh] max-w-5xl mx-auto pb-32 pt-2 text-white select-none">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-white/[0.08] text-zinc-300 font-medium">
            Lossless Member
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-2xl bg-[#121216]/80 border border-white/[0.08] p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 z-10">
          {/* Avatar with click to change */}
          <div className="relative group cursor-pointer flex-shrink-0" onClick={() => setShowAvatarPicker(prev => !prev)}>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-white/20 bg-zinc-800 shadow-md">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-medium gap-1 text-white">
              <Edit2 className="w-4 h-4" />
              <span>Change Photo</span>
            </div>
          </div>

          {/* Profile details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            {isEditing ? (
              <form onSubmit={handleSave} className="flex items-center gap-2 mb-2 max-w-sm">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-purple-500 text-white text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
                >
                  <Check className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white truncate">
                  {currentUser.name}
                </h1>
                <button
                  onClick={() => {
                    setName(currentUser.name);
                    setIsEditing(true);
                  }}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Edit Name"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs text-zinc-400 font-mono mb-3">mosamlovanshi54@gmail.com</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Verified Audiophile
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                320kbps Lossless
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-semibold">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                {allUsers.length} Saved Profiles
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Picker Drawer */}
        {showAvatarPicker && (
          <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Choose Aesthetic Avatar
              </h4>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {AVATARS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => {
                    updateProfile({ avatar: url });
                    setShowAvatarPicker(false);
                  }}
                  className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                    currentUser.avatar === url
                      ? 'border-purple-500 ring-2 ring-purple-500/40'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => onNavigate('library')}
          className="p-4 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-pink-500/40 hover:bg-zinc-900/90 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Favorites</span>
            <Heart className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{currentUser.favorites.length}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Liked Tracks</p>
        </div>

        <div
          onClick={() => onNavigate('library')}
          className="p-4 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-purple-500/40 hover:bg-zinc-900/90 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Playlists</span>
            <ListMusic className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{currentUser.playlists.length}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Created Collections</p>
        </div>

        <div className="p-4 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Streamed</span>
            <History className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{currentUser.history.length}</div>
          <p className="text-[11px] text-zinc-500 mt-1">Tracks in History</p>
        </div>

        <div className="p-4 rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Quality</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-base font-bold text-amber-300 mt-1">320kbps Lossless</div>
          <p className="text-[11px] text-zinc-500 mt-1">Studio Master</p>
        </div>
      </div>

      {/* Grid: Recently Streamed & Profile Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent History (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Recent Stream Trail
            </h3>
            {currentUser.history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear stream history?')) {
                    clearHistory();
                    showToast('History cleared', 'info');
                  }
                }}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {currentUser.history.length === 0 ? (
            <div className="py-12 text-center rounded-3xl bg-white/[0.02] border border-white/5">
              <Disc className="w-10 h-10 text-zinc-600 mx-auto mb-2 animate-spin-slow" />
              <p className="text-sm text-zinc-400 font-medium">No songs streamed recently.</p>
              <p className="text-xs text-zinc-500 mt-1">Start playing music to track your listening history!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentUser.history.slice(0, 8).map((h, i) => (
                <div
                  key={`${h.song.id}-${h.timestamp}-${i}`}
                  onClick={() => playSong(h.song)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-zinc-900/50 hover:bg-purple-900/20 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                      <img src={h.song.artwork} alt={h.song.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                        {h.song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">{h.song.artist}</p>
                    </div>
                  </div>

                  <span className="text-xs text-zinc-500 font-mono flex-shrink-0">
                    {formatDuration(h.song.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Profiles & Quick Actions */}
        <div className="space-y-6">
          {/* Switch Profile Card */}
          <div className="p-5 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                Profiles ({allUsers.length})
              </h3>
              <button
                onClick={() => setShowNewProfile(prev => !prev)}
                className="p-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold"
                title="Add Profile"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showNewProfile && (
              <form onSubmit={handleCreateProfile} className="space-y-2 p-3 rounded-2xl bg-black/60 border border-purple-500/30">
                <input
                  type="text"
                  required
                  autoFocus
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  placeholder="New profile name..."
                  className="w-full px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewProfile(false)}
                    className="text-xs text-zinc-400 hover:text-white px-2 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-3 py-1 bg-purple-600 rounded-lg font-semibold text-white"
                  >
                    Add
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
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      isActive ? 'bg-purple-900/20 border-purple-500/40' : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-white truncate">{u.name}</span>
                    </div>

                    {!isActive ? (
                      <button
                        onClick={() => switchUser(u.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-zinc-300 transition-colors"
                      >
                        Switch
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-600/20">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white">Shortcuts</h3>
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
            >
              <span>Audio & Player Settings</span>
              <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-500" />
            </button>
            <button
              onClick={() => openModal('create-playlist')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
            >
              <span>Create New Playlist</span>
              <Plus className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
