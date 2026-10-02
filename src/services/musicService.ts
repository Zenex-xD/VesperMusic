import { Album, Artist, LyricsData, MusicProvider, Playlist, SearchResults, Song } from '../types/music';
import { CURATED_ALBUMS, CURATED_ARTISTS, CURATED_PLAYLISTS, CURATED_SONGS } from './curatedCatalog';
import { fetchLyricsForSong } from './lyricsService';
import { metadataService } from './metadataService';
import { playbackResolver } from './playbackResolver';
import { deduplicateSongs, detectMusicCulture, filterSameCultureSongs } from '../utils/musicDeduplication';

/**
 * Unified Apple Music-Style Music Engine
 * Strictly separates Catalog Metadata (Title, Artist, Album, Artwork, Duration)
 * from Playback Resolution (playbackId / videoId).
 */
export class AppleMusicEngine implements MusicProvider {
  name = 'AeroX Catalog Engine';
  id = 'aerox-apple-music-engine';

  /**
   * Search canonical catalog (Metadata Layer).
   * Resolves canonical songs, artists, albums, and playlists.
   */
  async search(query: string, filter?: 'all' | 'songs' | 'artists' | 'albums' | 'playlists'): Promise<SearchResults> {
    return metadataService.search(query, filter || 'all');
  }

  /**
   * Resolve a specific song by ID.
   */
  async getSong(id: string): Promise<Song | null> {
    // 1. Check curated catalog
    const local = CURATED_SONGS.find(s => s.id === id || s.youtubeId === id || s.playbackId === id);
    if (local) return local;

    // 2. Check within albums
    for (const album of CURATED_ALBUMS) {
      const found = album.tracks.find(t => t.id === id || t.youtubeId === id || t.playbackId === id);
      if (found) return found;
    }

    // 3. If track belongs to iTunes or Deezer, do a targeted search
    if (id.startsWith('itunes-track-') || id.startsWith('deezer-track-')) {
      const rawId = id.replace(/^(itunes-track-|deezer-track-)/, '');
      const searchRes = await metadataService.search(rawId, 'songs');
      const match = searchRes.songs.find(s => s.id === id);
      if (match) return match;
    }

    return null;
  }

  /**
   * Resolve complete canonical Album with tracklist and pristine high-res artwork.
   */
  async getAlbum(id: string): Promise<Album | null> {
    return metadataService.getAlbum(id);
  }

  /**
   * Resolve complete canonical Artist profile with genuine portrait and discography.
   */
  async getArtist(id: string): Promise<Artist | null> {
    return metadataService.getArtist(id);
  }

  /**
   * Resolve playlist by ID.
   */
  async getPlaylist(id: string): Promise<Playlist | null> {
    const local = CURATED_PLAYLISTS.find(p => p.id === id);
    if (local) return local;
    return null;
  }

  /**
   * Get trending / chart tracks with canonical metadata.
   */
  async getTrending(limit: number = 20): Promise<Song[]> {
    return CURATED_SONGS.slice(0, limit);
  }

  /**
   * Get recommended tracks.
   */
  async getRecommended(_seedSongIds?: string[]): Promise<Song[]> {
    const base = [...CURATED_SONGS];
    return base.sort(() => Math.random() - 0.5);
  }

  /**
   * Get smart Song Radio / infinite recommendations for currently playing song.
   * Guarantees diverse, high-vibe tracks strictly matching the language, culture & vibe with NO duplicates.
   */
  async getSongRadio(song: Song, excludeTitles: string[] = []): Promise<Song[]> {
    let recs: Song[] = [];
    try {
      const excludeParam =
        excludeTitles.length > 0 ? `&exclude=${encodeURIComponent(excludeTitles.slice(0, 30).join(","))}` : "";
      const res = await fetch(
        `/api/radio/recommendations?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(
          song.artist
        )}&genre=${encodeURIComponent(song.genre || "")}${excludeParam}`
      );
      if (res.ok) {
        const data = await res.json();
        const serverRecs: Song[] = data.recommendations || [];
        // Strictly filter to ensure culture/language matches (NO English songs for Bollywood!)
        recs = filterSameCultureSongs(serverRecs, song);
      }
    } catch (e) {
      console.warn("Radio fetch error:", e);
    }

    // Only fallback if server returned zero tracks
    if (recs.length === 0) {
      const related = await this.getRelatedSongs(song);
      const combined = [...related.artistTopSongs, ...related.similarSongs];
      recs = filterSameCultureSongs(combined, song);
    }

    return recs;
  }

  /**
   * Get related tracks for currently playing song strictly matching the same culture and vibe.
   */
  async getRelatedSongs(song: Song): Promise<{ artistTopSongs: Song[]; similarSongs: Song[] }> {
    const targetCulture = detectMusicCulture(song);

    // Only look at songs from the exact same culture (e.g. Hindi/Bollywood NEVER mixes with Western/English!)
    const sameCultureSongs = CURATED_SONGS.filter(s => {
      if (s.id === song.id) return false;
      return detectMusicCulture(s) === targetCulture;
    });

    const primaryArtist = (song.artist || '').split(',')[0].split('&')[0].trim().toLowerCase();

    // 1. Artist's other songs
    const artistTop = sameCultureSongs.filter(s => {
      const sArtist = s.artist.toLowerCase();
      return sArtist.includes(primaryArtist) || (primaryArtist.length > 3 && primaryArtist.includes(sArtist));
    });

    // 2. Similar vibe songs (different artists of the same culture)
    const similar = sameCultureSongs.filter(s => !artistTop.includes(s));

    const cleanArtistTop = deduplicateSongs(artistTop, song);
    const cleanSimilar = deduplicateSongs(similar, song);

    return {
      artistTopSongs: cleanArtistTop.length > 0 ? cleanArtistTop.slice(0, 6) : cleanSimilar.slice(0, 4),
      similarSongs: cleanSimilar.slice(0, 8),
    };
  }

  async getFeaturedPlaylists(): Promise<Playlist[]> {
    return CURATED_PLAYLISTS;
  }

  async getTopArtists(): Promise<Artist[]> {
    return CURATED_ARTISTS;
  }

  async getFeaturedAlbums(): Promise<Album[]> {
    return CURATED_ALBUMS;
  }

  async getLyrics(song: Song): Promise<LyricsData> {
    return fetchLyricsForSong(song);
  }

  /**
   * Resolve playback target (Playback Layer).
   */
  async resolvePlayback(song: Song): Promise<{ playbackId: string; playbackSource: 'youtube' | 'stream' | 'curated' }> {
    return playbackResolver.resolvePlayback(song);
  }
}

export const musicService = new AppleMusicEngine();
