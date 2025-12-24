import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyBjuPhd8xAUr31AkPXrbbLHgOZ2H7lghyM",
  authDomain: "online-diary-2dbd1.firebaseapp.com",
  projectId: "online-diary-2dbd1",
  storageBucket: "online-diary-2dbd1.firebasestorage.app",
  messagingSenderId: "278881355834",
  appId: "1:278881355834:web:e5163c4f0b6045a6734d03",
  measurementId: "G-BR5RNFXNL3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);