import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const names = firebaseUser.displayName?.split(" ") || [];
          const firstName = names[0] || "";
          const lastName = names.slice(1).join(" ") || "";

          await apiRequest("/api/auth/sync-user", "POST", {
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email,
            first_name: firstName,
            last_name: lastName,
            profile_image_url: firebaseUser.photoURL,
          });

          setUser(firebaseUser);
        } catch (error) {
          console.error("Error syncing user:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };
}
