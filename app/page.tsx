export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="glass-card rounded-2xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          52 Weeks of Raja Yoga
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">
          A calm, structured one-year journey through Raja Yoga, based on
          Patañjali&apos;s Yoga Sūtras. We&apos;ll build the weekly journey
          overview here in later steps.
        </p>
      </section>
      <section className="glass-card rounded-2xl p-6">
        <p className="text-sm text-[hsl(var(--muted))]">
          Use the navigation above to explore the upcoming pages: Progress,
          Journal, and Settings.
        </p>
      </section>
    </div>
  );
}

