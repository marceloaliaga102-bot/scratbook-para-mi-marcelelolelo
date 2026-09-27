export interface PageElement {
  id: string;
  type: 'text' | 'image' | 'sticker' | 'polaroid' | 'quote' | 'frame';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width?: number; // percentage or px
  height?: number;
  rotation?: number; // degrees
  content: string; // text body or image URL
  title?: string;
  caption?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  zIndex?: number;
}

export interface CustomPage {
  pageNumber: number;
  title?: string;
  subtitle?: string;
  background?: string; // color or CSS class or gradient
  template?: 'blank' | 'polaroid_duo' | 'letter' | 'mosaic' | 'scrapbook_classic' | 'quote_banner';
  elements: PageElement[];
  note?: string;
}

export interface GameConfig {
  id: string;
  title: string;
  desc: string;
  icon?: string;
  url?: string;
  pageNumber?: number;
  active: boolean;
}

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
