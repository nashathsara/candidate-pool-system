// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDovLKo3djdRbs963vqKdbj-geRWyzMTrg", // Keep your hardcoded test keys here for now
  authDomain: "candidate-pool-system-6dbc9.firebaseapp.com",
  projectId: "candidate-pool-system-6dbc9",
  storageBucket: "candidate-pool-system-6dbc9.firebasestorage.app",
  messagingSenderId: "844476035831",
  appId: "1:844476035831:web:bddd2dd5394fb1346459f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Export the services
export { app, analytics, db, storage, auth };
export default app;
