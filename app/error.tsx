"use client";

import { RouteFallback } from "@/components/ui/route-fallback";

export default function GlobalError() {
  return (
    <RouteFallback
      title="Something went wrong"
      description="We hit a snag while loading the page. Please try again or return to the home screen."
      actionLabel="Try again"
      actionHref="/"
    />
  );
}
