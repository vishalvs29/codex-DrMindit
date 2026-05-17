"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4">
      <GlassCard className="max-w-lg p-6 text-center">
        <h2 className="text-2xl font-semibold">Something needs a reset.</h2>
        <p className="mt-3 text-sm text-slate-400">{error.message || "The app could not load this view."}</p>
        <Button className="mt-6" onClick={reset}>Try again</Button>
      </GlassCard>
    </main>
  );
}
