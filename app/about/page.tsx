import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About Daily Sutra"
        subtitle="A structured, year-long journey through Patañjali&apos;s Yoga Sūtras."
      />

      <GlassCard>
        <div className="space-y-6 text-sm text-[hsl(var(--muted))]">
          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              What is Daily Sutra?
            </h2>
            <p>
              Daily Sutra is a web application that guides you through a structured 52-week journey 
              based on Patañjali&apos;s Yoga Sūtras. We take this dense, aphoristic text and turn it into 
              a practical, weekly training path that you can integrate into your daily life.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              How It Works
            </h2>
            <div className="space-y-3">
              <p>
                Each of the 52 weeks focuses on a specific theme from the Yoga Sūtras, including:
              </p>
              <ul className="space-y-2 list-disc list-inside ml-2">
                <li>A clear weekly theme (e.g., Ahimsa, Tapas, Dharana)</li>
                <li>Core Sūtra references from Patañjali&apos;s text</li>
                <li>A key philosophical idea explained simply</li>
                <li>Concrete practices you can experiment with in daily life</li>
              </ul>
              <p>
                Each day, you can mark whether you practiced and write a brief note about what you noticed. 
                At the end of each week, you review, reflect, and can bookmark weeks you want to revisit.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              Who It&apos;s For
            </h2>
            <p className="mb-3">
              Daily Sutra is designed for:
            </p>
            <ul className="space-y-2 list-disc list-inside ml-2">
              <li>Beginners to the Yoga Sūtras who want a structured entry point rooted in Patañjali</li>
              <li>Practitioners from other traditions (Stoicism, mindfulness, CBT) who want a yoga-specific path</li>
              <li>People with busy lives who benefit from small, well-defined practices and a clear sense of &quot;today&apos;s step&quot;</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              Free Trial &amp; Pricing
            </h2>
            <p>
              When you sign up, you get a 1-month free trial (4 weeks) to explore the structure and see 
              if it serves you. After the trial, you can still read your notes and see your journey, but 
              marking new practice and editing notes is locked until you upgrade with a one-time payment. 
              The exact price will be shown in the secure checkout. Once purchased, you have lifetime access 
              to all 52 weeks of content.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              Our Approach
            </h2>
            <p className="mb-3">
              The emphasis is on accuracy to the spirit of the Yoga Sūtras, gentle experimentation, and 
              a calm, contemplative experience. Practices are framed as experiments, not tests. The app 
              is designed to feel more like a contemplative journal than a productivity app.
            </p>
            <p>
              <strong className="text-[hsl(var(--text))]">Important:</strong> Daily Sutra is not a substitute 
              for professional medical, psychological, or therapeutic advice. If you have health concerns, 
              please consult a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[hsl(var(--text))] mb-3">
              Questions?
            </h2>
            <p>
              If you have questions, please{" "}
              <Link href="/contact" className="text-[hsl(var(--accent))] hover:underline">
                contact us
              </Link>
              . You can also read our{" "}
              <Link href="/terms" className="text-[hsl(var(--accent))] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[hsl(var(--accent))] hover:underline">
                Privacy Policy
              </Link>
              {" "}for more information.
            </p>
          </section>
        </div>
      </GlassCard>
    </div>
  );
}

