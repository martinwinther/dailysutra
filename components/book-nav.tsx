"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";

const books = [
  { id: "i", label: "Book I", href: "/sutras/i" },
  { id: "ii", label: "Book II", href: "/sutras/ii" },
  { id: "iii", label: "Book III", href: "/sutras/iii" },
  { id: "iv", label: "Book IV", href: "/sutras/iv" },
];

export function BookNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      {books.map((book) => {
        const isActive = pathname === book.href;
        return (
          <Link
            key={book.id}
            href={book.href}
            className={cn(
              "flex whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
              isActive
                ? "bg-white/7 text-[hsl(var(--text))] shadow-[0_2px_8px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                : "bg-white/5 text-[hsl(var(--muted))] hover:bg-white/6 hover:text-[hsl(var(--text))]"
            )}
          >
            {book.label}
          </Link>
        );
      })}
    </nav>
  );
}

