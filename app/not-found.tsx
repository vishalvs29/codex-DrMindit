import { RouteFallback } from "@/components/ui/route-fallback";

export default function NotFound() {
  return (
    <RouteFallback
      title="Page not found"
      description="The page you were looking for isn't available. Please return to the home screen or try a different link."
      actionLabel="Back to home"
      actionHref="/"
    />
  );
}
