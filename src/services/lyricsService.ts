import { LyricLine, LyricsData, Song } from '../types/music';

// Parse standard LRC format string into synchronized lyric lines
export function parseLrc(lrcText: string): LyricLine[] {
  if (!lrcText) return [];
  const lines = lrcText.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains timestamp
    const matches = [...trimmed.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = trimmed.replace(timeRegex, '').trim();
      for (const match of matches) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const milliseconds = match[3]
          ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10)
          : 0;
        const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;

        if (text) {
          result.push({ time: totalSeconds, text });
        }
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

/**
 * Clean string for reliable lyrics matching
 */
function cleanQueryParam(str: string): string {
  return str
    .replace(/\s*\(feat\..+?\)/gi, '')
    .replace(/\s*\[feat\..+?\]/gi, '')
    .replace(/\s*\(with.+?\)/gi, '')
    .replace(/\s*\(From\s+["']?[^"']+["']?\)/gi, '')
    .replace(/\s*\(Official.+?\)/gi, '')
    .replace(/\s*\[Official.+?\]/gi, '')
    .trim();
}

/**
 * Fetch genuine lyrics for a canonical song.
 * Uses exact canonical metadata (title + artist + album + duration).
 * Strictly NO fabricated/mock lyrics.
 */
export async function fetchLyricsForSong(song: Song): Promise<LyricsData> {
  // 1. If song has authentic embedded lyrics with LRC timestamps
  if (song.lyrics && song.lyrics.trim().length > 0) {
    if (song.lyrics.includes('[00:') || song.lyrics.includes('[01:')) {
      const lines = parseLrc(song.lyrics);
      if (lines.length > 0) {
        return {
          isSynced: true,
          lines,
          rawText: song.lyrics,
          source: 'Canonical LRC',
        };
      }
    }

    // Authentic plain text lyrics
    const textLines = song.lyrics
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(text => ({ time: 0, text }));

    if (textLines.length > 0) {
      return {
        isSynced: false,
        lines: textLines,
        rawText: song.lyrics,
        source: 'Canonical Text',
      };
    }
  }

  const cleanTitle = cleanQueryParam(song.title);
  const cleanArtist = cleanQueryParam(song.artist.split(',')[0].split('&')[0]);

  // 2. Query LRCLIB direct get endpoint with canonical track identity
  try {
    const params = new URLSearchParams({
      track_name: cleanTitle,
      artist_name: cleanArtist,
    });

    if (song.album) {
      const cleanAlbum = cleanQueryParam(song.album);
      if (cleanAlbum) params.append('album_name', cleanAlbum);
    }
    if (song.duration && song.duration > 0) {
      params.append('duration', Math.round(song.duration).toString());
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://lrclib.net/api/get?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        'Lrclib-Client': 'AeroXMusicApp/2.0',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.syncedLyrics) {
        const lines = parseLrc(data.syncedLyrics);
        if (lines.length > 0) {
          return {
            isSynced: true,
            lines,
            rawText: data.syncedLyrics,
            source: 'LRCLIB Synced',
          };
        }
      }
      if (data.plainLyrics && data.plainLyrics.trim().length > 0) {
        const plainLines = data.plainLyrics
          .split('\n')
          .map((l: string) => l.trim())
          .filter(Boolean)
          .map((text: string) => ({
            time: 0,
            text,
          }));
        if (plainLines.length > 0) {
          return {
            isSynced: false,
            lines: plainLines,
            rawText: data.plainLyrics,
            source: 'LRCLIB Plain',
          };
        }
      }
    }
  } catch {
    // Network or abort - continue to fallback search
  }

  // 3. Query LRCLIB search endpoint as secondary lookup for minor title punctuation discrepancies
  try {
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanArtist} ${cleanTitle}`)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'Lrclib-Client': 'AeroXMusicApp/2.0',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        // Find best match verifying artist & title
        const normTitle = cleanTitle.toLowerCase();
        const normArtist = cleanArtist.toLowerCase();

        const match = list.find((item: any) => {
          const itemTitle = (item.trackName || '').toLowerCase();
          const itemArtist = (item.artistName || '').toLowerCase();
          return (
            (itemTitle.includes(normTitle) || normTitle.includes(itemTitle)) &&
            (itemArtist.includes(normArtist) || normArtist.includes(itemArtist))
          );
        }) || list[0];

        if (match) {
          if (match.syncedLyrics) {
            const lines = parseLrc(match.syncedLyrics);
            if (lines.length > 0) {
              return {
                isSynced: true,
                lines,
                rawText: match.syncedLyrics,
                source: 'LRCLIB Synced',
              };
            }
          }
          if (match.plainLyrics && match.plainLyrics.trim().length > 0) {
            const plainLines = match.plainLyrics
              .split('\n')
              .map((l: string) => l.trim())
              .filter(Boolean)
              .map((text: string) => ({
                time: 0,
                text,
              }));
            if (plainLines.length > 0) {
              return {
                isSynced: false,
                lines: plainLines,
                rawText: match.plainLyrics,
                source: 'LRCLIB Plain',
              };
            }
          }
        }
      }
    }
  } catch {
    // Network or abort
  }

  // 4. Return unavailable if no genuine lyrics exist — strictly NO fake data
  return {
    isSynced: false,
    lines: [],
    rawText: '',
    source: 'Unavailable',
  };
}
