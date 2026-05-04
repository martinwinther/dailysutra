import * as React from "react";
import { cn } from "../lib/cn";

type GlassCardVariant = "default" | "elevated" | "subtle";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
}

export function GlassCard({
  className,
  children,
  variant = "default",
  ...props
}: GlassCardProps) {
  // Softer, more minimal surface styles — avoid heavy nested cards
  const variantClasses =
    variant === "elevated"
      ? "rounded-xl p-5 bg-white/6 border border-[hsla(var(--border),0.12)] shadow-sm"
      : variant === "subtle"
      ? "rounded-lg p-3 bg-white/4 border border-[hsla(var(--border),0.06)]"
      : "rounded-xl p-4 bg-white/5 border border-[hsla(var(--border),0.08)]";

  return (
    <div
      className={cn(variantClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

