export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatRemaining(current: number, total: number): string {
  const rem = Math.max(0, total - current);
  return `-${formatDuration(rem)}`;
}

export function formatPlayCount(count?: number): string {
  if (!count) return '0';
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(0)}K`;
  }
  return count.toString();
}

export function getGreeting(userName?: string): string {
  const hour = new Date().getHours();
  let timeStr = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeStr = 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeStr = 'Good evening';
  } else {
    timeStr = 'Late night vibes';
  }
  return userName ? `${timeStr}, ${userName}` : timeStr;
}

/**
 * Intelligently normalizes raw song titles to clean display titles.
 * Strips technical/promotional video noise (HD, 4K, 8K, HQ, Full HD, Official Video,
 * Official Audio, Music Video, Official Music Video, Lyrics, Lyric Video, Visualizer, Full Video)
 * while strictly preserving legitimate artistic qualifiers like (Live), - Remix, (Acoustic), (feat. X), etc.
 */
export function cleanSongTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  let title = rawTitle.trim();

  // Run two passes to handle nested or adjacent suffix combinations (e.g. "(Official Video) HD")
  for (let pass = 0; pass < 2; pass++) {
    // 1. Remove bracketed / parenthesized video & technical metadata tags
    const bracketNoise = [
      // Official / Music Video variants
      /\s*[\(\[\{]\s*(?:official\s+)?(?:music\s+)?video(?:\s+song)?(?:\s+(?:hd|4k|8k|hq|full\s+hd))?\s*[\)\]\}]/gi,
      /\s*[\(\[\{]\s*official\s+audio(?:\s+(?:hd|4k|8k|hq|full\s+hd))?\s*[\)\]\}]/gi,
      /\s*[\(\[\{]\s*official\s+(?:track|lyric\s+video|visualizer)\s*[\)\]\}]/gi,
      /\s*[\(\[\{]\s*(?:music\s+video|full\s+video(?:\s+song)?|video\s+song)\s*[\)\]\}]/gi,
      /\s*[\(\[\{]\s*(?:audio|full\s+audio|audio\s+song)\s*[\)\]\}]/gi,
      /\s*[\(\[\{]\s*lyrics?(?:\s+video)?\s*[\)\]\}]/gi,
      /\s*[\(\[\{]\s*visualizer\s*[\)\]\}]/gi,
      // Standalone resolution & quality tags in brackets
      /\s*[\(\[\{]\s*(?:hd|4k|8k|hq|full\s+hd|uhd|1080p|720p)\s*[\)\]\}]/gi,
    ];

    for (const regex of bracketNoise) {
      title = title.replace(regex, '');
    }

    // 2. Remove trailing hyphen/pipe/slash promotional clauses
    const trailingNoise = [
      /\s*[-–—|/]\s*official\s+(?:music\s+)?video\s*$/gi,
      /\s*[-–—|/]\s*official\s+audio\s*$/gi,
      /\s*[-–—|/]\s*(?:official\s+)?(?:music\s+)?video\s*$/gi,
      /\s*[-–—|/]\s*(?:official\s+)?audio\s*$/gi,
      /\s*[-–—|/]\s*official\s+(?:lyric\s+video|visualizer)\s*$/gi,
      /\s*[-–—|/]\s*lyric(?:s)?(?:\s+video)?\s*$/gi,
      /\s*[-–—|/]\s*visualizer\s*$/gi,
      /\s*[-–—|/]\s*(?:full\s+)?video(?:\s+song)?\s*$/gi,
      /\s*[-–—|/]\s*(?:full\s+)?audio(?:\s+song)?\s*$/gi,
      /\s*[-–—|/]\s*(?:full\s+hd|4k|8k|hd|hq|uhd)\s*$/gi,
      /\s*[-–—|/]\s*(?:t-series|zee\s+music|yrf|speed\s+records|sony\s+music)(?:\s+company)?\s*$/gi,
    ];

    for (const regex of trailingNoise) {
      title = title.replace(regex, '');
    }

    // 3. Remove standalone technical suffixes at the very end
    title = title.replace(/\s+\b(?:Full\s+HD|HD|4K|8K|HQ|UHD|1080p|720p)\b\s*$/gi, '');
    title = title.replace(/\s+\b(?:Official\s+Music\s+Video|Official\s+Video|Official\s+Audio|Music\s+Video|Lyric\s+Video|Visualizer|Full\s+Video)\b\s*$/gi, '');
    title = title.replace(/\s+\b(?:Lyrics?)\b\s*$/gi, '');

    // 4. Remove leftover empty parentheses/brackets or dangling delimiters
    title = title.replace(/\s*[\(\[\{]\s*[\)\]\}]/g, '');
    title = title.replace(/\s*[-–—|/]+\s*$/, '');
    title = title.replace(/^\s*[-–—|/]+\s*/, '');
    title = title.replace(/\s+/g, ' ').trim();
  }

  // Fallback: if over-cleaned to empty, return rawTitle
  return title || rawTitle.trim();
}

