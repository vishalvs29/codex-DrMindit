import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyanGlow/10 text-cyanGlow">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-5 text-sm text-slate-400">{detail}</p>
    </GlassCard>
  );
}
