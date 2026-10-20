import React, { createContext, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { CURATED_SONGS } from '../services/curatedCatalog';
import { Playlist, Song, UserProfile, UserSettings } from '../types/music';

// Helper to safely serialize objects without crashing on cyclic references
export function safeJsonStringify(value: unknown, space?: number | string): string {
  try {
    const seen = new WeakSet();
    const result = JSON.stringify(
      value,
      (_key, val) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return undefined; // Drop circular reference safely
          }
          seen.add(val);
        }
        return val;
      },
      space
    );
    return result || '[]';
  } catch (err) {
    console.warn('safeJsonStringify fallback:', err);
    return '[]';
  }
}

// Helper to ensure clean, serializable song object with zero circular pointers
export function sanitizeSong(song: Song): Song {
  if (!song || typeof song !== 'object') {
    return {
      id: 'song-fallback',
      title: 'Unknown Title',
      artist: 'Unknown Artist',
      duration: 200,
      artwork: '',
      streamUrl: '',
      provider: 'youtube',
    };
  }
  return {
    id: String(song.id || ''),
    title: String(song.title || 'Untitled'),
    artist: String(song.artist || 'Unknown Artist'),
    album: song.album ? String(song.album) : undefined,
    duration: Number(song.duration) || 200,
    artwork: String(song.artwork || ''),
    streamUrl: String(song.streamUrl || ''),
    youtubeId: song.youtubeId ? String(song.youtubeId) : undefined,
    genre: song.genre ? String(song.genre) : undefined,
    releaseYear: song.releaseYear ? Number(song.releaseYear) : undefined,
    provider: song.provider || 'youtube',
    isLossless: Boolean(song.isLossless),
    color: song.color ? String(song.color) : '#6366f1',
    lyrics: song.lyrics ? String(song.lyrics) : undefined,
  };
}

// Helper to deeply sanitize user profiles before writing to localStorage
export function sanitizeUserProfile(user: UserProfile): UserProfile {
  return {
    id: String(user.id || 'user-default'),
    name: String(user.name || 'User'),
    avatar: String(user.avatar || ''),
    favorites: Array.isArray(user.favorites) ? user.favorites.map(f => String(f)) : [],
    history: Array.isArray(user.history)
      ? user.history.map(h => ({
          song: sanitizeSong(h.song),
          timestamp: Number(h.timestamp) || Date.now(),
        }))
      : [],
    playlists: Array.isArray(user.playlists)
      ? user.playlists.map(p => ({
          id: String(p.id || ''),
          title: String(p.title || 'Playlist'),
          description: p.description ? String(p.description) : undefined,
          coverUrl: p.coverUrl ? String(p.coverUrl) : undefined,
          gradient: p.gradient ? String(p.gradient) : undefined,
          ownerName: p.ownerName ? String(p.ownerName) : undefined,
          isCustom: Boolean(p.isCustom),
          tracks: Array.isArray(p.tracks) ? p.tracks.map(t => sanitizeSong(t)) : [],
          createdAt: Number(p.createdAt) || Date.now(),
          updatedAt: Number(p.updatedAt) || Date.now(),
        }))
      : [],
    savedAlbumIds: Array.isArray(user.savedAlbumIds) ? user.savedAlbumIds.map(a => String(a)) : [],
    savedArtistIds: Array.isArray(user.savedArtistIds) ? user.savedArtistIds.map(a => String(a)) : [],
    settings: {
      theme: user.settings?.theme || 'dark-cinematic',
      audioQuality: user.settings?.audioQuality || 'lossless',
      crossfadeDuration:
        typeof user.settings?.crossfadeDuration === 'number'
          ? Math.min(10, Math.max(0, user.settings.crossfadeDuration))
          : 6,
      autoMixEnabled: user.settings?.autoMixEnabled !== undefined ? Boolean(user.settings.autoMixEnabled) : true,
      autoMixDurationProfile:
        user.settings?.autoMixDurationProfile === 'short' ||
        user.settings?.autoMixDurationProfile === 'long'
          ? user.settings.autoMixDurationProfile
          : 'medium',
      autoplay: Boolean(user.settings?.autoplay ?? true),
      dataSaver: Boolean(user.settings?.dataSaver),
      ambientGlowIntensity: user.settings?.ambientGlowIntensity || 'high',
      activeProvider: user.settings?.activeProvider || 'hybrid',
    },
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark-cinematic',
  audioQuality: 'lossless',
  crossfadeDuration: 6,
  autoMixEnabled: true,
  autoMixDurationProfile: 'medium',
  autoplay: true,
  dataSaver: false,
  ambientGlowIntensity: 'high',
  activeProvider: 'hybrid',
};

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'user-mosam',
    name: 'Mosam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    favorites: ['curated-saiyaara', 'curated-kesariya', 'curated-lover'],
    history: [
      { song: sanitizeSong(CURATED_SONGS[5] || CURATED_SONGS[0]), timestamp: Date.now() - 1000 * 60 * 10 },
      { song: sanitizeSong(CURATED_SONGS[6] || CURATED_SONGS[1]), timestamp: Date.now() - 1000 * 60 * 30 },
      { song: sanitizeSong(CURATED_SONGS[7] || CURATED_SONGS[2] || CURATED_SONGS[0]), timestamp: Date.now() - 1000 * 60 * 60 },
      { song: sanitizeSong(CURATED_SONGS[8] || CURATED_SONGS[0]), timestamp: Date.now() - 1000 * 60 * 120 },
    ],
    playlists: [
      {
        id: 'pl-mosam-favorites',
        title: 'Midnight Atmospheric',
        description: 'Deep vibes, violet nights, and melodic bass',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        gradient: 'from-purple-900/70 via-indigo-900/50 to-black',
        ownerName: 'Mosam',
        isCustom: true,
        tracks: [
          sanitizeSong(CURATED_SONGS[0]),
          sanitizeSong(CURATED_SONGS[1]),
        ],
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 1,
      },
    ],
    savedAlbumIds: ['album-ek-tha-tiger', 'album-brahmastra'],
    savedArtistIds: ['artist-arijit-singh', 'artist-diljit-dosanjh'],
    settings: DEFAULT_SETTINGS,
  },
  {
    id: 'user-alex',
    name: 'Alex (Friend)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    favorites: ['curated-lover'],
    history: [],
    playlists: [],
    savedAlbumIds: [],
    savedArtistIds: [],
    settings: DEFAULT_SETTINGS,
  },
  {
    id: 'user-sarah',
    name: 'Sarah (Friend)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    favorites: ['curated-saiyaara'],
    history: [],
    playlists: [],
    savedAlbumIds: [],
    savedArtistIds: [],
    settings: DEFAULT_SETTINGS,
  },
];

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AuthContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;
  createNewProfile: (name: string, avatar?: string) => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  addToHistory: (song: Song) => void;
  clearHistory: () => void;
  createPlaylist: (title: string, description?: string, coverUrl?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, title: string, description?: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => boolean;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  reorderPlaylist: (playlistId: string, startIndex: number, endIndex: number) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  updateProfile: (data: Partial<Pick<UserProfile, 'name' | 'avatar'>>) => void;
  deleteProfile: (userId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AuthAndStorageContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vesper_music_app_state_v1';

export const AuthAndStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILES;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return users[0]?.id || 'user-mosam';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  useEffect(() => {
    try {
      const cleanUsers = users.map(sanitizeUserProfile);
      const serialized = safeJsonStringify(cleanUsers);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // quota or storage error
    }
  }, [users]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || DEFAULT_PROFILES[0];

  const updateCurrentUser = (updater: (prev: UserProfile) => UserProfile) => {
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updater(u) : u)));
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(userId);
    }
  };

  const createNewProfile = (name: string, avatar?: string) => {
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Listener',
      avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80`,
      favorites: [],
      history: [],
      playlists: [],
      savedAlbumIds: [],
      savedArtistIds: [],
      settings: { ...DEFAULT_SETTINGS },
    };
    setUsers(prev => [...prev, newProfile]);
    setCurrentUserId(newProfile.id);
  };

  const toggleFavorite = (songId: string) => {
    updateCurrentUser(user => {
      const isFav = user.favorites.includes(songId);
      const newFavs = isFav ? user.favorites.filter(id => id !== songId) : [...user.favorites, songId];
      return { ...user, favorites: newFavs };
    });
  };

  const isFavorite = (songId: string) => {
    return currentUser.favorites.includes(songId);
  };

  const addToHistory = (song: Song) => {
    if (!song || !song.id) return;
    const clean = sanitizeSong(song);
    updateCurrentUser(user => {
      const filtered = user.history.filter(h => h.song && h.song.id !== clean.id);
      const newHistory = [{ song: clean, timestamp: Date.now() }, ...filtered].slice(0, 50);
      return { ...user, history: newHistory };
    });
  };

  const clearHistory = () => {
    updateCurrentUser(user => ({ ...user, history: [] }));
  };

  const createPlaylist = (title: string, description?: string, coverUrl?: string): Playlist => {
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title: title.trim() || 'New Playlist',
      description: description || 'Personal curated mix',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      gradient: 'from-violet-900/60 via-purple-900/40 to-black',
      ownerName: currentUser.name,
      isCustom: true,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    updateCurrentUser(user => ({
      ...user,
      playlists: [newPl, ...user.playlists],
    }));

    showToast(`Created playlist "${newPl.title}"`, 'success');
    return newPl;
  };

  const deletePlaylist = (playlistId: string) => {
    const pl = currentUser.playlists.find(p => p.id === playlistId);
    updateCurrentUser(user => ({
      ...user,
      playlists: user.playlists.filter(p => p.id !== playlistId),
    }));
    if (pl) {
      showToast(`Deleted playlist "${pl.title}"`, 'info');
    }
  };

  const renamePlaylist = (playlistId: string, title: string, description?: string) => {
    updateCurrentUser(user => ({
      ...user,
      playlists: user.playlists.map(p =>
        p.id === playlistId ? { ...p, title, description: description ?? p.description, updatedAt: Date.now() } : p
      ),
    }));
    showToast(`Updated playlist "${title}"`, 'success');
  };

  const addSongToPlaylist = (playlistId: string, song: Song): boolean => {
    if (!song || !song.id) return false;
    const clean = sanitizeSong(song);
    let added = false;
    let playlistTitle = 'Playlist';

    updateCurrentUser(user => {
      let alreadyExists = false;
      const updatedPlaylists = user.playlists.map(p => {
        if (p.id === playlistId) {
          playlistTitle = p.title;
          const exists = p.tracks.some(t => t.id === clean.id);
          if (exists) {
            alreadyExists = true;
            return p;
          }
          added = true;
          return {
            ...p,
            tracks: [...p.tracks, clean],
            updatedAt: Date.now(),
          };
        }
        return p;
      });

      return {
        ...user,
        playlists: updatedPlaylists,
      };
    });

    if (added) {
      showToast(`Added "${clean.title}" to ${playlistTitle}`, 'success');
    } else {
      showToast(`"${clean.title}" is already in ${playlistTitle}`, 'info');
    }

    return added;
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    let removedSongTitle = '';
    let playlistTitle = 'Playlist';

    updateCurrentUser(user => ({
      ...user,
      playlists: user.playlists.map(p => {
        if (p.id === playlistId) {
          playlistTitle = p.title;
          const track = p.tracks.find(t => t.id === songId);
          if (track) removedSongTitle = track.title;
          return {
            ...p,
            tracks: p.tracks.filter(t => t.id !== songId),
            updatedAt: Date.now(),
          };
        }
        return p;
      }),
    }));

    if (removedSongTitle) {
      showToast(`Removed "${removedSongTitle}" from ${playlistTitle}`, 'info');
    }
  };

  const reorderPlaylist = (playlistId: string, startIndex: number, endIndex: number) => {
    updateCurrentUser(user => ({
      ...user,
      playlists: user.playlists.map(p => {
        if (p.id === playlistId) {
          const list = [...p.tracks];
          const [removed] = list.splice(startIndex, 1);
          list.splice(endIndex, 0, removed);
          return { ...p, tracks: list, updatedAt: Date.now() };
        }
        return p;
      }),
    }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    updateCurrentUser(user => ({
      ...user,
      settings: { ...user.settings, ...newSettings },
    }));
  };

  const exportData = () => {
    const cleanUsers = users.map(sanitizeUserProfile);
    return safeJsonStringify(cleanUsers, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.map(sanitizeUserProfile);
        setUsers(clean);
        return true;
      }
    } catch {
      // error
    }
    return false;
  };

  const updateProfile = (data: Partial<Pick<UserProfile, 'name' | 'avatar'>>) => {
    updateCurrentUser(user => ({
      ...user,
      name: data.name !== undefined && data.name.trim() ? data.name.trim() : user.name,
      avatar: data.avatar !== undefined && data.avatar.trim() ? data.avatar.trim() : user.avatar,
    }));
    showToast('Profile updated successfully', 'success');
  };

  const deleteProfile = (userId: string) => {
    if (users.length <= 1) {
      showToast('Cannot delete the only profile', 'error');
      return;
    }
    const toDelete = users.find(u => u.id === userId);
    const remaining = users.filter(u => u.id !== userId);
    setUsers(remaining);
    if (currentUserId === userId) {
      setCurrentUserId(remaining[0].id);
    }
    showToast(`Profile "${toDelete?.name || 'User'}" removed`, 'info');
  };

  return (
    <AuthAndStorageContext.Provider
      value={{
        currentUser,
        allUsers: users,
        switchUser,
        createNewProfile,
        updateProfile,
        deleteProfile,
        toggleFavorite,
        isFavorite,
        addToHistory,
        clearHistory,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        reorderPlaylist,
        updateSettings,
        updateUserSettings: updateSettings,
        exportData,
        importData,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notification Overlay */}
      {toasts.length > 0 && (
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none select-none">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border pointer-events-auto transition-all animate-in slide-in-from-top-4 duration-300 ${
                t.type === 'error'
                  ? 'bg-red-950/90 border-red-500/40 text-red-100 shadow-red-950/40'
                  : t.type === 'info'
                  ? 'bg-zinc-900/90 border-white/20 text-zinc-100 shadow-black/80'
                  : 'bg-zinc-900/90 border-purple-500/40 text-white shadow-purple-950/40'
              }`}
            >
              {t.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              ) : t.type === 'info' ? (
                <Info className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              )}
              <span className="text-xs font-semibold leading-snug flex-1">{t.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AuthAndStorageContext.Provider>
  );
};

export const useAuthAndStorage = () => {
  const context = useContext(AuthAndStorageContext);
  if (!context) {
    throw new Error('useAuthAndStorage must be used within an AuthAndStorageProvider');
  }
  return context;
};

