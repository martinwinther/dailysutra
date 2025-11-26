"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../lib/cn";
import { useAuth } from "../context/auth-context";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/sutras", label: "Sutras" },
  { href: "/glossary", label: "Glossary" },
];

const authenticatedLinks = [
  { href: "/progress", label: "Progress" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Settings" },
];

export function MainNav() {
  const pathname = usePathname();
  const { user, signOut, authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = user
    ? [...publicLinks, ...authenticatedLinks]
    : publicLinks;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex flex-col gap-1.5 p-2 sm:hidden"
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span
          className={cn(
            "h-0.5 w-5 bg-[hsl(var(--text))] opacity-100 transition-all duration-300",
            mobileMenuOpen && "translate-y-2 rotate-45"
          )}
        />
        <span
          className={cn(
            "h-0.5 w-5 bg-[hsl(var(--text))] transition-opacity duration-300",
            mobileMenuOpen ? "opacity-0" : "opacity-100"
          )}
        />
        <span
          className={cn(
            "h-0.5 w-5 bg-[hsl(var(--text))] opacity-100 transition-all duration-300",
            mobileMenuOpen && "-translate-y-2 -rotate-45"
          )}
        />
      </button>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <nav
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out sm:relative sm:z-auto sm:h-auto sm:w-auto sm:transform-none sm:bg-transparent sm:shadow-none",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0",
          "flex flex-col gap-4 p-6 text-sm text-[hsl(var(--muted))] sm:flex-row sm:items-center sm:p-0",
          // Glass morphism styling for mobile menu
          "bg-gradient-to-br from-[hsla(var(--surface),0.92)] to-[hsla(var(--surface-soft),0.88)]",
          "border-r border-[hsla(var(--border),0.35)]",
          "backdrop-blur-[18px] backdrop-saturate-[150%]",
          "shadow-[0_0_0_1px_hsla(var(--surface-soft),0.35),0_22px_60px_rgba(0,0,0,0.55)]"
        )}
      >
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "transition-colors hover:text-[hsl(var(--text))]",
                isActive && "text-[hsl(var(--text))] font-medium"
              )}
            >
              {link.label}
            </Link>
          );
        })}
        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-4 sm:mt-0 sm:flex-row sm:border-0 sm:pt-0">
          {user && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                signOut();
              }}
              className="btn-ghost text-left text-[10px] sm:text-right"
              disabled={authLoading}
            >
              Sign out
            </button>
          )}
          {!user && (
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-ghost text-[10px]"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

