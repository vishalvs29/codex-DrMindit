import * as React from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-2xl", className)}>{children}</div>;
}
