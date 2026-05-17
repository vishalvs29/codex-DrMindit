import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  id
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24", className)}>
      {children}
    </section>
  );
}
