import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CURATED_SONGS } from '../services/curatedCatalog';
import { musicService } from '../services/musicService';
import { AutoMixProfile, AutoMixTransitionState, LyricsData, Song } from '../types/music';
import { deduplicateSongs, detectMusicCulture, filterSameCultureSongs, isSameSongOrDuplicate } from '../utils/musicDeduplication';
import { useAuthAndStorage } from './AuthAndStorageContext';

type RepeatMode = 'off' | 'all' | 'one';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  playbackError: string | null;
  isResolvingPlayback: boolean;
  queue: Song[];
  queueIndex: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  lyricsData: LyricsData | null;
  currentLyricIndex: number;
  isLyricsLoading: boolean;
  audioFrequencyData: number;
  playbackEngine: 'html5' | 'youtube';
  isVideoMode: boolean;

  // Legacy/Compatibility fields
  crossfadeDuration: number;
  isCrossfading: boolean;
  autoMixEnabled: boolean;
  autoMixDurationProfile: AutoMixProfile;
  transitionState: AutoMixTransitionState;
  transitionProgress: number;
  nextTrack: Song | null;
  isDspStudioOpen: boolean;
  setIsDspStudioOpen: (open: boolean) => void;
  dspTelemetry: any;
  jumpToOutroCue: () => void;
  triggerDspAutoMix: () => void;
  toggleBassIsolation: () => void;
  toggleBeatMatching: () => void;

  // UI Modal/Drawer states
  isFullScreenOpen: boolean;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  activeModal: 'playlist' | 'create-playlist' | 'share' | 'profile' | null;
  modalTargetSong: Song | null;

  // Actions
  playSong: (
    song: Song,
    newQueue?: Song[],
    startIndex?: number,
    options?: { fromSearch?: boolean }
  ) => void;
  playSongFromSearch: (song: Song, searchResults?: Song[]) => void;
  retryPlayback: () => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: (isManual?: boolean) => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  playNextInQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  setIsVideoMode: (enabled: boolean) => void;
  setCrossfadeDuration: (seconds: number) => void;
  setAutoMixEnabled: (enabled: boolean) => void;
  setAutoMixDurationProfile: (profile: AutoMixProfile) => void;

  // UI Toggles
  setIsFullScreenOpen: (open: boolean) => void;
  setIsLyricsOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  openModal: (modal: 'playlist' | 'create-playlist' | 'share' | 'profile', targetSong?: Song | null) => void;
  closeModal: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToHistory } = useAuthAndStorage();

  const [currentSong, setCurrentSong] = useState<Song | null>(CURATED_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(CURATED_SONGS[0]?.duration || 180);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackEngine, setPlaybackEngine] = useState<'html5' | 'youtube'>('youtube');
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);

  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isResolvingPlayback, setIsResolvingPlayback] = useState<boolean>(false);

  const [queue, setQueue] = useState<Song[]>(CURATED_SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  // Lyrics state
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
  const [isLyricsLoading, setIsLyricsLoading] = useState<boolean>(false);

  // UI state
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'playlist' | 'create-playlist' | 'share' | 'profile' | null>(null);
  const [modalTargetSong, setModalTargetSong] = useState<Song | null>(null);

  // Frequency simulation for glow reactive effects
  const [audioFrequencyData, setAudioFrequencyData] = useState<number>(0.5);

  // Media references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const userVolumeRef = useRef<number>(0.85);
  const isMutedRef = useRef<boolean>(false);
  const prevVolumeRef = useRef<number>(0.85);
  const repeatModeRef = useRef<RepeatMode>('off');
  const activeResolutionIdRef = useRef<string | null>(null);
  const playedSongTitlesRef = useRef<Set<string>>(new Set());
  const queueRef = useRef<Song[]>(queue);
  const queueIndexRef = useRef<number>(queueIndex);
  const currentSongRef = useRef<Song | null>(currentSong);
  const isFetchingRadioRef = useRef<boolean>(false);

  repeatModeRef.current = repeatMode;
  queueRef.current = queue;
  queueIndexRef.current = queueIndex;
  currentSongRef.current = currentSong;

  // Initialize YouTube IFrame API
  useEffect(() => {
    const initYT = () => {
      if (!(window as any).YT || !(window as any).YT.Player) return;
      if (ytPlayerRef.current) return;

      try {
        ytPlayerRef.current = new (window as any).YT.Player('clean-yt-player-host', {
          height: '100%',
          width: '100%',
          videoId: CURATED_SONGS[0]?.playbackId || CURATED_SONGS[0]?.youtubeId || '4NRXx6U8ABQ',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (e: any) => {
              isYtReadyRef.current = true;
              e.target.setVolume(isMutedRef.current ? 0 : userVolumeRef.current * 100);
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
                setIsBuffering(false);
                const dur = ytPlayerRef.current?.getDuration();
                if (dur && !isNaN(dur) && dur > 0) setDuration(dur);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 3) {
                setIsBuffering(true);
              } else if (event.data === 0) {
                handleSongEnded();
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player notice:', err);
              setIsBuffering(false);
            },
          },
        });
      } catch (e) {
        console.warn('Could not initialize YT Player:', e);
      }
    };

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = initYT;
    } else {
      initYT();
    }
  }, []);

  // Initialize HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (playbackEngine !== 'html5') return;
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (playbackEngine === 'html5' && audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsBuffering(false);
    };

    const onWaiting = () => {
      if (playbackEngine === 'html5') {
        setIsBuffering(true);
      }
    };

    const onPlaying = () => {
      if (playbackEngine === 'html5') {
        setIsPlaying(true);
        setIsBuffering(false);
      }
    };

    const onPause = () => {
      if (playbackEngine === 'html5') {
        setIsPlaying(false);
      }
    };

    const onEnded = () => {
      if (playbackEngine === 'html5') {
        handleSongEnded();
      }
    };

    const onError = () => {
      if (playbackEngine === 'html5') {
        setIsBuffering(false);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [playbackEngine]);

  // YouTube progress polling
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (playbackEngine === 'youtube' && isPlaying) {
      interval = setInterval(() => {
        const yt = ytPlayerRef.current;
        if (yt && isYtReadyRef.current) {
          try {
            const curr = yt.getCurrentTime();
            const dur = yt.getDuration();
            if (curr !== undefined && !isNaN(curr)) {
              setCurrentTime(curr);
            }
            if (dur && !isNaN(dur) && dur > 0) {
              setDuration(dur);
            }
          } catch {}
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playbackEngine, isPlaying]);

  // Audio frequency simulation for glow reactive effects
  useEffect(() => {
    let phase = 0;
    const interval = setInterval(() => {
      if (isPlaying) {
        phase += 0.2;
        const dynamicVal = 0.4 + Math.sin(phase) * 0.3 + Math.random() * 0.2;
        setAudioFrequencyData(Math.min(1, Math.max(0.2, dynamicVal)));
      } else {
        setAudioFrequencyData(0.2);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Load lyrics when song changes
  useEffect(() => {
    if (!currentSong) {
      setLyricsData(null);
      return;
    }

    let isMounted = true;
    setIsLyricsLoading(true);

    musicService.getLyrics(currentSong).then(data => {
      if (isMounted) {
        setLyricsData(data);
        setIsLyricsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentSong?.id]);

  // Track active lyric line based on current time
  useEffect(() => {
    if (!lyricsData || !lyricsData.lines || lyricsData.lines.length === 0) {
      setCurrentLyricIndex(-1);
      return;
    }

    const lines = lyricsData.lines;
    let activeIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (currentTime >= lines[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }
    setCurrentLyricIndex(activeIdx);
  }, [currentTime, lyricsData]);

  // Handle song ended logic
  const handleSongEnded = () => {
    if (repeatModeRef.current === 'one') {
      seek(0);
      resume();
    } else {
      next(false);
    }
  };

  // Proactively fetch more matching radio tracks to maintain an infinite queue
  const fetchMoreRadioSongs = async (seedSong: Song, currentQ: Song[]) => {
    if (isFetchingRadioRef.current) return;
    isFetchingRadioRef.current = true;

    try {
      const allExcludes: string[] = currentQ.map(s => s.title);
      playedSongTitlesRef.current.forEach(pt => {
        if (pt) allExcludes.push(pt);
      });

      const radioSongs = await musicService.getSongRadio(seedSong, allExcludes);
      const cleanRadio = filterSameCultureSongs(radioSongs, seedSong);
      const currentList = queueRef.current;
      const finalRadio = cleanRadio.filter(
        rs =>
          !allExcludes.some(ex => isSameSongOrDuplicate(rs.title, ex)) &&
          !currentList.some(q => q.id === rs.id || isSameSongOrDuplicate(q.title, rs.title))
      );

      if (finalRadio.length > 0) {
        setQueue(prev => {
          const seen = new Set(prev.map(p => p.id));
          const filtered = finalRadio.filter(
            s => !seen.has(s.id) && !prev.some(p => isSameSongOrDuplicate(p.title, s.title))
          );
          if (filtered.length === 0) return prev;
          const newQ = [...prev, ...filtered];
          queueRef.current = newQ;
          return newQ;
        });
      }
    } catch (e) {
      console.warn('Auto radio expansion notice:', e);
    } finally {
      isFetchingRadioRef.current = false;
    }
  };

  // Play song cleanly with immediate full volume
  const playSong = async (
    song: Song,
    newQueue?: Song[],
    startIndex?: number,
    options?: { fromSearch?: boolean }
  ) => {
    const resolutionId = `${song.id}-${Date.now()}`;
    activeResolutionIdRef.current = resolutionId;

    let initialQueue: Song[] = [];
    let initialIndex = 0;

    if (options?.fromSearch) {
      // 1. From Search: Keep other search tracks if they are from the same primary artist
      const primaryArtist = (song.artist || '').split(',')[0].split('&')[0].split('-')[0].trim().toLowerCase();
      const sameArtistMatches = newQueue
        ? newQueue
            .filter(s => s.id !== song.id && s.artist.toLowerCase().includes(primaryArtist.slice(0, 5)))
            .slice(0, 2)
        : [];
      initialQueue = [song, ...sameArtistMatches];
      initialIndex = 0;
    } else if (newQueue && newQueue.length > 0) {
      initialQueue = newQueue;
      const idx = startIndex !== undefined ? startIndex : newQueue.findIndex(s => s.id === song.id);
      initialIndex = idx !== -1 ? idx : 0;
    } else {
      const idx = queueRef.current.findIndex(s => s.id === song.id);
      if (idx !== -1) {
        initialQueue = queueRef.current;
        initialIndex = idx;
      } else {
        initialQueue = [song, ...queueRef.current];
        initialIndex = 0;
      }
    }

    setQueue(initialQueue);
    setQueueIndex(initialIndex);
    queueRef.current = initialQueue;
    queueIndexRef.current = initialIndex;

    setCurrentSong(song);
    currentSongRef.current = song;
    addToHistory(song);
    if (song?.title) {
      playedSongTitlesRef.current.add(song.title.toLowerCase().trim());
    }

    // Immediately launch background infinite radio queue expansion
    // Guarantees that the queue is stocked with 20-35+ matching songs ahead of time!
    fetchMoreRadioSongs(song, initialQueue);

    // Preload artwork in browser memory for instant rendering
    if (song.artwork) {
      const preloadImg = new Image();
      preloadImg.src = song.artwork;
    }

    // Asynchronously upgrade any YouTube thumbnail to official original high-res album cover
    if (song.artwork && (song.artwork.includes('ytimg.com') || song.artwork.includes('hqdefault'))) {
      fetch(`/api/artwork/resolve?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.artwork) {
            song.artwork = data.artwork;
            setCurrentSong(prev => (prev?.id === song.id ? { ...prev, artwork: data.artwork } : prev));
          }
        })
        .catch(() => {});
    }

    setCurrentTime(0);
    setDuration(song.duration || 180);
    setPlaybackError(null);
    setIsResolvingPlayback(true);
    setIsBuffering(true);

    let targetPlaybackId = song.playbackId || song.youtubeId;

    if (!targetPlaybackId && song.provider !== 'custom') {
      try {
        const resolved = await musicService.resolvePlayback(song);
        if (activeResolutionIdRef.current !== resolutionId) return;
        targetPlaybackId = resolved.playbackId;
        if (targetPlaybackId) {
          song.playbackId = targetPlaybackId;
        }
      } catch (err) {
        if (activeResolutionIdRef.current !== resolutionId) return;
        console.warn('Playback resolution error:', err);
      }
    }

    if (activeResolutionIdRef.current !== resolutionId) return;
    setIsResolvingPlayback(false);

    if (targetPlaybackId && targetPlaybackId.trim().length > 0) {
      setPlaybackError(null);
      setPlaybackEngine('youtube');

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const yt = ytPlayerRef.current;
      if (yt && isYtReadyRef.current) {
        try {
          yt.loadVideoById(targetPlaybackId);
          yt.setVolume(isMutedRef.current ? 0 : userVolumeRef.current * 100);
          yt.playVideo();
          setIsPlaying(true);
          setIsBuffering(false);
        } catch (e) {
          console.warn('Error loading playback video:', e);
          setPlaybackError('Unable to play this song');
          setIsBuffering(false);
        }
      } else {
        setIsBuffering(false);
        setIsPlaying(true);
      }
    } else if (song.streamUrl && song.streamUrl.trim().length > 0) {
      setPlaybackError(null);
      setPlaybackEngine('html5');

      const yt = ytPlayerRef.current;
      if (yt && isYtReadyRef.current) {
        try { yt.pauseVideo(); } catch {}
      }

      const audio = audioRef.current;
      if (audio) {
        audio.src = song.streamUrl;
        audio.volume = isMutedRef.current ? 0 : userVolumeRef.current;
        audio.load();
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch(err => {
            console.warn('Playback error:', err);
            setPlaybackError('Unable to play this song');
            setIsPlaying(false);
            setIsBuffering(false);
          });
      }
    } else {
      setIsBuffering(false);
      setIsPlaying(false);
      setPlaybackError('Unable to play this song');
    }
  };

  const retryPlayback = () => {
    if (currentSong) {
      playSong(currentSong);
    }
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    if (playbackEngine === 'youtube') {
      const yt = ytPlayerRef.current;
      if (yt && isYtReadyRef.current) {
        try { yt.pauseVideo(); } catch {}
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    setIsPlaying(false);
  };

  const resume = () => {
    if (!currentSong) return;

    if (playbackEngine === 'youtube') {
      const yt = ytPlayerRef.current;
      if (yt && isYtReadyRef.current) {
        try {
          yt.setVolume(isMutedRef.current ? 0 : userVolumeRef.current * 100);
          yt.playVideo();
          setIsPlaying(true);
        } catch {}
      }
    } else {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = isMutedRef.current ? 0 : userVolumeRef.current;
        if (!audio.src || audio.src === window.location.href) {
          if (currentSong.streamUrl) audio.src = currentSong.streamUrl;
        }
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const playSongFromSearch = (song: Song, searchResults?: Song[]) => {
    playSong(song, searchResults, 0, { fromSearch: true });
  };

  const next = (_isManual = true) => {
    const currentQ = queueRef.current;
    if (currentQ.length === 0) return;

    const currentS = currentSongRef.current;
    const currentIndex = currentS
      ? currentQ.findIndex(s => s.id === currentS.id)
      : queueIndexRef.current;

    const validIndex = currentIndex !== -1 ? currentIndex : queueIndexRef.current;
    let nextIdx = validIndex + 1;

    if (isShuffle && currentQ.length > 1) {
      let rand = Math.floor(Math.random() * currentQ.length);
      while (rand === validIndex && currentQ.length > 1) {
        rand = Math.floor(Math.random() * currentQ.length);
      }
      nextIdx = rand;
    }

    // Smart Deduplication & Culture Guard:
    // Skip duplicate versions of current song OR tracks from a completely mismatched culture
    const currentCulture = currentS ? detectMusicCulture(currentS) : null;
    while (
      nextIdx < currentQ.length &&
      currentS &&
      (
        currentQ[nextIdx].id === currentS.id ||
        isSameSongOrDuplicate(currentQ[nextIdx].title, currentS.title) ||
        (currentCulture && detectMusicCulture(currentQ[nextIdx]) !== currentCulture)
      )
    ) {
      nextIdx++;
    }

    // Ahead-of-time Proactive Queue Refill:
    // Whenever remaining songs in queue are 5 or fewer, fetch more songs in the background!
    if (currentS && currentQ.length - nextIdx <= 5) {
      fetchMoreRadioSongs(currentS, currentQ);
    }

    // If nextIdx is within queue bounds, play immediately!
    if (nextIdx < currentQ.length) {
      const nextSong = currentQ[nextIdx];
      setQueueIndex(nextIdx);
      queueIndexRef.current = nextIdx;
      playSong(nextSong);
      return;
    }

    // If user explicitly enabled Repeat One
    if (repeatModeRef.current === 'one') {
      seek(0);
      resume();
      return;
    }

    // END OF LOADED QUEUE REACHED:
    // Under no circumstance do we stop or loop back to song #0!
    // As expected in modern streaming apps: "next krte jao krte jao kabhi gaane khtm nhi hote"
    const targetCulture = currentS ? detectMusicCulture(currentS) : 'bollywood';

    // 1. Instant fallback candidate from curated library of matching culture
    const unplayedCurated = CURATED_SONGS.filter(s => {
      if (currentS && s.id === currentS.id) return false;
      if (currentS && isSameSongOrDuplicate(s.title, currentS.title)) return false;
      if (detectMusicCulture(s) !== targetCulture) return false;
      if (playedSongTitlesRef.current.has(s.title.toLowerCase().trim())) return false;
      return true;
    });

    if (unplayedCurated.length > 0) {
      const chosen = unplayedCurated[Math.floor(Math.random() * unplayedCurated.length)];
      const updatedQ = [...currentQ, chosen];
      setQueue(updatedQ);
      queueRef.current = updatedQ;
      const newIdx = currentQ.length;
      setQueueIndex(newIdx);
      queueIndexRef.current = newIdx;
      playSong(chosen);
      if (currentS) {
        fetchMoreRadioSongs(currentS, updatedQ);
      }
      return;
    }

    // 2. If all curated songs were played, immediately fetch fresh batch from radio recommendations
    if (currentS) {
      setIsBuffering(true);
      const allExcludes: string[] = currentQ.map(s => s.title);
      playedSongTitlesRef.current.forEach(pt => {
        if (pt) allExcludes.push(pt);
      });

      musicService
        .getSongRadio(currentS, allExcludes)
        .then(moreSongs => {
          const cleanMore = filterSameCultureSongs(moreSongs, currentS).filter(
            s => !allExcludes.some(ex => isSameSongOrDuplicate(s.title, ex))
          );
          if (cleanMore.length > 0) {
            const firstNew = cleanMore[0];
            setQueue(prev => {
              const seen = new Set(prev.map(p => p.id));
              const filtered = cleanMore.filter(s => !seen.has(s.id));
              const newQ = [...prev, ...filtered];
              queueRef.current = newQ;
              return newQ;
            });
            const newIdx = queueRef.current.length;
            setQueueIndex(newIdx);
            queueIndexRef.current = newIdx;
            playSong(firstNew);
          } else {
            // Continuous loop safety: Pick any song from matching culture in catalog
            const pool = CURATED_SONGS.filter(s => detectMusicCulture(s) === targetCulture);
            const fallback = pool[Math.floor(Math.random() * pool.length)] || CURATED_SONGS[0];
            const newQ = [...queueRef.current, fallback];
            setQueue(newQ);
            queueRef.current = newQ;
            setQueueIndex(newQ.length - 1);
            queueIndexRef.current = newQ.length - 1;
            playSong(fallback);
          }
        })
        .catch(() => {
          const pool = CURATED_SONGS.filter(s => detectMusicCulture(s) === targetCulture);
          const fallback = pool[Math.floor(Math.random() * pool.length)] || CURATED_SONGS[0];
          playSong(fallback);
        });
      return;
    }

    if (currentQ.length > 0) {
      setQueueIndex(0);
      playSong(currentQ[0]);
    }
  };

  const previous = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const currentQ = queueRef.current;
    if (currentQ.length === 0) return;

    const currentS = currentSongRef.current;
    const currentIndex = currentS
      ? currentQ.findIndex(s => s.id === currentS.id)
      : queueIndexRef.current;

    const validIndex = currentIndex !== -1 ? currentIndex : queueIndexRef.current;
    let prevIdx = validIndex - 1;
    if (prevIdx < 0) {
      seek(0);
      return;
    }

    const prevSong = currentQ[prevIdx];
    if (prevSong) {
      setQueueIndex(prevIdx);
      queueIndexRef.current = prevIdx;
      playSong(prevSong);
    }
  };

  const seek = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, time));
    setCurrentTime(clamped);

    if (playbackEngine === 'youtube') {
      const yt = ytPlayerRef.current;
      if (yt && isYtReadyRef.current) {
        try {
          yt.seekTo(clamped, true);
        } catch {}
      }
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = clamped;
      }
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    userVolumeRef.current = clamped;

    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      isMutedRef.current = false;
    }

    if (playbackEngine === 'youtube') {
      const yt = ytPlayerRef.current;
      if (yt && isYtReadyRef.current) {
        try {
          yt.setVolume(clamped * 100);
        } catch {}
      }
    } else {
      if (audioRef.current) {
        audioRef.current.volume = clamped;
      }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      isMutedRef.current = false;
      const restoreVol = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.85;
      setVolume(restoreVol);
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
      isMutedRef.current = true;
      if (playbackEngine === 'youtube') {
        const yt = ytPlayerRef.current;
        if (yt && isYtReadyRef.current) {
          try { yt.setVolume(0); } catch {}
        }
      } else {
        if (audioRef.current) {
          audioRef.current.volume = 0;
        }
      }
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const playNextInQueue = (song: Song) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, song);
      return copy;
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearQueue = () => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const openModal = (modal: 'playlist' | 'create-playlist' | 'share' | 'profile', targetSong?: Song | null) => {
    setActiveModal(modal);
    setModalTargetSong(targetSong || currentSong);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalTargetSong(null);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        if (e.shiftKey) next();
        else seek(currentTime + 5);
      } else if (e.code === 'ArrowLeft') {
        if (e.shiftKey) previous();
        else seek(currentTime - 5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(volume - 0.05);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        setIsLyricsOpen(prev => !prev);
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQueueOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, volume, isMuted, playbackEngine]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isBuffering,
        playbackError,
        isResolvingPlayback,
        queue,
        queueIndex,
        repeatMode,
        isShuffle,
        lyricsData,
        currentLyricIndex,
        isLyricsLoading,
        audioFrequencyData,
        playbackEngine,
        isVideoMode,

        // Safe legacy fallback props
        crossfadeDuration: 0,
        isCrossfading: false,
        autoMixEnabled: false,
        autoMixDurationProfile: 'medium',
        transitionState: 'idle',
        transitionProgress: 0,
        nextTrack: null,
        isDspStudioOpen: false,
        setIsDspStudioOpen: () => {},
        dspTelemetry: {
          deckAGain: 1,
          deckBGain: 0,
          deckABassDb: 0,
          deckBBassDb: 0,
          isMixing: false,
          transitionProgress: 0,
          countdownRemaining: 0,
          activeDeck: 0,
          deckABpm: 120,
          deckBBpm: 120,
          deckARate: 1,
          deckBRate: 1,
          bassIsolationEnabled: false,
          beatMatchingEnabled: false,
          sampleRate: 44100,
          statusText: '',
        },
        jumpToOutroCue: () => {},
        triggerDspAutoMix: () => {},
        toggleBassIsolation: () => {},
        toggleBeatMatching: () => {},

        isFullScreenOpen,
        isLyricsOpen,
        isQueueOpen,
        activeModal,
        modalTargetSong,
        playSong,
        playSongFromSearch,
        retryPlayback,
        togglePlay,
        pause,
        resume,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        setIsVideoMode,
        setCrossfadeDuration: () => {},
        setAutoMixEnabled: () => {},
        setAutoMixDurationProfile: () => {},
        setIsFullScreenOpen,
        setIsLyricsOpen,
        setIsQueueOpen,
        openModal,
        closeModal,
      }}
    >
      {/* Hidden/Dynamic YouTube IFrame Host */}
      <div
        id="clean-yt-host-container"
        className={
          isVideoMode && isFullScreenOpen
            ? 'fixed z-50 top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-lg aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10'
            : 'fixed -left-[9999px] -top-[9999px] w-1 h-1 pointer-events-none opacity-0'
        }
      >
        <div id="clean-yt-player-host" className="w-full h-full" />
      </div>

      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
