import { ScrapbookStore } from '../data/scrapbookData';

const DB_NAME = 'Scrapbook500DB';
const DB_VERSION = 1;
const STORE_NAME = 'book_store';
const MEDIA_STORE_NAME = 'media_cache';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        db.createObjectStore(MEDIA_STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalBookState(data: ScrapbookStore): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(data, 'main_book');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('IndexedDB save warning:', e);
  }

  try {
    localStorage.setItem('scrapbook_500_data', JSON.stringify(data));
  } catch {
    // Si supera los 5MB de localStorage, eliminar la versión vieja de localStorage para que jamás pise a IndexedDB con fotos antiguas
    try {
      localStorage.removeItem('scrapbook_500_data');
    } catch {}
  }
}

export async function loadLocalBookState(): Promise<Partial<ScrapbookStore> | null> {
  try {
    const db = await openDb();
    const idbData = await new Promise<Partial<ScrapbookStore> | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get('main_book');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (idbData) return idbData;
  } catch {
    // Fallback a localStorage
  }

  try {
    const local = localStorage.getItem('scrapbook_500_data');
    if (local) return JSON.parse(local);
  } catch {}
  return null;
}

export async function saveMediaToLocalCache(mediaId: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE_NAME, 'readwrite');
      tx.objectStore(MEDIA_STORE_NAME).put(dataUrl, mediaId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {}
}

export async function getMediaFromLocalCache(mediaId: string): Promise<string | null> {
  try {
    const db = await openDb();
    return await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE_NAME, 'readonly');
      const req = tx.objectStore(MEDIA_STORE_NAME).get(mediaId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}
