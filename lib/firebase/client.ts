import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firebaseApp = app;
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging (client-side only)
export const messaging: Messaging | null = 
  typeof window !== "undefined" && "serviceWorker" in navigator
    ? getMessaging(app)
    : null;

// Export FCM functions for use in components
export { getToken as getFCMToken, onMessage as onFCMMessage };

