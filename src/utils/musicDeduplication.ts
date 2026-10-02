import { Song } from '../types/music';

export type MusicCulture = 'bollywood' | 'punjabi' | 'english';

/**
 * Extracts the core semantic title of a song by stripping out brackets,
 * common modifiers, remix/lofi/reverb/slowed tags, and non-alphanumeric symbols.
 */
export function getCoreTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  return rawTitle
    .toLowerCase()
    // Remove content in parentheses and brackets: e.g. (Slowed + Reverb), [Official Video]
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    // Remove trailing dashes and descriptors: e.g. - Lofi Mix, - Female Version
    .replace(/-\s*(official|video|audio|lyric|remix|lofi|slowed|reverb|version|acoustic|live|cover|reprise).*/i, '')
    // Remove individual modifier keywords
    .replace(/\b(slowed|reverb|lofi|lo-fi|remix|reprise|cover|version|audio|video|lyrics?|song|hook|status|edit|soundtrack|ost)\b/gi, '')
    // Remove all non-alphanumeric characters
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Checks if two song titles refer to the same underlying song or variation.
 */
export function isSameSongOrDuplicate(titleA: string, titleB: string): boolean {
  const coreA = getCoreTitle(titleA);
  const coreB = getCoreTitle(titleB);

  if (!coreA || !coreB) return false;
  if (coreA === coreB) return true;

  // If one core title is a substring of another and significant length matches
  if (coreA.includes(coreB) || coreB.includes(coreA)) {
    const minLen = Math.min(coreA.length, coreB.length);
    const maxLen = Math.max(coreA.length, coreB.length);
    // If core length is at least 4 characters and covers > 50% of the longer title
    if (minLen >= 4 && minLen / maxLen > 0.5) {
      return true;
    }
  }

  return false;
}

/**
 * Detects whether a song belongs to Bollywood/Hindi/Desi, Punjabi, or English/Western.
 */
export function detectMusicCulture(song: {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
}): MusicCulture {
  const text = `${song.title || ''} ${song.artist || ''} ${song.album || ''} ${song.genre || ''}`.toLowerCase();

  // 1. Explicit Hindi / Bollywood / Desi artists and keywords
  const bollywoodKeywords = [
    'bollywood', 'hindi', 'sufi', 'filmi', 'arijit', 'tanishk', 'pritam', 'shreya', 'jubin',
    'neha kakkar', 'atif aslam', 'mohit chauhan', 'sonu nigam', 'alka yagnik', 'kumar sanu', 'udit narayan',
    'badshah', 'honey singh', 'darshan raval', 'vishal mishra', 'mithoon', 'sachin-jigar', 'shankar-ehsaan-loy',
    'a.r. rahman', 'ar rahman', 'anuv jain', 'prateek kuhad', 'jasleen royal', 'faheem abdullah', 'arslan nizami',
    'irshad kamil', 'b praak', 'jaani', 'kailash kher', 'shilpa rao', 'sunidhi chauhan', 'kk', 'shaan',
    'saiyaara', 'tum hi ho', 'kesariya', 'apna bana le', 'channa mereya', 'chaleya', 'o maahi', 'satranga', 'sajni',
    'heeriye', 'tum se hi', 'kun faya kun', 'pee loon', 'shershaah', 'aashiqui', 'jawan', 'animal', 'brahmastra',
    'kalank', 'kabir singh', 'dhoom', 'ek tha tiger', 'dilwale', 'yeh jawaani hai deewani', 'rockstar', 'raataan lambiyan'
  ];

  // 2. Punjabi & Desi Hip-Hop artists and keywords
  const punjabiKeywords = [
    'punjabi', 'diljit', 'dosanjh', 'ap dhillon', 'sidhu', 'moose wala', 'karan aujla', 'shubh', 'amrinder gill',
    'dhanda nyoliwala', 'dhanda', 'dil de baithi', 'shevv', 'krsna', 'divine', 'mc stan', 'king', 'raftaar',
    'emiway', 'seedhe maut', 'talwiinder', 'desi melbourniye', 'russian bandana', 'gangsta',
    'brown munde', 'excuses', 'with you', 'lover', 'born to shine', 'cheques', 'baller', 'tauba tauba'
  ];

  // 3. Western / English artists and keywords
  const englishKeywords = [
    'the weeknd', 'taylor swift', 'ed sheeran', 'drake', 'sza', 'juice wrld', 'xxxtentacion', 'post malone',
    'billie eilish', 'dua lipa', 'bruno mars', 'coldplay', 'justin bieber', 'ariana grande', 'rema', 'calm down',
    'synthpop', 'r&b / darkwave', 'hip-hop / dancehall', 'blinding lights', 'starboy', 'snooze', 'kill bill', 'die for you',
    'randy travis', 'country', 'western'
  ];

  for (const kw of punjabiKeywords) {
    if (text.includes(kw)) return 'punjabi';
  }
  for (const kw of bollywoodKeywords) {
    if (text.includes(kw)) return 'bollywood';
  }
  for (const kw of englishKeywords) {
    if (text.includes(kw)) return 'english';
  }

  // Check if text has Devanagari script
  if (/[\u0900-\u097F]/.test(text)) return 'bollywood';

  // Check if genre is Western
  if (/\b(country|classic rock|heavy metal|western|americana)\b/i.test(text)) return 'english';

  // Default to bollywood for the Indian music experience
  return 'bollywood';
}

/**
 * Deduplicates a list of songs:
 * - Drops any song that is a duplicate of `seedSong` (if provided)
 * - Drops subsequent songs in the list that duplicate earlier ones
 */
export function deduplicateSongs(songs: Song[], seedSong?: Song): Song[] {
  const seenCoreTitles = new Set<string>();

  if (seedSong) {
    const seedCore = getCoreTitle(seedSong.title);
    if (seedCore) {
      seenCoreTitles.add(seedCore);
    }
  }

  const result: Song[] = [];

  for (const song of songs) {
    if (!song || !song.title) continue;

    // Skip if identical to seedSong by ID
    if (seedSong && (song.id === seedSong.id || (song.playbackId && song.playbackId === seedSong.playbackId))) {
      continue;
    }

    // Skip if duplicate of seedSong by core title
    if (seedSong && isSameSongOrDuplicate(song.title, seedSong.title)) {
      continue;
    }

    const core = getCoreTitle(song.title);
    if (seenCoreTitles.has(core)) {
      continue;
    }

    seenCoreTitles.add(core);
    result.push(song);
  }

  return result;
}

/**
 * Strict culture/vibe filter:
 * Guarantees that if the seed song is Bollywood/Hindi, ALL recommendations are Bollywood/Hindi.
 * NEVER allows English tracks (like The Weeknd, Drake, SZA) into a Bollywood queue, and vice-versa!
 */
export function filterSameCultureSongs(songs: Song[], seedSong: Song): Song[] {
  const targetCulture = detectMusicCulture(seedSong);

  // Filter only matching culture
  const cultureMatched = songs.filter(s => {
    if (!s || !s.title) return false;
    const songCulture = detectMusicCulture(s);
    return songCulture === targetCulture;
  });

  // Deduplicate against seed and internal list
  return deduplicateSongs(cultureMatched, seedSong);
}
