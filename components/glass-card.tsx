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
  const baseClass =
    variant === "subtle"
      ? "surface-subtle"
      : "glass-card";
  const variantClasses =
    variant === "elevated"
      ? "rounded-xl p-5"
      : variant === "subtle"
      ? "rounded-lg p-3"
      : "rounded-xl p-4";

  return (
    <div
      className={cn(baseClass, variantClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

