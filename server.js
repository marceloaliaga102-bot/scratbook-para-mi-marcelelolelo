import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  getScrapbook,
  upsertScrapbook,
  saveMediaItem,
  getMediaItems,
  saveSongItem,
  getSongItems,
  deleteSongItem
} from "./src/db/scrapbook.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { requireAuth, optionalAuth } from "./src/middleware/auth.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3e3;
const DATA_FILE = path.join(__dirname, "cloud_book_data.json");
const AUDIO_UPLOAD_DIR = path.join(__dirname, "public", "uploads", "audio");
if (!fs.existsSync(AUDIO_UPLOAD_DIR)) {
  fs.mkdirSync(AUDIO_UPLOAD_DIR, { recursive: true });
}
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads/audio", express.static(AUDIO_UPLOAD_DIR));
app.get("/api/book-data", async (req, res) => {
  try {
    let fileData = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        fileData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      } catch {
      }
    }
    const book = await getScrapbook("main_book");
    if (book) {
      const dbPagesData = book.pages || {};
      return res.json({
        ...fileData,
        title: fileData.title || book.title,
        subtitle: fileData.subtitle || book.subtitle || "",
        recipientName: fileData.recipientName || book.recipientName || "",
        senderName: fileData.senderName || book.senderName || "",
        specialDate: fileData.specialDate || book.specialDate || "",
        theme: fileData.theme || book.theme || {},
        pages: fileData.pages || (Array.isArray(book.pages) ? book.pages : dbPagesData.list || []),
        songs: Array.isArray(fileData.songs) ? fileData.songs : Array.isArray(book.songs) ? book.songs : [],
        customPages: fileData.customPages || dbPagesData.customPages || {},
        surpriseQuotes: fileData.surpriseQuotes || book.surpriseQuotes || [],
        updatedAt: book.updatedAt
      });
    }
    if (Object.keys(fileData).length > 0) {
      return res.json(fileData);
    }
    return res.json({ initialized: false });
  } catch (error) {
    console.error("Error fetching book data from Cloud SQL:", error);
    if (fs.existsSync(DATA_FILE)) {
      try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        return res.json(JSON.parse(data));
      } catch {
      }
    }
    return res.status(500).json({ error: "Failed to read book data" });
  }
});
app.post("/api/book-data", optionalAuth, async (req, res) => {
  try {
    const payload = req.body || {};
    let currentBackup = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        currentBackup = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      } catch {
      }
    }
    let existingSql = {};
    try {
      existingSql = await getScrapbook("main_book") || {};
    } catch {
    }
    const merged = {
      ...currentBackup,
      ...existingSql,
      ...payload
    };
    const saved = await upsertScrapbook({
      bookKey: "main_book",
      title: merged.coverTitle || merged.title || "Nuestro Scrapbook",
      subtitle: merged.coverSubtitle || merged.subtitle || "",
      recipientName: merged.recipientName ?? "",
      senderName: merged.senderName ?? "",
      specialDate: merged.specialDate ?? "",
      theme: merged.theme ?? {},
      pages: {
        list: Array.isArray(merged.pages) ? merged.pages : [],
        customPages: merged.customPages || {}
      },
      songs: merged.songs ?? [],
      surpriseQuotes: merged.surpriseQuotes ?? []
    });
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
    } catch (e) {
      console.warn("Backup file write failed:", e);
    }
    return res.json({ success: true, timestamp: Date.now(), id: saved?.id });
  } catch (error) {
    console.error("Error saving book data to Cloud SQL:", error);
    return res.status(500).json({ error: "Failed to save book data" });
  }
});
app.get("/api/media", async (_req, res) => {
  try {
    const mediaList = await getMediaItems();
    return res.json(mediaList);
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ error: "Failed to fetch media library" });
  }
});
app.post("/api/media", optionalAuth, async (req, res) => {
  try {
    const { name, type, url, caption, size } = req.body;
    if (!name || !url || !type) {
      return res.status(400).json({ error: "Missing required media fields (name, type, url)" });
    }
    let userId = void 0;
    if (req.user?.uid) {
      const user = await getOrCreateUser(req.user.uid, req.user.email || "");
      userId = user.id;
    }
    const savedMedia = await saveMediaItem({
      name,
      type,
      url,
      caption,
      size: size ? Number(size) : void 0,
      userId
    });
    return res.json({ success: true, media: savedMedia });
  } catch (error) {
    console.error("Error uploading media:", error);
    return res.status(500).json({ error: "Failed to save media item" });
  }
});
app.get("/api/songs", async (_req, res) => {
  try {
    const songList = await getSongItems();
    return res.json(songList);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return res.status(500).json({ error: "Failed to fetch songs" });
  }
});
app.post("/api/songs", optionalAuth, async (req, res) => {
  try {
    const { title, artist, url, type, duration } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Missing required song fields (title, url)" });
    }
    let finalUrl = url;
    if (type === "local" && url.startsWith("data:audio")) {
      const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        let ext = "mp3";
        if (mimeType.includes("wav")) ext = "wav";
        else if (mimeType.includes("ogg")) ext = "ogg";
        else if (mimeType.includes("m4a") || mimeType.includes("mp4")) ext = "m4a";
        const filename = `song-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filepath = path.join(AUDIO_UPLOAD_DIR, filename);
        fs.writeFileSync(filepath, buffer);
        finalUrl = `/uploads/audio/${filename}`;
      }
    }
    let userId = void 0;
    if (req.user?.uid) {
      const user = await getOrCreateUser(req.user.uid, req.user.email || "");
      userId = user.id;
    }
    const newSong = await saveSongItem({
      title,
      artist: artist || "Artista Desconocido",
      url: finalUrl,
      type: type || "local",
      duration: duration || "3:30",
      userId
    });
    return res.json({ success: true, song: newSong });
  } catch (error) {
    console.error("Error adding song:", error);
    return res.status(500).json({ error: "Failed to save song" });
  }
});
app.get("/api/audio/:filename", (req, res) => {
  const filepath = path.join(AUDIO_UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filepath)) {
    return res.sendFile(filepath);
  }
  return res.status(404).json({ error: "Audio file not found" });
});
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const rawId = req.params.id;
    const { url } = req.body || {};
    const cleanId = rawId.startsWith("db-") ? rawId.replace("db-", "") : rawId;
    const numericId = parseInt(cleanId, 10);
    if (!isNaN(numericId)) {
      await deleteSongItem(numericId);
    } else if (url) {
      await deleteSongItem(url);
    } else {
      await deleteSongItem(rawId);
    }
    if (url && typeof url === "string" && url.includes("/uploads/audio/")) {
      const filename = path.basename(url);
      const filepath = path.join(AUDIO_UPLOAD_DIR, filename);
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch {
        }
      }
    }
    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting song:", error);
    return res.status(500).json({ error: "Failed to delete song" });
  }
});
app.post("/api/users/sync", requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await getOrCreateUser(req.user.uid, req.user.email || "");
    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ error: "Failed to sync user" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV === "production" && fs.existsSync(path.join(__dirname, "dist"))) {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const templatePath = path.join(__dirname, "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}
startServer();
