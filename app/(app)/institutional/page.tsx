import { BarChart3, LockKeyhole, Users, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

const institutionalMetrics = [
  { value: "82%", label: "Retention in wellbeing programs", icon: Users },
  { value: "14%", label: "Burnout risk reduction", icon: BarChart3 },
  { value: "94%", label: "Privacy confidence", icon: LockKeyhole },
  { value: "3.2x", label: "Engagement lift", icon: Zap }
];

export default function InstitutionalPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Institutional access</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold">Transforming organizational resilience.</h2>
        <p className="mt-4 max-w-2xl text-slate-400">
          Discover risk, engagement, and recovery signals without exposing private member conversations.
        </p>
      </GlassCard>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {institutionalMetrics.map(({ value, label, icon: Icon }) => (
          <GlassCard key={label} className="p-5">
            <Icon className="mb-6 h-6 w-6 text-cyanGlow" />
            <p className="text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-slate-400">{label}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-4 p-6">
        <h3 className="text-xl font-semibold">Team stress levels</h3>
        <div className="mt-6 flex h-56 items-end gap-3">
          {[28, 42, 61, 78, 53, 47, 31].map((height, index) => (
            <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-slate-800 to-blue-500" style={{ height: `${height}%` }} />
          ))}
        </div>
      </GlassCard>
      <GlassCard className="mt-4 p-6 text-center">
        <h3 className="text-2xl font-semibold">Ready to support your team?</h3>
        <p className="mt-3 text-slate-400">Book a privacy and rollout strategy session.</p>
        <Button className="mt-5">Book enterprise consultation</Button>
      </GlassCard>
    </main>
  );
}
