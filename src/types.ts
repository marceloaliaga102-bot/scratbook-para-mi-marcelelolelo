export interface BookPage {
  id: string;
  pageNumber: number;
  chapterTitle: string;
  pageTitle: string;
  subtitle?: string;
  content: string;
  photoUrl?: string;
  photoCaption?: string;
  secondaryPhotoUrl?: string;
  secondaryCaption?: string;
  quote?: string;
  date?: string;
  type: 'cover' | 'story' | 'gallery' | 'reasons' | 'playlist' | 'letter' | 'backcover';
  extraData?: {
    reasonsList?: string[];
    galleryImages?: Array<{ url: string; caption: string; id: string }>;
    signature?: string;
    envelopeOpened?: boolean;
    spotifyUrl?: string;
    youtubeUrl?: string;
  };
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  type: 'local' | 'youtube' | 'spotify' | 'synth';
  url: string; // audio data url or embed url or id
  duration?: string;
}

export interface ThemeSettings {
  mode: 'auto' | 'night' | 'sunset' | 'candlelight';
  fontFamily: 'Caveat' | 'Dancing Script' | 'Playfair Display' | 'Quicksand' | 'Great Vibes';
  bookCoverColor: string;
  pageTone: 'cream' | 'sepia' | 'vintage' | 'warm-pink';
  particlesEnabled: boolean;
  empanadaRainAutoStart: boolean;
}

export interface BookData {
  title: string;
  subtitle: string;
  recipientName: string;
  senderName: string;
  specialDate: string;
  pages: BookPage[];
  songs: SongItem[];
  theme: ThemeSettings;
  surpriseQuotes: string[];
}
