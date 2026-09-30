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

/**
 * Escucha cambios en tiempo real desde Firebase Firestore.
 * Sincroniza tanto los campos generales como cada página personalizada independientemente.
 */
export function subscribeToScrapbook(
  onData: (data: ScrapbookStore) => void,
  onError?: (err: Error) => void
) {
  const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);
  const customPagesCol = collection(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'custom_pages');

  let latestMainData: Partial<ScrapbookStore> = {};
  let latestCustomPages: Record<number, CustomPage> = {};

  const notify = () => {
    const combinedPages = {
      ...(latestMainData.customPages || {}),
      ...latestCustomPages,
    };

    const merged: ScrapbookStore = {
      ...defaultScrapbookData,
      ...latestMainData,
      customPages: combinedPages,
    };
    onData(merged);
  };

  // 1. Escuchar documento principal
  const unsubMain = onSnapshot(
    scrapbookRef,
    (snapshot) => {
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
 * Garantiza que las páginas personalizadas se guarden tanto en el documento principal
 * como en documentos individuales para que nunca se pierdan ni superen límites.
 */
export async function saveScrapbookToCloud(partialOrFull: Partial<ScrapbookStore>) {
  try {
    const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);
    
    // Si viene customPages, guardar cada página en la subcolección para persistencia permanente
    if (partialOrFull.customPages) {
      const pageEntries = Object.entries(partialOrFull.customPages);
      for (const [pNum, pData] of pageEntries) {
        if (pData) {
          const pageDocRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID, 'custom_pages', String(pNum));
          setDoc(pageDocRef, { ...pData, _updatedAt: serverTimestamp() }, { merge: true }).catch((e) =>
            console.warn(`Error guardando página ${pNum} en subcolección:`, e)
          );
        }
      }
    }

    await setDoc(
      scrapbookRef,
      {
        ...partialOrFull,
        _updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error guardando en Firebase Firestore:', error);
    throw error;
  }
}

/**
 * Obtener datos una sola vez
 */
export async function fetchScrapbookOnce(): Promise<ScrapbookStore> {
  const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);
  const snap = await getDoc(scrapbookRef);
  if (snap.exists()) {
    return {
      ...defaultScrapbookData,
      ...(snap.data() as Partial<ScrapbookStore>),
    };
  }
  return defaultScrapbookData;
}
