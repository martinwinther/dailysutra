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
  const variantClasses =
    variant === "elevated"
      ? "glass-card rounded-2xl p-6 shadow-[0_28px_72px_rgba(0,0,0,0.62)] backdrop-blur-[22px]"
      : variant === "subtle"
      ? "glass-card rounded-2xl p-6 shadow-[0_16px_36px_rgba(0,0,0,0.28)] backdrop-blur-[14px]"
      : "glass-card rounded-2xl p-6";

  return (
    <div
      className={cn(variantClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

