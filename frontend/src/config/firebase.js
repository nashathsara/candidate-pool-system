import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Import the Storage module

const firebaseConfig = {
  apiKey: "AIzaSyDovLKo3djdRbs963vqKdbj-geRWyzMTrg", // Keep your hardcoded test keys here for now
  authDomain: "candidate-pool-system-6dbc9.firebaseapp.com",
  projectId: "candidate-pool-system-6dbc9",
  storageBucket: "candidate-pool-system-6dbc9.firebasestorage.app",
  messagingSenderId: "844476035831",
  appId: "1:844476035831:web:bddd2dd5394fb1346459f2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 2. Initialize and export storage!

export default app;