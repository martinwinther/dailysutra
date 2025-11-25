import Link from "next/link";
import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";

const books = [
  { id: "i", label: "Book I", href: "/sutras/i", description: "Samadhi Pada - The chapter on concentration" },
  { id: "ii", label: "Book II", href: "/sutras/ii", description: "Sadhana Pada - The chapter on practice" },
  { id: "iii", label: "Book III", href: "/sutras/iii", description: "Vibhuti Pada - The chapter on powers" },
  { id: "iv", label: "Book IV", href: "/sutras/iv", description: "Kaivalya Pada - The chapter on liberation" },
];

export default function SutrasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="The Yoga Sūtras"
        subtitle="Read through all four books of Patañjali&apos;s Yoga Sūtras with commentary. Click on any sutra to expand its commentary."
      />

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm">
          <p className="text-sm text-[hsl(var(--text))]">
            This is a community translation and commentary. We strongly recommend also reading a scholarly source, such as:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
            <li>
              <em>Yoga Sūtras of Patañjali: A New Edition</em> by Edwin F. Bryant
            </li>
            <li>
              <em>The Yoga Sūtras of Patañjali</em> by Sri Swami Satchidananda
            </li>
          </ul>
        </div>
      </GlassCard>

      <div className="grid gap-6 sm:grid-cols-2">
        {books.map((book) => (
          <GlassCard key={book.id}>
            <Link href={book.href} className="block">
              <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
                <h2 className="text-sm font-semibold text-[hsl(var(--text))]">
                  {book.label}
                </h2>
                <p className="mt-2 text-xs text-[hsl(var(--muted))]">
                  {book.description}
                </p>
              </div>
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

