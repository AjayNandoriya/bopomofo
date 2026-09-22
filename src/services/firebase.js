import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGzYPSO6xTm6tE5dZwohnfJwWCzsWtPYM",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zhuyin-annotator.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zhuyin-annotator",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zhuyin-annotator.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "164847569213",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:164847569213:web:aac3261fa3e9bb2f37dd54"
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication with Google Auth Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
