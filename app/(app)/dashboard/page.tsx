import { Activity, Brain, CalendarHeart, Moon, Sparkles, Waves } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";

const dailyPlan = [
  { title: "Deep Blue Breathing", detail: "12 min guided breathwork", icon: Waves },
  { title: "Cognitive Reframe", detail: "AI journaling prompt", icon: Brain },
  { title: "Evening check-in", detail: "Mood and sleep prep", icon: Moon }
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Daily peace index</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-[220px_1fr]">
            <div className="relative mx-auto grid h-48 w-48 place-items-center rounded-full bg-[conic-gradient(from_180deg,#3fe7ff_0_72%,rgba(255,255,255,.08)_72%_100%)]">
              <div className="grid h-36 w-36 place-items-center rounded-full bg-ink text-center">
                <div>
                  <p className="text-4xl font-semibold">82</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">steady</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-semibold">Good evening. Your nervous system is trending calmer.</h2>
              <p className="mt-4 text-slate-400">
                You completed two grounding practices this week. DrMindit recommends a short sleep session and one reflective journal prompt tonight.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/chat"><Button>Talk to DrMindit</Button></Link>
                <Link href="/audio"><Button variant="secondary">Sleep now</Button></Link>
              </div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Today&apos;s plan</p>
          <div className="mt-5 space-y-3">
            {dailyPlan.map(({ title, detail, icon: Icon }) => (
              <div key={title} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/20 text-cyanGlow">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Activity} label="Mood continuum" value="+14%" detail="Positive emotional variability this week." />
        <MetricCard icon={Moon} label="Sleep flow" value="7.2h" detail="Sleep consistency improved across 5 nights." />
        <MetricCard icon={Sparkles} label="AI insight" value="3" detail="New patterns detected in your reflections." />
        <MetricCard icon={CalendarHeart} label="Program day" value="08" detail="21-day anxiety reduction journey." />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold">Mood journey</h3>
          <div className="mt-5 flex h-40 items-end gap-2">
            {[34, 52, 45, 68, 72, 63, 82].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-blue-700 to-cyanGlow" style={{ height: `${height}%` }} />
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold">Weekly reflection</h3>
          <p className="mt-4 text-slate-400">
            You are using shorter pauses before difficult decisions. Anxiety language appears most often near late afternoon work transitions.
          </p>
          <Link href="/profile" className="mt-6 inline-block">
            <Button variant="secondary">View insights</Button>
          </Link>
        </GlassCard>
      </div>
    </main>
  );
}
