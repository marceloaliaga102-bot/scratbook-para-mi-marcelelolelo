import { SongItem } from '../types';

export interface ScrapbookStore {
  // Common details
  recipientName: string;
  senderName: string;
  totalPageCount: number;

  // Page 9-10: Social Feed
  igPhoto: string;
  igBubbleText: string;
  igCaption: string;
  igLikesCount: number;
  isIgLiked: boolean;

  xTopQuote: string;
  xBody: string;
  xPhoto1: string;
  xPhoto2: string;
  xLikesCount: string;
  isXLiked: boolean;

  cameraPhoto: string;
  stickyQuote: string;

  // Page 17-18: Tin Box & Denim Pocket
  tinPolaroid1: string;
  tinPolaroid1Title: string;
  tinPolaroid2: string;
  tinPolaroid2Title: string;
  tinWishList: string[];

  denimPocketPhoto: string;
  denimLandscape1: string;
  denimLandscape1Title: string;
  denimLandscape2: string;
  denimLandscape2Title: string;

  // Page 19-20: Achievements & Birthday
  achievements: { id: string; title: string; icon: string }[];
  achievementPhonePhoto: string;
  achievementQuote: string;
  birthdayCameraPhoto: string;
  birthdayNotes: string[];

  // Page 21-22: Things we love & Retro TV
  thingsWeLovePhotos: { id: string; title: string; url: string; stamp?: string }[];
  retroTvPhoto: string;
  clapperboardData: {
    scene: string;
    take: string;
    directors: string;
    quote: string;
  };

  // Page 23-24: Vinyl & 10 Things
  vinylTrackName: string;
  sideANote: string;
  polaroidMoonPhoto: string;
  photoboothItems: string[];
  tenThingsList: string[];
  clipboardQuote: string;

  // Spreads 0, 1, 2, 3 details
  secretLetter: string;
  coverTitle: string;
  coverSubtitle: string;
  specialMoments: { title: string; date: string; photo: string }[];
  songs?: SongItem[];
}

export const defaultScrapbookData: ScrapbookStore = {
  recipientName: 'Marcelololelo',
  senderName: 'Tu Niña Hermosa',
  totalPageCount: 500,

  // Page 9-10
  igPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Wva-2IjYALIbwcRlIsIwJeH1kPSfBHBZPOUGQgKSAdeZxolCORQ9tr3jT8-dW8wl1Dsoxm4AFJOhOnRxcHp4kEGA5T5wWnvza5Plsqfn2zhW8Ik8gvoRVc7reCoXyA3VYHbl1JZvTH4W0Xzwqobou8lHieXUYnxzwxlHqbNrI8sBHyGNUnWiCGptlztyWZbMthQ407-_2dXD3hw0OtyUR1bs75MeYJSUXiP7reKKU2V4SbdyI2i3Cq3G96nT5vJsTg',
  igBubbleText: 'Mishell you look so beautiful!',
  igCaption: 'Bajo las luces de la ciudad, caminando de tu mano para siempre. No hay lugar más lindo que a tu lado.',
  igLikesCount: 977255,
  isIgLiked: false,

  xTopQuote: '"I love you. Even if the fates unraveled our destiny, I would find a way back to you!"',
  xBody: "If I die or go somewhere far, I'll write your name on every star so people looking up can see just how much you meant to me.",
  xPhoto1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV_suehCWMySvou9EBhG9-WIvQWnbZreLZb-6ZNsLpSRX-Kic50vtKzXa9Xb6Ma_H9AMuiH7l5-Dg0c-L-nXd-dMv6K50PPXEWpH8dz6G931GaXFVu90jUFRK0im0NGBbk4ESpg0n00LDOs2KjTs6X67xGpQWhB52gtjWTVc0UHsDQgDU3rlSFaASKn9TBrsKzcxcTjfBL1omGK6M492H_Ig8i5FqeF1n0WuHiSl_Bo0vPr8ZHWJJ80zcNP29D5mzAHg',
  xPhoto2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDDujNCh_tLCYZ2FwtgHg6rUK8CWGuzJKLrYAIosYxzFxnx8zpgWaMh4DKq0wfZPo16eA7QW4OaKpB3onjjauzDy6EsXnE8BdtqMZ3h03d07Prxy2uxDJ_t0zlUbGrcYtUMRJfLujBnoz8ElYAXHhaDB54oagQhCEKqZBoJAzOBMKrwip0mSTmVtdYnC81jTYY-FhLM4CirHheDf96E24oal7LNuIYhCBNaf6BHckuqrWdcch1yhQLv8b02uh5mE7NGw',
  xLikesCount: '189.5K',
  isXLiked: false,

  cameraPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJmhDRgv591QbyyUPHtReO69luiXaQEdxAFBGYIfjXVZe_XmmnskAxaBvkd16FahpSwbRjf-miWAhKeTSGazLaTaItFuL8DssOPQL1av_qX8qpWuj2zd4MBtn40rgAhu6me24_M8NFBTBOEZ9bNMhOCWY5OLKqka2s7mjxWSygux7ymISaliWKG9omOd7jlQzMRXMOvRe9jroyqkOviTryAZVaz8EvP7TAPZ2Idne1t-W1eBmW9O4Iuk7jF4FLyc6Gyw',
  stickyQuote: '"I\'m not finish fall in love with you yet!"',

  // Page 17-18
  tinPolaroid1: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop',
  tinPolaroid1Title: 'Día de Campo',
  tinPolaroid2: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
  tinPolaroid2Title: 'Nuestra Tarde',
  tinWishList: ['500 páginas', 'Empanadas juntas', 'Mirar las estrellas'],

  denimPocketPhoto: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop',
  denimLandscape1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
  denimLandscape1Title: 'Paseo de fin de semana',
  denimLandscape2: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop',
  denimLandscape2Title: 'Bajo el mismo cielo',

  // Page 19-20
  achievements: [
    { id: 'a1', title: 'Logro #1: Tu Grado 🎓', icon: 'school' },
    { id: 'a2', title: 'Nuevo Proyecto 🚀', icon: 'rocket_launch' },
    { id: 'a3', title: '¡Tu Sonrisa Siempre! ⭐', icon: 'star' },
  ],
  achievementPhonePhoto: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop',
  achievementQuote: '"No hay logro pequeño. Admiro tu constancia, tu brillantez y tu sonrisa invencible."',
  birthdayCameraPhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop',
  birthdayNotes: [
    'Gracias por ser la luz más bonita en cada aventura compartida.',
    'Que este nuevo año te regale tanta felicidad como la que das.',
    'Por mil fotos más, viajes soñados y risas eternas juntos.',
  ],

  // Page 21-22
  thingsWeLovePhotos: [
    { id: 'twl1', title: 'Nuestros paseos', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop', stamp: '50¢' },
    { id: 'twl2', title: 'Cenar empanadas 🥟', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop' },
    { id: 'twl3', title: 'Mirar la luna 🌙', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop' },
    { id: 'twl4', title: 'Tu sonrisa favorita', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop' },
  ],
  retroTvPhoto: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop',
  clapperboardData: {
    scene: '21-22',
    take: 'FOREVER',
    directors: 'Marcelololelo & Mi Amor',
    quote: '"Cada película es mejor si la vemos acurrucados comiendo rico."',
  },

  // Page 23-24
  vinylTrackName: 'Mi Canción',
  sideANote: 'SIDE A • TRACK 23 Nuestra Historia',
  polaroidMoonPhoto: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop',
  photoboothItems: ['Risas sin parar ✨', 'Cafecito y charla ☕', 'Abrazo favorito 🫂'],
  tenThingsList: [
    'Tu paciencia infinita y tu calma cuando todo se vuelve caos.',
    'La manera en que se te iluminan los ojos al reírte fuerte.',
    'Tu generosidad pura y cómo cuidas siempre a los demás.',
    'Que compartas tus comidas ricas y tu antojo de empanadas.',
    'Tus abrazos apretados que curan cualquier mal día.',
    'Tu voz cuando me dices que todo va a salir bien.',
    'Que apoyas cada uno de mis sueños con orgullo sincero.',
    'Tus ocurrencias divertidas en los momentos más inesperados.',
    'La complicidad única que solo tú y yo entendemos.',
    'Haces de cualquier lugar común nuestro lugar favorito.',
  ],
  clipboardQuote: "\"You're kind in ways that people don't always see... your warmth, your patience, and your big heart make the entire world better.\"",

  // Secret letter & cover
  secretLetter: 'Si me pidieran elegir entre el mundo entero y pasar 5 minutos más contigo, elegiría tus abrazos sin dudarlo. Gracias por cada risa, cada partida jugando juntos, por cada empanada que compartimos y por ser mi refugio favorito. Este libro de 500 páginas apenas alcanza para guardar una pequeña fracción de todo lo que te amo, muak muak muak!',
  coverTitle: 'Nuestro Scrapbook de Amor Eterno',
  coverSubtitle: 'Dedicado para el osito más hermoso del universo',
  specialMoments: [
    { title: 'El inicio de nuestra magia', date: 'Día Inolvidable', photo: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop' },
    { title: 'Tardes de risas infinitas', date: 'Siempre Juntos', photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop' },
  ],
  songs: [
    {
      id: 'synth-1',
      title: 'Melodía Romántica en Piano',
      artist: 'Nuestra Historia de Amor',
      type: 'synth',
      url: 'synth',
      duration: 'Ambiental',
    },
    {
      id: 'yt-1',
      title: 'Ed Sheeran - Perfect',
      artist: 'Ed Sheeran',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      duration: '4:23',
    },
    {
      id: 'spot-1',
      title: "Can't Help Falling in Love",
      artist: 'Elvis Presley',
      type: 'spotify',
      url: 'https://open.spotify.com/track/44AyOl4qVkzS48vBsbNXaC',
      duration: '3:00',
    },
  ],
};
