"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { createLogger } from "../lib/logger";
import { PageHeader } from "./page-header";
import { GlassCard } from "./glass-card";
import Link from "next/link";

const logger = createLogger("ErrorBoundary");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches React errors and logs them to Firebase Crashlytics
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error using our logger
    logger.error("Error caught by boundary", error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="space-y-6">
          <PageHeader
            title="Something went wrong"
            subtitle="We're sorry, but something unexpected happened."
          />

          <GlassCard variant="elevated">
            <div className="space-y-4">
              <p className="text-sm text-[hsl(var(--muted))]">
                An error occurred while loading this page. The error has been logged and we&apos;ll look into it.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="callout callout-danger">
                  <p className="break-all text-xs font-mono text-[hsl(var(--danger))]">
                    {this.state.error.toString()}
                  </p>
                  {this.state.error.stack && (
                    <pre className="mt-2 whitespace-pre-wrap break-all text-[10px] text-[hsl(var(--muted))]">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Reload page
                </button>
                <Link href="/" className="btn-ghost text-xs">
                  Go to home
                </Link>
                <Link href="/contact" className="btn-ghost text-xs">
                  Contact support
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

