"use client";

import { RouteFallback } from "@/components/ui/route-fallback";

export default function MarketingError() {
  return (
    <RouteFallback
      title="Page unavailable"
      description="The marketing page can't be rendered right now. Please try again later." 
      actionLabel="View homepage"
      actionHref="/"
    />
  );
}
