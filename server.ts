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
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'cloud_book_data.json');

// Allow large payloads for media uploads (photos, videos, audio up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
      return res.json({
        ...fileData,
        title: book.title,
        subtitle: book.subtitle || '',
        recipientName: book.recipientName || '',
        senderName: book.senderName || '',
        specialDate: book.specialDate || '',
        theme: book.theme || {},
        pages: book.pages || [],
        songs: (Array.isArray(book.songs) && book.songs.length > 0) ? book.songs : (fileData.songs || []),
        surpriseQuotes: book.surpriseQuotes || [],
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

    const merged = {
      ...currentBackup,
      ...existingSql,
      ...payload,
    };
    
    // Save merged to PostgreSQL via Drizzle
    const saved = await upsertScrapbook({
      bookKey: 'main_book',
      title: merged.title || 'Nuestro Scrapbook',
      subtitle: merged.subtitle ?? '',
      recipientName: merged.recipientName ?? '',
      senderName: merged.senderName ?? '',
      specialDate: merged.specialDate ?? '',
      theme: merged.theme ?? {},
      pages: merged.pages ?? [],
      songs: merged.songs ?? [],
      surpriseQuotes: merged.surpriseQuotes ?? [],
    });

    // Also write merged backup file
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Backup file write failed:', e);
    }

    return res.json({ success: true, timestamp: Date.now(), id: saved?.id });
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

    let userId: number | undefined = undefined;
    if (req.user?.uid) {
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      userId = user.id;
    }

    const newSong = await saveSongItem({
      title,
      artist: artist || 'Artista Desconocido',
      url,
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
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
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
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
