"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/cn";
import { useAuth } from "../context/auth-context";

const publicLinks = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/sutras", label: "Sutras", emoji: "📿" },
  { href: "/glossary", label: "Glossary", emoji: "📖" },
];

const authenticatedLinks = [
  { href: "/progress", label: "Progress", emoji: "📊" },
  { href: "/journal", label: "Journal", emoji: "📝" },
  { href: "/settings", label: "Settings", emoji: "⚙️" },
];

export function MainNav() {
  const pathname = usePathname();
  const { user, signOut, authLoading } = useAuth();

  const links = user
    ? [...publicLinks, ...authenticatedLinks]
    : publicLinks;

  const isAuthActive = pathname === "/auth";

  return (
    <nav className="flex w-full items-center gap-2 sm:gap-4">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center justify-center transition-all duration-200",
              "sm:px-3 sm:py-2 sm:rounded-lg",
              "hover:text-[hsl(var(--text))]",
              isActive && "text-[hsl(var(--text))]"
            )}
            aria-label={link.label}
          >
            {/* Mobile: emoji in circle */}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg",
                "backdrop-blur-sm transition-all duration-200",
                "border",
                "sm:hidden",
                isActive
                  ? "bg-white/12 border-white/25 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
              )}
            >
              {link.emoji}
            </span>
            {/* Desktop: text label */}
            <span
              className={cn(
                "hidden text-sm transition-colors sm:block",
                isActive
                  ? "text-[hsl(var(--text))] font-medium"
                  : "text-[hsl(var(--muted))]"
              )}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {user && (
          <button
            type="button"
            onClick={signOut}
            className={cn(
              "flex items-center justify-center transition-all duration-200",
              "sm:px-3 sm:py-2 sm:rounded-lg",
              "btn-ghost sm:text-sm"
            )}
            disabled={authLoading}
            aria-label="Sign out"
          >
            {/* Mobile: emoji in circle */}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg",
                "backdrop-blur-sm transition-all duration-200",
                "border border-white/10",
                "bg-white/5 hover:bg-white/8 hover:border-white/15",
                "sm:hidden",
                authLoading && "opacity-50"
              )}
            >
              🚪
            </span>
            {/* Desktop: text label */}
            <span className="hidden text-[10px] sm:block">Sign out</span>
          </button>
        )}
        {!user && (
          <Link
            href="/auth"
            className={cn(
              "flex items-center justify-center transition-all duration-200",
              "sm:px-3 sm:py-2 sm:rounded-lg",
              "btn-ghost sm:text-sm",
              isAuthActive && "text-[hsl(var(--text))]"
            )}
            aria-label="Sign in"
          >
            {/* Mobile: emoji in circle */}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-lg",
                "backdrop-blur-sm transition-all duration-200",
                "border",
                "sm:hidden",
                isAuthActive
                  ? "bg-white/12 border-white/25 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
              )}
            >
              🔑
            </span>
            {/* Desktop: text label */}
            <span
              className={cn(
                "hidden text-[10px] transition-colors sm:block",
                isAuthActive
                  ? "text-[hsl(var(--text))] font-medium"
                  : "text-[hsl(var(--muted))]"
              )}
            >
              Sign in
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}

