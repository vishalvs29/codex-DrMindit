import { Activity, Brain, CalendarHeart, Moon, Sparkles, Waves } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardAnalytics } from "@/lib/services/analytics-service";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/metric-card";

const dailyPlan = [
  { title: "Deep Blue Breathing", detail: "12 min guided breathwork", icon: Waves },
  { title: "Cognitive Reframe", detail: "AI journaling prompt", icon: Brain },
  { title: "Evening check-in", detail: "Mood and sleep prep", icon: Moon }
];

export default async function DashboardPage() {
  const user = await requireUser();
  const dashboard = await getDashboardAnalytics(user.id);
  const emotionalScore = dashboard.emotionalScore || 0;
  const conicValue = Math.min(Math.max(emotionalScore, 0), 100);
  const latestMood = dashboard.mood.latest?.mood ?? "No check-in yet";
  const recommendation = dashboard.mood.recommendation;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <GlassCard className="p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Daily peace index</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-[220px_1fr]">
            <div
              className="relative mx-auto grid h-48 w-48 place-items-center rounded-full"
              style={{
                background: `conic-gradient(from 180deg, #3fe7ff 0 ${conicValue}%, rgba(255,255,255,.08) ${conicValue}% 100%)`
              }}
            >
              <div className="grid h-36 w-36 place-items-center rounded-full bg-ink text-center">
                <div>
                  <p className="text-4xl font-semibold">{emotionalScore}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{latestMood}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-semibold">Your wellness dashboard is powered by saved check-ins.</h2>
              <p className="mt-4 text-slate-400">
                {recommendation}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/chat"><Button>Talk to DrMindit</Button></Link>
                <Link href="/sessions"><Button variant="secondary">Sleep now</Button></Link>
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
        <MetricCard icon={Activity} label="Mood continuum" value={`${dashboard.moodDelta >= 0 ? "+" : ""}${dashboard.moodDelta}`} detail={`${dashboard.weeklyMoodEntries} check-ins saved this week.`} />
        <MetricCard icon={Moon} label="Practice minutes" value={`${dashboard.completedAudioMinutes}`} detail="Completed session minutes this month." />
        <MetricCard icon={Sparkles} label="AI sessions" value={`${dashboard.sessionCount}`} detail={`${dashboard.messageCount} persisted messages across conversations.`} />
        <MetricCard icon={CalendarHeart} label="Current streak" value={`${dashboard.streak}`} detail="Consecutive daily mood check-ins." />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold">Mood journey</h3>
          <div className="mt-5 flex h-40 items-end gap-2">
            {(dashboard.mood.trend.length > 0 ? dashboard.mood.trend.map((entry) => entry.score) : [8]).map((height, index) => (
              <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-blue-700 to-cyanGlow" style={{ height: `${height}%` }} />
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold">Weekly reflection</h3>
          <p className="mt-4 text-slate-400">
            {dashboard.insights[0]?.body ?? "Start with a mood check-in or AI conversation and DrMindit will build real insights from your saved data."}
          </p>
          <Link href="/profile" className="mt-6 inline-block">
            <Button variant="secondary">View insights</Button>
          </Link>
        </GlassCard>
      </div>
    </main>
  );
}
