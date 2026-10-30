import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

if (!isConfigured) {
    console.warn(
        '[Firebase] Missing configuration. Ensure VITE_FIREBASE_* environment variables are set in your .env file.'
    );
}

// Safe fallback configuration for test/offline environments to prevent unhandled initializeApp errors
const activeConfig = isConfigured
    ? firebaseConfig
    : {
        apiKey: 'demo-api-key',
        authDomain: 'demo.firebaseapp.com',
        projectId: 'demo-project',
        storageBucket: 'demo.appspot.com',
        messagingSenderId: '000000000000',
        appId: '1:000000000000:web:0000000000000000'
    };

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);

// Initialize Firebase Authentication with Google Auth Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

export { isConfigured };
export default app;
