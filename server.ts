import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getScrapbook,
  upsertScrapbook,
  saveMediaItem,
  getMediaItems,
  saveSongItem,
  getSongItems,
  deleteSongItem,
} from './src/db/scrapbook.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, optionalAuth, type AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'cloud_book_data.json');
const AUDIO_UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'audio');
const IMAGE_UPLOAD_DIR = path.join(__dirname, 'public', 'uploads', 'images');

if (!fs.existsSync(AUDIO_UPLOAD_DIR)) {
  fs.mkdirSync(AUDIO_UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGE_UPLOAD_DIR)) {
  fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
}

// Allow large payloads for media uploads (photos, videos, audio up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded audio and image files directly
app.use('/uploads/audio', express.static(AUDIO_UPLOAD_DIR));
app.use('/uploads/images', express.static(IMAGE_UPLOAD_DIR));

// Endpoint to upload and persist images directly to disk
app.post('/api/upload-image', (req, res) => {
  try {
    const { image, name } = req.body || {};
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // If it's a data URL, decode base64 and save as file
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1];
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      const cleanName = (name || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      const fileName = `${cleanName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = path.join(IMAGE_UPLOAD_DIR, fileName);
      const buffer = Buffer.from(matches[2], 'base64');
      fs.writeFileSync(filePath, buffer);
      return res.json({ success: true, url: `/uploads/images/${fileName}` });
    }
    // If it's already a URL, return it
    return res.json({ success: true, url: image });
  } catch (err: any) {
    console.error('Error saving image upload:', err);
    return res.status(500).json({ error: 'Failed to save image' });
  }
});

// Download complete project archive for GitHub / Vercel
app.get('/nuestro-scrapbook.zip', (req, res) => {
  const zipPath = path.join(__dirname, 'public', 'nuestro-scrapbook.zip');
  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'nuestro-scrapbook.zip');
  } else {
    res.status(404).send('ZIP no encontrado');
  }
});

// Cloud SQL Scrapbook persistence endpoints
app.get('/api/book-data', async (req, res) => {
  try {
    let fileData: any = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        fileData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      } catch {}
    }

    const book = await getScrapbook('main_book');
    if (book) {
      const dbPagesData: any = book.pages || {};
      const dbStoreData: any = dbPagesData.store || {};
      const allCustomPages = {
        ...(dbStoreData.customPages || {}),
        ...(dbPagesData.customPages || {}),
        ...(fileData.customPages || {}),
      };

      return res.json({
        ...dbStoreData,
        ...fileData,
        ...dbPagesData,
        customPages: allCustomPages,
        title: fileData.coverTitle || dbStoreData.coverTitle || fileData.title || book.title || 'Nuestro Scrapbook',
        subtitle: fileData.coverSubtitle || dbStoreData.coverSubtitle || fileData.subtitle || book.subtitle || '',
        recipientName: fileData.recipientName || dbStoreData.recipientName || book.recipientName || '',
        senderName: fileData.senderName || dbStoreData.senderName || book.senderName || '',
        specialDate: fileData.specialDate || dbStoreData.specialDate || book.specialDate || '',
        theme: fileData.theme || dbStoreData.theme || book.theme || {},
        pages: fileData.pages || (Array.isArray(book.pages) ? book.pages : dbPagesData.list || []),
        songs: Array.isArray(fileData.songs) && fileData.songs.length > 0 ? fileData.songs : (Array.isArray(book.songs) ? book.songs : []),
        surpriseQuotes: fileData.surpriseQuotes || dbStoreData.surpriseQuotes || book.surpriseQuotes || [],
        updatedAt: book.updatedAt,
      });
    }

    // Fallback to local file if SQL record not created yet
    if (Object.keys(fileData).length > 0) {
      return res.json(fileData);
    }
    return res.json({ initialized: false });
  } catch (error: any) {
    console.error('Error fetching book data from Cloud SQL:', error);
    // Fallback to file if database error occurs
    if (fs.existsSync(DATA_FILE)) {
      try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return res.json(JSON.parse(data));
      } catch {}
    }
    return res.status(500).json({ error: 'Failed to read book data' });
  }
});

app.post('/api/book-data', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const payload = req.body || {};
    
    // Fetch current existing book from SQL and file to merge safely
    let currentBackup: any = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        currentBackup = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      } catch {}
    }

    let existingSql: any = {};
    try {
      existingSql = (await getScrapbook('main_book')) || {};
    } catch {}

    const existingStore =
      existingSql.pages && typeof existingSql.pages === 'object' && !Array.isArray(existingSql.pages)
        ? existingSql.pages.store || {}
        : {};

    const existingCustomPages = {
      ...(existingStore.customPages || {}),
      ...(currentBackup.customPages || {}),
      ...((existingSql.pages && typeof existingSql.pages === 'object' && !Array.isArray(existingSql.pages)) ? existingSql.pages.customPages : {}),
      ...(existingSql.customPages || {}),
    };

    const mergedCustomPages = payload.customPages
      ? { ...existingCustomPages, ...payload.customPages }
      : existingCustomPages;

    const merged = {
      ...existingStore,
      ...currentBackup,
      ...payload,
      customPages: mergedCustomPages,
    };
    
    // Save merged to PostgreSQL via Drizzle
    const saved = await upsertScrapbook({
      bookKey: 'main_book',
      title: merged.coverTitle || merged.title || 'Nuestro Scrapbook',
      subtitle: merged.coverSubtitle || merged.subtitle || '',
      recipientName: merged.recipientName ?? '',
      senderName: merged.senderName ?? '',
      specialDate: merged.specialDate ?? '',
      theme: merged.theme ?? {},
      pages: {
        list: Array.isArray(merged.pages) ? merged.pages : [],
        customPages: mergedCustomPages,
        store: merged,
      },
      songs: merged.songs ?? [],
      surpriseQuotes: merged.surpriseQuotes ?? [],
    });

    // Also write merged backup file with full store data
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Backup file write failed:', e);
    }

    return res.json({ success: true, timestamp: Date.now(), id: saved?.id, customPagesCount: Object.keys(mergedCustomPages).length });
  } catch (error: any) {
    console.error('Error saving book data to Cloud SQL:', error);
    return res.status(500).json({ error: 'Failed to save book data' });
  }
});

// Media library endpoints (Fotos y Videos)
app.get('/api/media', async (_req, res) => {
  try {
    const mediaList = await getMediaItems();
    return res.json(mediaList);
  } catch (error: any) {
    console.error('Error fetching media:', error);
    return res.status(500).json({ error: 'Failed to fetch media library' });
  }
});

app.post('/api/media', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { name, type, url, caption, size } = req.body;
    if (!name || !url || !type) {
      return res.status(400).json({ error: 'Missing required media fields (name, type, url)' });
    }

    let userId: number | undefined = undefined;
    if (req.user?.uid) {
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      userId = user.id;
    }

    const savedMedia = await saveMediaItem({
      name,
      type,
      url,
      caption,
      size: size ? Number(size) : undefined,
      userId,
    });

    return res.json({ success: true, media: savedMedia });
  } catch (error: any) {
    console.error('Error uploading media:', error);
    return res.status(500).json({ error: 'Failed to save media item' });
  }
});

// Songs library endpoints (Música)
app.get('/api/songs', async (_req, res) => {
  try {
    const songList = await getSongItems();
    return res.json(songList);
  } catch (error: any) {
    console.error('Error fetching songs:', error);
    return res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

app.post('/api/songs', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { title, artist, url, type, duration } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: 'Missing required song fields (title, url)' });
    }

    let finalUrl = url;
    // If user uploaded a local audio file as base64, save to static audio folder
    if (type === 'local' && url.startsWith('data:audio')) {
      const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        let ext = 'mp3';
        if (mimeType.includes('wav')) ext = 'wav';
        else if (mimeType.includes('ogg')) ext = 'ogg';
        else if (mimeType.includes('m4a') || mimeType.includes('mp4')) ext = 'm4a';

        const filename = `song-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filepath = path.join(AUDIO_UPLOAD_DIR, filename);
        fs.writeFileSync(filepath, buffer);
        finalUrl = `/uploads/audio/${filename}`;
      }
    }

    let userId: number | undefined = undefined;
    if (req.user?.uid) {
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      userId = user.id;
    }

    const newSong = await saveSongItem({
      title,
      artist: artist || 'Artista Desconocido',
      url: finalUrl,
      type: type || 'local',
      duration: duration || '3:30',
      userId,
    });

    return res.json({ success: true, song: newSong });
  } catch (error: any) {
    console.error('Error adding song:', error);
    return res.status(500).json({ error: 'Failed to save song' });
  }
});

app.get('/api/audio/:filename', (req, res) => {
  const filepath = path.join(AUDIO_UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filepath)) {
    return res.sendFile(filepath);
  }
  return res.status(404).json({ error: 'Audio file not found' });
});

app.delete('/api/songs/:id', async (req, res) => {
  try {
    const rawId = req.params.id;
    const { url } = req.body || {};
    
    // Check if numeric or has prefix db-
    const cleanId = rawId.startsWith('db-') ? rawId.replace('db-', '') : rawId;
    const numericId = parseInt(cleanId, 10);
    
    if (!isNaN(numericId)) {
      await deleteSongItem(numericId);
    } else if (url) {
      await deleteSongItem(url);
    } else {
      // Song might be local or external, still succeed
      await deleteSongItem(rawId);
    }

    // If it was a local file in /uploads/audio, delete it
    if (url && typeof url === 'string' && url.includes('/uploads/audio/')) {
      const filename = path.basename(url);
      const filepath = path.join(AUDIO_UPLOAD_DIR, filename);
      if (fs.existsSync(filepath)) {
        try { fs.unlinkSync(filepath); } catch {}
      }
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting song:', error);
    return res.status(500).json({ error: 'Failed to delete song' });
  }
});

// User sync endpoint (Google Sign-In integration)
app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await getOrCreateUser(req.user.uid, req.user.email || '');
    return res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Vite middleware integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_event === 'start';
  const hasDist = fs.existsSync(path.join(__dirname, 'dist'));

  if (isProd && hasDist) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback handler for all SPA routes
    app.use('*', async (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const templatePath = path.join(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
