"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { doc, getDoc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase/client";
import { useAuth } from "./auth-context";
import { useAppStatus } from "./app-status-context";

export type SubscriptionStatus = "none" | "trial" | "active" | "expired";

interface SubscriptionContextValue {
  status: SubscriptionStatus;
  trialEndsAt: Date | null;
  daysLeft: number | null;
  isTrialActive: boolean;
  isActivePaid: boolean;
  isExpired: boolean;
  canEditJourney: boolean;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { setLastError } = useAppStatus();
  const [status, setStatus] = useState<SubscriptionStatus>("none");
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [subLoading, setSubLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setStatus("none");
      setTrialEndsAt(null);
      setSubLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    let unsub: (() => void) | null = null;

    const init = async () => {
      setSubLoading(true);

      // First check if the doc exists; if not, create a trial doc
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 30 * MS_PER_DAY);

        await setDoc(userRef, {
          subscriptionStatus: "trial",
          trialStartedAt: Timestamp.fromDate(now),
          trialEndsAt: Timestamp.fromDate(trialEnd),
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now),
        });
      }

      // Subscribe to updates
      unsub = onSnapshot(
        userRef,
        (docSnap) => {
          if (!docSnap.exists()) {
            setStatus("none");
            setTrialEndsAt(null);
            setSubLoading(false);
            return;
          }

          const data = docSnap.data() as {
            subscriptionStatus?: SubscriptionStatus;
            trialEndsAt?: Timestamp;
          };

          const rawStatus = data.subscriptionStatus ?? "none";
          const endsTs = data.trialEndsAt ?? null;
          const endsDate = endsTs ? endsTs.toDate() : null;

          // compute derived flags
          const nowMs = Date.now();
          const endsMs = endsDate ? endsDate.getTime() : 0;
          const remainingMs = endsDate ? endsMs - nowMs : 0;

          const trialStillValid =
            rawStatus === "trial" && endsDate !== null && remainingMs > 0;

          const normalizedStatus: SubscriptionStatus = trialStillValid
            ? "trial"
            : rawStatus === "active"
            ? "active"
            : rawStatus === "trial" && !trialStillValid
            ? "expired"
            : rawStatus;

          setStatus(normalizedStatus);
          setTrialEndsAt(endsDate);
          setSubLoading(false);
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.warn("[Subscription] onSnapshot error:", error);
          setLastError("Failed to sync with server. Working from local copy.");
          setStatus("none");
          setTrialEndsAt(null);
          setSubLoading(false);
        }
      );
    };

    init();

    return () => {
      if (unsub) unsub();
    };
  }, [authLoading, user?.uid, setLastError]);

  const nowMs = Date.now();
  const endsMs = trialEndsAt ? trialEndsAt.getTime() : 0;
  const daysLeft =
    trialEndsAt && endsMs > nowMs
      ? Math.max(0, Math.ceil((endsMs - nowMs) / MS_PER_DAY))
      : null;

  const isActivePaid = status === "active";
  const isTrialActive = status === "trial" && !!trialEndsAt && endsMs > nowMs;
  const isExpired = status === "expired" || (!isActivePaid && !isTrialActive);
  const canEditJourney = isActivePaid || isTrialActive;

  const value: SubscriptionContextValue = {
    status,
    trialEndsAt,
    daysLeft,
    isTrialActive,
    isActivePaid,
    isExpired,
    canEditJourney,
    loading: subLoading || authLoading,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
}

