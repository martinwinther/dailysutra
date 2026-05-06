import Link from "next/link";
import { PageHeader } from "../components/page-header";
import { GlassCard } from "../components/glass-card";

export default function NotFound() {
  return (
    <div className="page-stack">
      <PageHeader
        title="Page Not Found"
        subtitle="The page you&apos;re looking for doesn&apos;t exist."
      />

      <GlassCard>
        <div className="card-section">
          <p className="text-sm text-[hsl(var(--muted))]">
            The page you tried to access could not be found. It may have been moved, deleted, or the URL might be incorrect.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Go to Home
            </Link>
            <Link href="/sutras" className="btn-ghost">
              Browse Sutras
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

