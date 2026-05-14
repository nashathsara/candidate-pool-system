// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4-Eyo9vAIiTaouVIuA2JQpiaQH5wjN_U",
  authDomain: "candidate-pool-system-1ac6d.firebaseapp.com",
  projectId: "candidate-pool-system-1ac6d",
  storageBucket: "candidate-pool-system-1ac6d.firebasestorage.app",
  messagingSenderId: "737670423887",
  appId: "1:737670423887:web:5714e1efa90c47895f913a",
  measurementId: "G-D1S2DZNS8C"
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