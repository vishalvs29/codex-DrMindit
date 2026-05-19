import { CreditCard, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { requireUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/services/subscription-service";
import { BillingActions } from "@/components/billing/billing-actions";

export default async function BillingPage() {
  const user = await requireUser();
  const subscription = await getActiveSubscription(user.id);
  const hasSubscription = Boolean(subscription);
  const planLabel = subscription?.tier === "ORGANIZATION" ? "Organization" : "Premium";
  const renewalDate = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Billing</p>
          <h1 className="mt-2 text-4xl font-semibold">Subscription and payment settings</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Manage access to premium audio content, billing history, and your subscription plan from one secure place.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <CreditCard className="h-6 w-6 text-cyanGlow" />
              <div>
                <h2 className="text-xl font-semibold">{hasSubscription ? "Active subscription" : "Start your premium plan"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                      {hasSubscription
                        ? "Your premium access is active and you can unlock all gated sessions."
                        : "Upgrade to unlock premium sessions, extended sessions, and guided practices."}
                </p>
              </div>
            </div>

            {hasSubscription ? (
              <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Plan</span>
                  <span>{planLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Status</span>
                  <span className="capitalize">{subscription?.status}</span>
                </div>
                {renewalDate ? (
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Renewal date</span>
                    <span>{renewalDate}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            <BillingActions actionType={hasSubscription ? "portal" : "checkout"} />
          </GlassCard>

          <GlassCard className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold">Secure payments</h2>
                <p className="mt-1 text-sm text-slate-500">Stripe handles card details and billing securely. We only store subscription state.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Premium subscribers receive:</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Full access to premium sessions</li>
                <li>• Progress saving across devices</li>
                <li>• Personalized listening recommendations</li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
