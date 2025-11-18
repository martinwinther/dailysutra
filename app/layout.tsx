import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "52 Weeks of Raja Yoga",
  description: "A one-year structured practice journey based on Patañjali's Yoga Sūtras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen flex-col">
          <nav className="border-b border-slate-800">
            <div className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
              <Link
                href="/"
                className="text-lg font-semibold text-slate-100 hover:text-slate-200"
              >
                52 Weeks of Raja Yoga
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-slate-200"
                >
                  Home
                </Link>
                <Link
                  href="/progress"
                  className="text-sm text-slate-400 hover:text-slate-200"
                >
                  Progress
                </Link>
                <Link
                  href="/journal"
                  className="text-sm text-slate-400 hover:text-slate-200"
                >
                  Journal
                </Link>
                <Link
                  href="/settings"
                  className="text-sm text-slate-400 hover:text-slate-200"
                >
                  Settings
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}

