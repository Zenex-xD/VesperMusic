import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory caches for high-speed repeated searches and metadata lookups
const searchMetadataCache = new Map<string, any>();
const albumMetadataCache = new Map<string, any>();
const artistMetadataCache = new Map<string, any>();
const playbackCache = new Map<string, { playbackId: string; playbackSource: string }>();
const serverArtworkCache = new Map<string, string>();

// Helper to upgrade iTunes artwork to ultra-high-resolution (1000x1000 or 600x600)
function upgradeAppleArtwork(url?: string, size = 1000): string {
  if (!url) return "";
  return url
    .replace(/\/\d+x\d+bb\./, `/${size}x${size}bb.`)
    .replace(/\/\d+x\d+\./, `/${size}x${size}.`);
}

// Helper to clean up titles for exact metadata matching
function normalizeText(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// -------------------------------------------------------------
// 1. METADATA / CATALOG LAYER
// -------------------------------------------------------------

interface CanonicalTrack {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album?: string;
  albumId?: string;
  artwork: string;
  artistArtwork?: string;
  duration: number;
  playbackId?: string;
  playbackSource?: "youtube" | "stream" | "curated";
  releaseDate?: string;
  releaseYear?: number | string;
  genre?: string;
  streamUrl?: string;
  youtubeId?: string;
  isLossless?: boolean;
  color?: string;
  lyrics?: string;
  provider?: string;
}

interface CanonicalAlbum {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  artwork: string;
  releaseYear: number | string;
  releaseDate?: string;
  trackCount: number;
  genre?: string;
  description?: string;
  tracks: CanonicalTrack[];
  provider: string;
}

interface CanonicalArtist {
  id: string;
  name: string;
  artwork: string;
  bannerArtwork?: string;
  monthlyListeners?: number;
  bio?: string;
  verified?: boolean;
  genre?: string;
  topTracks: CanonicalTrack[];
  albums?: CanonicalAlbum[];
  similarArtists?: { id: string; name: string; artwork: string }[];
  provider: string;
}

// Search official Apple Music / iTunes Catalog
async function searchItunesCatalog(query: string): Promise<{
  songs: CanonicalTrack[];
  albums: CanonicalAlbum[];
  artists: CanonicalArtist[];
}> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&entity=song,album,musicArtist&limit=30&country=IN`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AppleMusicCatalogClient/2.0" },
    });

    if (!res.ok) return { songs: [], albums: [], artists: [] };

    const data = await res.json();
    const results = data.results || [];

    const songs: CanonicalTrack[] = [];
    const albums: CanonicalAlbum[] = [];
    const artists: CanonicalArtist[] = [];
    const seenSongIds = new Set<string>();
    const seenAlbumIds = new Set<string>();
    const seenArtistIds = new Set<string>();

    for (const item of results) {
      if (item.wrapperType === "track" && item.kind === "song") {
        const id = `itunes-track-${item.trackId}`;
        if (seenSongIds.has(id)) continue;
        seenSongIds.add(id);

        const artwork = upgradeAppleArtwork(item.artworkUrl100, 1000);
        const duration = Math.round((item.trackTimeMillis || 210000) / 1000);
        const releaseYear = item.releaseDate
          ? new Date(item.releaseDate).getFullYear()
          : new Date().getFullYear();

        songs.push({
          id,
          title: item.trackName || "Unknown Title",
          artist: item.artistName || "Unknown Artist",
          artistId: item.artistId ? `itunes-artist-${item.artistId}` : undefined,
          album: item.collectionName || "Single",
          albumId: item.collectionId
            ? `itunes-album-${item.collectionId}`
            : undefined,
          artwork: artwork || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
          artistArtwork: undefined,
          duration,
          playbackId: undefined, // Playback resolved independently
          playbackSource: "youtube",
          releaseDate: item.releaseDate
            ? item.releaseDate.split("T")[0]
            : undefined,
          releaseYear,
          genre: item.primaryGenreName || "Pop",
          streamUrl: item.previewUrl || "",
          isLossless: true,
          provider: "itunes",
        });
      } else if (
        item.wrapperType === "collection" ||
        item.collectionType === "Album"
      ) {
        const id = `itunes-album-${item.collectionId}`;
        if (seenAlbumIds.has(id)) continue;
        seenAlbumIds.add(id);

        const artwork = upgradeAppleArtwork(item.artworkUrl100, 1000);
        const releaseYear = item.releaseDate
          ? new Date(item.releaseDate).getFullYear()
          : new Date().getFullYear();

        albums.push({
          id,
          title: item.collectionName || "Unknown Album",
          artist: item.artistName || "Unknown Artist",
          artistId: item.artistId ? `itunes-artist-${item.artistId}` : undefined,
          artwork: artwork || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
          releaseYear,
          releaseDate: item.releaseDate
            ? item.releaseDate.split("T")[0]
            : undefined,
          trackCount: item.trackCount || 1,
          genre: item.primaryGenreName || "Music",
          description: `Official master release by ${item.artistName}. Apple Digital Master with lossless high-resolution audio fidelity.`,
          tracks: [],
          provider: "itunes",
        });
      } else if (
        item.wrapperType === "artist" ||
        item.artistType === "Artist"
      ) {
        const id = `itunes-artist-${item.artistId}`;
        if (seenArtistIds.has(id)) continue;
        seenArtistIds.add(id);

        artists.push({
          id,
          name: item.artistName || "Unknown Artist",
          artwork: "",
          monthlyListeners: 28500000,
          verified: true,
          genre: item.primaryGenreName || "Popular Music",
          bio: `${item.artistName} is a verified recording artist with official catalog releases on Apple Music.`,
          topTracks: [],
          albums: [],
          provider: "itunes",
        });
      }
    }

    return { songs, albums, artists };
  } catch (err) {
    console.warn("iTunes search error:", err);
    return { songs: [], albums: [], artists: [] };
  }
}

// Search Deezer Public Music Catalog (Rich artist photography and cover art)
async function searchDeezerCatalog(query: string): Promise<{
  songs: CanonicalTrack[];
  albums: CanonicalAlbum[];
  artists: CanonicalArtist[];
}> {
  try {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=25`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AppleMusicCatalogClient/2.0" },
    });

    if (!res.ok) return { songs: [], albums: [], artists: [] };

    const data = await res.json();
    const items = data.data || [];

    const songs: CanonicalTrack[] = [];
    const albums: CanonicalAlbum[] = [];
    const artists: CanonicalArtist[] = [];
    const seenSongIds = new Set<string>();
    const seenAlbumIds = new Set<string>();
    const seenArtistIds = new Set<string>();

    for (const item of items) {
      const songId = `deezer-track-${item.id}`;
      if (!seenSongIds.has(songId)) {
        seenSongIds.add(songId);

        const artwork =
          item.album?.cover_xl ||
          item.album?.cover_big ||
          item.album?.cover_medium ||
          item.album?.cover;
        const artistArtwork =
          item.artist?.picture_xl ||
          item.artist?.picture_big ||
          item.artist?.picture_medium;

        songs.push({
          id: songId,
          title: item.title || item.title_short || "Unknown Title",
          artist: item.artist?.name || "Unknown Artist",
          artistId: item.artist?.id ? `deezer-artist-${item.artist.id}` : undefined,
          album: item.album?.title || "Single",
          albumId: item.album?.id ? `deezer-album-${item.album.id}` : undefined,
          artwork: artwork || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
          artistArtwork: artistArtwork || undefined,
          duration: item.duration || 210,
          playbackId: undefined,
          playbackSource: "youtube",
          releaseYear: new Date().getFullYear(),
          genre: "Pop / Hits",
          streamUrl: item.preview || "",
          isLossless: true,
          provider: "deezer",
        });
      }

      if (item.album && item.album.id) {
        const albumId = `deezer-album-${item.album.id}`;
        if (!seenAlbumIds.has(albumId)) {
          seenAlbumIds.add(albumId);
          const artwork =
            item.album.cover_xl ||
            item.album.cover_big ||
            item.album.cover_medium;

          albums.push({
            id: albumId,
            title: item.album.title || "Album",
            artist: item.artist?.name || "Unknown Artist",
            artistId: item.artist?.id ? `deezer-artist-${item.artist.id}` : undefined,
            artwork: artwork || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
            releaseYear: new Date().getFullYear(),
            trackCount: 1,
            genre: "Album",
            description: `Official master album by ${item.artist?.name || "Artist"}.`,
            tracks: [],
            provider: "deezer",
          });
        }
      }

      if (item.artist && item.artist.id) {
        const artistId = `deezer-artist-${item.artist.id}`;
        if (!seenArtistIds.has(artistId)) {
          seenArtistIds.add(artistId);
          const artistArt =
            item.artist.picture_xl ||
            item.artist.picture_big ||
            item.artist.picture_medium;

          artists.push({
            id: artistId,
            name: item.artist.name || "Unknown Artist",
            artwork: artistArt || "",
            bannerArtwork: item.artist.picture_xl || artistArt,
            monthlyListeners: 24000000,
            verified: true,
            genre: "Artist",
            bio: `${item.artist.name} is a verified recording artist with global discography.`,
            topTracks: [],
            albums: [],
            provider: "deezer",
          });
        }
      }
    }

    return { songs, albums, artists };
  } catch (err) {
    console.warn("Deezer search error:", err);
    return { songs: [], albums: [], artists: [] };
  }
}

// Helper to clean YouTube titles and extract artist and album
function cleanYouTubeTitleAndArtist(rawTitle: string, channelName: string): { title: string; artist: string; album: string } {
  let clean = rawTitle
    .replace(/\s*(\(|\[)\s*(official\s*(music\s*)?video|official\s*audio|lyric\s*video|full\s*song|video\s*song|audio\s*song|audio|lyrics|4k|hd|visualizer|video)\s*(\)|\])/gi, "")
    .trim();

  let title = clean;
  let artist = channelName || "Unknown Artist";
  let album = "Single";

  if (clean.includes(" - ")) {
    const parts = clean.split(" - ");
    const part0 = parts[0].trim();
    const part1 = parts.slice(1).join(" - ").trim();
    if (part0.length > 0 && part1.length > 0 && part0.length < 60) {
      artist = part0;
      title = part1;
    }
  } else if (clean.includes(" | ")) {
    const parts = clean.split(" | ");
    title = parts[0].trim();
    if (parts.length > 1 && parts[1].trim()) {
      album = parts[1].trim();
    }
    if (channelName && channelName.trim() && !channelName.toLowerCase().includes("records") && !channelName.toLowerCase().includes("music")) {
      artist = channelName.trim();
    } else if (parts.length > 2 && parts[2].trim()) {
      artist = parts[2].trim();
    } else if (channelName && channelName.trim()) {
      artist = channelName.trim();
    }
  }

  title = title.replace(/[|–-]\s*$/, "").trim();
  artist = artist.replace(/[|–-]\s*$/, "").trim();

  return { title, artist, album };
}

// Music intent detection and cartoon/episode filter
const MUSIC_INTENT_REGEX =
  /\b(song|songs|music|audio|track|tracks|theme|ost|soundtrack|mashup|remix|dj|cover|acoustic|unplugged|slowed|reverb|lofi|album|jukebox|nonstop|live|official|video|discography|hits)\b/i;

const NON_MUSIC_REGEX =
  /\b(full episode|episode\s*\d+|ep\s*\d+|season\s*\d+|s\d{1,2}\b|animated series|3d animation|cartoon cartoon|cartoons for kids|hindi cartoon|full movie|natok|drama series|gameplay|walkthrough|comedy compilation|funny scene|funny moments|roast|reaction|how to draw|vlog|news|interview|behind the scenes|bloopers|fight scene|action scene|trailers?|teaser)\b/i;

const ALLOW_MUSIC_REGEX =
  /\b(title song|theme song|title track|official song|official audio|full song|music video|mashup|remix|hit song|video song|audio song|soundtrack|ost|theme|lofi)\b/i;

// Search YouTube directly via Innertube (100% verified 1:1 playbackId attached to every single track)
async function searchYouTubeDirect(query: string): Promise<{
  songs: CanonicalTrack[];
  albums: CanonicalAlbum[];
  artists: CanonicalArtist[];
}> {
  try {
    const cleanQuery = query.trim();
    // If the query does not contain any music words, append 'song' so YouTube searches for musical tracks rather than cartoon episodes or movie clips
    const ytQuery = MUSIC_INTENT_REGEX.test(cleanQuery) ? cleanQuery : `${cleanQuery} song`;

    const res = await fetch("https://www.youtube.com/youtubei/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240101.00.00",
            hl: "en",
            gl: "US",
          },
        },
        query: ytQuery,
      }),
    });

    if (!res.ok) return { songs: [], albums: [], artists: [] };

    const data = await res.json();
    const sections =
      data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

    const songs: CanonicalTrack[] = [];
    const albums: CanonicalAlbum[] = [];
    const artists: CanonicalArtist[] = [];
    const seenVideoIds = new Set<string>();

    for (const section of sections) {
      const items = section?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        if (item.videoRenderer) {
          const v = item.videoRenderer;
          const videoId = v.videoId;
          if (!videoId || seenVideoIds.has(videoId)) continue;

          const rawTitle = v.title?.runs?.map((r: any) => r.text).join("") || "";
          const channelName =
            v.ownerText?.runs?.map((r: any) => r.text).join("") ||
            v.longBylineText?.runs?.map((r: any) => r.text).join("") ||
            "Unknown Artist";

          const durStr = v.lengthText?.simpleText;
          const duration = parseDurationSecs(durStr) || 210;

          // Reject non-music content (e.g. cartoon episodes, animated shows, movies, skits)
          if (NON_MUSIC_REGEX.test(rawTitle) && !ALLOW_MUSIC_REGEX.test(rawTitle)) {
            continue;
          }

          // Filter out short non-music clips (< 25s) or excessive livestreams (> 3.5h) that aren't jukebox/mashup
          if (duration < 25) continue;
          if (duration > 12600 && !/\b(jukebox|mashup|nonstop|collection|album)\b/i.test(rawTitle)) continue;

          // If channel is explicit cartoon/gaming/news channel, ensure title contains a music indicator
          if (
            /\b(cartoon|cartoons|animation|animated|gaming|vlog|news)\b/i.test(channelName) &&
            !/\b(song|songs|music|track|tracks|audio|lyric|lyrics|theme|ost|soundtrack|mashup|remix)\b/i.test(rawTitle)
          ) {
            continue;
          }

          seenVideoIds.add(videoId);

          const parsed = cleanYouTubeTitleAndArtist(rawTitle, channelName);

          // High-res YouTube thumbnail
          const artwork = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

          // Track object with verified 1:1 playbackId
          const track: CanonicalTrack = {
            id: `yt-${videoId}`,
            playbackId: videoId,
            youtubeId: videoId,
            title: parsed.title,
            artist: parsed.artist,
            album: parsed.album,
            artwork,
            duration,
            genre: "Music",
            provider: "youtube",
          };

          songs.push(track);

          // Prime backend resolution cache
          const cacheKey = `${normalizeText(parsed.title)}|||${normalizeText(parsed.artist)}`;
          playbackCache.set(cacheKey, { playbackId: videoId, playbackSource: "youtube" });
          const rawKey = `${normalizeText(rawTitle)}|||${normalizeText(channelName)}`;
          playbackCache.set(rawKey, { playbackId: videoId, playbackSource: "youtube" });
        } else if (item.channelRenderer) {
          const ch = item.channelRenderer;
          const channelId = ch.channelId;
          const channelName = ch.title?.simpleText || "Artist";
          const thumbs = ch.thumbnail?.thumbnails;
          const avatarUrl = thumbs && thumbs.length > 0 ? thumbs[thumbs.length - 1].url : "";

          artists.push({
            id: `yt-ch-${channelId}`,
            name: channelName,
            artwork: avatarUrl,
            monthlyListeners: 15000000,
            verified: true,
            genre: "Artist",
            bio: `${channelName} official artist on YouTube.`,
            topTracks: [],
            albums: [],
            provider: "youtube",
          });
        } else if (item.playlistRenderer) {
          const pl = item.playlistRenderer;
          const playlistId = pl.playlistId;
          const title = pl.title?.simpleText || "Playlist";
          const count = parseInt(pl.videoCount, 10) || 10;
          const thumbs = pl.thumbnails?.[0]?.thumbnails;
          const artwork = thumbs && thumbs.length > 0 ? thumbs[thumbs.length - 1].url : "";

          albums.push({
            id: `yt-pl-${playlistId}`,
            title,
            artist: pl.shortBylineText?.runs?.map((r: any) => r.text).join("") || "YouTube Collection",
            artwork,
            releaseYear: new Date().getFullYear(),
            trackCount: count,
            genre: "Collection",
            description: `YouTube collection by ${pl.shortBylineText?.runs?.[0]?.text || "Creator"}.`,
            tracks: [],
            provider: "youtube",
          });
        }
      }
    }

    return { songs, albums, artists };
  } catch (err) {
    console.warn("YouTube direct search error:", err);
    return { songs: [], albums: [], artists: [] };
  }
}

// Helper to check title similarity before accepting external artwork
function isFuzzyTitleMatch(titleA: string, titleB: string): boolean {
  const clean = (t: string) =>
    (t || "")
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/-\s*(official|video|audio|lyric|remix|lofi|slowed|reverb|version|acoustic|live|cover|reprise).*/i, "")
      .replace(/\b(slowed|reverb|lofi|lo-fi|remix|reprise|cover|version|audio|video|lyrics?|song|hook|status|edit|soundtrack|ost)\b/gi, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const a = clean(titleA);
  const b = clean(titleB);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) {
    const minLen = Math.min(a.length, b.length);
    const maxLen = Math.max(a.length, b.length);
    if (minLen >= 4 && minLen / maxLen > 0.5) return true;
  }
  return false;
}

// Helper to resolve official high-res square album artwork via Apple Music / iTunes
async function resolveOfficialArtwork(title: string, artist: string): Promise<string | null> {
  try {
    const cleanTitle = title
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/-\s*(official|video|audio|lyric|remix|lofi|slowed|reverb|version|acoustic|live|cover).*/i, "")
      .replace(/\b(slowed|reverb|lofi|remix|official|video|audio|song)\b/gi, "")
      .trim();
    const cleanArtist = artist.split(",")[0].split("&")[0].split("-")[0].trim();
    const cacheKey = `${cleanTitle.toLowerCase()}||${cleanArtist.toLowerCase()}`;

    // Return instant cached artwork if already resolved
    if (serverArtworkCache.has(cacheKey)) {
      return serverArtworkCache.get(cacheKey)!;
    }

    const query = `${cleanTitle} ${cleanArtist}`.trim();

    // Query official Indian catalog first (covers all Indian regional + top international releases)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5&country=IN`
    );
    if (res.ok) {
      const data = await res.json();
      const results = data.results || [];
      for (const item of results) {
        if (!item.trackName) continue;
        // Strictly verify that the returned track name matches the requested song title!
        if (isFuzzyTitleMatch(item.trackName, cleanTitle)) {
          if (item.artworkUrl100) {
            const upgraded = upgradeAppleArtwork(item.artworkUrl100, 600);
            serverArtworkCache.set(cacheKey, upgraded);
            return upgraded;
          }
        }
      }
    }
  } catch {}
  return null;
}

// Master Metadata Aggregator & Canonical Ranker
async function searchCanonicalCatalog(query: string) {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { songs: [], artists: [], albums: [], playlists: [] };
  }

  const cacheKey = cleanQuery.toLowerCase();
  if (searchMetadataCache.has(cacheKey)) {
    return searchMetadataCache.get(cacheKey);
  }

  // 1. Primary: Official Master Catalogs (Apple Music / iTunes + Deezer)
  // Provides clean official titles, verified artists, official albums, and high-res 1000x1000 square covers!
  const [itunesRes, deezerRes] = await Promise.all([
    searchItunesCatalog(cleanQuery),
    searchDeezerCatalog(cleanQuery),
  ]);

  const officialSongs = [...itunesRes.songs, ...deezerRes.songs];
  const uniqueSongs: CanonicalTrack[] = [];
  const seenSongKeys = new Set<string>();

  for (const song of officialSongs) {
    const key = `${normalizeText(song.title)}||${normalizeText(song.artist)}`;
    if (seenSongKeys.has(key)) continue;
    seenSongKeys.add(key);
    uniqueSongs.push(song);
  }

  // Rank tracks by query relevance so exact title/artist matches appear first!
  const queryTerms = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);
  uniqueSongs.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aArtist = a.artist.toLowerCase();
    const bArtist = b.artist.toLowerCase();

    if (aTitle === cleanQuery.toLowerCase()) scoreA += 50;
    if (bTitle === cleanQuery.toLowerCase()) scoreB += 50;
    if (aTitle.includes(cleanQuery.toLowerCase())) scoreA += 20;
    if (bTitle.includes(cleanQuery.toLowerCase())) scoreB += 20;

    for (const term of queryTerms) {
      if (aTitle.includes(term)) scoreA += 5;
      if (aArtist.includes(term)) scoreA += 3;
      if (bTitle.includes(term)) scoreB += 5;
      if (bArtist.includes(term)) scoreB += 3;
    }

    return scoreB - scoreA;
  });

  // If official catalog has results, use them as primary!
  if (uniqueSongs.length > 0) {
    const result = {
      songs: uniqueSongs.slice(0, 30),
      artists: [...itunesRes.artists, ...deezerRes.artists].slice(0, 10),
      albums: [...itunesRes.albums, ...deezerRes.albums].slice(0, 12),
      playlists: [],
    };
    searchMetadataCache.set(cacheKey, result);
    return result;
  }

  // 2. Fallback: YouTube Direct Search if not found in iTunes/Deezer
  const ytRes = await searchYouTubeDirect(cleanQuery);
  if (ytRes.songs.length > 0) {
    const result = {
      songs: ytRes.songs,
      artists: ytRes.artists,
      albums: ytRes.albums,
      playlists: [],
    };
    searchMetadataCache.set(cacheKey, result);
    return result;
  }

  return { songs: [], artists: [], albums: [], playlists: [] };
}

// Full Album Details Resolver
async function resolveAlbumDetails(albumId: string): Promise<CanonicalAlbum | null> {
  const cacheKey = albumId.toLowerCase();
  if (albumMetadataCache.has(cacheKey)) {
    return albumMetadataCache.get(cacheKey);
  }

  // 1. If iTunes Album ID
  if (albumId.startsWith("itunes-album-")) {
    const rawId = albumId.replace("itunes-album-", "");
    try {
      const url = `https://itunes.apple.com/lookup?id=${rawId}&entity=song`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items = data.results || [];
        if (items.length > 0) {
          const albumItem = items[0];
          const trackItems = items.slice(1);
          const artwork = upgradeAppleArtwork(albumItem.artworkUrl100, 1000);
          const releaseYear = albumItem.releaseDate
            ? new Date(albumItem.releaseDate).getFullYear()
            : new Date().getFullYear();

          const tracks: CanonicalTrack[] = trackItems.map((item: any, idx: number) => ({
            id: `itunes-track-${item.trackId}`,
            title: item.trackName || `Track ${idx + 1}`,
            artist: item.artistName || albumItem.artistName,
            artistId: item.artistId ? `itunes-artist-${item.artistId}` : undefined,
            album: albumItem.collectionName,
            albumId: `itunes-album-${albumItem.collectionId}`,
            artwork,
            duration: Math.round((item.trackTimeMillis || 210000) / 1000),
            playbackSource: "youtube",
            releaseDate: albumItem.releaseDate ? albumItem.releaseDate.split("T")[0] : undefined,
            releaseYear,
            genre: albumItem.primaryGenreName || "Music",
            streamUrl: item.previewUrl || "",
            isLossless: true,
            provider: "itunes",
          }));

          const album: CanonicalAlbum = {
            id: albumId,
            title: albumItem.collectionName || "Album",
            artist: albumItem.artistName || "Artist",
            artistId: albumItem.artistId ? `itunes-artist-${albumItem.artistId}` : undefined,
            artwork,
            releaseYear,
            releaseDate: albumItem.releaseDate ? albumItem.releaseDate.split("T")[0] : undefined,
            trackCount: tracks.length || albumItem.trackCount || 1,
            genre: albumItem.primaryGenreName || "Soundtrack",
            description: `Experience the complete master soundscape of "${albumItem.collectionName}". Featuring pristine mixing, emotional melodies, and captivating vocal arrangements crafted with Apple Digital Master acoustic fidelity.`,
            tracks,
            provider: "itunes",
          };

          albumMetadataCache.set(cacheKey, album);
          return album;
        }
      }
    } catch (err) {
      console.warn("iTunes album lookup error:", err);
    }
  }

  // 2. If Deezer Album ID
  if (albumId.startsWith("deezer-album-")) {
    const rawId = albumId.replace("deezer-album-", "");
    try {
      const url = `https://api.deezer.com/album/${rawId}`;
      const res = await fetch(url);
      if (res.ok) {
        const item = await res.json();
        if (item && item.id) {
          const artwork =
            item.cover_xl || item.cover_big || item.cover_medium || item.cover;
          const releaseYear = item.release_date
            ? new Date(item.release_date).getFullYear()
            : new Date().getFullYear();

          const tracks: CanonicalTrack[] = (item.tracks?.data || []).map(
            (t: any, idx: number) => ({
              id: `deezer-track-${t.id}`,
              title: t.title || t.title_short || `Track ${idx + 1}`,
              artist: t.artist?.name || item.artist?.name,
              artistId: t.artist?.id ? `deezer-artist-${t.artist.id}` : undefined,
              album: item.title,
              albumId: `deezer-album-${item.id}`,
              artwork,
              duration: t.duration || 210,
              playbackSource: "youtube",
              releaseDate: item.release_date,
              releaseYear,
              genre: item.genres?.data?.[0]?.name || "Pop",
              streamUrl: t.preview || "",
              isLossless: true,
              provider: "deezer",
            })
          );

          const album: CanonicalAlbum = {
            id: albumId,
            title: item.title,
            artist: item.artist?.name || "Artist",
            artistId: item.artist?.id ? `deezer-artist-${item.artist.id}` : undefined,
            artwork,
            releaseYear,
            releaseDate: item.release_date,
            trackCount: tracks.length || item.nb_tracks || 1,
            genre: item.genres?.data?.[0]?.name || "Album",
            description: `Official master album by ${item.artist?.name || "Artist"}. Featuring lossless audio streams.`,
            tracks,
            provider: "deezer",
          };

          albumMetadataCache.set(cacheKey, album);
          return album;
        }
      }
    } catch (err) {
      console.warn("Deezer album lookup error:", err);
    }
  }

  return null;
}

// Full Artist Details Resolver
async function resolveArtistDetails(artistId: string): Promise<CanonicalArtist | null> {
  const cacheKey = artistId.toLowerCase();
  if (artistMetadataCache.has(cacheKey)) {
    return artistMetadataCache.get(cacheKey);
  }

  let artistName = "";
  let artistArtwork = "";
  let bannerArtwork = "";

  // 1. If Deezer Artist ID
  if (artistId.startsWith("deezer-artist-")) {
    const rawId = artistId.replace("deezer-artist-", "");
    try {
      const [artistRes, topRes, albumsRes] = await Promise.all([
        fetch(`https://api.deezer.com/artist/${rawId}`),
        fetch(`https://api.deezer.com/artist/${rawId}/top?limit=15`),
        fetch(`https://api.deezer.com/artist/${rawId}/albums?limit=10`),
      ]);

      if (artistRes.ok) {
        const aData = await artistRes.json();
        artistName = aData.name || "";
        artistArtwork =
          aData.picture_xl || aData.picture_big || aData.picture_medium || aData.picture;
        bannerArtwork = aData.picture_xl || artistArtwork;

        let topTracks: CanonicalTrack[] = [];
        if (topRes.ok) {
          const tData = await topRes.json();
          topTracks = (tData.data || []).map((t: any) => ({
            id: `deezer-track-${t.id}`,
            title: t.title || t.title_short,
            artist: aData.name,
            artistId: `deezer-artist-${aData.id}`,
            album: t.album?.title || "Single",
            albumId: t.album?.id ? `deezer-album-${t.album.id}` : undefined,
            artwork: t.album?.cover_xl || t.album?.cover_big || artistArtwork,
            artistArtwork,
            duration: t.duration || 210,
            playbackSource: "youtube",
            releaseYear: new Date().getFullYear(),
            streamUrl: t.preview || "",
            isLossless: true,
            provider: "deezer",
          }));
        }

        let albums: CanonicalAlbum[] = [];
        if (albumsRes.ok) {
          const albData = await albumsRes.json();
          albums = (albData.data || []).map((alb: any) => ({
            id: `deezer-album-${alb.id}`,
            title: alb.title,
            artist: aData.name,
            artistId: `deezer-artist-${aData.id}`,
            artwork: alb.cover_xl || alb.cover_big || alb.cover_medium,
            releaseYear: alb.release_date
              ? new Date(alb.release_date).getFullYear()
              : new Date().getFullYear(),
            trackCount: alb.nb_tracks || 1,
            genre: "Album",
            tracks: [],
            provider: "deezer",
          }));
        }

        const canonicalArtist: CanonicalArtist = {
          id: artistId,
          name: artistName,
          artwork: artistArtwork,
          bannerArtwork,
          monthlyListeners: (aData.nb_fan || 1800000) * 12,
          verified: true,
          genre: "Pop / Soundtrack",
          bio: `${artistName} is a verified recording artist with official catalog releases worldwide.`,
          topTracks,
          albums,
          similarArtists: [],
          provider: "deezer",
        };

        artistMetadataCache.set(cacheKey, canonicalArtist);
        return canonicalArtist;
      }
    } catch (err) {
      console.warn("Deezer artist lookup error:", err);
    }
  }

  // 2. If iTunes Artist ID
  if (artistId.startsWith("itunes-artist-")) {
    const rawId = artistId.replace("itunes-artist-", "");
    try {
      const url = `https://itunes.apple.com/lookup?id=${rawId}&entity=song,album&limit=25`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const items = data.results || [];
        if (items.length > 0) {
          const artistItem = items[0];
          artistName = artistItem.artistName || "Artist";

          const topTracks: CanonicalTrack[] = [];
          const albums: CanonicalAlbum[] = [];

          for (const item of items.slice(1)) {
            if (item.wrapperType === "track") {
              const artwork = upgradeAppleArtwork(item.artworkUrl100, 1000);
              topTracks.push({
                id: `itunes-track-${item.trackId}`,
                title: item.trackName,
                artist: artistName,
                artistId: `itunes-artist-${artistItem.artistId}`,
                album: item.collectionName,
                albumId: `itunes-album-${item.collectionId}`,
                artwork,
                duration: Math.round((item.trackTimeMillis || 210000) / 1000),
                playbackSource: "youtube",
                releaseYear: item.releaseDate
                  ? new Date(item.releaseDate).getFullYear()
                  : new Date().getFullYear(),
                genre: item.primaryGenreName,
                streamUrl: item.previewUrl || "",
                isLossless: true,
                provider: "itunes",
              });
            } else if (item.wrapperType === "collection") {
              const artwork = upgradeAppleArtwork(item.artworkUrl100, 1000);
              albums.push({
                id: `itunes-album-${item.collectionId}`,
                title: item.collectionName,
                artist: artistName,
                artistId: `itunes-artist-${artistItem.artistId}`,
                artwork,
                releaseYear: item.releaseDate
                  ? new Date(item.releaseDate).getFullYear()
                  : new Date().getFullYear(),
                trackCount: item.trackCount || 1,
                genre: item.primaryGenreName,
                tracks: [],
                provider: "itunes",
              });
            }
          }

          const defaultArt =
            topTracks[0]?.artwork ||
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80";

          const canonicalArtist: CanonicalArtist = {
            id: artistId,
            name: artistName,
            artwork: defaultArt,
            bannerArtwork: defaultArt,
            monthlyListeners: 29000000,
            verified: true,
            genre: artistItem.primaryGenreName || "Music",
            bio: `${artistName} is verified on Apple Music with high-resolution lossless discography.`,
            topTracks,
            albums,
            provider: "itunes",
          };

          artistMetadataCache.set(cacheKey, canonicalArtist);
          return canonicalArtist;
        }
      }
    } catch (err) {
      console.warn("iTunes artist lookup error:", err);
    }
  }

  return null;
}

// -------------------------------------------------------------
// 2. PLAYBACK RESOLUTION LAYER (INDEPENDENT)
// -------------------------------------------------------------

// Helper to parse duration string "03:45" to seconds
function parseDurationSecs(str?: string): number {
  if (!str) return 0;
  const parts = str.split(":").map((p) => parseInt(p, 10));
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  } else if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  return 0;
}

// Helper to calculate title & artist relevance and prevent playing unrelated tracks
function computeTrackRelevance(
  requestedTitle: string,
  requestedArtist: string,
  candidateTitle: string,
  channelName: string,
  targetDuration?: number,
  candidateDuration?: number
): { score: number; isVerified: boolean } {
  const normReqTitle = normalizeText(requestedTitle);
  const normReqArtist = normalizeText(requestedArtist.split(",")[0].split("&")[0]);
  const normCandTitle = normalizeText(candidateTitle);
  const normChannel = normalizeText(channelName);

  const titleWords = normReqTitle.split(" ").filter((w) => w.length > 1);
  const artistWords = normReqArtist.split(" ").filter((w) => w.length > 1);

  let titleMatches = 0;
  for (const w of titleWords) {
    if (normCandTitle.includes(w)) titleMatches++;
  }
  const titleRatio = titleWords.length > 0 ? titleMatches / titleWords.length : 0;

  let artistMatches = 0;
  for (const w of artistWords) {
    if (normCandTitle.includes(w) || normChannel.includes(w)) artistMatches++;
  }
  const artistRatio = artistWords.length > 0 ? artistMatches / artistWords.length : 0;

  let score = titleRatio * 60 + artistRatio * 40;

  if (
    normChannel.includes("topic") ||
    normChannel.includes("vevo") ||
    normChannel.includes("records") ||
    normChannel.includes("official")
  ) {
    score += 15;
  }
  if (
    normCandTitle.includes("official audio") ||
    normCandTitle.includes("official video") ||
    normCandTitle.includes("music video") ||
    normCandTitle.includes("audio")
  ) {
    score += 10;
  }

  // Duration tolerance check
  if (targetDuration && candidateDuration && targetDuration > 0 && candidateDuration > 0) {
    const diff = Math.abs(targetDuration - candidateDuration);
    if (diff < 15) score += 25;
    else if (diff > 120) score -= 60;
  }

  // Strict verification: title MUST match substantially AND artist MUST match candidate title or channel
  const isVerified =
    titleRatio >= 0.45 &&
    (artistRatio >= 0.35 || normChannel.includes(normReqArtist) || normCandTitle.includes(normReqArtist));

  return { score, isVerified };
}

// Known verified canonical master IDs to avoid unnecessary lookup latency
const VERIFIED_TRACK_MASTER_MAP: Record<string, string> = {
  "blinding lights|||the weeknd": "4NRXx6U8ABQ",
  "starboy (feat. daft punk)|||the weeknd & daft punk": "34Na4j8AVgA",
  "starboy|||the weeknd": "34Na4j8AVgA",
  "kesariya|||arijit singh": "BddP6PYo2gs",
  "brown munde|||ap dhillon": "VNs_cCtdbPc",
  "shape of you|||ed sheeran": "JGwWNGJdvx8",
  "as it was|||harry styles": "H5v3kku4y6Q",
  "tum hi ho|||arijit singh": "Umqb9KENgmk",
  "levitating|||dua lipa": "TUVcZfQe-Kw",
  "anti-hero|||taylor swift": "b1kbLwvqugk",
};

function sanitizePlaybackSearch(title: string, artist: string): string {
  const cleanTitle = title
    .replace(/\s*\([^)]*(feat|ft|remaster|deluxe|version|edition|original)[^)]*\)/gi, "")
    .replace(/\s*\[[^\]]*(feat|ft|remaster|deluxe|version|edition|original)[^\]]*\]/gi, "")
    .trim();
  const primaryArtist = artist.split(",")[0].split("&")[0].split("/")[0].trim();
  return `${primaryArtist} ${cleanTitle} official audio`;
}

// Resolves verified YouTube playback videoId without mutating metadata
async function resolvePlaybackSource(
  title: string,
  artist: string,
  album?: string,
  targetDuration?: number
): Promise<{ playbackId: string; playbackSource: "youtube" } | null> {
  const normTitle = normalizeText(title);
  const normArtist = normalizeText(artist.split(",")[0].split("&")[0]);
  const cacheKey = `${normTitle}|||${normArtist}`;

  // 1. Check known verified master map
  if (VERIFIED_TRACK_MASTER_MAP[cacheKey]) {
    return {
      playbackId: VERIFIED_TRACK_MASTER_MAP[cacheKey],
      playbackSource: "youtube",
    };
  }

  // 2. Check in-memory playback cache
  if (playbackCache.has(cacheKey)) {
    return playbackCache.get(cacheKey)! as {
      playbackId: string;
      playbackSource: "youtube";
    };
  }

  // 3. Query YouTube via direct Innertube Search API
  try {
    const searchQuery = sanitizePlaybackSearch(title, artist);
    const innertubeRes = await fetch("https://www.youtube.com/youtubei/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240101.00.00",
            hl: "en",
            gl: "US",
          },
        },
        query: searchQuery,
      }),
    });

    if (innertubeRes.ok) {
      const data = await innertubeRes.json();
      const sections =
        data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];

      const forbiddenKeywords = [
        "reaction",
        "reacting",
        "trailer",
        "teaser",
        "cover",
        "review",
        "interview",
        "full movie",
        "scene",
        "roast",
        "vlog",
        "ringtone",
        "status video",
        "whatsapp status",
        "10 hour",
        "1 hour loop",
        "slowed + reverb",
        "slowed reverb",
        "nightcore",
        "karaoke",
      ];
      const isRemixWanted = normTitle.includes("remix");

      const candidates: {
        videoId: string;
        score: number;
        title: string;
        channel: string;
      }[] = [];

      for (const section of sections) {
        const items = section?.itemSectionRenderer?.contents || [];
        for (const item of items) {
          if (item.videoRenderer) {
            const v = item.videoRenderer;
            const videoId = v.videoId;
            if (!videoId) continue;

            const rawTitle = v.title?.runs?.map((r: any) => r.text).join("") || "";
            const rawTitleLower = rawTitle.toLowerCase();

            // Reject spam/unwanted videos
            const isSpam = forbiddenKeywords.some((kw) => {
              if (kw === "remix" && isRemixWanted) return false;
              return rawTitleLower.includes(kw);
            });
            if (isSpam) continue;

            const channelName =
              v.ownerText?.runs?.map((r: any) => r.text).join("") ||
              v.longBylineText?.runs?.map((r: any) => r.text).join("") ||
              "";

            const durStr = v.lengthText?.simpleText;
            const durSecs = parseDurationSecs(durStr);

            const { score, isVerified } = computeTrackRelevance(
              title,
              artist,
              rawTitle,
              channelName,
              targetDuration,
              durSecs
            );

            if (isVerified) {
              candidates.push({
                videoId,
                score,
                title: rawTitle,
                channel: channelName,
              });
            }
          }
        }
      }

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.score - a.score);
        const best = candidates[0];
        const result = {
          playbackId: best.videoId,
          playbackSource: "youtube" as const,
        };
        playbackCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn("Innertube playback resolution notice:", err);
  }

  // Strictly DO NOT return an unrelated fallback song. If no verified source matches, return null.
  return null;
}

// -------------------------------------------------------------
// 3. API ENDPOINTS
// -------------------------------------------------------------

// Search Metadata Catalog (Apple Music / iTunes + Deezer)
app.get("/api/metadata/search", async (req, res) => {
  const q = req.query.q as string;
  if (!q || !q.trim()) {
    return res.json({ songs: [], artists: [], albums: [], playlists: [] });
  }

  try {
    const results = await searchCanonicalCatalog(q);
    res.json(results);
  } catch (err) {
    console.error("Metadata search error:", err);
    res.status(500).json({ error: "Failed to search metadata", songs: [], artists: [], albums: [], playlists: [] });
  }
});

// Resolve Canonical Album
app.get("/api/metadata/album", async (req, res) => {
  const id = req.query.id as string;
  if (!id || !id.trim()) {
    return res.status(400).json({ error: "Album ID required", album: null });
  }

  try {
    const album = await resolveAlbumDetails(id.trim());
    res.json({ album });
  } catch (err) {
    console.error("Album lookup error:", err);
    res.status(500).json({ error: "Failed to resolve album", album: null });
  }
});

// Resolve Canonical Artist Profile
app.get("/api/metadata/artist", async (req, res) => {
  const id = req.query.id as string;
  if (!id || !id.trim()) {
    return res.status(400).json({ error: "Artist ID required", artist: null });
  }

  try {
    const artist = await resolveArtistDetails(id.trim());
    res.json({ artist });
  } catch (err) {
    console.error("Artist lookup error:", err);
    res.status(500).json({ error: "Failed to resolve artist", artist: null });
  }
});

// Resolve Playback Source independently from Metadata (supports POST & GET)
app.all(["/api/playback/resolve", "/api/resolve-playback"], async (req, res) => {
  const title = (req.body?.title || req.query.title) as string;
  const artist = (req.body?.artist || req.query.artist) as string;
  const album = (req.body?.album || req.query.album) as string;
  const rawDuration = req.body?.duration || req.query.duration;
  const duration = rawDuration ? Number(rawDuration) : undefined;

  if (!title || !artist) {
    return res.status(400).json({ error: "Title and Artist required" });
  }

  try {
    const playback = await resolvePlaybackSource(title, artist, album, duration);
    if (!playback || !playback.playbackId) {
      return res.status(404).json({ error: "Playback unavailable", playbackId: null });
    }
    res.json(playback);
  } catch (err) {
    console.error("Playback resolution error:", err);
    res.status(404).json({ error: "Playback unavailable", playbackId: null });
  }
});

// Backward-compatible endpoints
app.get("/api/artist/lookup", async (req, res) => {
  const name = req.query.name as string;
  if (!name) return res.json({ artist: null });
  try {
    const resSearch = await searchCanonicalCatalog(name);
    const artist = resSearch.artists[0] || null;
    res.json({ artist });
  } catch {
    res.json({ artist: null });
  }
});

app.get("/api/youtube/search", async (req, res) => {
  const q = req.query.q as string;
  if (!q) return res.json({ results: [] });
  try {
    const catalog = await searchCanonicalCatalog(q);
    res.json({ results: catalog.songs });
  } catch {
    res.json({ results: [] });
  }
});

app.get("/api/youtube/trending", async (_req, res) => {
  try {
    const catalog = await searchCanonicalCatalog("Bollywood Top Hits 2024");
    res.json({ results: catalog.songs.slice(0, 20) });
  } catch {
    res.json({ results: [] });
  }
});

app.get("/api/artwork/resolve", async (req, res) => {
  const title = (req.query.title as string) || "";
  const artist = (req.query.artist as string) || "";
  if (!title) return res.json({ artwork: null });
  try {
    const artwork = await resolveOfficialArtwork(title, artist);
    res.json({ artwork });
  } catch {
    res.json({ artwork: null });
  }
});

// Duplicate detector for server-side recommendations
function isDuplicateTrackTitle(titleA: string, titleB: string): boolean {
  const clean = (t: string) =>
    (t || "")
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/-\s*(official|video|audio|lyric|remix|lofi|slowed|reverb|version|acoustic|live|cover|reprise).*/i, "")
      .replace(/\b(slowed|reverb|lofi|lo-fi|remix|reprise|cover|version|audio|video|lyrics?|song|hook|status|edit|soundtrack|ost)\b/gi, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const a = clean(titleA);
  const b = clean(titleB);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) {
    const minLen = Math.min(a.length, b.length);
    const maxLen = Math.max(a.length, b.length);
    if (minLen >= 4 && minLen / maxLen > 0.5) return true;
  }
  return false;
}

type MusicVibeType = 'desi_hiphop' | 'indie_acoustic' | 'punjabi_pop' | 'bollywood_party' | 'bollywood_romantic' | 'english_pop';

// Culture and vibe detector for intelligent song radio recommendations
function detectServerMusicVibe(title: string, artist: string, album?: string, genre?: string): MusicVibeType {
  const text = `${title || ''} ${artist || ''} ${album || ''} ${genre || ''}`.toLowerCase();

  // 1. Desi Hip-Hop, Punjabi Trap & Haryanvi Rap
  const hiphopKeywords = [
    'dhanda nyoliwala', 'karan aujla', 'sidhu', 'moose wala', 'ap dhillon', 'shubh',
    'divine', 'mc stan', 'king', 'badshah', 'raftaar', 'emiway', 'ikky', 'gurinder gill',
    'shinda kahlon', 'hip-hop', 'rap', 'trap', 'drill', 'haryanvi', 'russian bandana',
    'dil de baithi', 'dil de betha', 'gangsta', 'cheques', 'baller', 'brown munde', 'not guilty',
    'desi melbourniye', 'shevv', 'hustle', 'seedhe maut', 'krsna', 'kr$na', 'bella', 'talwiinder'
  ];
  for (const kw of hiphopKeywords) {
    if (text.includes(kw)) return 'desi_hiphop';
  }

  // 2. Indian Indie, Acoustic & Soulful Poetry
  const indieKeywords = [
    'anuv jain', 'prateek kuhad', 'zaeden', 'faheem abdullah', 'arslan nizami',
    'mitraz', 'jasleen royal', 'the local train', 'acoustic', 'indie', 'baarishein',
    'husn', 'saiyaara', 'choo lo', 'kasoor', 'babil khan', 'when chai met toast',
    'yellow diary', 'kavita seth', 'chaand baaliyan'
  ];
  for (const kw of indieKeywords) {
    if (text.includes(kw)) return 'indie_acoustic';
  }

  // 3. Punjabi Pop & Melodic Hits
  const punjabiPopKeywords = [
    'diljit', 'dosanjh', 'guru randhawa', 'b praak', 'jaani', 'harrdy sandhu',
    'amrinder gill', 'jassie gill', 'punjabi', 'lover', 'born to shine', 'tauba tauba',
    'lehanga', 'naah', 'soch', 'qismat', 'mann bharrya', 'filhall'
  ];
  for (const kw of punjabiPopKeywords) {
    if (text.includes(kw)) return 'punjabi_pop';
  }

  // 4. Bollywood Party & Dance
  const partyKeywords = [
    'yo yo honey singh', 'mika singh', 'neha kakkar', 'tony kakkar', 'dhoom machale',
    'party', 'club', 'dj', 'remix', 'hookah bar', 'chammak challo', 'lungi dance',
    'kar gayi chull', 'aankh marey', 'kala chashma', 'swag se swagat'
  ];
  for (const kw of partyKeywords) {
    if (text.includes(kw)) return 'bollywood_party';
  }

  // 5. English & Global Pop/R&B
  const englishKeywords = [
    'the weeknd', 'taylor swift', 'ed sheeran', 'drake', 'sza', 'juice wrld', 'xxxtentacion', 'post malone',
    'billie eilish', 'dua lipa', 'bruno mars', 'coldplay', 'justin bieber', 'ariana grande', 'rema', 'calm down',
    'synthpop', 'r&b', 'hip-hop / dancehall', 'blinding lights', 'starboy', 'snooze', 'kill bill', 'die for you',
    'billboard', 'pop hits'
  ];
  for (const kw of englishKeywords) {
    if (text.includes(kw)) return 'english_pop';
  }

  // Check Devanagari script
  if (/[\u0900-\u097F]/.test(text)) return 'bollywood_romantic';

  // Check if western genre without Indian keywords
  const westernGenres = ['country', 'classic rock', 'heavy metal', 'western', 'folk pop'];
  for (const wg of westernGenres) {
    if (text.includes(wg)) return 'english_pop';
  }

  // Default to Bollywood Romantic (Arijit, Pritam, Mohit Chauhan, etc.)
  return 'bollywood_romantic';
}

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const VIBE_ARTIST_POOLS: Record<MusicVibeType, string[]> = {
  desi_hiphop: [
    "Dhanda Nyoliwala", "Karan Aujla", "AP Dhillon", "Shubh", "Sidhu Moose Wala", "Badshah",
    "Divine", "MC Stan", "King", "Raftaar", "Emiway", "Seedhe Maut", "KR$NA", "Bella",
    "Talwiinder", "Gurinder Gill", "Shinda Kahlon", "Navaan Sandhu", "Wazir Patar", "Gulab Sidhu",
    "Jordan Sandhu", "Masoom Sharma"
  ],
  indie_acoustic: [
    "Anuv Jain", "Prateek Kuhad", "Zaeden", "Faheem Abdullah", "Arslan Nizami", "Mitraz",
    "Jasleen Royal", "The Local Train", "When Chai Met Toast", "The Yellow Diary", "Taba Chake",
    "Kavita Seth", "Lucky Ali", "Twin Strings", "Osho Jain", "Kanishk Seth", "Sanam"
  ],
  punjabi_pop: [
    "Diljit Dosanjh", "B Praak", "Guru Randhawa", "Harrdy Sandhu", "Amrinder Gill", "Jassie Gill",
    "Parmish Verma", "Gippy Grewal", "Garry Sandhu", "Ammy Virk", "Akhil", "Maninder Buttar"
  ],
  bollywood_party: [
    "Yo Yo Honey Singh", "Badshah", "Mika Singh", "Neha Kakkar", "Tony Kakkar", "Sukhwinder Singh",
    "Guru Randhawa", "Vishal-Shekhar", "Meet Bros"
  ],
  bollywood_romantic: [
    "Arijit Singh", "Pritam", "Atif Aslam", "Mohit Chauhan", "Jubin Nautiyal", "Shreya Ghoshal",
    "Darshan Raval", "Vishal Mishra", "Mithoon", "Sachin-Jigar", "Shankar-Ehsaan-Loy", "A.R. Rahman",
    "KK", "Sonu Nigam", "Shaan", "Javed Ali", "Armaan Malik", "Papon", "Shilpa Rao", "Sunidhi Chauhan"
  ],
  english_pop: [
    "The Weeknd", "Drake", "Post Malone", "Bruno Mars", "Taylor Swift", "Billie Eilish",
    "Ed Sheeran", "Dua Lipa", "SZA", "Juice WRLD", "Justin Bieber", "Ariana Grande", "Coldplay",
    "Charlie Puth", "Shawn Mendes", "Harry Styles", "Khalid"
  ]
};

// Generate smart Song Radio recommendations based on artist, vibe & rotation
async function getSongRadioRecommendations(
  title: string,
  artist: string,
  genre?: string,
  excludeTitlesList: string[] = []
): Promise<CanonicalTrack[]> {
  const vibe = detectServerMusicVibe(title, artist, "", genre);
  const primaryArtist = (artist || "").split(",")[0].split("&")[0].split("-")[0].trim();

  const seenTitles = new Set<string>();
  const cleanBase = (title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleanBase) seenTitles.add(cleanBase);

  // Add all excluded titles to seenTitles so they are NEVER returned again!
  for (const ex of excludeTitlesList) {
    const cleanEx = (ex || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanEx) seenTitles.add(cleanEx);
  }

  // Determine query list: Primary artist + 7-8 randomly sampled diverse artists from the vibe pool
  const pool = VIBE_ARTIST_POOLS[vibe] || VIBE_ARTIST_POOLS.bollywood_romantic;
  const otherArtists = shuffleArray(
    pool.filter(a => a.toLowerCase() !== primaryArtist.toLowerCase())
  ).slice(0, 8);

  const queryBatches: { artistName: string; maxTracks: number }[] = [];
  if (primaryArtist) {
    queryBatches.push({ artistName: primaryArtist, maxTracks: 4 });
  }
  for (const a of otherArtists) {
    queryBatches.push({ artistName: a, maxTracks: 4 });
  }

  const country = vibe === "english_pop" ? "US" : "IN";

  // Fetch all batches in parallel
  const artistBuckets: CanonicalTrack[][] = await Promise.all(
    queryBatches.map(async batch => {
      try {
        const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
          batch.artistName
        )}&entity=song&limit=10&country=${country}`;
        const res = await fetch(itunesUrl, {
          headers: { "User-Agent": "AppleMusicCatalogClient/2.0" },
        });
        if (!res.ok) return [];
        const data = await res.json();
        const tracks: CanonicalTrack[] = [];

        for (const item of data.results || []) {
          if (!item.trackName || !item.artistName) continue;
          if (isDuplicateTrackTitle(item.trackName, title)) continue;

          // Check if Western country / folk leak into Indian vibe
          if (vibe !== "english_pop") {
            const itemVibe = detectServerMusicVibe(
              item.trackName,
              item.artistName,
              item.collectionName,
              item.primaryGenreName
            );
            if (itemVibe === "english_pop") continue;
            if (
              item.primaryGenreName &&
              /country|western|heavy metal|classical/i.test(item.primaryGenreName)
            )
              continue;
          }

          const normalizedCore = item.trackName.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (seenTitles.has(normalizedCore)) continue;
          seenTitles.add(normalizedCore);

          const artwork = upgradeAppleArtwork(item.artworkUrl100, 600);
          // Prime server cache with this track's official artwork
          const cacheKey = `${item.trackName.toLowerCase().trim()}||${item.artistName.toLowerCase().trim()}`;
          serverArtworkCache.set(cacheKey, artwork);

          const duration = Math.round((item.trackTimeMillis || 210000) / 1000);
          const releaseYear = item.releaseDate
            ? new Date(item.releaseDate).getFullYear()
            : new Date().getFullYear();

          tracks.push({
            id: `itunes-track-${item.trackId}`,
            title: item.trackName,
            artist: item.artistName,
            artistId: item.artistId ? `itunes-artist-${item.artistId}` : undefined,
            album: item.collectionName || "Single",
            albumId: item.collectionId ? `itunes-album-${item.collectionId}` : undefined,
            artwork:
              artwork ||
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
            duration,
            playbackId: undefined,
            playbackSource: "youtube",
            releaseYear,
            genre: item.primaryGenreName || "Music",
            streamUrl: item.previewUrl || "",
            isLossless: true,
            provider: "itunes",
          });

          if (tracks.length >= batch.maxTracks) break;
        }
        return tracks;
      } catch {
        return [];
      }
    })
  );

  // Dynamic Interleaving: Interleave tracks so that no artist monopolizes the queue!
  const candidateSongs: CanonicalTrack[] = [];
  const maxLen = Math.max(...artistBuckets.map(b => b.length), 0);
  for (let i = 0; i < maxLen; i++) {
    for (const bucket of artistBuckets) {
      if (i < bucket.length) {
        candidateSongs.push(bucket[i]);
      }
    }
  }

  return candidateSongs.slice(0, 35);
}

app.get("/api/radio/recommendations", async (req, res) => {
  const title = (req.query.title as string) || "";
  const artist = (req.query.artist as string) || "";
  const genre = (req.query.genre as string) || "";
  const excludeQuery = (req.query.exclude as string) || "";
  let excludeList: string[] = [];
  if (excludeQuery) {
    try {
      excludeList = excludeQuery.startsWith("[")
        ? JSON.parse(excludeQuery)
        : excludeQuery.split(",").map(s => s.trim());
    } catch {
      excludeList = excludeQuery.split(",").map(s => s.trim());
    }
  }
  try {
    const recommendations = await getSongRadioRecommendations(title, artist, genre, excludeList);
    res.json({ recommendations });
  } catch (err) {
    console.warn("Radio recommendation error:", err);
    res.json({ recommendations: [] });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Vite middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AeroX Music Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
