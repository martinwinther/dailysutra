"use client";

import Link from "next/link";

import { PageHeader } from "../../components/page-header";
import { GlassCard } from "../../components/glass-card";
import { useProgress } from "../../context/progress-context";
import {
  TOTAL_DAYS,
  TOTAL_WEEKS,
  getWeekForDay,
  getDayIndexInWeek,
} from "../../data/yogaProgram";
import { getDateForDayNumber } from "../../lib/progress-time";

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function JournalPage() {
  const { dayProgress, weekProgress, settings } = useProgress();

  // Daily notes: all days with a non-empty note, newest first
  const dailyEntries = [];
  for (let dayNumber = 1; dayNumber <= TOTAL_DAYS; dayNumber++) {
    const day = dayProgress[dayNumber];
    if (!day) continue;

    const trimmed = day.note.trim();
    if (!trimmed) continue;

    const week = getWeekForDay(dayNumber);
    const dayIndex = getDayIndexInWeek(dayNumber);
    if (!week || !dayIndex) continue;

    const date = getDateForDayNumber(settings, dayNumber);

    dailyEntries.push({
      dayNumber,
      weekNumber: week.week,
      dayIndex,
      dateLabel: formatDate(date),
      note: trimmed,
      didPractice: day.didPractice,
    });
  }

  dailyEntries.sort((a, b) => b.dayNumber - a.dayNumber);

  // Weekly reflections: weeks with reflection or explicit flags, newest first
  const weeklyEntries = [];
  for (let weekNumber = 1; weekNumber <= TOTAL_WEEKS; weekNumber++) {
    const weekState = weekProgress[weekNumber];
    if (!weekState) continue;

    const hasReflection = weekState.reflectionNote.trim().length > 0;
    const hasFlags =
      weekState.completed || weekState.enjoyed || weekState.bookmarked;

    if (!hasReflection && !hasFlags) continue;

    weeklyEntries.push({
      weekNumber,
      completed: weekState.completed,
      enjoyed: weekState.enjoyed,
      bookmarked: weekState.bookmarked,
      reflection: weekState.reflectionNote.trim(),
    });
  }

  weeklyEntries.sort((a, b) => b.weekNumber - a.weekNumber);

  const hasAnyJournal = dailyEntries.length > 0 || weeklyEntries.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal"
        subtitle="A simple log of your daily notes and weekly reflections across the 52 weeks."
      />

      {!hasAnyJournal && (
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <p className="text-sm text-[hsl(var(--muted))]">
              You haven&apos;t written anything yet. When you add daily notes on
              the day pages and fill out weekly reflections on Day 7, they will
              appear here.
            </p>
          </div>
        </GlassCard>
      )}

      {dailyEntries.length > 0 && (
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <h2 className="text-sm font-medium text-[hsl(var(--text))]">
              Daily notes
            </h2>
            <p className="mt-1 text-xs text-[hsl(var(--muted))]">
              Days where you wrote something about your practice or how the theme
              showed up in life. Newest first.
            </p>

            <div className="mt-4 space-y-3">
              {dailyEntries.map((entry) => (
                <Link
                  key={entry.dayNumber}
                  href={`/day/${entry.dayNumber}`}
                  className="block rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-3 text-left text-sm transition-colors hover:border-[hsla(var(--border),0.7)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium">
                        Week {entry.weekNumber} · Day {entry.dayIndex}
                      </span>
                      {entry.dateLabel && (
                        <span className="text-[11px] text-[hsl(var(--muted))]">
                          {entry.dateLabel}
                        </span>
                      )}
                    </div>
                    {entry.didPractice && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
                        Practiced
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-[hsl(var(--muted))]">
                    {entry.note}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {weeklyEntries.length > 0 && (
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <h2 className="text-sm font-medium text-[hsl(var(--text))]">
              Weekly reflections
            </h2>
            <p className="mt-1 text-xs text-[hsl(var(--muted))]">
              Notes and flags you&apos;ve added on the last day of each week.
            </p>

            <div className="mt-4 space-y-3">
              {weeklyEntries.map((week) => {
                const tags: string[] = [];
                if (week.completed) tags.push("Completed");
                if (week.enjoyed) tags.push("Enjoyed");
                if (week.bookmarked) tags.push("Bookmarked");

                const firstDayOfWeek = (week.weekNumber - 1) * 7 + 1;

                return (
                  <Link
                    key={week.weekNumber}
                    href={`/day/${firstDayOfWeek}`}
                    className="block rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-3 text-left text-sm transition-colors hover:border-[hsla(var(--border),0.7)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium">
                        Week {week.weekNumber}
                      </span>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-[hsl(var(--muted))]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {week.reflection && (
                      <p className="mt-2 line-clamp-3 text-sm text-[hsl(var(--muted))]">
                        {week.reflection}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

