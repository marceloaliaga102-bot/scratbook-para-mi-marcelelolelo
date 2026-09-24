import { BookData } from '../types';

export const defaultBookData: BookData = {
  title: 'Nuestra Historia de Amor',
  subtitle: 'Cada segundo a tu lado es el regalo más hermoso del universo',
  recipientName: 'Mi Osito Hermoso',
  senderName: 'Tu personita favorita',
  specialDate: 'Para Siempre & Toda la Vida',
  theme: {
    mode: 'auto',
    fontFamily: 'Caveat',
    bookCoverColor: '#4a1525', // Deep romantic velvet wine
    pageTone: 'cream',
    particlesEnabled: true,
    empanadaRainAutoStart: true,
  },
  surpriseQuotes: [
    '¡Te amo más que a todas las estrellas del cielo y más que a diez mil empanadas recién horneadas! ❤️🥟',
    'Eres mi lugar seguro, mi sonrisa inesperada y el abrazo al que siempre quiero volver. ✨🐻',
    'Si tuviera que elegirte un millón de veces, en cada una de mis vidas volvería a encontrarte.',
    'Prometo cuidarte, darte mimitos cuando estés cansadito y apoyarte en todos tus sueños.',
    'Eres la personita más tierna, noble y hermosa que existe en este planeta. ¡Te amo con locura!'
  ],
  songs: [
    {
      id: 'synth-1',
      title: 'Melodía Romántica de Cuna',
      artist: 'Armonía de Amor para Mi Osito',
      type: 'synth',
      url: 'synth://piano-stream',
      duration: 'En vivo ∞',
    },
    {
      id: 'sp-1',
      title: 'Yellow',
      artist: 'Coldplay',
      type: 'spotify',
      url: 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg',
      duration: '4:29',
    },
    {
      id: 'yt-1',
      title: 'Perfect - Ed Sheeran (Romantic Acoustic)',
      artist: 'Ed Sheeran',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      duration: '4:23',
    },
    {
      id: 'sp-2',
      title: 'Can\'t Help Falling in Love',
      artist: 'Elvis Presley',
      type: 'spotify',
      url: 'https://open.spotify.com/track/44AyOl4qVkzS48vBsbNXaC',
      duration: '3:00',
    }
  ],
  pages: [
    {
      id: 'page-cover',
      pageNumber: 1,
      type: 'cover',
      chapterTitle: 'Portada',
      pageTitle: 'NUESTRO LIBRO DE AMOR',
      subtitle: 'Dedicado con todo mi corazón para mi osito consentido',
      content: 'Este libro guarda los pedacitos más puros de nuestro amor, nuestras sonrisas tontas, las tardes eternas y cada latido que te pertenece.',
      photoUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
      photoCaption: 'Tú y yo, bajo el mismo cielo eterno.',
      quote: '«En un mundo lleno de caos, tú eres mi paz más dulce.»',
      date: 'Nuestra Fecha Eterna',
    },
    {
      id: 'page-1',
      pageNumber: 2,
      type: 'story',
      chapterTitle: 'Capítulo I',
      pageTitle: 'El Día Que Llegaste a Mi Vida',
      subtitle: 'Cuando el destino supo exactamente lo que hacía',
      content: 'Aún recuerdo la primera vez que hablamos con detenimiento. No imaginaba que aquella mirada y esa forma tan tierna que tienes de sonreír se convertirían en mi refugio favorito.\n\nDesde ese día, cada hora sin ti se siente un poquito más vacía, y cada minuto a tu lado se convierte en un recuerdo que atesoro como el oro más brillante.',
      photoUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      photoCaption: 'Aquel primer cruce de miradas que lo cambió todo.',
      quote: '«Llegaste a encender luces en rincones de mi alma que ni yo sabía que estaban a oscuras.»',
      date: 'Capítulo Inicial',
    },
    {
      id: 'page-2',
      pageNumber: 3,
      type: 'story',
      chapterTitle: 'Capítulo II',
      pageTitle: 'Nuestras Aventuras & Risas',
      subtitle: 'Cómplices de travesuras y empanadas calientes',
      content: 'No hay nada más lindo que compartir contigo una tarde de comida rica, charlas interminables donde nos reímos hasta que nos duele la pancita, y esos momentos donde con solo mirarnos nos entendemos todo.\n\nMe encanta cómo te emocionas por las cosas pequeñas, cómo disfrutas tus comidas favoritas y cómo me abrazas fuerte cuando hace frío.',
      photoUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80',
      photoCaption: 'Comiendo cositas ricas y sonriendo sin prisa.',
      quote: '«Amarte es tan fácil como respirar y tan emocionante como viajar a las estrellas.»',
      date: 'Momentos Inolvidables',
    },
    {
      id: 'page-3',
      pageNumber: 4,
      type: 'reasons',
      chapterTitle: 'Capítulo III',
      pageTitle: 'Razones Por Las Que Te Amo',
      subtitle: 'Podría escribir mil libros y aún faltarían páginas',
      content: 'A veces me preguntas por qué te amo tanto. Aquí tienes unas cuantas de las millones de razones que hacen que mi corazón baile por ti:',
      quote: '«Te amo no solo por lo que eres, sino por quien soy cuando estoy contigo.»',
      extraData: {
        reasonsList: [
          'Por tu manera tan dulce y sincera de mirarme.',
          'Por cómo me haces reír incluso en mis días más grises.',
          'Porque tus abrazos tienen el poder mágico de calmar cualquier tormenta.',
          'Por tu pasión inmensa cuando me hablas de lo que te gusta.',
          'Porque eres mi osito favorito, el más leal, cariñoso y especial de todo el mundo.',
          'Porque compartir una empanada de carne contigo sabe a gloria bendita.',
          'Por la paz inexplicable que me da tomar tu manita cuando caminamos juntos.'
        ]
      }
    },
    {
      id: 'page-4',
      pageNumber: 5,
      type: 'gallery',
      chapterTitle: 'Capítulo IV',
      pageTitle: 'Galería de Nuestros Recuerdos',
      subtitle: 'Instantes congelados de pura felicidad',
      content: 'Cada fotografía guarda la magia de un instante donde fuimos infinitos. Haz clic en las fotos para apreciarlas en grande con todo el amor con el que fueron tomadas.',
      photoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
      photoCaption: 'Abrazos que detienen el reloj.',
      secondaryPhotoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
      secondaryCaption: 'Nuestras manos siempre entrelazadas.',
      extraData: {
        galleryImages: [
          {
            id: 'g1',
            url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
            caption: 'Nuestra serenata de miradas'
          },
          {
            id: 'g2',
            url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
            caption: 'Caminatas bajo el atardecer'
          },
          {
            id: 'g3',
            url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80',
            caption: 'Risas cómplices sin fin'
          },
          {
            id: 'g4',
            url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80',
            caption: 'El mejor lugar del mundo: a tu lado'
          }
        ]
      }
    },
    {
      id: 'page-5',
      pageNumber: 6,
      type: 'playlist',
      chapterTitle: 'Capítulo V',
      pageTitle: 'La Banda Sonora de Nuestro Amor',
      subtitle: 'Canciones que llevan grabado tu nombre',
      content: 'La música nos conecta con instantes únicos. Aquí puedes reproducir nuestras canciones favoritas, sincronizar pistas desde Spotify y YouTube, o subir audios especiales para escuchar juntitos mientras leemos nuestro libro.',
      quote: '«Donde las palabras fallan, nuestra música habla por nosotros.»',
      extraData: {
        spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4t95P4H3mIe',
        youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g'
      }
    },
    {
      id: 'page-6',
      pageNumber: 7,
      type: 'letter',
      chapterTitle: 'Capítulo VI',
      pageTitle: 'Nuestra Carta Secreta',
      subtitle: 'Un mensaje directo desde el fondo de mi alma',
      content: 'Mi adorado osito:\n\nSi algún día dudas de lo importante que eres para mí, abre este libro y recuerda que fuiste, eres y serás mi elección favorita de todos los días.\n\nPrometo sostenerte cuando sientas que caes, celebrar cada uno de tus logros como si fueran míos y recordarte siempre lo valioso, talentoso y maravilloso que eres.\n\nGracias por existir, gracias por elegirme y gracias por ser ese osito tan dulce que llena mi vida de ternura infinita.\n\nCon todo mi amor,\nTu personita que te ama hasta el infinito de ida y vuelta.',
      quote: '«Tú eres mi hoy y todos mis mañanas.»',
      extraData: {
        signature: 'Con amor eterno, tu osita ❤️',
        envelopeOpened: false
      }
    },
    {
      id: 'page-7',
      pageNumber: 8,
      type: 'backcover',
      chapterTitle: 'Contraportada',
      pageTitle: 'Para Siempre & Toda la Vida',
      subtitle: 'Continuará escribiéndose cada día...',
      content: 'Este libro no tiene un final, porque nuestro amor apenas está empezando a escribir sus mejores capítulos.\n\n¡Te amo con todo mi corazón, mi dulce osito! ❤️🐻🥟',
      photoUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80',
      photoCaption: 'El inicio de nuestra eternidad.',
      quote: '«Fin del libro... pero comienzo de mil aventuras más juntos.»',
      date: 'Amor Infinito'
    }
  ]
};
