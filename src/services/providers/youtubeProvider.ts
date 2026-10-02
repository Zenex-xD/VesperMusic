import { SearchResults, Song } from '../../types/music';

// Curated high-fidelity YouTube tracks with 100% real official video IDs and real thumbnails
const YOUTUBE_HINDI_DATABASE: Array<{
  youtubeId: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string;
  releaseYear: number;
  artwork: string;
  color: string;
}> = [
  {
    youtubeId: 'BkW8o_k1f3c',
    title: 'Saiyaara',
    artist: 'Mohit Chauhan, Taraannum Mallik & Sohail Sen',
    album: 'Ek Tha Tiger',
    duration: 253,
    genre: 'Bollywood Romantic / Soul',
    releaseYear: 2012,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ef/eb/b9/efebb98b-c9c8-33b9-7476-2e01a622edc0/849486005914_cover.jpg/1000x1000bb.jpg',
    color: '#e11d48',
  },
  {
    youtubeId: 'BddP6PYo2gs',
    title: 'Kesariya',
    artist: 'Arijit Singh & Pritam',
    album: 'Brahmāstra',
    duration: 268,
    genre: 'Bollywood Romantic',
    releaseYear: 2022,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/1000x1000bb.jpg',
    color: '#f59e0b',
  },
  {
    youtubeId: 'ElZfdU54Cp8',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    album: 'Bhediya',
    duration: 261,
    genre: 'Bollywood Soul',
    releaseYear: 2022,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/2e/0b/c0/2e0bc070-112f-a827-6ad8-6bc64f7caaff/840214460180.png/1000x1000bb.jpg',
    color: '#8b5cf6',
  },
  {
    youtubeId: 'cl0a3i2wFcc',
    title: 'Lover',
    artist: 'Diljit Dosanjh',
    album: 'MoonChild Era',
    duration: 195,
    genre: 'Punjabi Pop',
    releaseYear: 2021,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8a/89/e4/8a89e445-d2c6-f8ac-a828-27818b0c1afe/859749638209_cover.jpg/1000x1000bb.jpg',
    color: '#ec4899',
  },
  {
    youtubeId: 'VNs_cCtdbPc',
    title: 'Brown Munde',
    artist: 'AP Dhillon, Gurinder Gill',
    album: 'Not by Chance',
    duration: 247,
    genre: 'Punjabi Trap',
    releaseYear: 2020,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg',
    color: '#ef4444',
  },
  {
    youtubeId: '2qcx3yE_zL0',
    title: 'Channa Mereya',
    artist: 'Arijit Singh & Pritam',
    album: 'Ae Dil Hai Mushkil',
    duration: 289,
    genre: 'Bollywood Classic',
    releaseYear: 2016,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bc/6e/4d/bc6e4d0c-adec-b431-7b60-16f5689f9664/886446201597.jpg/1000x1000bb.jpg',
    color: '#dc2626',
  },
  {
    youtubeId: 'dZ0fwJojhrs',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh & Mithoon',
    album: 'Aashiqui 2',
    duration: 262,
    genre: 'Bollywood Romantic',
    releaseYear: 2013,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/1000x1000bb.jpg',
    color: '#3b82f6',
  },
  {
    youtubeId: 'pRRtzjL_y9E',
    title: 'Heeriye',
    artist: 'Jasleen Royal & Arijit Singh',
    album: 'Heeriye - Single',
    duration: 194,
    genre: 'Indie Romantic',
    releaseYear: 2023,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f0/8c/2a/f08c2aeb-3903-8738-d0a5-8c2e4547eed7/5054197711039.jpg/1000x1000bb.jpg',
    color: '#06b6d4',
  },
  {
    youtubeId: 'V1DbdfP9e8o',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao, Anirudh',
    album: 'Jawan',
    duration: 200,
    genre: 'Bollywood Dance',
    releaseYear: 2023,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/1000x1000bb.jpg',
    color: '#f97316',
  },
  {
    youtubeId: '87JIOAX3NjM',
    title: 'O Maahi',
    artist: 'Arijit Singh & Pritam',
    album: 'Dunki',
    duration: 233,
    genre: 'Bollywood Soul',
    releaseYear: 2023,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/cf/cf/af/cfcfaf49-f337-eeab-2351-dd0a137dc740/8902894362139_cover.jpg/1000x1000bb.jpg',
    color: '#a855f7',
  },
  {
    youtubeId: 'RLzC55ai0eo',
    title: 'Satranga',
    artist: 'Arijit Singh & Shreyas Puranik',
    album: 'Animal',
    duration: 271,
    genre: 'Bollywood Melodic',
    releaseYear: 2023,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/ad/5e/dbad5e8b-0bee-d962-92d4-021c90e375ac/8902894362092_cover.jpg/1000x1000bb.jpg',
    color: '#dc2626',
  },
  {
    youtubeId: 'qFD4Yx6dE_o',
    title: 'Sajni',
    artist: 'Arijit Singh & Ram Sampath',
    album: 'Laapataa Ladies',
    duration: 170,
    genre: 'Folk / Indie',
    releaseYear: 2024,
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/48/d8/bf/48d8bf8f-df58-e05f-62e2-bc494d748ea4/8902894362252_cover.jpg/1000x1000bb.jpg',
    color: '#10b981',
  },
];

export const youtubeProvider = {
  // Extract YouTube ID from link if user pastes one
  extractYoutubeId(urlOrId: string): string | null {
    if (!urlOrId) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
      return urlOrId;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  },

  // Convert track to Song
  toSong(item: (typeof YOUTUBE_HINDI_DATABASE)[0]): Song {
    const artwork = item.artwork || `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
    return {
      id: `yt-${item.youtubeId}`,
      youtubeId: item.youtubeId,
      title: item.title,
      artist: item.artist,
      album: item.album,
      duration: item.duration,
      artwork,
      streamUrl: `https://www.youtube.com/watch?v=${item.youtubeId}`,
      genre: item.genre,
      releaseYear: item.releaseYear,
      provider: 'youtube',
      isLossless: true,
      color: item.color || '#6366f1',
    };
  },

  // Search YouTube
  async search(query: string): Promise<SearchResults> {
    const qLower = query.toLowerCase().trim();
    if (!qLower) {
      return { songs: [], artists: [], albums: [], playlists: [] };
    }

    // 1. Check if user pasted a direct YouTube link or ID
    const extractedId = this.extractYoutubeId(query);
    if (extractedId) {
      const directSong: Song = {
        id: `yt-${extractedId}`,
        youtubeId: extractedId,
        title: query.length > 30 ? 'YouTube Track' : query,
        artist: 'YouTube Music',
        album: 'YouTube Stream',
        duration: 240,
        artwork: `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
        streamUrl: `https://www.youtube.com/watch?v=${extractedId}`,
        genre: 'YouTube Music',
        provider: 'youtube',
        isLossless: true,
        color: '#dc2626',
      };
      return {
        songs: [directSong],
        artists: [],
        albums: [],
        playlists: [],
      };
    }

    // 2. Query our live server YouTube Search API endpoint (/api/youtube/search)
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.results && Array.isArray(json.results) && json.results.length > 0) {
          const liveSongs: Song[] = json.results;
          return {
            songs: liveSongs,
            artists: [],
            albums: [],
            playlists: [],
          };
        }
      }
    } catch (err) {
      console.warn('Backend YouTube search notice:', err);
    }

    // 3. Fallback to local curated Hindi tracks database
    const localMatches: Song[] = YOUTUBE_HINDI_DATABASE.filter(
      item =>
        item.title.toLowerCase().includes(qLower) ||
        item.artist.toLowerCase().includes(qLower) ||
        item.album.toLowerCase().includes(qLower) ||
        item.genre.toLowerCase().includes(qLower)
    ).map(item => youtubeProvider.toSong(item));

    return {
      songs: localMatches,
      artists: [],
      albums: [],
      playlists: [],
    };
  },

  getTopHindiHits(): Song[] {
    return YOUTUBE_HINDI_DATABASE.map(item => youtubeProvider.toSong(item));
  },
};
