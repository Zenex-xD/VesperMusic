import { Song } from '../types/music';

// Cache for verified resolved playback IDs
const resolvedPlaybackMap = new Map<string, string>();

// Initialize from local storage, purging any legacy corrupted/fallback entries
try {
  const saved = localStorage.getItem('vesper_playback_cache');
  if (saved) {
    const parsed = JSON.parse(saved);
    for (const [k, v] of Object.entries(parsed)) {
      // Purge any stale global 'BddP6PYo2gs' mapping unless the song was actually Kesariya
      if (typeof v === 'string' && (v !== 'BddP6PYo2gs' || k.includes('kesariya'))) {
        resolvedPlaybackMap.set(k, v);
      }
    }
  }
} catch {
  // Ignore local storage quota/security error
}

function getPlaybackKey(song: Song): string {
  const cleanTitle = song.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanArtist = song.artist.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanTitle}|||${cleanArtist}`;
}

export class PlaybackResolver {
  /**
   * Resolves the verified playback ID (e.g. YouTube video ID or direct audio stream)
   * for a canonical track WITHOUT mutating its metadata, album title, or artwork.
   * Ensures a strict 1-to-1 relationship between requested track and playback source.
   */
  async resolvePlayback(
    song: Song
  ): Promise<{ playbackId: string; playbackSource: 'youtube' | 'stream' | 'curated' }> {
    // 1. If song already has verified playbackId or youtubeId specified
    if (song.playbackId && song.playbackId.trim().length > 0) {
      return {
        playbackId: song.playbackId,
        playbackSource: song.playbackSource || 'youtube',
      };
    }
    if (song.youtubeId && song.youtubeId.trim().length > 0) {
      return {
        playbackId: song.youtubeId,
        playbackSource: 'youtube',
      };
    }

    // 2. Check in-memory verified playback cache
    const key = getPlaybackKey(song);
    if (resolvedPlaybackMap.has(key)) {
      const cachedId = resolvedPlaybackMap.get(key)!;
      if (cachedId) {
        return { playbackId: cachedId, playbackSource: 'youtube' };
      }
    }

    // 3. Query the backend independent playback resolution endpoint
    try {
      const res = await fetch('/api/playback/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: song.title,
          artist: song.artist,
          album: song.album,
          duration: song.duration,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.playbackId && typeof json.playbackId === 'string') {
          resolvedPlaybackMap.set(key, json.playbackId);
          this.persistCache();
          return {
            playbackId: json.playbackId,
            playbackSource: json.playbackSource || 'youtube',
          };
        }
      }
    } catch (err) {
      console.warn('Playback resolution network error:', err);
    }

    // 3.5 Client-side direct public YouTube search fallback (for Wasmer / static hosting)
    try {
      const cleanQ = encodeURIComponent(`${song.title} ${song.artist} audio`);
      const endpoints = [
        `https://vid.priv.au/api/v1/search?q=${cleanQ}&type=video`,
        `https://invidious.jing.rocks/api/v1/search?q=${cleanQ}&type=video`,
      ];
      for (const url of endpoints) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2200);
          const iRes = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);
          if (iRes.ok) {
            const data = await iRes.json();
            if (Array.isArray(data) && data.length > 0 && data[0].videoId) {
              const vid = data[0].videoId;
              resolvedPlaybackMap.set(key, vid);
              this.persistCache();
              return { playbackId: vid, playbackSource: 'youtube' };
            }
          }
        } catch {}
      }
    } catch {}

    // 4. Fallback to direct streamUrl if available on the canonical track
    if (song.streamUrl && song.streamUrl.trim().length > 0) {
      return {
        playbackId: '',
        playbackSource: 'stream',
      };
    }

    // 5. Strictly NEVER play an unrelated fallback song.
    // If no verified match is found, throw an explicit error to inform the player UI.
    throw new Error('Playback unavailable for this track');
  }

  private persistCache() {
    try {
      const obj: Record<string, string> = {};
      let count = 0;
      for (const [k, v] of resolvedPlaybackMap.entries()) {
        if (v && (v !== 'BddP6PYo2gs' || k.includes('kesariya'))) {
          obj[k] = v;
          count++;
          if (count > 250) break; // bounded size
        }
      }
      localStorage.setItem('vesper_playback_cache', JSON.stringify(obj));
    } catch {
      // Ignore quota errors
    }
  }
}

export const playbackResolver = new PlaybackResolver();
