import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8zklanUhEE6SKBv8jZp_vW5xjrNuHtrw",
  authDomain: `ibok-27898.firebaseapp.com`,
  projectId: "ibok-27898",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: "1:721930222826:web:d10f67ba4ab407ef5eab93",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default app;
