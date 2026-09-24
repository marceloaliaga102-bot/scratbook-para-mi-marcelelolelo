import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'cloud_book_data.json');

app.use(express.json({ limit: '50mb' }));

// Cloud persistence API endpoints
app.get('/api/book-data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return res.json(JSON.parse(data));
    }
    return res.json({ initialized: false });
  } catch (error) {
    console.error('Error reading book data:', error);
    return res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/book-data', (req, res) => {
  try {
    const payload = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return res.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Error saving book data:', error);
    return res.status(500).json({ error: 'Failed to save data' });
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
