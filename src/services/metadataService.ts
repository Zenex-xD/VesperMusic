import { Album, Artist, Playlist, SearchResults, Song } from '../types/music';
import { CURATED_ALBUMS, CURATED_ARTISTS, CURATED_PLAYLISTS, CURATED_SONGS } from './curatedCatalog';

// In-memory client cache for lightning-fast repeated queries
const clientMetadataSearchCache = new Map<string, SearchResults>();
const clientAlbumCache = new Map<string, Album>();
const clientArtistCache = new Map<string, Artist>();

// Apple Music-inspired ambient color palette generator based on title/artist hash
const AMBIENT_PALETTES = [
  '#fa2d48', // Apple Music Red / Pink
  '#8b5cf6', // Violet
  '#ec4899', // Hot Pink
  '#3b82f6', // Sapphire Blue
  '#06b6d4', // Cyan
  '#f59e0b', // Amber / Gold
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#e11d48', // Rose
  '#d946ef', // Fuchsia
];

export function getDominantColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AMBIENT_PALETTES.length;
  return AMBIENT_PALETTES[idx];
}

class MetadataService {
  /**
   * Search the canonical metadata catalog (Apple Music / iTunes + Deezer + Curated).
   * Resolves canonical Song, Artist, and Album models with genuine high-resolution artwork.
   */
  async search(query: string, type: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all'): Promise<SearchResults> {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return { songs: [], artists: [], albums: [], playlists: [] };
    }

    const cacheKey = `${cleanQuery}__${type}`;
    if (clientMetadataSearchCache.has(cacheKey)) {
      return clientMetadataSearchCache.get(cacheKey)!;
    }

    // 1. Search local curated catalog first for immediate match
    const curatedMatches: Song[] = CURATED_SONGS.filter(s =>
      s.title.toLowerCase().includes(cleanQuery) ||
      s.artist.toLowerCase().includes(cleanQuery) ||
      (s.album && s.album.toLowerCase().includes(cleanQuery))
    );

    const curatedAlbumMatches: Album[] = CURATED_ALBUMS.filter(a =>
      a.title.toLowerCase().includes(cleanQuery) ||
      a.artist.toLowerCase().includes(cleanQuery)
    );

    const curatedArtistMatches: Artist[] = CURATED_ARTISTS.filter(ar =>
      ar.name.toLowerCase().includes(cleanQuery)
    );

    const curatedPlaylistMatches: Playlist[] = CURATED_PLAYLISTS.filter(p =>
      p.title.toLowerCase().includes(cleanQuery) ||
      (p.description && p.description.toLowerCase().includes(cleanQuery))
    );

    try {
      // 2. Query Server Canonical Metadata Service
      const res = await fetch(`/api/metadata/search?q=${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const data = await res.json();
        const serverSongs: Song[] = (data.songs || []).map((s: any) => ({
          ...s,
          color: s.color || getDominantColor(`${s.title} ${s.artist}`),
        }));

        const serverAlbums: Album[] = data.albums || [];
        const serverArtists: Artist[] = data.artists || [];

        // Combine server (YouTube direct with verified playbackId) + curated results
        const combinedSongs: Song[] = [...serverSongs];
        const seenSongKeys = new Set(serverSongs.map(s => `${s.title.toLowerCase()}||${s.artist.toLowerCase()}`));

        for (const s of curatedMatches) {
          const key = `${s.title.toLowerCase()}||${s.artist.toLowerCase()}`;
          if (!seenSongKeys.has(key)) {
            seenSongKeys.add(key);
            combinedSongs.push(s);
          }
        }

        const combinedAlbums: Album[] = [...curatedAlbumMatches];
        const seenAlbumKeys = new Set(curatedAlbumMatches.map(a => `${a.title.toLowerCase()}||${a.artist.toLowerCase()}`));
        for (const a of serverAlbums) {
          const key = `${a.title.toLowerCase()}||${a.artist.toLowerCase()}`;
          if (!seenAlbumKeys.has(key)) {
            seenAlbumKeys.add(key);
            combinedAlbums.push(a);
          }
        }

        const combinedArtists: Artist[] = [...curatedArtistMatches];
        const seenArtistKeys = new Set(curatedArtistMatches.map(ar => ar.name.toLowerCase()));
        for (const ar of serverArtists) {
          const key = ar.name.toLowerCase();
          if (!seenArtistKeys.has(key)) {
            seenArtistKeys.add(key);
            combinedArtists.push(ar);
          }
        }

        const finalResults: SearchResults = {
          songs: type === 'all' || type === 'songs' ? combinedSongs : [],
          artists: type === 'all' || type === 'artists' ? combinedArtists : [],
          albums: type === 'all' || type === 'albums' ? combinedAlbums : [],
          playlists: type === 'all' || type === 'playlists' ? curatedPlaylistMatches : [],
        };

        clientMetadataSearchCache.set(cacheKey, finalResults);
        return finalResults;
      }
    } catch (err) {
      console.warn('Server metadata search error, falling back to curated:', err);
    }

    const fallbackResults: SearchResults = {
      songs: curatedMatches,
      artists: curatedArtistMatches,
      albums: curatedAlbumMatches,
      playlists: curatedPlaylistMatches,
    };
    return fallbackResults;
  }

  /**
   * Resolve complete Canonical Album metadata with tracklist and official high-res artwork.
   */
  async getAlbum(id: string): Promise<Album | null> {
    if (clientAlbumCache.has(id)) {
      return clientAlbumCache.get(id)!;
    }

    // Check curated albums first
    const curated = CURATED_ALBUMS.find(a => a.id === id);
    if (curated) {
      clientAlbumCache.set(id, curated);
      return curated;
    }

    try {
      const res = await fetch(`/api/metadata/album?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.album) {
          const loaded: Album = {
            ...json.album,
            tracks: (json.album.tracks || []).map((t: any) => ({
              ...t,
              color: t.color || getDominantColor(`${t.title} ${t.artist}`),
            })),
          };
          clientAlbumCache.set(id, loaded);
          return loaded;
        }
      }
    } catch (err) {
      console.warn('Error fetching album details:', err);
    }

    return null;
  }

  /**
   * Resolve complete Canonical Artist profile with verified portrait, top tracks, and discography.
   */
  async getArtist(id: string): Promise<Artist | null> {
    if (clientArtistCache.has(id)) {
      return clientArtistCache.get(id)!;
    }

    const curated = CURATED_ARTISTS.find(ar => ar.id === id);
    if (curated) {
      clientArtistCache.set(id, curated);
      return curated;
    }

    try {
      const res = await fetch(`/api/metadata/artist?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.artist) {
          const loaded: Artist = {
            ...json.artist,
            topTracks: (json.artist.topTracks || []).map((t: any) => ({
              ...t,
              color: t.color || getDominantColor(`${t.title} ${t.artist}`),
            })),
          };
          clientArtistCache.set(id, loaded);
          return loaded;
        }
      }
    } catch (err) {
      console.warn('Error fetching artist details:', err);
    }

    // Return first curated artist if not found
    return CURATED_ARTISTS[0] || null;
  }
}

export const metadataService = new MetadataService();
