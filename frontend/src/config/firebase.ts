import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  connectAuthEmulator,
  getAuth,
  signInAnonymously,
  type User,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

type FirebaseConfigKey =
  | "apiKey"
  | "authDomain"
  | "projectId"
  | "storageBucket"
  | "messagingSenderId"
  | "appId";

type FirebaseEnvConfig = Record<FirebaseConfigKey, string>;

export const firebaseConfig: FirebaseEnvConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

const requiredConfigKeys: Array<keyof FirebaseEnvConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

export const missingConfigKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key],
);
export const isFirebaseConfigured = missingConfigKeys.length === 0;

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firestoreDb: Firestore | null = firebaseApp
  ? getFirestore(firebaseApp)
  : null;

export const firebaseStorage: FirebaseStorage | null = firebaseApp
  ? getStorage(firebaseApp)
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;

let hasConnectedEmulators = false;

if (firestoreDb && firebaseAuth) {
  const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";
  if (useEmulators && !hasConnectedEmulators) {
    connectFirestoreEmulator(firestoreDb, "127.0.0.1", 8080);
    connectAuthEmulator(firebaseAuth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    hasConnectedEmulators = true;
  }
}

export const firebaseSetupError = isFirebaseConfigured
  ? ""
  : `Missing Firebase config: ${missingConfigKeys.join(", ")}`;

let authReadyPromise: Promise<User | null> = Promise.resolve(null);

if (firebaseAuth) {
  authReadyPromise = signInAnonymously(firebaseAuth)
    .then(({ user }) => user)
    .catch((error) => {
      console.warn(
        "Anonymous Firebase sign-in failed, falling back to local data.",
        error,
      );
      return null;
    });
}

export const ensureFirebaseAuthReady = () => authReadyPromise;
