import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function OfflinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Offline mode"
        subtitle="You&apos;re currently offline. Some data may be out of date."
      />

      <GlassCard>
        <p className="text-sm text-[hsl(var(--muted))]">
          The shell of the app is still available, and any changes you make will
          be saved locally when possible. Once you&apos;re back online, the app
          will sync your journey with the server.
        </p>
        <p className="mt-3 text-xs text-[hsl(var(--muted))]">
          You can try navigating back to{" "}
          <Link href="/" className="underline">
            Home
          </Link>{" "}
          or other pages. If content doesn&apos;t load, please reconnect to the
          internet and refresh.
        </p>
      </GlassCard>
    </div>
  );
}

