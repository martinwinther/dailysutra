"use client";

import Link from "next/link";
import { PageHeader } from "../../../components/page-header";
import { GlassCard } from "../../../components/glass-card";

export default function CheckoutCancelPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment cancelled"
        subtitle="Your payment was not completed. No charges were made."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="space-y-4">
            <p className="text-sm text-[hsl(var(--muted))]">
              Your checkout session was cancelled. No payment was processed and your account remains unchanged.
            </p>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[hsl(var(--text))]">
                What you can do:
              </p>
              <ul className="space-y-1.5 text-xs text-[hsl(var(--muted))] list-disc list-inside">
                <li>Try again from your settings page</li>
                <li>Check your payment method details</li>
                <li>Contact support if you experienced any issues</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/settings" className="btn-primary">
                Try again
              </Link>
              <Link href="/contact" className="btn-ghost text-xs">
                Contact Support
              </Link>
            </div>

            <div className="pt-2 border-t border-[hsla(var(--border),0.2)]">
              <p className="text-xs text-[hsl(var(--muted))]">
                If you&apos;re experiencing payment issues, please contact us at{" "}
                <a
                  href="mailto:support@dailysutra.app"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  support@dailysutra.app
                </a>{" "}
                or use our{" "}
                <Link
                  href="/contact"
                  className="text-[hsl(var(--accent))] hover:underline"
                >
                  contact form
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

