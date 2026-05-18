"use client";

import { RouteFallback } from "@/components/ui/route-fallback";
export default function SignInError() {
  return (
    <RouteFallback
      title="Sign-in interrupted"
      description="We couldn't reach the sign-in page. Please try again in a moment." 
      actionLabel="Home"
      actionHref="/"
    />
  );
}
