import * as React from "react";
import { cn } from "@/lib/utils";

export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("glass rounded-2xl", className)}>
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";
