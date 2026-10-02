export interface Song {
  id: string; // Canonical track ID (e.g. "track-itunes-1499378108" or "track-deezer-87295812")
  title: string; // Canonical song title
  artist: string; // Canonical artist name
  artistId?: string; // Canonical artist ID
  album?: string; // Canonical album title
  albumId?: string; // Canonical album ID
  artwork: string; // Pristine high-resolution album cover artwork (NEVER video thumbnail by default)
  artistArtwork?: string; // High-resolution artist portrait
  duration: number; // in seconds
  playbackId?: string; // Reference for audio playback (e.g. YouTube video ID or stream ID)
  playbackSource?: 'youtube' | 'stream' | 'curated'; // Playback provider engine
  releaseDate?: string; // e.g. "2020-03-20"
  releaseYear?: number | string; // e.g. 2020
  genre?: string;
  streamUrl?: string; // Stream fallback or direct audio URL
  youtubeId?: string; // Kept for backwards-compatibility
  isLossless?: boolean;
  color?: string; // Dominant ambient color hex
  lyrics?: string; // Optional embedded lyrics or LRC string
  playCount?: number;
  bpm?: number; // Beats per minute for beat-matching / tempo alignment
  provider?: 'metadata' | 'itunes' | 'deezer' | 'curated' | 'youtube' | 'custom';
}

export interface AutoMixDiagnostics {
  deckAGain: number;
  deckBGain: number;
  deckABassDb: number;
  deckBBassDb: number;
  isMixing: boolean;
  transitionProgress: number; // 0.0 to 1.0
  countdownRemaining: number;
  activeDeck: 0 | 1;
  deckASong: Song | null;
  deckBSong: Song | null;
  deckABpm: number;
  deckBBpm: number;
  deckAPlaybackRate: number;
  deckBPlaybackRate: number;
  bassIsolationEnabled: boolean;
  beatMatchingEnabled: boolean;
  smartCueSeconds: number;
}

export type Track = Song;

export interface LyricLine {
  time: number; // timestamp in seconds
  text: string;
}

export interface LyricsData {
  isSynced: boolean;
  lines: LyricLine[];
  rawText?: string;
  source?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artwork: string;
  releaseYear: number | string;
  trackCount: number;
  tracks: Song[];
  genre?: string;
  description?: string;
  provider: string;
}

export interface Artist {
  id: string;
  name: string;
  artwork: string;
  bannerArtwork?: string;
  monthlyListeners?: number;
  bio?: string;
  verified?: boolean;
  topTracks: Song[];
  albums?: Album[];
  similarArtists?: { id: string; name: string; artwork: string }[];
  provider: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  gradient?: string;
  ownerName: string;
  isCustom?: boolean;
  tracks: Song[];
  createdAt: number;
  updatedAt: number;
}

export type AutoMixProfile = 'short' | 'medium' | 'long';
export type AutoMixTransitionState = 'idle' | 'preparing' | 'mixing' | 'complete';

export interface UserSettings {
  theme: 'dark-cinematic' | 'midnight-violet' | 'deep-sapphire' | 'pure-obsidian';
  audioQuality: 'lossless' | 'high' | 'normal';
  crossfadeDuration: number; // 0 to 10s (legacy/fine-tune)
  autoMixEnabled: boolean; // AutoMix intelligent transition
  autoMixDurationProfile: AutoMixProfile; // 'short' (4s) | 'medium' (6s) | 'long' (9s)
  autoplay: boolean;
  dataSaver: boolean;
  ambientGlowIntensity: 'high' | 'medium' | 'low' | 'off';
  activeProvider: 'hybrid' | 'youtube' | 'audius' | 'itunes' | 'curated';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  favorites: string[]; // Song IDs
  history: { song: Song; timestamp: number }[];
  playlists: Playlist[];
  savedAlbumIds: string[];
  savedArtistIds: string[];
  settings: UserSettings;
}

export interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface MusicProvider {
  name: string;
  id: string;
  search(query: string, type?: 'all' | 'songs' | 'artists' | 'albums' | 'playlists'): Promise<SearchResults>;
  getSong(id: string): Promise<Song | null>;
  getAlbum(id: string): Promise<Album | null>;
  getArtist(id: string): Promise<Artist | null>;
  getPlaylist(id: string): Promise<Playlist | null>;
  getTrending(limit?: number): Promise<Song[]>;
  getRecommended(seedSongIds?: string[]): Promise<Song[]>;
  getFeaturedPlaylists(): Promise<Playlist[]>;
  getTopArtists(): Promise<Artist[]>;
  getLyrics(song: Song): Promise<LyricsData>;
}
