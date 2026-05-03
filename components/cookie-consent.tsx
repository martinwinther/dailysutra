"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "./glass-card";

const COOKIE_NOTICE_KEY = "dailysutra-cookie-notice-dismissed";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const dismissed = window.localStorage.getItem(COOKIE_NOTICE_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(COOKIE_NOTICE_KEY, "true");
      window.localStorage.setItem(`${COOKIE_NOTICE_KEY}-date`, new Date().toISOString());
    } catch {
      // Ignore storage failures; the banner will simply reappear later.
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="mx-auto max-w-5xl">
        <GlassCard variant="elevated" className="border border-[hsla(var(--border),0.3)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <h3
                id="cookie-consent-title"
                className="text-sm font-semibold text-[hsl(var(--text))]"
              >
                Essential Cookies &amp; Storage
              </h3>
              <p
                id="cookie-consent-description"
                className="text-xs text-[hsl(var(--muted))]"
              >
                We use <strong className="text-[hsl(var(--text))]">localStorage</strong> to save
                your journey progress locally and <strong className="text-[hsl(var(--text))]">Firebase cookies</strong> for
                secure authentication. These are essential for the app to function and do not require consent.{" "}
                <Link
                  href="/privacy"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  Learn more in our Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleDismiss}
                className="btn-primary whitespace-nowrap text-xs px-4 py-2"
                aria-label="Dismiss cookie notice"
              >
                Got it
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

