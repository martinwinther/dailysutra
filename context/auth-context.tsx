"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authError: string | null;
  authLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will update user
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("[Auth] signUp error:", error);
      setAuthError(
        error?.message ?? "Could not sign up. Please check your details."
      );
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("[Auth] signIn error:", error);
      setAuthError(
        error?.message ?? "Could not sign in. Please check your credentials."
      );
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("[Auth] signOut error:", error);
      setAuthError(error?.message ?? "Could not sign out.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    authError,
    authLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

