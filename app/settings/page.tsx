"use client";

import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import {
  useProgress,
  ProgressState,
  PROGRESS_STORAGE_KEY,
} from "../../context/progress-context";
import { useSubscription } from "../../context/subscription-context";
import { useAuth } from "../../context/auth-context";

export default function SettingsPage() {
  const { settings, dispatch } = useProgress();
  const {
    status,
    isTrialActive,
    isActivePaid,
    isExpired,
  } = useSubscription();
  const { user, authLoading } = useAuth();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || null;
    dispatch({ type: "SET_START_DATE", date: value });
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will clear all progress and notes. Are you sure you want to reset your journey?"
    );
    if (!confirmed) return;

    dispatch({ type: "RESET_ALL" });
  };

  const handleExport = () => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      let exportState: ProgressState | null = null;

      if (raw) {
        const parsed = JSON.parse(raw) as ProgressState | null;
        if (parsed && typeof parsed === "object") {
          exportState = parsed;
        }
      }

      // If nothing in storage yet, still export a minimal empty state
      if (!exportState) {
        exportState = {
          dayProgress: {},
          weekProgress: {},
          settings,
        };
      }

      const blob = new Blob([JSON.stringify(exportState, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `raja-yoga-progress-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[Settings] Failed to export progress:", error);
      window.alert("Sorry, something went wrong while exporting your data.");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        if (typeof text !== "string") {
          throw new Error("Unexpected file content");
        }

        const parsed = JSON.parse(text) as ProgressState;

        // Basic structural sanity check
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !("dayProgress" in parsed) ||
          !("weekProgress" in parsed) ||
          !("settings" in parsed)
        ) {
          throw new Error(
            "File does not look like a Raja Yoga progress backup."
          );
        }

        const confirmed = window.confirm(
          "Importing will replace your current progress with the data from this file. Continue?"
        );
        if (!confirmed) return;

        dispatch({ type: "HYDRATE_FROM_STORAGE", payload: parsed });

        // localStorage persistence effect in ProgressProvider will run automatically
        window.alert("Import completed. Your journey state has been updated.");
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[Settings] Failed to import progress:", error);
        window.alert(
          "Sorry, this file could not be imported. Make sure it is an unmodified backup from this app."
        );
      } finally {
        // reset file input so the same file can be selected again if needed
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleUpgradeClick = async () => {
    if (!user || !user.email) {
      setUpgradeError("You need to be signed in with an email to upgrade.");
      return;
    }

    setUpgradeLoading(true);
    setUpgradeError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start checkout.");
      }

      const data = (await res.json()) as { url?: string };
      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }

      window.location.href = data.url;
    } catch (error: any) {
      console.warn("[Settings] Upgrade error:", error);
      setUpgradeError(
        error?.message || "Something went wrong when starting checkout."
      );
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Adjust your start date, or reset your journey if you want to begin again."
      />

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Start date
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            The start date determines which week and day you are on today. You
            can change it if you want to restart or sync the journey to a
            different calendar date.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-col text-sm text-[hsl(var(--muted))]">
              <span className="mb-1">Journey start date</span>
              <input
                type="date"
                value={settings.startDate ?? ""}
                onChange={handleDateChange}
                className="rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7"
              />
            </label>
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Reset journey
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            This will clear all recorded practice check-ins and notes, and remove
            your start date. You can&apos;t undo this action.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 btn-primary"
          >
            Reset all progress
          </button>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Subscription
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            Your free trial includes the first 4 weeks of content. Upgrade to
            access all 52 weeks of the program.
          </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-white/5 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-[hsl(var(--muted))]">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-[hsl(var(--text))]">
              {isActivePaid && "Pro (paid)"}
              {isTrialActive && "Free trial"}
              {isExpired && "Upgrade required"}
              {!isActivePaid && !isTrialActive && !isExpired && "Free"}
            </p>
            {isTrialActive && (
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                Access to weeks 1-4 (28 days)
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-[hsl(var(--muted))]">
            <p>
              With a free trial, you can access and edit content for the first 4
              weeks. Weeks 5-52 require a paid subscription.
            </p>
            <p>
              Upgrade to unlock full access to all 52 weeks of content.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={handleUpgradeClick}
            disabled={upgradeLoading || authLoading || isActivePaid}
          >
            {isActivePaid
              ? "You're on Pro"
              : upgradeLoading
              ? "Starting checkout…"
              : "Upgrade to full access"}
          </button>
          {upgradeError && (
            <p className="text-[10px] text-red-300">{upgradeError}</p>
          )}
          {!isActivePaid && !upgradeError && (
            <span className="text-[10px] text-[hsl(var(--muted))]">
              You&apos;ll be redirected to a secure Stripe checkout page.
            </span>
          )}
        </div>
        </div>
      </GlassCard>

      <div className="flex items-center justify-between px-6">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
          Backup &amp; restore
        </h2>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <p className="text-sm text-[hsl(var(--muted))]">
            You can export your current journey to a JSON file and later import it
            on this or another device. This is useful if you uninstall the app,
            switch browsers, or want a manual backup.
          </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleExport} className="btn-primary">
            Export progress as JSON
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[hsl(var(--muted))]">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-medium">
              Import backup
            </span>
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
          <p className="mt-2 text-[10px] text-[hsl(var(--muted))]">
            Imported files completely replace your current progress. Only use
            backups that were exported from this app.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

