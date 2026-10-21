import os
import re
import json
from typing import Optional, List, Dict, Any
from urllib.parse import quote_plus

import httpx
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

# Initialize FastAPI App
app = FastAPI(
    title="AeroX Music Engine API",
    description="High-performance music search, metadata & playback engine powered by FastAPI",
    version="2.0.0"
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory Caches
search_cache: Dict[str, Any] = {}
playback_cache: Dict[str, Dict[str, str]] = {}
album_cache: Dict[str, Any] = {}
artist_cache: Dict[str, Any] = {}

# Verified fallback tracks for instant response
VERIFIED_TRACKS = {
    "starboy|||the weeknd": "d38H_rJ2kO4",
    "blinding lights|||the weeknd": "4NRXx6U8ABQ",
    "shape of you|||ed sheeran": "JGwWNGJdvx8",
    "kesariya|||arijit singh": "BddP6PYo2gs",
    "tum hi ho|||arijit singh": "IJq0yyWug1k",
    "channa mereya|||arijit singh": "284Ov7ysmfA",
    "apna bana le|||arijit singh": "u2NAus-NocY",
    "believer|||imagine dragons": "7wtfhZwyrcc",
    "bones|||imagine dragons": "TO-_3tck2tg",
}

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"[^\w\s]", " ", text.lower())
    return re.sub(r"\s+", " ", text).strip()

def upgrade_apple_artwork(url: Optional[str], size: int = 1000) -> str:
    if not url:
        return ""
    url = re.sub(r"/\d+x\d+bb\.", f"/{size}x{size}bb.", url)
    return re.sub(r"/\d+x\d+\.", f"/{size}x{size}.", url)

def sanitize_search_query(title: str, artist: str) -> str:
    clean_title = re.sub(r"\s*\([^)]*(feat|ft|remaster|deluxe|version|edition|original)[^)]*\)", "", title, flags=re.I)
    clean_title = re.sub(r"\s*\[[^\]]*(feat|ft|remaster|deluxe|version|edition|original)[^\]]*\]", "", clean_title, flags=re.I).strip()
    primary_artist = artist.split(",")[0].split("&")[0].split("/")[0].strip()
    return f"{primary_artist} {clean_title} official audio"

# -------------------------------------------------------------
# 1. CATALOG SEARCH (iTunes + Deezer)
# -------------------------------------------------------------

async def search_itunes(query: str) -> Dict[str, List[Dict[str, Any]]]:
    url = f"https://itunes.apple.com/search?term={quote_plus(query)}&entity=song,album,musicArtist&limit=30&country=IN"
    songs, albums, artists = [], [], []
    seen_songs, seen_albums, seen_artists = set(), set(), set()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"User-Agent": "AeroXMusicClient/2.0"})
            if resp.status_code != 200:
                return {"songs": [], "albums": [], "artists": []}
            data = resp.json()

        for item in data.get("results", []):
            wrapper = item.get("wrapperType")
            kind = item.get("kind")

            if wrapper == "track" and kind == "song":
                sid = f"itunes-track-{item.get('trackId')}"
                if sid in seen_songs:
                    continue
                seen_songs.add(sid)

                artwork = upgrade_apple_artwork(item.get("artworkUrl100"), 1000)
                duration = round((item.get("trackTimeMillis") or 210000) / 1000)
                release_year = item.get("releaseDate", "")[:4] or "2024"

                songs.append({
                    "id": sid,
                    "title": item.get("trackName") or "Unknown Title",
                    "artist": item.get("artistName") or "Unknown Artist",
                    "artistId": f"itunes-artist-{item.get('artistId')}" if item.get("artistId") else None,
                    "album": item.get("collectionName") or "Single",
                    "albumId": f"itunes-album-{item.get('collectionId')}" if item.get("collectionId") else None,
                    "artwork": artwork or "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
                    "duration": duration,
                    "releaseYear": release_year,
                    "genre": item.get("primaryGenreName") or "Music",
                    "isLossless": True,
                    "provider": "itunes"
                })

            elif wrapper == "collection" or item.get("collectionType") == "Album":
                aid = f"itunes-album-{item.get('collectionId')}"
                if aid in seen_albums:
                    continue
                seen_albums.add(aid)

                artwork = upgrade_apple_artwork(item.get("artworkUrl100"), 1000)
                albums.append({
                    "id": aid,
                    "title": item.get("collectionName") or "Unknown Album",
                    "artist": item.get("artistName") or "Unknown Artist",
                    "artistId": f"itunes-artist-{item.get('artistId')}" if item.get("artistId") else None,
                    "artwork": artwork,
                    "releaseYear": item.get("releaseDate", "")[:4] or "2024",
                    "trackCount": item.get("trackCount") or 1,
                    "genre": item.get("primaryGenreName") or "Music",
                    "provider": "itunes",
                    "tracks": []
                })

            elif wrapper == "artist" or item.get("artistType") == "Artist":
                art_id = f"itunes-artist-{item.get('artistId')}"
                if art_id in seen_artists:
                    continue
                seen_artists.add(art_id)

                artists.append({
                    "id": art_id,
                    "name": item.get("artistName") or "Unknown Artist",
                    "artwork": "",
                    "monthlyListeners": 12500000,
                    "verified": True,
                    "genre": item.get("primaryGenreName") or "Popular Music",
                    "bio": f"{item.get('artistName')} official catalog release on Apple Music.",
                    "provider": "itunes",
                    "topTracks": [],
                    "albums": []
                })

    except Exception as e:
        print(f"iTunes API search error: {e}")

    return {"songs": songs, "albums": albums, "artists": artists}

async def search_deezer(query: str) -> Dict[str, List[Dict[str, Any]]]:
    url = f"https://api.deezer.com/search?q={quote_plus(query)}&limit=25"
    songs, albums, artists = [], [], []
    seen_songs, seen_albums, seen_artists = set(), set(), set()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers={"User-Agent": "AeroXMusicClient/2.0"})
            if resp.status_code != 200:
                return {"songs": [], "albums": [], "artists": []}
            data = resp.json()

        for item in data.get("data", []):
            sid = f"deezer-track-{item.get('id')}"
            if sid not in seen_songs:
                seen_songs.add(sid)
                alb = item.get("album") or {}
                art = item.get("artist") or {}
                artwork = alb.get("cover_xl") or alb.get("cover_big") or alb.get("cover_medium") or ""
                artist_artwork = art.get("picture_xl") or art.get("picture_big") or art.get("picture_medium") or ""

                songs.append({
                    "id": sid,
                    "title": item.get("title") or "Unknown Title",
                    "artist": art.get("name") or "Unknown Artist",
                    "artistId": f"deezer-artist-{art.get('id')}" if art.get("id") else None,
                    "album": alb.get("title") or "Single",
                    "albumId": f"deezer-album-{alb.get('id')}" if alb.get("id") else None,
                    "artwork": artwork,
                    "artistArtwork": artist_artwork,
                    "duration": item.get("duration") or 210,
                    "genre": "Pop",
                    "isLossless": True,
                    "provider": "deezer"
                })

            art = item.get("artist") or {}
            art_id = f"deezer-artist-{art.get('id')}"
            if art.get("id") and art_id not in seen_artists:
                seen_artists.add(art_id)
                artists.append({
                    "id": art_id,
                    "name": art.get("name") or "Unknown Artist",
                    "artwork": art.get("picture_xl") or art.get("picture_big") or art.get("picture_medium") or "",
                    "monthlyListeners": 18000000,
                    "verified": True,
                    "genre": "Pop",
                    "provider": "deezer",
                    "topTracks": [],
                    "albums": []
                })
    except Exception as e:
        print(f"Deezer search error: {e}")

    return {"songs": songs, "albums": albums, "artists": artists}

# -------------------------------------------------------------
# 2. YOUTUBE PLAYBACK RESOLVER (Innertube + Direct stream)
# -------------------------------------------------------------

async def resolve_youtube_video_id(title: str, artist: str) -> Optional[str]:
    norm_key = f"{normalize_text(title)}|||{normalize_text(artist)}"

    if norm_key in VERIFIED_TRACKS:
        return VERIFIED_TRACKS[norm_key]

    if norm_key in playback_cache:
        return playback_cache[norm_key].get("playbackId")

    search_query = sanitize_search_query(title, artist)

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(
                "https://www.youtube.com/youtubei/v1/search",
                headers={
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                },
                json={
                    "context": {
                        "client": {
                            "clientName": "WEB",
                            "clientVersion": "2.20240101.00.00",
                            "hl": "en",
                            "gl": "US",
                        }
                    },
                    "query": search_query
                }
            )

            if resp.status_code == 200:
                data = resp.json()
                sections = (
                    data.get("contents", {})
                    .get("twoColumnSearchResultsRenderer", {})
                    .get("primaryContents", {})
                    .get("sectionListRenderer", {})
                    .get("contents", [])
                )

                forbidden = ["reaction", "reacting", "trailer", "teaser", "cover", "review", "interview"]

                for section in sections:
                    items = section.get("itemSectionRenderer", {}).get("contents", [])
                    for it in items:
                        v = it.get("videoRenderer")
                        if not v or not v.get("videoId"):
                            continue

                        v_title = v.get("title", {}).get("runs", [{}])[0].get("text", "").lower()
                        if any(f in v_title for f in forbidden):
                            continue

                        video_id = v.get("videoId")
                        playback_cache[norm_key] = {"playbackId": video_id, "playbackSource": "youtube"}
                        return video_id

    except Exception as e:
        print(f"Innertube search error: {e}")

    # Fallback to Invidious search
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"https://invidious.privacydev.net/api/v1/search?q={quote_plus(search_query)}&type=video"
            )
            if resp.status_code == 200:
                items = resp.json()
                if items and isinstance(items, list) and len(items) > 0:
                    vid = items[0].get("videoId")
                    if vid:
                        playback_cache[norm_key] = {"playbackId": vid, "playbackSource": "youtube"}
                        return vid
    except Exception:
        pass

    return None

# -------------------------------------------------------------
# 3. FASTAPI ROUTE HANDLERS (Matching existing React frontend)
# -------------------------------------------------------------

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "AeroX Music Engine (FastAPI)", "version": "2.0.0"}

@app.get("/api/metadata/search")
async def metadata_search(q: str = Query(..., min_length=1)):
    clean_q = q.strip().lower()
    if clean_q in search_cache:
        return search_cache[clean_q]

    itunes_res = await search_itunes(clean_q)
    deezer_res = await search_deezer(clean_q)

    # Merge results
    merged_songs = itunes_res["songs"] + [s for s in deezer_res["songs"] if s["id"] not in {x["id"] for x in itunes_res["songs"]}]
    merged_albums = itunes_res["albums"] + deezer_res["albums"]
    merged_artists = itunes_res["artists"] + deezer_res["artists"]

    # Filter out empty artist photos if Deezer has a good one
    for art in merged_artists:
        if not art.get("artwork"):
            for d_art in deezer_res["artists"]:
                if normalize_text(d_art["name"]) == normalize_text(art["name"]) and d_art.get("artwork"):
                    art["artwork"] = d_art["artwork"]
                    break

    result = {
        "songs": merged_songs[:35],
        "artists": merged_artists[:15],
        "albums": merged_albums[:15],
        "playlists": []
    }

    search_cache[clean_q] = result
    return result

@app.get("/api/metadata/album")
async def get_album(id: str = Query(...)):
    raw_id = id.replace("itunes-album-", "").replace("deezer-album-", "").strip()

    if id in album_cache:
        return {"album": album_cache[id]}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"https://itunes.apple.com/lookup?id={raw_id}&entity=song",
                headers={"User-Agent": "AeroXMusicClient/2.0"}
            )
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                if results:
                    col = results[0]
                    track_items = [it for it in results[1:] if it.get("wrapperType") == "track"]

                    tracks = []
                    for t in track_items:
                        tracks.append({
                            "id": f"itunes-track-{t.get('trackId')}",
                            "title": t.get("trackName") or "Track",
                            "artist": t.get("artistName") or col.get("artistName") or "Artist",
                            "album": col.get("collectionName"),
                            "artwork": upgrade_apple_artwork(t.get("artworkUrl100"), 600),
                            "duration": round((t.get("trackTimeMillis") or 210000) / 1000),
                            "trackNumber": t.get("trackNumber") or 1,
                            "isLossless": True,
                            "provider": "itunes"
                        })

                    album_obj = {
                        "id": id,
                        "title": col.get("collectionName") or "Album",
                        "artist": col.get("artistName") or "Artist",
                        "artwork": upgrade_apple_artwork(col.get("artworkUrl100"), 1000),
                        "releaseYear": col.get("releaseDate", "")[:4] or "2024",
                        "trackCount": len(tracks),
                        "genre": col.get("primaryGenreName") or "Music",
                        "tracks": tracks,
                        "provider": "itunes"
                    }
                    album_cache[id] = album_obj
                    return {"album": album_obj}
    except Exception as e:
        print(f"Album lookup error: {e}")

    return {"album": None}

@app.get("/api/metadata/artist")
async def get_artist(id: str = Query(...)):
    raw_id = id.replace("itunes-artist-", "").replace("deezer-artist-", "").strip()

    if id in artist_cache:
        return {"artist": artist_cache[id]}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"https://itunes.apple.com/lookup?id={raw_id}&entity=song,album&limit=25",
                headers={"User-Agent": "AeroXMusicClient/2.0"}
            )
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                if results:
                    artist_item = results[0]
                    songs, albums = [], []
                    for it in results[1:]:
                        if it.get("wrapperType") == "track" and it.get("kind") == "song":
                            songs.append({
                                "id": f"itunes-track-{it.get('trackId')}",
                                "title": it.get("trackName") or "Song",
                                "artist": it.get("artistName"),
                                "album": it.get("collectionName"),
                                "artwork": upgrade_apple_artwork(it.get("artworkUrl100"), 600),
                                "duration": round((it.get("trackTimeMillis") or 210000) / 1000),
                                "provider": "itunes"
                            })
                        elif it.get("wrapperType") == "collection":
                            albums.append({
                                "id": f"itunes-album-{it.get('collectionId')}",
                                "title": it.get("collectionName"),
                                "artist": it.get("artistName"),
                                "artwork": upgrade_apple_artwork(it.get("artworkUrl100"), 800),
                                "releaseYear": it.get("releaseDate", "")[:4] or "2024",
                                "provider": "itunes"
                            })

                    artist_obj = {
                        "id": id,
                        "name": artist_item.get("artistName"),
                        "artwork": "",
                        "monthlyListeners": 15000000,
                        "genre": artist_item.get("primaryGenreName") or "Pop",
                        "bio": f"{artist_item.get('artistName')} is a featured recording artist.",
                        "topTracks": songs,
                        "albums": albums,
                        "provider": "itunes"
                    }
                    artist_cache[id] = artist_obj
                    return {"artist": artist_obj}
    except Exception as e:
        print(f"Artist lookup error: {e}")

    return {"artist": None}

class PlaybackRequest(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    duration: Optional[float] = None

@app.api_route("/api/playback/resolve", methods=["GET", "POST"])
async def resolve_playback(req: Request):
    title = req.query_params.get("title")
    artist = req.query_params.get("artist")

    if req.method == "POST":
        try:
            body = await req.json()
            title = body.get("title") or title
            artist = body.get("artist") or artist
        except Exception:
            pass

    if not title or not artist:
        raise HTTPException(status_code=400, detail="Title and Artist required")

    video_id = await resolve_youtube_video_id(title, artist)
    if not video_id:
        raise HTTPException(status_code=404, detail="Playback source not found")

    return {
        "playbackId": video_id,
        "playbackSource": "youtube",
        "streamUrl": None
    }

@app.get("/api/artist/lookup")
async def artist_lookup(name: str = Query(...)):
    res = await metadata_search(name)
    artists = res.get("artists", [])
    return {"artist": artists[0] if artists else None}

@app.get("/api/youtube/search")
async def youtube_search(q: str = Query(...)):
    vid = await resolve_youtube_video_id(q, "")
    return {"results": [{"id": vid, "title": q}] if vid else []}

@app.get("/api/artwork/resolve")
async def resolve_artwork(title: str = Query(...), artist: str = Query(...)):
    res = await metadata_search(f"{artist} {title}")
    songs = res.get("songs", [])
    if songs and songs[0].get("artwork"):
        return {"artwork": songs[0]["artwork"]}
    return {"artwork": ""}

@app.get("/api/radio/recommendations")
async def radio_recommendations(
    title: str = Query(...),
    artist: str = Query(...),
    genre: Optional[str] = None
):
    # Fetch songs from same artist and genre
    res = await metadata_search(artist)
    recs = [s for s in res.get("songs", []) if normalize_text(s["title"]) != normalize_text(title)]
    return {"recommendations": recs[:12]}

# -------------------------------------------------------------
# 4. STATIC ASSET SERVING (Production React SPA)
# -------------------------------------------------------------

dist_dir = os.path.join(os.path.dirname(__file__), "dist")
if os.path.exists(dist_dir):
    # Mount assets folder
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Serve index.html for all client-side React routes
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 3000))
    print(f"Starting AeroX FastAPI Server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
