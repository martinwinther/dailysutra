"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ScrollText,
  BookMarked,
  TrendingUp,
  Settings,
  LogIn,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/cn";
import { useAuth } from "../context/auth-context";
import { StreakCounter } from "./streak-counter";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sutras", label: "Sutras", icon: ScrollText },
  { href: "/glossary", label: "Glossary", icon: BookMarked },
];

const authenticatedLinks = [
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();
  const { user, signOut, authLoading } = useAuth();

  const links = user
    ? [...publicLinks, ...authenticatedLinks]
    : publicLinks;

  const isAuthActive = pathname === "/auth";

  return (
    <nav className="flex w-full items-center gap-2 sm:gap-4" aria-label="Main navigation">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative flex items-center gap-2 transition-all duration-200",
              "sm:px-3 sm:py-2 sm:rounded-lg",
              "hover:text-[hsl(var(--text))]",
              isActive && "text-[hsl(var(--text))]"
            )}
            aria-label={link.label}
          >
            {/* Mobile: icon in circle */}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                "backdrop-blur-sm transition-all duration-200",
                "border",
                "sm:hidden",
                isActive
                  ? "bg-white/12 border-white/25 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/15"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-white/70"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </span>
            {/* Desktop: icon + text label */}
            <span
              className={cn(
                "hidden items-center gap-2 text-sm transition-colors sm:flex",
                isActive
                  ? "text-[hsl(var(--text))] font-medium"
                  : "text-[hsl(var(--muted))]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--muted))]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {link.label}
            </span>
            {/* Active underline indicator */}
            {isActive && (
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5",
                  "hidden sm:block",
                  "bg-[hsl(var(--accent))]"
                )}
              />
            )}
          </Link>
        );
      })}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <StreakCounter />
        {user && (
          <button
            type="button"
            onClick={signOut}
            className={cn(
              "relative flex items-center gap-2 transition-all duration-200",
              "sm:px-3 sm:py-2 sm:rounded-lg",
              "btn-ghost sm:text-sm"
            )}
            disabled={authLoading}
            aria-label="Sign out"
          >
            {/* Mobile: icon in circle */}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                "backdrop-blur-sm transition-all duration-200",
                "border border-white/10",
                "bg-transparent hover:bg-white/5 hover:border-white/15",
                "sm:hidden",
                authLoading && "opacity-50"
              )}
            >
              <LogOut className="h-5 w-5 text-white/70" strokeWidth={2} />
            </span>
            {/* Desktop: icon + text label */}
            <span className="hidden items-center gap-2 text-sm sm:flex">
              <LogOut className="h-4 w-4 text-[hsl(var(--muted))]" strokeWidth={2} />
              Sign out
            </span>
          </button>
        )}
        {!user && (
          <Link
            href="/auth"
            className={cn(
              "relative flex items-center gap-2 transition-all duration-200",
              "sm:px-3 sm:py-2 sm:rounded-lg",
              "btn-ghost sm:text-sm",
              isAuthActive && "text-[hsl(var(--text))]"
            )}
            aria-label="Sign in"
          >
            {/* Mobile: icon in circle */}
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                "backdrop-blur-sm transition-all duration-200",
                "border",
                "sm:hidden",
                isAuthActive
                  ? "bg-white/12 border-white/25 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                  : "bg-transparent border-white/10 hover:bg-white/5 hover:border-white/15"
              )}
            >
              <LogIn
                className={cn(
                  "h-5 w-5 transition-colors",
                  isAuthActive ? "text-white" : "text-white/70"
                )}
                strokeWidth={isAuthActive ? 2.5 : 2}
              />
            </span>
            {/* Desktop: icon + text label */}
            <span
              className={cn(
                "hidden items-center gap-2 text-sm transition-colors sm:flex",
                isAuthActive
                  ? "text-[hsl(var(--text))] font-medium"
                  : "text-[hsl(var(--muted))]"
              )}
            >
              <LogIn
                className={cn(
                  "h-4 w-4 transition-colors",
                  isAuthActive
                    ? "text-[hsl(var(--accent))]"
                    : "text-[hsl(var(--muted))]"
                )}
                strokeWidth={isAuthActive ? 2.5 : 2}
              />
              Sign in
            </span>
            {/* Active underline indicator */}
            {isAuthActive && (
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5",
                  "hidden sm:block",
                  "bg-[hsl(var(--accent))]"
                )}
              />
            )}
          </Link>
        )}
      </div>
    </nav>
  );
}

