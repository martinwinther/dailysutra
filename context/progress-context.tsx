"use client";

import * as React from "react";
import { DayProgress, WeekProgress, AppSettings } from "../types/app";
import { TOTAL_DAYS, TOTAL_WEEKS } from "../data/yogaProgram";
import { db } from "../lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./auth-context";
import { useAppStatus } from "./app-status-context";

export interface ProgressState {
  dayProgress: Record<number, DayProgress>;
  weekProgress: Record<number, WeekProgress>;
  settings: AppSettings;
}

type ProgressAction =
  | { type: "TOGGLE_DAY_PRACTICE"; dayNumber: number }
  | { type: "UPDATE_DAY_NOTE"; dayNumber: number; note: string }
  | { type: "TOGGLE_WEEK_COMPLETED"; week: number }
  | { type: "TOGGLE_WEEK_ENJOYED"; week: number }
  | { type: "TOGGLE_WEEK_BOOKMARKED"; week: number }
  | { type: "UPDATE_WEEK_REFLECTION"; week: number; note: string }
  | { type: "SET_START_DATE"; date: string | null }
  | { type: "RESET_ALL" }
  | { type: "HYDRATE_FROM_STORAGE"; payload: ProgressState };

interface ProgressContextValue extends ProgressState {
  dispatch: React.Dispatch<ProgressAction>;
}

const ProgressContext = React.createContext<ProgressContextValue | null>(null);

export const PROGRESS_STORAGE_KEY = "raja-yoga-progress-v1";

const initialState: ProgressState = {
  dayProgress: {},
  weekProgress: {},
  settings: {
    startDate: null,
  },
};

function ensureValidDayNumber(dayNumber: number): number {
  if (dayNumber < 1) return 1;
  if (dayNumber > TOTAL_DAYS) return TOTAL_DAYS;
  return dayNumber;
}

function ensureValidWeek(week: number): number {
  if (week < 1) return 1;
  if (week > TOTAL_WEEKS) return TOTAL_WEEKS;
  return week;
}

function progressReducer(
  state: ProgressState,
  action: ProgressAction
): ProgressState {
  switch (action.type) {
    case "HYDRATE_FROM_STORAGE":
      return action.payload;

    case "TOGGLE_DAY_PRACTICE": {
      const dayNumber = ensureValidDayNumber(action.dayNumber);
      const current = state.dayProgress[dayNumber];
      const didPractice = !current?.didPractice;

      return {
        ...state,
        dayProgress: {
          ...state.dayProgress,
          [dayNumber]: {
            dayNumber,
            didPractice,
            note: current?.note ?? "",
          },
        },
      };
    }

    case "UPDATE_DAY_NOTE": {
      const dayNumber = ensureValidDayNumber(action.dayNumber);
      const current = state.dayProgress[dayNumber];

      return {
        ...state,
        dayProgress: {
          ...state.dayProgress,
          [dayNumber]: {
            dayNumber,
            didPractice: current?.didPractice ?? false,
            note: action.note,
          },
        },
      };
    }

    case "TOGGLE_WEEK_COMPLETED": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: !current?.completed,
            enjoyed: current?.enjoyed ?? false,
            bookmarked: current?.bookmarked ?? false,
            reflectionNote: current?.reflectionNote ?? "",
          },
        },
      };
    }

    case "TOGGLE_WEEK_ENJOYED": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];
      const enjoyed = !current?.enjoyed;

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: current?.completed ?? false,
            enjoyed,
            bookmarked: current?.bookmarked ?? enjoyed, // if enjoyed, auto-bookmark
            reflectionNote: current?.reflectionNote ?? "",
          },
        },
      };
    }

    case "TOGGLE_WEEK_BOOKMARKED": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];
      const bookmarked = !current?.bookmarked;

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: current?.completed ?? false,
            enjoyed: current?.enjoyed ?? false,
            bookmarked,
            reflectionNote: current?.reflectionNote ?? "",
          },
        },
      };
    }

    case "UPDATE_WEEK_REFLECTION": {
      const week = ensureValidWeek(action.week);
      const current = state.weekProgress[week];

      return {
        ...state,
        weekProgress: {
          ...state.weekProgress,
          [week]: {
            week,
            completed: current?.completed ?? false,
            enjoyed: current?.enjoyed ?? false,
            bookmarked: current?.bookmarked ?? false,
            reflectionNote: action.note,
          },
        },
      };
    }

    case "SET_START_DATE": {
      return {
        ...state,
        settings: {
          ...state.settings,
          startDate: action.date,
        },
      };
    }

    case "RESET_ALL":
      return initialState;

    default:
      return state;
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(progressReducer, initialState);
  const { user, loading: authLoading } = useAuth();
  const { setLastError } = useAppStatus();

  // Hydrate from localStorage once on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as ProgressState;

      // Basic defensive check
      if (parsed && typeof parsed === "object") {
        dispatch({ type: "HYDRATE_FROM_STORAGE", payload: parsed });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        "[ProgressProvider] Failed to parse localStorage state.",
        error
      );
    }
  }, []);

  // Persist to localStorage when state changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const serialized = JSON.stringify(state);
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, serialized);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        "[ProgressProvider] Failed to write localStorage state.",
        error
      );
    }
  }, [state]);

  // Firestore hydration once we know auth state
  React.useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const run = async () => {
      try {
        const journeyRef = doc(
          db,
          "users",
          user.uid,
          "journeys",
          "raja-yoga-v1"
        );
        const snap = await getDoc(journeyRef);
        if (snap.exists()) {
          const data = snap.data() as Partial<ProgressState>;
          if (data && data.dayProgress && data.weekProgress && data.settings) {
            dispatch({
              type: "HYDRATE_FROM_STORAGE",
              payload: {
                dayProgress: data.dayProgress,
                weekProgress: data.weekProgress,
                settings: data.settings,
              },
            });
          }
        } else {
          // Initialize journey doc from current local state
          await setDoc(journeyRef, {
            ...state,
            programKey: "raja-yoga-v1",
            programVersion: "1",
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[Progress] Failed to hydrate from Firestore:", error);
        setLastError("Failed to sync with server. Working from local copy.");
      }
    };

    run();
    // we only want to run on first auth resolution or when user changes,
    // not on every state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.uid, setLastError]);

  // Firestore persistence on state changes
  React.useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const journeyRef = doc(db, "users", user.uid, "journeys", "raja-yoga-v1");

    const run = async () => {
      try {
        await setDoc(
          journeyRef,
          {
            dayProgress: state.dayProgress,
            weekProgress: state.weekProgress,
            settings: state.settings,
            programKey: "raja-yoga-v1",
            programVersion: "1",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[Progress] Failed to persist to Firestore:", error);
        setLastError("Failed to sync with server. Working from local copy.");
      }
    };

    run();
  }, [
    authLoading,
    user?.uid,
    state.dayProgress,
    state.weekProgress,
    state.settings,
    setLastError,
  ]);

  const value: ProgressContextValue = React.useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = React.useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return ctx;
}

