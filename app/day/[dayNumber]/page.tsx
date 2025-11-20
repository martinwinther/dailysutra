"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "../../../components/page-header";
import { GlassCard } from "../../../components/glass-card";
import {
  TOTAL_DAYS,
  getWeekForDay,
  getDayIndexInWeek,
} from "../../../data/yogaProgram";
import { useProgress } from "../../../context/progress-context";
import { useSubscription } from "../../../context/subscription-context";
import { getDateForDayNumber } from "../../../lib/progress-time";

interface DayPageProps {
  params: {
    dayNumber: string;
  };
}

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DayPage({ params }: DayPageProps) {
  const { dayProgress, weekProgress, settings, dispatch } = useProgress();
  const {
    canEditJourney,
    isExpired,
    isTrialActive,
    isActivePaid,
    daysLeft,
  } = useSubscription();

  const raw = Number(params.dayNumber);

  if (!Number.isFinite(raw) || raw < 1 || raw > TOTAL_DAYS) {
    return notFound();
  }

  const dayNumber = raw;
  const week = getWeekForDay(dayNumber);
  const dayIndex = getDayIndexInWeek(dayNumber);

  const hasPrev = dayNumber > 1;
  const hasNext = dayNumber < TOTAL_DAYS;
  const prevDay = hasPrev ? dayNumber - 1 : null;
  const nextDay = hasNext ? dayNumber + 1 : null;

  if (!week || !dayIndex) {
    return notFound();
  }

  const dayState = dayProgress[dayNumber];
  const weekState = weekProgress[week.week];

  const didPractice = dayState?.didPractice ?? false;
  const note = dayState?.note ?? "";
  const reflectionNote = weekState?.reflectionNote ?? "";
  const weekCompleted = weekState?.completed ?? false;
  const weekBookmarked = weekState?.bookmarked ?? false;
  const weekEnjoyed = weekState?.enjoyed ?? false;

  const dateForDay = getDateForDayNumber(settings, dayNumber);
  const dateLabel = formatDate(dateForDay);

  const handleTogglePractice = () => {
    if (!canEditJourney) return;
    dispatch({ type: "TOGGLE_DAY_PRACTICE", dayNumber });
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!canEditJourney) return;
    dispatch({ type: "UPDATE_DAY_NOTE", dayNumber, note: event.target.value });
  };

  const handleToggleWeekCompleted = () => {
    if (!canEditJourney) return;
    dispatch({ type: "TOGGLE_WEEK_COMPLETED", week: week.week });
  };

  const handleToggleWeekEnjoyed = () => {
    if (!canEditJourney) return;
    dispatch({ type: "TOGGLE_WEEK_ENJOYED", week: week.week });
  };

  const handleToggleWeekBookmarked = () => {
    if (!canEditJourney) return;
    dispatch({ type: "TOGGLE_WEEK_BOOKMARKED", week: week.week });
  };

  const handleReflectionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!canEditJourney) return;
    dispatch({
      type: "UPDATE_WEEK_REFLECTION",
      week: week.week,
      note: event.target.value,
    });
  };

  const isLastDayOfWeek = dayIndex === 7;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Week ${week.week} · Day ${dayIndex}`}
        subtitle={week.theme}
      />

      {isTrialActive && daysLeft !== null && daysLeft <= 7 && (
        <GlassCard>
          <p className="text-sm font-medium text-[hsl(var(--text))]">
            Your free month is ending soon
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--muted))]">
            About {daysLeft} day{daysLeft === 1 ? "" : "s"} left in your free
            trial. In the future, this is where an upgrade option will appear.
          </p>
        </GlassCard>
      )}

      {isExpired && (
        <GlassCard>
          <p className="text-sm font-medium text-[hsl(var(--text))]">
            Your free month has ended
          </p>
          <p className="mt-1 text-xs text-[hsl(var(--muted))]">
            You can still read your past notes and see your journey, but marking
            new practice and editing notes is now locked. In the future, this is
            where an upgrade option will appear.
          </p>
        </GlassCard>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {hasPrev ? (
            <Link href={`/day/${prevDay}`} className="btn-ghost">
              ← Previous day
            </Link>
          ) : (
            <button
              className="btn-ghost opacity-40 cursor-not-allowed"
              disabled
              aria-disabled="true"
            >
              ← Previous day
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {hasNext ? (
            <Link href={`/day/${nextDay}`} className="btn-ghost">
              Next day →
            </Link>
          ) : (
            <button
              className="btn-ghost opacity-40 cursor-not-allowed"
              disabled
              aria-disabled="true"
            >
              Next day →
            </button>
          )}
        </div>
      </div>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
                Core Sūtras
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--muted))]">
                {week.coreSutras}
              </p>
            </div>
            {dateLabel ? (
              <div className="flex flex-col items-start text-right sm:items-end">
                <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
                  Date
                </p>
                <p className="mt-1 text-sm text-[hsl(var(--muted))]">
                  {dateLabel}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
              Key idea
            </p>
            <p className="mt-1 text-sm text-[hsl(var(--muted))]">
              {week.keyIdea}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--muted))]">
              Weekly practice
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--muted))]">
              {week.weeklyPractice}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--text))]">
                Did today&apos;s practice?
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                Check this when you&apos;ve engaged with today&apos;s practice in
                a way that feels honest, not perfect.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTogglePractice}
              className={
                canEditJourney
                  ? didPractice
                    ? "btn-primary"
                    : "btn-ghost border border-[hsla(var(--border),0.7)]"
                  : "btn-ghost opacity-40 cursor-not-allowed border border-[hsla(var(--border),0.4)]"
              }
              disabled={!canEditJourney}
            >
              {canEditJourney
                ? didPractice
                  ? "Marked as done"
                  : "Mark as done"
                : "Editing locked"}
            </button>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-[hsl(var(--text))]">
              Today&apos;s note
            </p>
            <p className="text-xs text-[hsl(var(--muted))]">
              Jot down what you noticed in practice, any resistance, or a single
              sentence about how the day related to this week&apos;s theme.
            </p>
            <textarea
              value={note}
              onChange={handleNoteChange}
              rows={5}
              className="mt-2 w-full rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7 disabled:opacity-40 disabled:cursor-not-allowed"
              placeholder={
                canEditJourney
                  ? "For example: I noticed how often my mind jumped to planning today. Pausing to observe it made things feel a bit slower."
                  : "Editing locked – your trial has ended. You can still read past notes."
              }
              disabled={!canEditJourney}
            />
          </div>
        </div>
      </GlassCard>

      {isLastDayOfWeek && (
        <GlassCard>
          <div className="-mx-6 rounded-lg bg-white/6 px-6 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--text))]">
                  Weekly review
                </p>
                <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                  On the last day of the week, take a moment to reflect on how
                  this theme played out in your life, and whether you&apos;d like
                  to revisit it after the 52 weeks.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-[hsl(var(--muted))]">
                  <input
                    type="checkbox"
                    checked={weekCompleted}
                    onChange={handleToggleWeekCompleted}
                    disabled={!canEditJourney}
                    className="h-4 w-4 rounded border border-[hsla(var(--border),0.4)] bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span>Mark this week as completed</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-[hsl(var(--muted))]">
                  <input
                    type="checkbox"
                    checked={weekEnjoyed}
                    onChange={handleToggleWeekEnjoyed}
                    disabled={!canEditJourney}
                    className="h-4 w-4 rounded border border-[hsla(var(--border),0.4)] bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span>I enjoyed this week</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-[hsl(var(--muted))]">
                  <input
                    type="checkbox"
                    checked={weekBookmarked}
                    onChange={handleToggleWeekBookmarked}
                    disabled={!canEditJourney}
                    className="h-4 w-4 rounded border border-[hsla(var(--border),0.4)] bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span>I want to bookmark this week to revisit later</span>
                </label>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <p className="text-sm font-medium text-[hsl(var(--text))]">
                  Weekly reflection
                </p>
                <p className="text-xs text-[hsl(var(--muted))]">
                  A few lines about what shifted (or didn&apos;t) for you this
                  week is enough.
                </p>
                <textarea
                  value={reflectionNote}
                  onChange={handleReflectionChange}
                  rows={4}
                  disabled={!canEditJourney}
                  className="mt-1 w-full rounded-xl border border-[hsla(var(--border),0.4)] bg-white/5 px-3 py-2 text-sm text-[hsl(var(--text))] outline-none focus:border-[hsl(var(--accent))] focus:bg-white/7 disabled:opacity-40 disabled:cursor-not-allowed"
                  placeholder={
                    canEditJourney
                      ? "What did you notice about this week&apos;s theme in your day-to-day life?"
                      : "Editing locked – your trial has ended. You can still read past notes."
                  }
                />
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

