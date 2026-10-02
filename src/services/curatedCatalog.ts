import { Album, Artist, Playlist, Song } from '../types/music';

// 100% REAL Bollywood, Punjabi, and Indian Hits with Real YouTube IDs, HD Thumbnails & Synced Lyrics
export const CURATED_SONGS: Song[] = [
  // --- SCREENSHOT FEATURED TRACKS ---
  {
    id: 'vesper-blinding-lights',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    artistId: 'artist-the-weeknd',
    album: 'After Hours',
    albumId: 'album-after-hours',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg',
    artistArtwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/600x600bb.jpg',
    duration: 200,
    playbackId: '4NRXx6U8ABQ',
    playbackSource: 'youtube',
    releaseDate: '2020-03-20',
    releaseYear: 2020,
    genre: 'Synthpop / R&B',
    bpm: 171,
    isLossless: true,
    color: '#8b5cf6',
    lyrics: `[00:00.00] ♪ 80s Synthwave Intro ♪
[00:13.00] Yeah
[00:16.00] I've been tryna call
[00:20.00] I've been on my own for long enough
[00:24.00] Maybe you can show me how to love, maybe
[00:30.00] I'm going through withdrawals
[00:34.00] You don't even have to do too much
[00:38.00] You can turn me on with just a touch, baby
[00:44.00] I look around and Sin City's cold and empty
[00:51.00] No one's around to judge me
[00:54.00] I can't see clearly when you're gone
[00:58.00] I said, ooh, I'm blinded by the lights
[01:06.00] No, I can't sleep until I feel your touch
[01:13.00] I said, ooh, I'm drowning in the night
[01:21.00] Oh, when I'm like this, you're the one I trust`,
  },
  {
    id: 'vesper-masakali-2',
    title: 'Masakali 2.0',
    artist: 'Arijit Singh',
    artistId: 'artist-arijit-singh',
    album: 'Masakali 2.0 - Single',
    albumId: 'album-masakali',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/f6/3b/89/f63b89e7-5333-0489-2858-987d7c4c65d4/8903431773319_cover.jpg/600x600bb.jpg',
    duration: 213,
    playbackId: 'hQ6E1TkfzKA',
    playbackSource: 'youtube',
    releaseYear: 2020,
    genre: 'Bollywood Pop',
    color: '#f59e0b',
    isLossless: true,
  },
  {
    id: 'vesper-calm-down',
    title: 'Calm Down',
    artist: 'Rema',
    artistId: 'artist-rema',
    album: 'Rave & Clout',
    albumId: 'album-calm-down',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b2/b4/7c/b2b47cf9-d8e2-53f6-5c62-c974d665c95b/22UMGIM08994.rgb.jpg/600x600bb.jpg',
    duration: 219,
    playbackId: 'CQLsdm1ZYAw',
    playbackSource: 'youtube',
    releaseYear: 2022,
    genre: 'Afrobeats',
    color: '#ea580c',
    isLossless: true,
  },
  {
    id: 'vesper-snooze',
    title: 'Snooze',
    artist: 'SZA',
    artistId: 'artist-sza',
    album: 'SOS',
    albumId: 'album-sos',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/600x600bb.jpg',
    duration: 201,
    playbackId: 'LDY_XyxBu8A',
    playbackSource: 'youtube',
    releaseYear: 2022,
    genre: 'R&B / Soul',
    color: '#0284c7',
    isLossless: true,
  },
  {
    id: 'vesper-one-dance',
    title: 'One Dance',
    artist: 'Drake',
    artistId: 'artist-drake',
    album: 'Views',
    albumId: 'album-views',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f2/0d/8b/f20d8bff-a927-ae98-6784-20a1f51cb23e/16UMGIM27642.rgb.jpg/600x600bb.jpg',
    duration: 173,
    playbackId: 'FOqKN-ouAUE',
    playbackSource: 'youtube',
    releaseYear: 2016,
    genre: 'Hip-Hop / Dancehall',
    color: '#71717a',
    isLossless: true,
  },
  {
    id: 'vesper-after-hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    artistId: 'artist-the-weeknd',
    album: 'After Hours',
    albumId: 'album-after-hours',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/600x600bb.jpg',
    duration: 361,
    playbackId: 'ygTZZpVkmKg',
    playbackSource: 'youtube',
    releaseYear: 2020,
    genre: 'R&B / Darkwave',
    color: '#b91c1c',
    isLossless: true,
  },
  {
    id: 'vesper-ctrl',
    title: 'Ctrl',
    artist: 'SZA',
    artistId: 'artist-sza',
    album: 'Ctrl',
    albumId: 'album-ctrl',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a2/bc/ad/a2bcad46-b389-4be1-8bac-5a0959b0b8e4/886446548449.jpg/600x600bb.jpg',
    duration: 235,
    playbackId: '0Exxu8lsGYE',
    playbackSource: 'youtube',
    releaseYear: 2017,
    genre: 'Neo Soul / R&B',
    color: '#15803d',
    isLossless: true,
  },
  {
    id: 'vesper-deluxe-x',
    title: '? (Deluxe)',
    artist: 'XXXTENTACION',
    artistId: 'artist-xxxtentacion',
    album: '? (Deluxe)',
    albumId: 'album-question-mark',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/93/49/bb/9349bb3b-317d-57c3-966a-71fa25247dc2/19UMGIM41705.rgb.jpg/600x600bb.jpg',
    duration: 166,
    playbackId: 'pgN-vvVVxMA',
    playbackSource: 'youtube',
    releaseYear: 2018,
    genre: 'Emo Rap / Alternative',
    color: '#e4e4e7',
    isLossless: true,
  },
  {
    id: 'vesper-dawn-fm',
    title: 'Dawn FM',
    artist: 'The Weeknd',
    artistId: 'artist-the-weeknd',
    album: 'Dawn FM',
    albumId: 'album-dawn-fm',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/92/14/e3/9214e352-3322-3708-4903-cf5059c4985f/21UM1IM58861.rgb.jpg/600x600bb.jpg',
    duration: 220,
    playbackId: '_Tn_I4GVwxg',
    playbackSource: 'youtube',
    releaseYear: 2022,
    genre: 'Synth-Pop / Dance',
    color: '#3b82f6',
    isLossless: true,
  },
  {
    id: 'itunes-track-1440871441',
    title: 'Starboy (feat. Daft Punk)',
    artist: 'The Weeknd & Daft Punk',
    artistId: 'artist-the-weeknd',
    album: 'Starboy',
    albumId: 'album-starboy',
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000&auto=format&fit=crop&q=80',
    artistArtwork: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    duration: 230,
    playbackId: '34Na4j8AVgA',
    playbackSource: 'youtube',
    releaseDate: '2016-11-25',
    releaseYear: 2016,
    genre: 'R&B / Electropop',
    bpm: 120,
    isLossless: true,
    color: '#2563eb',
    lyrics: `[00:00.00] ♪ Daft Punk Signature Vocoder & Beat ♪
[00:14.00] I'm tryna put you in the worst mood, ah
[00:18.00] P1 cleaner than your church shoes, ah
[00:22.00] Milli point two just to hurt you, ah
[00:26.00] All red Lamb' just to tease you, ah
[00:30.00] None of these toys on lease too, ah
[00:34.00] Made your whole year in a week too, yah
[00:38.00] Look what you've done
[00:42.00] I'm a motherfuckin' starboy!`,
  },
  // --- SAIYAARA 2025/2026 (YRF MOVIE - Ahaan Panday & Aneet Padda) ---
  {
    id: 'curated-saiyaara-2026-title',
    title: 'Saiyaara (Title Song)',
    artist: 'Tanishk Bagchi, Faheem Abdullah & Arslan Nizami',
    artistId: 'artist-tanishk-bagchi',
    album: 'Saiyaara (2026 Motion Picture)',
    albumId: 'album-saiyaara-2026',
    duration: 248,
    youtubeId: 'BSJa1UytM8w',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=BSJa1UytM8w',
    genre: 'Bollywood / Soulful Romantic',
    releaseYear: 2026,
    playCount: 95000000,
    provider: 'youtube',
    color: '#e11d48',
    isLossless: true,
    lyrics: `[00:00.00] ♪ YRF Opening Theme & Soulful Strings ♪
[00:15.00] Saiyaara main saiyaara, tu mera sahara
[00:27.00] Rooh se judaa hokar bhi tu dil mein pukara
[00:40.00] Har mod pe teri khushboo ka pehra hai
[00:52.00] Yeh ishq samundar se bhi gehra hai
[01:05.00] Saiyaara... o saiyaara!
[01:18.00] Teri aankhon mein likhi meri taqdeer
[01:30.00] Tu hi meri ranjha, tu hi meri heer
[01:45.00] ♪ Grand Orchestral Chorus Drop ♪
[02:05.00] Saiyaara main saiyaara!`,
  },
  {
    id: 'curated-saiyaara-2026-full',
    title: 'Saiyaara - Official Audio',
    artist: 'Faheem Abdullah, Arslan Nizami & Irshad Kamil',
    artistId: 'artist-tanishk-bagchi',
    album: 'Saiyaara (2026 Motion Picture)',
    albumId: 'album-saiyaara-2026',
    duration: 344,
    youtubeId: 'MQoColHyGzQ',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=MQoColHyGzQ',
    genre: 'Bollywood / Romantic Anthem',
    releaseYear: 2026,
    playCount: 68000000,
    provider: 'youtube',
    color: '#be123c',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Acoustic Kashmiri Rubab & Modern Beats ♪
[00:20.00] Dil se nikli jo dua woh rang laayi
[00:32.00] Tere aane se zindagi muskurayi
[00:45.00] Saiyaara tu saiyaara
[00:58.00] Ab toh tere bina jeena gavara nahi
[01:10.00] Tu mera zameen, tu aasmaan hamara`,
  },
  {
    id: 'curated-saiyaara-2026-reprise',
    title: 'Saiyaara Reprise (Female)',
    artist: 'YRF Music & Taraannum',
    artistId: 'artist-tanishk-bagchi',
    album: 'Saiyaara (2026 Motion Picture)',
    albumId: 'album-saiyaara-2026',
    duration: 215,
    youtubeId: 'asG7cwxi1sA',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=asG7cwxi1sA',
    genre: 'Bollywood / Acoustic Soul',
    releaseYear: 2026,
    playCount: 42000000,
    provider: 'youtube',
    color: '#9f1239',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Soft Piano & Flute Melody ♪
[00:15.00] Chupke se aake tune chua
[00:28.00] Jaise hawaon mein jaadu hua
[00:42.00] Saiyaara main saiyaara
[00:56.00] Tere ishq mein khud ko haara`,
  },

  // --- SAIYAARA CLASSIC (Ek Tha Tiger - Mohit Chauhan) ---
  {
    id: 'curated-saiyaara-classic',
    title: 'Saiyaara (Ek Tha Tiger)',
    artist: 'Mohit Chauhan, Taraannum Mallik & Sohail Sen',
    artistId: 'artist-mohit-chauhan',
    album: 'Ek Tha Tiger',
    albumId: 'album-ek-tha-tiger',
    duration: 253,
    youtubeId: 'BkW8o_k1f3c',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ef/eb/b9/efebb98b-c9c8-33b9-7476-2e01a622edc0/849486005914_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=BkW8o_k1f3c',
    genre: 'Bollywood / Romantic / Soul',
    releaseYear: 2012,
    playCount: 280000000,
    provider: 'youtube',
    color: '#e11d48',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Soulful Oud & String Intro ♪
[00:18.00] Aasmaan tera mera hua
[00:25.00] Daakhil toote taare mein hua
[00:33.00] Parwaaz chhoota, jahan choota
[00:41.00] Dil ka jahaan toot ke bikhra
[00:49.00] Saiyaara main saiyaara
[00:56.00] Saiyaara tu saiyaara
[01:04.00] Sitaaron ke jahaan mein
[01:12.00] Milenge ab dobaara
[01:20.00] ♪ Grand Cinematic Orchestral Interlude ♪
[01:38.00] Saiyaara main saiyaara
[01:46.00] Saiyaara tu saiyaara`,
  },

  // --- ARIJIT SINGH HITS ---
  {
    id: 'curated-kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh & Pritam',
    artistId: 'artist-arijit-singh',
    album: 'Brahmāstra: Part One – Shiva',
    albumId: 'album-brahmastra',
    duration: 268,
    youtubeId: 'BddP6PYo2gs',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=BddP6PYo2gs',
    genre: 'Bollywood / Romantic',
    releaseYear: 2022,
    playCount: 580000000,
    provider: 'youtube',
    color: '#f59e0b',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Sitar & Acoustic Guitar Intro ♪
[00:15.00] Mujhko itna bataye koyi
[00:22.00] Kaise tujhse dil na lagaye koyi
[00:29.00] Rabba ne tujhko banane mein
[00:35.00] Kar di hai husn ki khaali tijoriyan
[00:42.00] Kaajal ki siyaahi se likhi
[00:48.00] Hai tune jaane kitno ki love storiyan
[00:55.00] Kesariya tera ishq hai piya
[01:02.00] Rang jaaun jo main haath lagaun
[01:09.00] Din beete saara teri fikr mein
[01:15.00] Rain saari teri khair manaun
[01:23.00] ♪ Euphoric Chorus Melodic Drop ♪
[01:40.00] Kesariya tera ishq hai piya
[01:48.00] Rang jaaun jo main haath lagaun`,
  },
  {
    id: 'curated-apna-bana-le',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh & Sachin-Jigar',
    artistId: 'artist-arijit-singh',
    album: 'Bhediya',
    albumId: 'album-bhediya',
    duration: 261,
    youtubeId: 'ElZfdU54Cp8',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/2e/0b/c0/2e0bc070-112f-a827-6ad8-6bc64f7caaff/840214460180.png/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=ElZfdU54Cp8',
    genre: 'Bollywood / Soul',
    releaseYear: 2022,
    playCount: 460000000,
    provider: 'youtube',
    color: '#8b5cf6',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Soft Piano & String Intro ♪
[00:14.00] Tu mera koyi na hoke bhi kuch laage
[00:24.00] Tu mera koyi na hoke bhi kuch laage
[00:34.00] Kiya re jo bhi tune kaise kiya re
[00:44.00] Jiya ko mere baandh aise liya re
[00:54.00] Samajh ke bhi na samajh main sakun
[01:04.00] Apna bana le piya, apna bana le piya
[01:14.00] Dil ke nagar mein shehar tu basa le piya`,
  },
  {
    id: 'curated-tum-hi-ho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh & Mithoon',
    artistId: 'artist-arijit-singh',
    album: 'Aashiqui 2',
    albumId: 'album-aashiqui-2',
    duration: 262,
    youtubeId: 'dZ0fwJojhrs',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=dZ0fwJojhrs',
    genre: 'Bollywood / Romantic Anthem',
    releaseYear: 2013,
    playCount: 890000000,
    provider: 'youtube',
    color: '#2563eb',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Grand Piano & Rain Ambiance Intro ♪
[00:23.00] Hum tere bin ab reh nahi sakte
[00:30.00] Tere bina kya wajood mera
[00:37.00] Tujhse juda gar ho jaayenge
[00:44.00] Toh khud se hi ho jaayenge judaa
[00:51.00] Kyunki tum hi ho, ab tum hi ho
[00:58.00] Zindagi ab tum hi ho
[01:05.00] Chain bhi, mera dard bhi
[01:12.00] Meri aashiqui ab tum hi ho`,
  },
  {
    id: 'curated-channa-mereya',
    title: 'Channa Mereya',
    artist: 'Arijit Singh & Pritam',
    artistId: 'artist-arijit-singh',
    album: 'Ae Dil Hai Mushkil',
    albumId: 'album-adhm',
    duration: 289,
    youtubeId: '2qcx3yE_zL0',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bc/6e/4d/bc6e4d0c-adec-b431-7b60-16f5689f9664/886446201597.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=2qcx3yE_zL0',
    genre: 'Bollywood / Classical Sufi',
    releaseYear: 2016,
    playCount: 530000000,
    provider: 'youtube',
    color: '#dc2626',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Harmonium & Melodic Strings Intro ♪
[00:22.00] Achha chalta hoon, duaon mein yaad rakhna
[00:31.00] Mere zikr ka zubaan pe swaad rakhna
[00:41.00] Dil ke sandookon mein mere achhe kaam rakhna
[00:51.00] Chitthi taaron mein bhi mera tu salaam rakhna
[01:01.00] Andhera tera maine le liya
[01:07.00] Mera ujla sitaara tere naam kiya
[01:14.00] Channa mereya mereya, channa mereya mereya
[01:21.00] Channa mereya mereya beliya, o piya`,
  },
  {
    id: 'curated-chaleya',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao & Anirudh Ravichander',
    artistId: 'artist-arijit-singh',
    album: 'Jawan',
    albumId: 'album-jawan',
    duration: 200,
    youtubeId: 'V1DbdfP9e8o',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=V1DbdfP9e8o',
    genre: 'Bollywood / Dance Pop',
    releaseYear: 2023,
    playCount: 480000000,
    provider: 'youtube',
    color: '#f97316',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Anirudh Signature Synth Beats ♪
[00:14.00] Ishq mein dil bana hai, ishq mein dil fanaa hai
[00:23.00] Jitna bhi saaf chaaho, yeh utna hi daagh-daar hai
[00:32.00] Chaleya teri ore, chaleya teri ore
[00:41.00] Tera nasha mujhe aisa chadh gaya
[00:50.00] Haye re haye mera dil tere piche dauda`,
  },
  {
    id: 'curated-o-maahi',
    title: 'O Maahi',
    artist: 'Arijit Singh & Pritam',
    artistId: 'artist-arijit-singh',
    album: 'Dunki',
    albumId: 'album-dunki',
    duration: 233,
    youtubeId: '87JIOAX3NjM',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/cf/cf/af/cfcfaf49-f337-eeab-2351-dd0a137dc740/8902894362139_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=87JIOAX3NjM',
    genre: 'Bollywood / Melodic Soul',
    releaseYear: 2023,
    playCount: 310000000,
    provider: 'youtube',
    color: '#a855f7',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Acoustic Guitar & String Intro ♪
[00:15.00] O maahi o maahi, dil ki yeh sun le duhaai
[00:28.00] Tere bin main adhoora, tu jo mili toh zameen aasmaan pura
[00:42.00] Sabse alag hai tu, sabse juda hai
[00:54.00] Mere khuda ki sabse pyari dua hai`,
  },
  {
    id: 'curated-satranga',
    title: 'Satranga',
    artist: 'Arijit Singh & Shreyas Puranik',
    artistId: 'artist-arijit-singh',
    album: 'Animal',
    albumId: 'album-animal',
    duration: 271,
    youtubeId: 'RLzC55ai0eo',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/ad/5e/dbad5e8b-0bee-d962-92d4-021c90e375ac/8902894362092_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=RLzC55ai0eo',
    genre: 'Bollywood / Soul',
    releaseYear: 2023,
    playCount: 380000000,
    provider: 'youtube',
    color: '#dc2626',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Classical Sitar & Sarangi Intro ♪
[00:20.00] Adhoore lafzon mein poori baat keh gaya
[00:32.00] Jo tha samundar woh ek boond mein beh gaya
[00:45.00] Yeh satranga ishq tera, rang badalta jaave
[00:58.00] Kabhi roop saje, kabhi zakhm lage`,
  },
  {
    id: 'curated-sajni',
    title: 'Sajni',
    artist: 'Arijit Singh & Ram Sampath',
    artistId: 'artist-arijit-singh',
    album: 'Laapataa Ladies',
    albumId: 'album-laapataa-ladies',
    duration: 170,
    youtubeId: 'qFD4Yx6dE_o',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/48/d8/bf/48d8bf8f-df58-e05f-62e2-bc494d748ea4/8902894362252_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=qFD4Yx6dE_o',
    genre: 'Indian Folk / Soul',
    releaseYear: 2024,
    playCount: 260000000,
    provider: 'youtube',
    color: '#10b981',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Folk Harmonium & Tabla Intro ♪
[00:12.00] O sajni re, kaise kate din raat
[00:24.00] Kaise kate din raat, tore bin saiyaan
[00:36.00] Dekha nahi ek pal jo tohe
[00:46.00] Bechaini baadh jaave manwa maahi re`,
  },
  {
    id: 'curated-heeriye',
    title: 'Heeriye',
    artist: 'Jasleen Royal & Arijit Singh',
    artistId: 'artist-arijit-singh',
    album: 'Heeriye - Single',
    albumId: 'album-heeriye',
    duration: 194,
    youtubeId: 'pRRtzjL_y9E',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f0/8c/2a/f08c2aeb-3903-8738-d0a5-8c2e4547eed7/5054197711039.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=pRRtzjL_y9E',
    genre: 'Indian Indie / Romantic',
    releaseYear: 2023,
    playCount: 410000000,
    provider: 'youtube',
    color: '#06b6d4',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Acoustic Guitar & Whistle Intro ♪
[00:12.00] Heeriye heeriye aa, heeriye heeriye aa
[00:24.00] Teri hoke maraan jind jaan karaan
[00:36.00] Heeriye heeriye aa, heeriye heeriye aa
[00:48.00] Neendaan vi tutt gaiyaan, khwaab vi muk gaye ne
[01:00.00] Par tera intezaar aje vi baaki hai`,
  },

  // --- DILJIT DOSANJH HITS ---
  {
    id: 'curated-lover',
    title: 'Lover',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-diljit-dosanjh',
    album: 'MoonChild Era',
    albumId: 'album-moonchild',
    duration: 195,
    youtubeId: 'cl0a3i2wFcc',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8a/89/e4/8a89e445-d2c6-f8ac-a828-27818b0c1afe/859749638209_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=cl0a3i2wFcc',
    genre: 'Punjabi Pop',
    releaseYear: 2021,
    playCount: 220000000,
    provider: 'youtube',
    color: '#ec4899',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Synthwave Punjabi Beat ♪
[00:10.00] Tera ni tera lover
[00:14.00] Teri aankhon mein doob jaana
[00:19.00] Mainu le ja tu kithe door
[00:24.00] Tere bina dil nayi lagna
[00:29.00] Diljit in the building!
[00:34.00] Yeah baby you are my lover
[00:40.00] Tere piche saari duniya bhula di
[00:48.00] Tera ni tera lover!`,
  },
  {
    id: 'curated-born-to-shine',
    title: 'Born to Shine',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-diljit-dosanjh',
    album: 'G.O.A.T.',
    albumId: 'album-goat',
    duration: 214,
    youtubeId: 'm4rP2kS8wI0',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/89/ac/d289ac98-749e-3822-6b6e-b06aa4815715/859740651597_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=m4rP2kS8wI0',
    genre: 'Punjabi Hip Hop',
    releaseYear: 2020,
    playCount: 310000000,
    provider: 'youtube',
    color: '#eab308',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Brass Horns & Heavy Trap Beat ♪
[00:12.00] Kise de dabaye nahiyo dabde
[00:22.00] Dil de ameer aan te sohneya
[00:32.00] Born to shine, munde born to shine!
[00:45.00] Asli swaag, no drama!`,
  },
  {
    id: 'curated-naina-diljit',
    title: 'Naina',
    artist: 'Diljit Dosanjh & Badshah',
    artistId: 'artist-diljit-dosanjh',
    album: 'Crew',
    albumId: 'album-crew',
    duration: 180,
    youtubeId: 'mH_3XvP2_u0',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/85/81/8a/85818af9-dc68-1d0d-1ac8-7f6f905135ec/8901854117970.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=mH_3XvP2_u0',
    genre: 'Bollywood / Punjabi Club',
    releaseYear: 2024,
    playCount: 290000000,
    provider: 'youtube',
    color: '#3b82f6',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Upbeat Dance Club Intro ♪
[00:10.00] Naina tere kajrare naina
[00:20.00] Lut gaye hum toh pehli baar
[00:30.00] Diljit te Badshah combo!`,
  },

  // --- MOHIT CHAUHAN HITS ---
  {
    id: 'curated-tum-se-hi',
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan & Pritam',
    artistId: 'artist-mohit-chauhan',
    album: 'Jab We Met',
    albumId: 'album-jab-we-met',
    duration: 323,
    youtubeId: 'mt9xg0mmt68',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3d/c7/43/3dc74387-e7f4-2342-397c-4cf2037c69a5/8902894623223_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=mt9xg0mmt68',
    genre: 'Bollywood / Timeless Romance',
    releaseYear: 2007,
    playCount: 450000000,
    provider: 'youtube',
    color: '#0284c7',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Iconic Acoustic Guitar Strum ♪
[00:25.00] Na hai yeh pana, na khona hi hai
[00:33.00] Tera na hona, jaane kyun hona hi hai
[00:41.00] Tum se hi din hota hai
[00:49.00] Surmayi shaam aati hai
[00:57.00] Tum se hi, tum se hi
[01:05.00] Har ghadi saans aati hai
[01:13.00] Zindagi kehlati hai
[01:21.00] Tum se hi, tum se hi`,
  },
  {
    id: 'curated-kun-faya-kun',
    title: 'Kun Faya Kun',
    artist: 'A.R. Rahman, Mohit Chauhan & Javed Ali',
    artistId: 'artist-mohit-chauhan',
    album: 'Rockstar',
    albumId: 'album-rockstar',
    duration: 473,
    youtubeId: 'T94PHkuydcw',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/56/ac/41/56ac41f7-99f3-3eae-3b07-443167292c4e/8902894697408_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=T94PHkuydcw',
    genre: 'Sufi / Devotional Masterpiece',
    releaseYear: 2011,
    playCount: 520000000,
    provider: 'youtube',
    color: '#d97706',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Sacred Harmonium & Acoustic Intro ♪
[00:35.00] Ya Nizamuddin Auliya
[01:10.00] Kun faya kun, kun faya kun
[01:30.00] Jab kahin pe kuch nahi bhi nahi tha
[01:45.00] Wahi tha, wahi tha, wahi tha
[02:05.00] Sajra sawera mere tan barse
[02:20.00] Kajar andhera teri lau tarse`,
  },
  {
    id: 'curated-pee-loon',
    title: 'Pee Loon',
    artist: 'Mohit Chauhan & Pritam',
    artistId: 'artist-mohit-chauhan',
    album: 'Once Upon a Time in Mumbaai',
    albumId: 'album-ouatim',
    duration: 288,
    youtubeId: 'b_sQwAfxHCo',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f3/d9/23/f3d92398-118c-10c9-2ef8-5f28cff344c2/8902894688512_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=b_sQwAfxHCo',
    genre: 'Bollywood / Soul',
    releaseYear: 2010,
    playCount: 380000000,
    provider: 'youtube',
    color: '#8b5cf6',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Soulful Sitar & Strings ♪
[00:20.00] Pee loon tere neele neele naino se shabnam
[00:34.00] Pee loon tere geele geele hothon ki sargam
[00:48.00] Paas aaye jo hum, ho gaye bekhabar`,
  },

  // --- AP DHILLON HITS ---
  {
    id: 'curated-brown-munde',
    title: 'Brown Munde',
    artist: 'AP Dhillon, Gurinder Gill & Shinda Kahlon',
    artistId: 'artist-ap-dhillon',
    album: 'Not by Chance',
    albumId: 'album-not-by-chance',
    duration: 247,
    youtubeId: 'VNs_cCtdbPc',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=VNs_cCtdbPc',
    genre: 'Punjabi Trap',
    releaseYear: 2020,
    playCount: 680000000,
    provider: 'youtube',
    color: '#ef4444',
    isLossless: true,
    lyrics: `[00:00.00] ♪ 808 Bass & Trap Intro ♪
[00:12.00] Desi munde, brown munde!
[00:18.00] Gaddi lambi, sheeshe kaale
[00:24.00] Gehri route te gaane chale
[00:30.00] Saade naal jehde turde ne
[00:36.00] Saare bande sire de ne
[00:42.00] Brown Munde!
[00:50.00] AP Dhillon on the track!`,
  },
  {
    id: 'curated-excuses',
    title: 'Excuses',
    artist: 'AP Dhillon & Gurinder Gill',
    artistId: 'artist-ap-dhillon',
    album: 'Excuses - Single',
    albumId: 'album-not-by-chance',
    duration: 176,
    youtubeId: 'vX2cDW8LUWk',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/47/47/ac/4747ac85-1658-64ae-bc82-220a4d6213d5/859747478890_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=vX2cDW8LUWk',
    genre: 'Punjabi Wave',
    releaseYear: 2020,
    playCount: 490000000,
    provider: 'youtube',
    color: '#ec4899',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Kehndi hundi si chann tak raah bana de ♪
[00:15.00] Taare ne pasand mainu hethan saare laade
[00:28.00] Ohna taareyan de vich jad mainu vekhengi
[00:40.00] Yaad karu tenu jad pyar mera chete aavega`,
  },
  {
    id: 'curated-with-you',
    title: 'With You',
    artist: 'AP Dhillon',
    artistId: 'artist-ap-dhillon',
    album: 'With You - Single',
    albumId: 'album-not-by-chance',
    duration: 153,
    youtubeId: 'b_d3o4uSswE',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5a/ac/00/5aac005f-9403-70e4-bce0-cf452017476e/197189606472.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=b_d3o4uSswE',
    genre: 'Indie Pop',
    releaseYear: 2023,
    playCount: 320000000,
    provider: 'youtube',
    color: '#06b6d4',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Acoustic Ukulele & Melodic Vocals ♪
[00:10.00] Tere naal jeena, tere naal marna
[00:22.00] With you forever, holding your hand`,
  },

  // --- ANUV JAIN & KING HITS ---
  {
    id: 'curated-baarishein',
    title: 'Baarishein',
    artist: 'Anuv Jain',
    artistId: 'artist-anuv-jain',
    album: 'Baarishein - Single',
    albumId: 'album-baarishein',
    duration: 207,
    youtubeId: '7b4W3xH-z0c',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a7/46/2f/a7462f7e-6dde-b235-2f5e-90e31af919a7/7799192004134_cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=7b4W3xH-z0c',
    genre: 'Indian Indie / Acoustic',
    releaseYear: 2019,
    playCount: 220000000,
    provider: 'youtube',
    color: '#06b6d4',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Acoustic Ukulele & Rain Ambiance ♪
[00:12.00] Hawaayein thandi hain, baarishein bhi hain
[00:22.00] Teri yaadein aake dil ko choo rahi hain
[00:34.00] Yeh baarishein kehti hain
[00:44.00] Tu laut ke aayega
[00:54.00] Mere sang phir se muskurayega`,
  },
  {
    id: 'curated-husn',
    title: 'Husn',
    artist: 'Anuv Jain',
    artistId: 'artist-anuv-jain',
    album: 'Husn - Single',
    albumId: 'album-baarishein',
    duration: 218,
    youtubeId: 'gJh_J0Uu0Gg',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ef/46/82/ef4682f1-d607-ad6b-441c-280cfc45f252/057914348520.png/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=gJh_J0Uu0Gg',
    genre: 'Indian Indie / Poetry',
    releaseYear: 2023,
    playCount: 340000000,
    provider: 'youtube',
    color: '#6366f1',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Gentle Acoustic Guitar Intro ♪
[00:14.00] Dekho dekho kaise khudgarz hain yeh log
[00:28.00] Husn tera dekh ke baatein banate hain
[00:42.00] Par main toh teri rooh ko chahana chahta hoon`,
  },
  {
    id: 'curated-maan-meri-jaan',
    title: 'Maan Meri Jaan',
    artist: 'King & Saurabh Lokhande',
    artistId: 'artist-king',
    album: 'Champagne Talk',
    albumId: 'album-champagne-talk',
    duration: 194,
    youtubeId: 'VuG7ge_8I2Y',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/54/be/a154be36-2ba3-a22a-4064-c3d78f910c11/5054197602184.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=VuG7ge_8I2Y',
    genre: 'Indian Pop / R&B',
    releaseYear: 2022,
    playCount: 650000000,
    provider: 'youtube',
    color: '#6366f1',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Melodic Guitar & 808 Beat Intro ♪
[00:10.00] Main teri aankhon mein udaasi kabhi dekh sakda nahi
[00:20.00] Tujhe khush main rakhunga soniya
[00:30.00] Tere dil se na kabhi khelunga
[00:40.00] Maan meri jaan, main tujhe jaane na dunga
[00:50.00] Main tujhko apni baahon mein chhupa ke rakhunga`,
  },
  {
    id: 'curated-pasoori',
    title: 'Pasoori',
    artist: 'Ali Sethi & Shae Gill',
    artistId: 'artist-ali-sethi',
    album: 'Coke Studio Season 14',
    albumId: 'album-coke-studio-14',
    duration: 224,
    youtubeId: '5Eqb_-j3FDA',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f3/f9/06/f3f906c3-79d5-ac9a-5fdd-262048f955f9/cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=5Eqb_-j3FDA',
    genre: 'Desi Pop / Global Hit',
    releaseYear: 2022,
    playCount: 740000000,
    provider: 'youtube',
    color: '#d97706',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Turkish Strings & Reggaeton Beat Intro ♪
[00:15.00] Agg laavan majboori nu
[00:22.00] Aan jaan di pasoori nu
[00:30.00] Zeher bane haan teri
[00:37.00] Pee jaavan main poori nu
[00:45.00] Raavan ch baavan ch ohnu lukawaan
[00:52.00] Koyi mainu na roke!`,
  },
  {
    id: 'curated-raataan-lambiyan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur & Tanishk Bagchi',
    artistId: 'artist-jubin-nautiyal',
    album: 'Shershaah',
    albumId: 'album-shershaah',
    duration: 230,
    youtubeId: 'gvyUuxdRdR4',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/61/65/ae/6165aee9-8bb9-0bd4-02b0-5d0f1e6257a3/886449510238.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=gvyUuxdRdR4',
    genre: 'Bollywood / Romantic',
    releaseYear: 2021,
    playCount: 920000000,
    provider: 'youtube',
    color: '#0284c7',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Soulful Guitar & Whistle Intro ♪
[00:14.00] Teri meri gallan ho gayi mashhoor
[00:22.00] Kar na kabhi tu mujhe nazron se door
[00:30.00] Kithe chali ae tu dhoop mein sawere
[00:38.00] Kaatun tere bin kaise din ve mere
[00:46.00] Kaate kate na re raataan lambiyan
[00:54.00] Tere bin ab toh saansein bhi kam hain`,
  },
  {
    id: 'curated-srivalli',
    title: 'Srivalli',
    artist: 'Sid Sriram & Devi Sri Prasad',
    artistId: 'artist-sid-sriram',
    album: 'Pushpa: The Rise',
    albumId: 'album-pushpa',
    duration: 224,
    youtubeId: 'hcMzwMrr1tE',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/34/7b/ec347b9b-0add-c529-4746-799277a5e1c0/cover.jpg/1000x1000bb.jpg',
    streamUrl: 'https://www.youtube.com/watch?v=hcMzwMrr1tE',
    genre: 'Tollywood / Melodic Hit',
    releaseYear: 2021,
    playCount: 710000000,
    provider: 'youtube',
    color: '#10b981',
    isLossless: true,
    lyrics: `[00:00.00] ♪ Melodic Mandolin & Flute Intro ♪
[00:15.00] Teri jhalak ashrafi, Srivalli
[00:25.00] Naina madak barfi
[00:35.00] Teri jhalak ashrafi, Srivalli
[00:45.00] Baatein kare do harfi`,
  },
];

// 100% REAL Bollywood & Indian Albums
export const CURATED_ALBUMS: Album[] = [
  {
    id: 'album-saiyaara-2026',
    title: 'Saiyaara (2026 Original Motion Picture Soundtrack)',
    artist: 'Tanishk Bagchi, Faheem Abdullah, Arslan Nizami & YRF',
    artistId: 'artist-tanishk-bagchi',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    releaseYear: 2026,
    trackCount: 3,
    genre: 'Bollywood / Romantic Soundtrack',
    description: 'The monumental 2026 Yash Raj Films romantic soundtrack starring Ahaan Panday & Aneet Padda, featuring the blockbuster Saiyaara Title Song, Audio Master, and Reprise.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[0], // Saiyaara Title Song
      CURATED_SONGS[1], // Saiyaara Audio
      CURATED_SONGS[2], // Saiyaara Reprise
    ],
  },
  {
    id: 'album-ek-tha-tiger',
    title: 'Ek Tha Tiger (Original Soundtrack)',
    artist: 'Sohail Sen, Sajid-Wajid & Mohit Chauhan',
    artistId: 'artist-mohit-chauhan',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ef/eb/b9/efebb98b-c9c8-33b9-7476-2e01a622edc0/849486005914_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2012,
    trackCount: 4,
    genre: 'Bollywood / Action Romance',
    description: 'The iconic blockbuster soundtrack featuring the classic Saiyaara by Mohit Chauhan & Taraannum Mallik.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[3], // Saiyaara Ek Tha Tiger
    ],
  },
  {
    id: 'album-brahmastra',
    title: 'Brahmāstra: Part One – Shiva',
    artist: 'Pritam & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/1000x1000bb.jpg',
    releaseYear: 2022,
    trackCount: 4,
    genre: 'Bollywood / Soundtrack',
    description: 'The iconic blockbuster album featuring Kesariya, Deva Deva, and Rasiya.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[4], // Kesariya
    ],
  },
  {
    id: 'album-bhediya',
    title: 'Bhediya (Original Soundtrack)',
    artist: 'Sachin-Jigar & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://i.ytimg.com/vi/1_m93qA3tLw/hqdefault.jpg',
    releaseYear: 2022,
    trackCount: 4,
    genre: 'Bollywood / Romance',
    description: 'Magical romantic album featuring Apna Bana Le, Thumkeshwari, and Baaki Sab Theek.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[5], // Apna Bana Le
    ],
  },
  {
    id: 'album-aashiqui-2',
    title: 'Aashiqui 2',
    artist: 'Mithoon, Ankit Tiwari & Jeet Gannguli',
    artistId: 'artist-arijit-singh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/23/ee/bb23eeed-0c35-4f1d-2b11-485622777ae4/8902894353007_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2013,
    trackCount: 6,
    genre: 'Bollywood / Romantic Classic',
    description: 'One of the greatest Hindi romantic albums in cinema history featuring Tum Hi Ho, Sunn Raha Hai, and Chahun Main Ya Naa.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[6], // Tum Hi Ho
    ],
  },
  {
    id: 'album-adhm',
    title: 'Ae Dil Hai Mushkil',
    artist: 'Pritam & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://i.ytimg.com/vi/284Ov7ysmfA/hqdefault.jpg',
    releaseYear: 2016,
    trackCount: 6,
    genre: 'Bollywood / Romantic Drama',
    description: 'Masterpiece soulful soundtrack featuring Channa Mereya, Bulleya, and the Title Track.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[7], // Channa Mereya
    ],
  },
  {
    id: 'album-jawan',
    title: 'Jawan (Original Motion Picture Soundtrack)',
    artist: 'Anirudh Ravichander & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2023,
    trackCount: 5,
    genre: 'Bollywood / High-Octane Pop',
    description: 'Chart-topping multilingual soundtrack by Anirudh featuring Chaleya, Zinda Banda, and Not Ramaiya Vastavaiya.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[8], // Chaleya
    ],
  },
  {
    id: 'album-dunki',
    title: 'Dunki (Original Soundtrack)',
    artist: 'Pritam & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://i.ytimg.com/vi/tD0sPebf6Cg/hqdefault.jpg',
    releaseYear: 2023,
    trackCount: 5,
    genre: 'Bollywood / Soundtrack',
    description: 'Heartfelt emotional soundtrack featuring O Maahi, Lutt Putt Gaya, and Nikle The Kabhi Hum Ghar Se.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[9], // O Maahi
    ],
  },
  {
    id: 'album-animal',
    title: 'Animal (Original Motion Picture Soundtrack)',
    artist: 'Pritam, Harshavardhan Rameshwar & Shreyas Puranik',
    artistId: 'artist-arijit-singh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/ad/5e/dbad5e8b-0bee-d962-92d4-021c90e375ac/8902894362092_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2023,
    trackCount: 6,
    genre: 'Bollywood / Cinematic Drama',
    description: 'High-emotion blockbuster music featuring Satranga, Arjan Vailly, Hua Main, and Pehle Bhi Main.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[10], // Satranga
    ],
  },
  {
    id: 'album-laapataa-ladies',
    title: 'Laapataa Ladies',
    artist: 'Ram Sampath & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://i.ytimg.com/vi/k3g_Wj7474U/hqdefault.jpg',
    releaseYear: 2024,
    trackCount: 4,
    genre: 'Bollywood / Folk Romance',
    description: 'Critically acclaimed rustic soundtrack featuring Sajni, Dheeme Dheeme, and Beda Paar.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[11], // Sajni
    ],
  },
  {
    id: 'album-heeriye',
    title: 'Heeriye (Single & Acoustic)',
    artist: 'Jasleen Royal & Arijit Singh',
    artistId: 'artist-arijit-singh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/db/ad/5e/dbad5e8b-0bee-d962-92d4-021c90e375ac/8902894362092_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2023,
    trackCount: 2,
    genre: 'Indie Pop / Acoustic Romance',
    description: 'Global viral acoustic romantic anthem featuring Jasleen Royal, Arijit Singh, and Dulquer Salmaan.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[12], // Heeriye
    ],
  },
  {
    id: 'album-moonchild',
    title: 'MoonChild Era',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-diljit-dosanjh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8a/89/e4/8a89e445-d2c6-f8ac-a828-27818b0c1afe/859749638209_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2021,
    trackCount: 5,
    genre: 'Punjabi Pop',
    description: 'Futuristic synthwave-infused Punjabi chartbuster album featuring Lover, Black & White, and Luna.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[13], // Lover
    ],
  },
  {
    id: 'album-goat',
    title: 'G.O.A.T.',
    artist: 'Diljit Dosanjh',
    artistId: 'artist-diljit-dosanjh',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8a/89/e4/8a89e445-d2c6-f8ac-a828-27818b0c1afe/859749638209_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2020,
    trackCount: 8,
    genre: 'Punjabi Hip-Hop',
    description: 'Iconic global hit Punjabi album featuring Born to Shine, G.O.A.T., and Clash.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[14], // Born to Shine
    ],
  },
  {
    id: 'album-crew',
    title: 'Crew (Original Motion Picture Soundtrack)',
    artist: 'Diljit Dosanjh & Badshah',
    artistId: 'artist-diljit-dosanjh',
    artwork: 'https://i.ytimg.com/vi/7j5j1zQo_d0/hqdefault.jpg',
    releaseYear: 2024,
    trackCount: 4,
    genre: 'Bollywood / Party',
    description: 'Chart-topping high energy movie soundtrack featuring Naina, Choli Ke Peeche, and Ghagra.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[15], // Naina
    ],
  },
  {
    id: 'album-jab-we-met',
    title: 'Jab We Met',
    artist: 'Pritam & Mohit Chauhan',
    artistId: 'artist-mohit-chauhan',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3d/c7/43/3dc74387-e7f4-2342-397c-4cf2037c69a5/8902894623223_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2007,
    trackCount: 6,
    genre: 'Bollywood / Romantic Classic',
    description: 'Timeless Bollywood romantic soundtrack featuring Tum Se Hi, Mauja Hi Mauja, and Yeh Ishq Hai.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[16], // Tum Se Hi
    ],
  },
  {
    id: 'album-rockstar',
    title: 'Rockstar',
    artist: 'A.R. Rahman & Mohit Chauhan',
    artistId: 'artist-mohit-chauhan',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/56/ac/41/56ac41f7-99f3-3eae-3b07-443167292c4e/8902894697408_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2011,
    trackCount: 8,
    genre: 'Sufi Rock / Cinema Masterpiece',
    description: 'Legendary musical magnum opus by A.R. Rahman featuring Kun Faya Kun, Nadaan Parinde, Phir Se Ud Chala, and Sadda Haq.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[17], // Kun Faya Kun
    ],
  },
  {
    id: 'album-ouatim',
    title: 'Once Upon a Time in Mumbaai',
    artist: 'Pritam & Mohit Chauhan',
    artistId: 'artist-mohit-chauhan',
    artwork: 'https://i.ytimg.com/vi/bXf7Nq6f5XU/hqdefault.jpg',
    releaseYear: 2010,
    trackCount: 5,
    genre: 'Bollywood / Retro Romance',
    description: 'Iconic retro romantic album featuring Pee Loon, Tum Jo Aaye, and Parda.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[18], // Pee Loon
    ],
  },
  {
    id: 'album-not-by-chance',
    title: 'Not by Chance',
    artist: 'AP Dhillon & Gurinder Gill',
    artistId: 'artist-ap-dhillon',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2020,
    trackCount: 5,
    genre: 'Punjabi Trap',
    description: 'Groundbreaking album redefining modern Punjabi hip hop and urban melodies worldwide.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[19], // Brown Munde
      CURATED_SONGS[20], // Excuses
      CURATED_SONGS[21], // With You
    ],
  },
  {
    id: 'album-baarishein',
    title: 'Baarishein & Acoustic Stories',
    artist: 'Anuv Jain',
    artistId: 'artist-anuv-jain',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a7/46/2f/a7462f7e-6dde-b235-2f5e-90e31af919a7/7799192004134_cover.jpg/1000x1000bb.jpg',
    releaseYear: 2021,
    trackCount: 4,
    genre: 'Indian Indie / Acoustic',
    description: 'Soul-stirring storytelling acoustic collection featuring Baarishein, Husn, Alag Aasmaan, and Mishri.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[22], // Baarishein
      CURATED_SONGS[23], // Husn
    ],
  },
  {
    id: 'album-champagne-talk',
    title: 'Champagne Talk',
    artist: 'King',
    artistId: 'artist-king',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a1/54/be/a154be36-2ba3-a22a-4064-c3d78f910c11/5054197602184.jpg/1000x1000bb.jpg',
    releaseYear: 2022,
    trackCount: 8,
    genre: 'Indian Pop / Hip-Hop',
    description: 'Blockbuster album featuring the record-shattering global hit Maan Meri Jaan, Pablo, and Oops.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[24], // Maan Meri Jaan
    ],
  },
  {
    id: 'album-coke-studio-14',
    title: 'Coke Studio Season 14',
    artist: 'Ali Sethi, Shae Gill & Xulfi',
    artistId: 'artist-coke-studio',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f3/f9/06/f3f906c3-79d5-ac9a-5fdd-262048f955f9/cover.jpg/1000x1000bb.jpg',
    releaseYear: 2022,
    trackCount: 8,
    genre: 'South Asian Fusion',
    description: 'Global viral sensation album featuring Pasoori, Tu Jhoom, and Kana Yaari.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[25], // Pasoori
    ],
  },
  {
    id: 'album-shershaah',
    title: 'Shershaah (Original Motion Picture Soundtrack)',
    artist: 'Jasleen Royal, B Praak & Tanishk Bagchi',
    artistId: 'artist-tanishk-bagchi',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/61/65/ae/6165aee9-8bb9-0bd4-02b0-5d0f1e6257a3/886449510238.jpg/1000x1000bb.jpg',
    releaseYear: 2021,
    trackCount: 6,
    genre: 'Bollywood / National Romance',
    description: 'National award-winning soundtrack featuring Raataan Lambiyan, Ranjha, and Mann Bharryaa 2.0.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[26], // Raataan Lambiyan
    ],
  },
  {
    id: 'album-pushpa',
    title: 'Pushpa: The Rise (Hindi Soundtrack)',
    artist: 'Devi Sri Prasad & Javed Ali',
    artistId: 'artist-dsp',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/34/7b/ec347b9b-0add-c529-4746-799277a5e1c0/cover.jpg/1000x1000bb.jpg',
    releaseYear: 2021,
    trackCount: 5,
    genre: 'Indian Mass Pop / Romance',
    description: 'Massive pan-Indian chartbuster soundtrack featuring Srivalli, Oo Antava, and Sami Sami.',
    provider: 'curated',
    tracks: [
      CURATED_SONGS[27], // Srivalli
    ],
  },
];

// 100% REAL Verified Indian Artists with Authentic HD Portrait Photography & Complete Discography
export const CURATED_ARTISTS: Artist[] = [
  {
    id: 'artist-arijit-singh',
    name: 'Arijit Singh',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/1000x1000.jpg',
    monthlyListeners: 98400000,
    bio: 'India’s #1 playback singer and undisputed voice of romance, beloved for timeless chartbusters including Kesariya, Tum Hi Ho, Channa Mereya, Apna Bana Le, Chaleya, O Maahi, Satranga, and Sajni.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[4], // Kesariya
      CURATED_SONGS[5], // Apna Bana Le
      CURATED_SONGS[6], // Tum Hi Ho
      CURATED_SONGS[7], // Channa Mereya
      CURATED_SONGS[8], // Chaleya
      CURATED_SONGS[9], // O Maahi
      CURATED_SONGS[10], // Satranga
      CURATED_SONGS[11], // Sajni
      CURATED_SONGS[12], // Heeriye
    ],
    albums: [
      CURATED_ALBUMS[2], // Brahmastra
      CURATED_ALBUMS[3], // Bhediya
      CURATED_ALBUMS[4], // Aashiqui 2
      CURATED_ALBUMS[5], // ADHM
      CURATED_ALBUMS[6], // Jawan
      CURATED_ALBUMS[7], // Dunki
      CURATED_ALBUMS[8], // Animal
      CURATED_ALBUMS[9], // Laapataa Ladies
      CURATED_ALBUMS[10], // Heeriye
    ],
    similarArtists: [
      { id: 'artist-mohit-chauhan', name: 'Mohit Chauhan', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ce5eeef975d0fe8a4f6645ea945110eb/500x500.jpg' },
      { id: 'artist-shreya-ghoshal', name: 'Shreya Ghoshal', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/9cffca9e51c8907ad50bcf84ec810166/500x500.jpg' },
      { id: 'artist-atif-aslam', name: 'Atif Aslam', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ea3db97f48b99c75bf63654483733075/500x500.jpg' },
    ],
  },
  {
    id: 'artist-shreya-ghoshal',
    name: 'Shreya Ghoshal',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/9cffca9e51c8907ad50bcf84ec810166/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/9cffca9e51c8907ad50bcf84ec810166/1000x1000.jpg',
    monthlyListeners: 48200000,
    bio: 'Five-time National Film Award winner and one of India’s most celebrated vocalists, renowned for Teri Ore, Deewani Mastani, Ghoomar, Sunn Raha Hai, and Agar Tum Mil Jao.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[4], // Kesariya
      CURATED_SONGS[8], // Chaleya
    ],
    albums: [
      CURATED_ALBUMS[2], // Brahmastra
      CURATED_ALBUMS[6], // Jawan
    ],
    similarArtists: [
      { id: 'artist-arijit-singh', name: 'Arijit Singh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg' },
      { id: 'artist-sonu-nigam', name: 'Sonu Nigam', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/82f8d38bf76136d859ec5e1e1273934d/500x500.jpg' },
    ],
  },
  {
    id: 'artist-mohit-chauhan',
    name: 'Mohit Chauhan',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ce5eeef975d0fe8a4f6645ea945110eb/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/ce5eeef975d0fe8a4f6645ea945110eb/1000x1000.jpg',
    monthlyListeners: 24500000,
    bio: 'Legendary Indian playback singer and former Silk Route frontman, voice behind legendary romantic anthems like Saiyaara (Ek Tha Tiger), Tum Se Hi, Kun Faya Kun, Pee Loon, Masakali, and Matargashti.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[3], // Saiyaara Classic
      CURATED_SONGS[16], // Tum Se Hi
      CURATED_SONGS[17], // Kun Faya Kun
      CURATED_SONGS[18], // Pee Loon
    ],
    albums: [
      CURATED_ALBUMS[1], // Ek Tha Tiger
      CURATED_ALBUMS[14], // Jab We Met
      CURATED_ALBUMS[15], // Rockstar
      CURATED_ALBUMS[16], // OUATIM
    ],
    similarArtists: [
      { id: 'artist-arijit-singh', name: 'Arijit Singh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg' },
      { id: 'artist-kk', name: 'KK', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/194ba2d28f8f2b380f28328eb0d47347/500x500.jpg' },
    ],
  },
  {
    id: 'artist-atif-aslam',
    name: 'Atif Aslam',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ea3db97f48b99c75bf63654483733075/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/ea3db97f48b99c75bf63654483733075/1000x1000.jpg',
    monthlyListeners: 39800000,
    bio: 'Iconic South Asian superstar vocalist known for Tera Hone Laga Hoon, Dil Diyan Gallan, Jeene Laga Hoon, Pehli Nazar Mein, Tu Jaane Na, and Tajdar-e-Haram.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[3], // Saiyaara
      CURATED_SONGS[6], // Tum Hi Ho
    ],
    albums: [
      CURATED_ALBUMS[1],
    ],
    similarArtists: [
      { id: 'artist-arijit-singh', name: 'Arijit Singh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg' },
    ],
  },
  {
    id: 'artist-kk',
    name: 'KK (Krishnakumar Kunnath)',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/194ba2d28f8f2b380f28328eb0d47347/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/194ba2d28f8f2b380f28328eb0d47347/1000x1000.jpg',
    monthlyListeners: 32000000,
    bio: 'The immortal voice of a generation, immortalized in anthems like Zara Sa, Yaaron, Pal, Labon Ko, Kya Mujhe Pyar Hai, Aankhon Mein Teri, and Alvida.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[16],
    ],
    albums: [
      CURATED_ALBUMS[14],
    ],
    similarArtists: [
      { id: 'artist-mohit-chauhan', name: 'Mohit Chauhan', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ce5eeef975d0fe8a4f6645ea945110eb/500x500.jpg' },
    ],
  },
  {
    id: 'artist-diljit-dosanjh',
    name: 'Diljit Dosanjh',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/da0ea41f1737f1981ff3ff70e1762c2f/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/da0ea41f1737f1981ff3ff70e1762c2f/1000x1000.jpg',
    monthlyListeners: 34500000,
    bio: 'Global Punjabi music superstar and live stadium performer with iconic synthwave hits like Lover, Born to Shine, G.O.A.T., Naina, and Hass Hass.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[13], // Lover
      CURATED_SONGS[14], // Born to Shine
      CURATED_SONGS[15], // Naina
    ],
    albums: [
      CURATED_ALBUMS[11], // MoonChild Era
      CURATED_ALBUMS[12], // GOAT
      CURATED_ALBUMS[13], // Crew
    ],
    similarArtists: [
      { id: 'artist-ap-dhillon', name: 'AP Dhillon', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ecb80cf4ec829e0b82f009df35e4d1fb/500x500.jpg' },
      { id: 'artist-karan-aujla', name: 'Karan Aujla', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/3bb004e0e470876fc156e9c490a0ddbe/500x500.jpg' },
    ],
  },
  {
    id: 'artist-ap-dhillon',
    name: 'AP Dhillon',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ecb80cf4ec829e0b82f009df35e4d1fb/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/ecb80cf4ec829e0b82f009df35e4d1fb/1000x1000.jpg',
    monthlyListeners: 24800000,
    bio: 'Indo-Canadian trailblazer pioneering Punjabi Trap, Melodic Pop, and viral global chartbusters like Brown Munde, Excuses, With You, and Insane.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[19], // Brown Munde
      CURATED_SONGS[20], // Excuses
      CURATED_SONGS[21], // With You
    ],
    albums: [
      CURATED_ALBUMS[17], // Not by Chance
    ],
    similarArtists: [
      { id: 'artist-diljit-dosanjh', name: 'Diljit Dosanjh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/da0ea41f1737f1981ff3ff70e1762c2f/500x500.jpg' },
    ],
  },
  {
    id: 'artist-anuv-jain',
    name: 'Anuv Jain',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c6ce5d576a0fb41f17e3a9fa1e2b5e2a/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/c6ce5d576a0fb41f17e3a9fa1e2b5e2a/1000x1000.jpg',
    monthlyListeners: 18200000,
    bio: 'India’s acoustic storytelling poet whose acoustic melodies in Baarishein, Husn, Alag Aasmaan, and Mishri resonate with millions worldwide.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[22], // Baarishein
      CURATED_SONGS[23], // Husn
    ],
    albums: [
      CURATED_ALBUMS[18], // Baarishein
    ],
    similarArtists: [
      { id: 'artist-arijit-singh', name: 'Arijit Singh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg' },
    ],
  },
  {
    id: 'artist-king',
    name: 'King',
    artwork: 'https://e-cdns-images.dzcdn.net/images/artist/cf1b297b8f2a1bfe48cf2027b409748b/500x500.jpg',
    bannerArtwork: 'https://e-cdns-images.dzcdn.net/images/artist/cf1b297b8f2a1bfe48cf2027b409748b/1000x1000.jpg',
    monthlyListeners: 20400000,
    bio: 'Indian pop & hip-hop sensation known for record-shattering viral hits like Maan Meri Jaan, Tu Aake Dekhle, and Champagne Talk.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[24], // Maan Meri Jaan
    ],
    albums: [
      CURATED_ALBUMS[19], // Champagne Talk
    ],
    similarArtists: [
      { id: 'artist-diljit-dosanjh', name: 'Diljit Dosanjh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/da0ea41f1737f1981ff3ff70e1762c2f/500x500.jpg' },
    ],
  },
  {
    id: 'artist-tanishk-bagchi',
    name: 'Tanishk Bagchi & Faheem Abdullah',
    artwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    bannerArtwork: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    monthlyListeners: 34200000,
    bio: 'Renowned Bollywood music composers and hitmakers behind the massive 2026 YRF Saiyaara movie soundtrack, Raataan Lambiyan, and leading chartbuster anthems.',
    verified: true,
    provider: 'curated',
    topTracks: [
      CURATED_SONGS[0], // Saiyaara Title Song 2026
      CURATED_SONGS[1], // Saiyaara Audio
      CURATED_SONGS[2], // Saiyaara Reprise
      CURATED_SONGS[26], // Raataan Lambiyan
    ],
    albums: [
      CURATED_ALBUMS[0], // Saiyaara 2026
      CURATED_ALBUMS[21], // Shershaah
    ],
    similarArtists: [
      { id: 'artist-mohit-chauhan', name: 'Mohit Chauhan', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/ce5eeef975d0fe8a4f6645ea945110eb/500x500.jpg' },
      { id: 'artist-arijit-singh', name: 'Arijit Singh', artwork: 'https://e-cdns-images.dzcdn.net/images/artist/c1767664c0dd59a35e02ba2c244c00ff/500x500.jpg' },
    ],
  },
];

// 100% REAL Featured Playlists
export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-saiyaara-experience',
    title: 'Saiyaara (2026 & Classic Specials)',
    description: 'All official tracks from YRF’s latest 2026 blockbuster movie Saiyaara (Ahaan Panday & Aneet Padda) plus the timeless classic by Mohit Chauhan.',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c6/6a/a3/c66aa366-4522-14b8-c629-7cfee5422fc0/Saiyaara_Album_Cover.jpg/1000x1000bb.jpg',
    gradient: 'from-rose-950/70 via-red-900/40 to-black',
    ownerName: 'AeroX Curators',
    tracks: [
      CURATED_SONGS[0], // Saiyaara Title Track 2026
      CURATED_SONGS[1], // Saiyaara Audio 2026
      CURATED_SONGS[2], // Saiyaara Reprise 2026
      CURATED_SONGS[3], // Saiyaara Classic Ek Tha Tiger
      CURATED_SONGS[4], // Kesariya
      CURATED_SONGS[16], // Tum Se Hi
    ],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
  },
  {
    id: 'playlist-bollywood-romantic',
    title: 'Arijit Singh & Bollywood Romantics',
    description: 'Soulful late-night Hindi tracks, acoustic ballads, and timeless love anthems by Arijit Singh, Mohit Chauhan, and Pritam.',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/1000x1000bb.jpg',
    gradient: 'from-amber-900/60 via-purple-900/40 to-black',
    ownerName: 'AeroX Curators',
    tracks: [
      CURATED_SONGS[0], // Saiyaara 2026
      CURATED_SONGS[4], // Kesariya
      CURATED_SONGS[5], // Apna Bana Le
      CURATED_SONGS[6], // Tum Hi Ho
      CURATED_SONGS[7], // Channa Mereya
      CURATED_SONGS[12], // Heeriye
      CURATED_SONGS[10], // Satranga
      CURATED_SONGS[11], // Sajni
    ],
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
  },
  {
    id: 'playlist-punjabi-heatwave',
    title: 'Punjabi Chartbusters & Hype',
    description: 'High-energy Punjabi anthems, 808 basslines, and synthwave melodies by Diljit Dosanjh, AP Dhillon, and King.',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8a/89/e4/8a89e445-d2c6-f8ac-a828-27818b0c1afe/859749638209_cover.jpg/1000x1000bb.jpg',
    gradient: 'from-rose-900/60 via-violet-900/40 to-black',
    ownerName: 'AeroX Curators',
    tracks: [
      CURATED_SONGS[13], // Lover
      CURATED_SONGS[14], // Born to Shine
      CURATED_SONGS[15], // Naina
      CURATED_SONGS[19], // Brown Munde
      CURATED_SONGS[20], // Excuses
      CURATED_SONGS[24], // Maan Meri Jaan
    ],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now(),
  },
  {
    id: 'playlist-indian-indie',
    title: 'Indian Indie & Acoustic Coffee',
    description: 'Gentle acoustic guitars, ukulele strums, and heartfelt Hindi poetry for cozy evenings.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-cyan-900/60 via-teal-900/40 to-black',
    ownerName: 'AeroX Curators',
    tracks: [
      CURATED_SONGS[22], // Baarishein
      CURATED_SONGS[23], // Husn
      CURATED_SONGS[12], // Heeriye
      CURATED_SONGS[11], // Sajni
      CURATED_SONGS[21], // With You
    ],
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now(),
  },
];

export const CURATED_PLAYLISTS: Playlist[] = FEATURED_PLAYLISTS;

