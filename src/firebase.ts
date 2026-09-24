import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ScrapbookStore, defaultScrapbookData } from './data/scrapbookData';

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
 * Cuando tú o tu pareja hagan un cambio, se actualiza al instante en la pantalla del otro.
 */
export function subscribeToScrapbook(
  onData: (data: ScrapbookStore) => void,
  onError?: (err: Error) => void
) {
  const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);

  return onSnapshot(
    scrapbookRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data() as Partial<ScrapbookStore>;
        // Combinar con los datos por defecto para asegurar todos los campos
        const merged: ScrapbookStore = {
          ...defaultScrapbookData,
          ...cloudData,
        };
        onData(merged);
      } else {
        // Inicializar por primera vez con los datos por defecto
        setDoc(scrapbookRef, {
          ...defaultScrapbookData,
          _updatedAt: serverTimestamp(),
        }).catch((err) => {
          console.error('Error inicializando scrapbook en la nube:', err);
        });
        onData(defaultScrapbookData);
      }
    },
    (error) => {
      console.error('Error en suscripción de Firebase:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Guarda cualquier cambio parcial o completo en la nube de Firebase.
 * Se refleja inmediatamente en todos los dispositivos conectados.
 */
export async function saveScrapbookToCloud(partialOrFull: Partial<ScrapbookStore>) {
  try {
    const scrapbookRef = doc(db, 'scrapbook', SCRAPBOOK_DOC_ID);
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
