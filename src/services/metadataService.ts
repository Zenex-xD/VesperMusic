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

        if (serverSongs.length > 0 || serverAlbums.length > 0 || serverArtists.length > 0) {
          // Combine server + curated results
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
      }
    } catch (err) {
      console.warn('Server metadata search error, falling back to client-side catalog:', err);
    }

    // 3. Client-Side Direct Public iTunes Catalog Fallback (Works 100% on Wasmer / Static Deployments)
    try {
      const itunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&entity=song&limit=40`
      );
      if (itunesRes.ok) {
        const itunesData = await itunesRes.json();
        const results = itunesData.results || [];

        const itunesSongs: Song[] = [];
        const albumMap = new Map<string, Album>();
        const artistMap = new Map<string, Artist>();

        for (const item of results) {
          if (!item.trackName || !item.artistName) continue;
          const artwork = (item.artworkUrl100 || '').replace('100x100bb', '600x600bb');
          const duration = Math.round((item.trackTimeMillis || 180000) / 1000);

          itunesSongs.push({
            id: `itunes-track-${item.trackId}`,
            title: item.trackName,
            artist: item.artistName,
            album: item.collectionName || 'Single',
            artwork: artwork || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop',
            duration,
            streamUrl: item.previewUrl || '',
            provider: 'itunes',
            playbackSource: 'stream',
            genre: item.primaryGenreName || 'Music',
            releaseDate: item.releaseDate ? item.releaseDate.slice(0, 10) : undefined,
            color: getDominantColor(`${item.trackName} ${item.artistName}`),
          });

          if (item.collectionId && item.collectionName && !albumMap.has(item.collectionName)) {
            albumMap.set(item.collectionName, {
              id: `itunes-album-${item.collectionId}`,
              title: item.collectionName,
              artist: item.artistName,
              artwork,
              releaseYear: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 2024,
              trackCount: item.trackCount || 1,
              genre: item.primaryGenreName || 'Music',
              provider: 'itunes',
              tracks: [],
            });
          }

          if (item.artistId && item.artistName && !artistMap.has(item.artistName)) {
            artistMap.set(item.artistName, {
              id: `itunes-artist-${item.artistId}`,
              name: item.artistName,
              artwork,
              monthlyListeners: 120000,
              provider: 'itunes',
              topTracks: [],
              albums: [],
            });
          }
        }

        const combinedSongs = [...itunesSongs];
        for (const s of curatedMatches) {
          if (!combinedSongs.some(cs => cs.id === s.id)) {
            combinedSongs.push(s);
          }
        }

        const clientResults: SearchResults = {
          songs: type === 'all' || type === 'songs' ? combinedSongs : [],
          artists: type === 'all' || type === 'artists' ? Array.from(artistMap.values()) : [],
          albums: type === 'all' || type === 'albums' ? Array.from(albumMap.values()) : [],
          playlists: type === 'all' || type === 'playlists' ? curatedPlaylistMatches : [],
        };

        if (clientResults.songs.length > 0) {
          clientMetadataSearchCache.set(cacheKey, clientResults);
          return clientResults;
        }
      }
    } catch (itunesErr) {
      console.warn('Direct iTunes search error:', itunesErr);
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

    // Direct iTunes lookup fallback for album
    if (id.startsWith('itunes-album-')) {
      try {
        const rawId = id.replace('itunes-album-', '');
        const itunesRes = await fetch(`https://itunes.apple.com/lookup?id=${rawId}&entity=song`);
        if (itunesRes.ok) {
          const data = await itunesRes.json();
          const items = data.results || [];
          const albumItem = items.find((i: any) => i.wrapperType === 'collection') || items[0];
          const trackItems = items.filter((i: any) => i.wrapperType === 'track');

          if (albumItem) {
            const artwork = (albumItem.artworkUrl100 || '').replace('100x100bb', '600x600bb');
            const loaded: Album = {
              id,
              title: albumItem.collectionName || 'Album',
              artist: albumItem.artistName || 'Various Artists',
              artwork,
              releaseYear: albumItem.releaseDate ? new Date(albumItem.releaseDate).getFullYear() : 2024,
              trackCount: trackItems.length || albumItem.trackCount || 1,
              genre: albumItem.primaryGenreName || 'Music',
              provider: 'itunes',
              tracks: trackItems.map((t: any) => ({
                id: `itunes-track-${t.trackId}`,
                title: t.trackName,
                artist: t.artistName,
                album: t.collectionName || albumItem.collectionName,
                artwork,
                duration: Math.round((t.trackTimeMillis || 180000) / 1000),
                streamUrl: t.previewUrl || '',
                provider: 'itunes',
                playbackSource: 'stream',
                genre: t.primaryGenreName || 'Music',
                color: getDominantColor(`${t.trackName} ${t.artistName}`),
              })),
            };
            clientAlbumCache.set(id, loaded);
            return loaded;
          }
        }
      } catch (err) {
        console.warn('Direct iTunes album lookup error:', err);
      }
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

    // Direct iTunes lookup fallback for artist
    if (id.startsWith('itunes-artist-')) {
      try {
        const rawId = id.replace('itunes-artist-', '');
        const itunesRes = await fetch(`https://itunes.apple.com/lookup?id=${rawId}&entity=song&limit=25`);
        if (itunesRes.ok) {
          const data = await itunesRes.json();
          const items = data.results || [];
          const artistItem = items.find((i: any) => i.wrapperType === 'artist') || items[0];
          const trackItems = items.filter((i: any) => i.wrapperType === 'track');

          if (artistItem || trackItems.length > 0) {
            const firstArtwork = trackItems[0]?.artworkUrl100
              ? trackItems[0].artworkUrl100.replace('100x100bb', '600x600bb')
              : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop';

            const loaded: Artist = {
              id,
              name: artistItem?.artistName || trackItems[0]?.artistName || 'Artist',
              artwork: firstArtwork,
              monthlyListeners: 250000,
              provider: 'itunes',
              topTracks: trackItems.map((t: any) => ({
                id: `itunes-track-${t.trackId}`,
                title: t.trackName,
                artist: t.artistName,
                album: t.collectionName || 'Single',
                artwork: (t.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
                duration: Math.round((t.trackTimeMillis || 180000) / 1000),
                streamUrl: t.previewUrl || '',
                provider: 'itunes',
                playbackSource: 'stream',
                genre: t.primaryGenreName || 'Music',
                color: getDominantColor(`${t.trackName} ${t.artistName}`),
              })),
              albums: [],
            };
            clientArtistCache.set(id, loaded);
            return loaded;
          }
        }
      } catch (err) {
        console.warn('Direct iTunes artist lookup error:', err);
      }
    }

    // Return first curated artist if not found
    return CURATED_ARTISTS[0] || null;
  }
}

export const metadataService = new MetadataService();
