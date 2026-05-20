"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type BillingActionType = "checkout" | "portal";

const actionLabels: Record<BillingActionType, string> = {
  checkout: "Upgrade now",
  portal: "Manage subscription"
};

const actionEndpoints: Record<BillingActionType, string> = {
  checkout: "/api/billing",
  portal: "/api/billing/portal"
};

export function BillingActions({ actionType }: { actionType: BillingActionType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(actionEndpoints[actionType], {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const payload = await response.json();
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to complete billing action.");
      }

      window.location.href = payload.url;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={handleAction} disabled={isLoading} className="w-full">
        {isLoading ? "Please wait…" : actionLabels[actionType]}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      {error ? <p className="text-sm text-roseGlow">{error}</p> : null}
    </div>
  );
}
