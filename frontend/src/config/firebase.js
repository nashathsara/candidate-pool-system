import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => typeof value !== "string" || value.trim().length === 0)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  // This will show in the browser console to confirm whether Vite is injecting env vars.
  // eslint-disable-next-line no-console
  console.error("Firebase config missing env values:", missingKeys);
  throw new Error(`Firebase configuration is missing env values: ${missingKeys.join(", ")}`);
}

// eslint-disable-next-line no-console
console.log("Firebase config present?", {
  apiKey: firebaseConfig.apiKey?.length ? "yes" : "no",
  authDomain: firebaseConfig.authDomain?.length ? "yes" : "no",
  projectId: firebaseConfig.projectId?.length ? "yes" : "no",
  storageBucket: firebaseConfig.storageBucket?.length ? "yes" : "no",
  messagingSenderId: firebaseConfig.messagingSenderId?.length ? "yes" : "no",
  appId: firebaseConfig.appId?.length ? "yes" : "no",
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const linkedInProvider = new OAuthProvider("linkedin.com");

export async function signInWithEmailPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithLinkedIn() {
  return signInWithPopup(auth, linkedInProvider);
}
