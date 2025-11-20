"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AppStatusValue {
  isOnline: boolean;
  lastError: string | null;
  setLastError: (msg: string | null) => void;
}

const AppStatusContext = createContext<AppStatusValue | undefined>(undefined);

export function AppStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window === "undefined" ? true : navigator.onLine
  );
  const [lastError, setLastErrorState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const setLastError = (msg: string | null) => {
    setLastErrorState(msg);
  };

  return (
    <AppStatusContext.Provider value={{ isOnline, lastError, setLastError }}>
      {children}
    </AppStatusContext.Provider>
  );
}

export function useAppStatus(): AppStatusValue {
  const ctx = useContext(AppStatusContext);
  if (!ctx) {
    throw new Error("useAppStatus must be used within a AppStatusProvider");
  }
  return ctx;
}

