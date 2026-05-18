"use client";

import { RouteFallback } from "@/components/ui/route-fallback";

export default function GlobalLoading() {
  return (
    <RouteFallback
      title="Loading your wellness space"
      description="Hold tight while we restore your session and personalize the experience." 
      actionLabel="Return to home"
      actionHref="/"
    />
  );
}
