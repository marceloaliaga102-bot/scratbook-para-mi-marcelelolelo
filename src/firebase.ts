import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { ScrapbookStore, defaultScrapbookData } from './data/scrapbookData';
import { CustomPage } from './types';
import { saveMediaToLocalCache, getMediaFromLocalCache } from './utils/localDb';

// Config from firebase-applet-config.json
const firebaseConfig = {
  projectId: "celestial-being-qv9wh",
  appId: "1:995285430863:web:3f550fa5f36b63ad3af03a",
  apiKey: "AIzaSyBObEuY3F0p25lriA84gdWYz3nY_h8Yw1Q",
  authDomain: "celestial-being-qv9wh.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-nuestroscrapbook-2f014802-8794-49c6-a8e0-dbdb799e0c63",
  storageBucket: "celestial-being-qv9wh.firebasestorage.app",
  messagingSenderId: "995285430863",
  oAuthClientId: "995285430863-1raufo27v4m250rocv1lr5i4jmg6h62f.apps.googleusercontent.com",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const SCRAPBOOK_DOC_ID = 'main_book';
const FS_MEDIA_PREFIX = 'fs-media://';
const MAX_CHUNK_SIZE = 650000; // ~650KB por documento para estar siempre muy por debajo del límite de 1MB de Firestore

// Caché en memoria para resolución instantánea de fotos
const memoryMediaCache = new Map<string, string>();
const uploadedMediaIds = new Set<string>();

// Contador de guardados en curso y generación de guardado para evitar que snapshots en vuelo pisen cambios locales recientes
let pendingSavesCount = 0;
let lastSaveCompletedAt = 0;
let saveGeneration = 0;

/**
 * Genera un ID determinístico único basado en el contenido de la imagen/video
 */
function computeMediaId(dataUrl: string): string {
  let h1 = 0xdeadbeef ^ dataUrl.length;
  let h2 = 0x41c6ce57 ^ dataUrl.length;
  const step = Math.max(1, Math.floor(dataUrl.length / 4096));
  for (let i = 0; i < dataUrl.length; i += step) {
    const ch = dataUrl.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hashHex = (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
  return `m_${dataUrl.length}_${hashHex}`;
}

/**
 * Guarda un dataUrl en la subcolección /scrapbook/main_book/media/{mediaId}
 * Soporta partición automática en fragmentos si el archivo supera 650KB.
 */
async function storeMediaInFirestore(mediaId: string, dataUrl: string): Promise<void> {
  memoryMediaCache.set(mediaId, dataUrl);
  saveMediaToLocalCache(mediaId, dataUrl).catch(() => {});

  if (uploadedMediaIds.has(mediaId)) {
    return;
  }

  const mediaDocRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'media', mediaId);

  if (dataUrl.length <= MAX_CHUNK_SIZE) {
    await setDoc(mediaDocRef, {
      dataUrl,
      chunkCount: 1,
      updatedAt: serverTimestamp(),
    });
  } else {
    const chunks: string[] = [];
    for (let i = 0; i < dataUrl.length; i += MAX_CHUNK_SIZE) {
      chunks.push(dataUrl.slice(i, i + MAX_CHUNK_SIZE));
    }
    // Subir fragmentos en lotes seguros de 4 para soportar videos pesados sin saturar conexiones
    const BATCH_SIZE = 4;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const slice = chunks.slice(i, i + BATCH_SIZE);
      await Promise.all(
        slice.map((chunkData, offset) => {
          const idx = i + offset;
          const chunkRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'media', `${mediaId}_chunk_${idx}`);
          return setDoc(chunkRef, { chunkData, idx });
        })
      );
    }
    await setDoc(mediaDocRef, {
      chunkCount: chunks.length,
      updatedAt: serverTimestamp(),
    });
  }

  uploadedMediaIds.add(mediaId);
}

/**
 * Carga un mediaId desde caché en memoria, IndexedDB o Firestore
 */
async function loadMediaFromFirestore(mediaId: string): Promise<string | null> {
  if (memoryMediaCache.has(mediaId)) {
    return memoryMediaCache.get(mediaId)!;
  }

  const cachedLocal = await getMediaFromLocalCache(mediaId);
  if (cachedLocal) {
    memoryMediaCache.set(mediaId, cachedLocal);
    uploadedMediaIds.add(mediaId);
    return cachedLocal;
  }

  try {
    const mediaDocRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'media', mediaId);
    const snap = await getDoc(mediaDocRef);
    if (!snap.exists()) return null;

    const info = snap.data();
    let fullDataUrl = '';

    if (info.dataUrl) {
      fullDataUrl = info.dataUrl;
    } else if (typeof info.chunkCount === 'number' && info.chunkCount > 1) {
      const chunkSnaps = await Promise.all(
        Array.from({ length: info.chunkCount }, (_, idx) =>
          getDoc(doc(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'media', `${mediaId}_chunk_${idx}`))
        )
      );
      fullDataUrl = chunkSnaps.map((s) => (s.exists() ? s.data().chunkData || '' : '')).join('');
    }

    if (fullDataUrl) {
      memoryMediaCache.set(mediaId, fullDataUrl);
      uploadedMediaIds.add(mediaId);
      saveMediaToLocalCache(mediaId, fullDataUrl).catch(() => {});
      return fullDataUrl;
    }
  } catch (err) {
    console.warn(`Error cargando media ${mediaId}:`, err);
  }
  return null;
}

/**
 * Recorre cualquier objeto/array y extrae las cadenas data:... largas hacia /scrapbook/main_book/media
 * devolviendo una copia ligera con referencias fs-media://{mediaId}
 */
async function extractMediaFromTree(node: any): Promise<any> {
  if (typeof node === 'string') {
    if (node.startsWith('data:') && node.length > 1500) {
      const mediaId = computeMediaId(node);
      await storeMediaInFirestore(mediaId, node);
      return `${FS_MEDIA_PREFIX}${mediaId}`;
    }
    return node;
  }

  if (Array.isArray(node)) {
    return Promise.all(node.map((item) => extractMediaFromTree(item)));
  }

  if (node && typeof node === 'object') {
    // No tocar objetos especiales de Firestore como serverTimestamp
    if (node._methodName) return node;
    const out: Record<string, any> = {};
    const entries = Object.entries(node);
    for (const [k, v] of entries) {
      out[k] = await extractMediaFromTree(v);
    }
    return out;
  }

  return node;
}

/**
 * Recorre cualquier objeto/array y reemplaza las referencias fs-media://{mediaId}
 * con sus verdaderos dataUrl cargados desde caché o Firestore.
 */
async function resolveMediaInTree(node: any): Promise<any> {
  if (typeof node === 'string') {
    if (node.startsWith(FS_MEDIA_PREFIX)) {
      const mediaId = node.slice(FS_MEDIA_PREFIX.length);
      const resolved = await loadMediaFromFirestore(mediaId);
      return resolved || node;
    }
    return node;
  }

  if (Array.isArray(node)) {
    return Promise.all(node.map((item) => resolveMediaInTree(item)));
  }

  if (node && typeof node === 'object') {
    const out: Record<string, any> = {};
    const entries = Object.entries(node);
    await Promise.all(
      entries.map(async ([k, v]) => {
        out[k] = await resolveMediaInTree(v);
      })
    );
    return out;
  }

  return node;
}

/**
 * Escucha cambios en tiempo real desde Firebase Firestore.
 * Sincroniza tanto los campos generales como cada página personalizada y foto independientemente.
 */
export function subscribeToScrapbook(
  onData: (data: ScrapbookStore) => void,
  onError?: (err: Error) => void
) {
  const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);
  const customPagesCol = collection(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'custom_pages');

  let latestMainData: Partial<ScrapbookStore> | null = null;
  let latestCustomPages: Record<number, CustomPage> = {};

  const notify = async () => {
    // No emitir hasta que el documento principal haya cargado al menos una vez
    if (!latestMainData) return;

    // Si hay un guardado local activo en este preciso instante, no pisar el estado optimista local
    if (pendingSavesCount > 0 || Date.now() - lastSaveCompletedAt < 1200) return;

    const genAtStart = saveGeneration;

    const rawCombinedPages = {
      ...(latestMainData.customPages || {}),
      ...latestCustomPages,
    };

    const rawMerged: ScrapbookStore = {
      ...defaultScrapbookData,
      ...latestMainData,
      customPages: rawCombinedPages,
    };

    const resolvedMerged = (await resolveMediaInTree(rawMerged)) as ScrapbookStore;

    // Verificar nuevamente que no haya comenzado ni ocurrido un guardado mientras se resolvían las imágenes
    if (pendingSavesCount > 0 || genAtStart !== saveGeneration || Date.now() - lastSaveCompletedAt < 1200) {
      return;
    }

    onData(resolvedMerged);
  };

  // 1. Escuchar documento principal
  const unsubMain = onSnapshot(
    scrapbookRef,
    (snapshot) => {
      if (snapshot.metadata.hasPendingWrites && pendingSavesCount > 0) {
        return;
      }
      if (snapshot.exists()) {
        latestMainData = snapshot.data() as Partial<ScrapbookStore>;
        notify();
      } else {
        setDoc(scrapbookRef, {
          ...defaultScrapbookData,
          _updatedAt: serverTimestamp(),
        }).catch((err) => {
          console.error('Error inicializando scrapbook en la nube:', err);
        });
        latestMainData = defaultScrapbookData;
        notify();
      }
    },
    (error) => {
      console.error('Error en suscripción de Firebase (main):', error);
      if (onError) onError(error);
    }
  );

  // 2. Escuchar subcolección de páginas personalizadas (para páginas 25-500)
  const unsubPages = onSnapshot(
    customPagesCol,
    (snapshot) => {
      if (snapshot.metadata.hasPendingWrites && pendingSavesCount > 0) {
        return;
      }
      const pagesMap: Record<number, CustomPage> = {};
      snapshot.forEach((d) => {
        const pageNum = parseInt(d.id, 10);
        if (!isNaN(pageNum)) {
          pagesMap[pageNum] = d.data() as CustomPage;
        }
      });
      latestCustomPages = { ...latestCustomPages, ...pagesMap };
      notify();
    },
    (error) => {
      console.warn('Nota: subcolección de páginas personalizada en espera:', error);
    }
  );

  return () => {
    unsubMain();
    unsubPages();
  };
}

/**
 * Guarda cualquier cambio parcial o completo en la nube de Firebase.
 * Extrae automáticamente todas las fotos/videos hacia documentos individuales en /media
 * para que el documento principal jamás supere el límite de 1MB de Firestore.
 */
export async function saveScrapbookToCloud(partialOrFull: Partial<ScrapbookStore>) {
  pendingSavesCount++;
  saveGeneration++;
  try {
    const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);

    // 1. Extraer cualquier foto/video en base64 hacia /scrapbook/main_book/media/{mediaId}
    const lightweightPayload = (await extractMediaFromTree(partialOrFull)) as Partial<ScrapbookStore>;

    // 2. Si viene customPages, guardar cada página en la subcolección para persistencia permanente
    if (lightweightPayload.customPages) {
      const pageEntries = Object.entries(lightweightPayload.customPages);
      await Promise.all(
        pageEntries.map(([pNum, pData]) => {
          if (!pData) return Promise.resolve();
          const pageDocRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'custom_pages', String(pNum));
          return setDoc(pageDocRef, { ...pData, _updatedAt: serverTimestamp() }, { merge: true }).catch((e) =>
            console.warn(`Error guardando página ${pNum} en subcolección:`, e)
          );
        })
      );
    }

    // 3. Guardar el payload ligero en el documento principal
    await setDoc(
      scrapbookRef,
      {
        ...lightweightPayload,
        _updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error('Error guardando en Firebase Firestore:', error);
    throw error;
  } finally {
    lastSaveCompletedAt = Date.now();
    pendingSavesCount = Math.max(0, pendingSavesCount - 1);
  }
}

export function isCloudSaveInProgress(): boolean {
  return pendingSavesCount > 0 || Date.now() - lastSaveCompletedAt < 1200;
}

/**
 * Obtener datos una sola vez con todas las imágenes resueltas
 */
export async function fetchScrapbookOnce(): Promise<ScrapbookStore> {
  const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);
  const snap = await getDoc(scrapbookRef);
  if (snap.exists()) {
    const raw = {
      ...defaultScrapbookData,
      ...(snap.data() as Partial<ScrapbookStore>),
    };
    return (await resolveMediaInTree(raw)) as ScrapbookStore;
  }
  return defaultScrapbookData;
}
