import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyanGlow disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-r from-blue-500 via-cyan-400 to-iris text-white shadow-glow hover:scale-[1.02]",
        variant === "secondary" &&
          "glass text-slate-100 hover:border-cyanGlow/50 hover:bg-slate-900/100",
        variant === "ghost" && "text-slate-300 hover:bg-white/10 hover:text-white",
        variant === "danger" && "bg-gradient-to-r from-roseGlow to-red-500 text-white shadow-[0_0_40px_rgba(255,88,118,.24)]",
        size === "sm" && "h-10 px-4 text-sm",
        size === "md" && "h-12 px-5 text-sm",
        size === "lg" && "h-14 px-6 text-base",
        size === "icon" && "h-11 w-11 px-0",
        className
      )}
      {...props}
    />
  );
}
