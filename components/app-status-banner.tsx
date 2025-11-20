"use client";

import { useAppStatus } from "../context/app-status-context";

export function AppStatusBanner() {
  const { isOnline, lastError } = useAppStatus();

  if (isOnline && !lastError) return null;

  return (
    <div className="bg-amber-600/80 text-[11px] text-white text-center py-1">
      {!isOnline ? (
        <>
          You appear to be offline. Changes will be saved locally and synced when
          you&apos;re back online.
        </>
      ) : lastError ? (
        lastError
      ) : null}
    </div>
  );
}

