import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { programs } from "@/lib/data";

export default function ProgramsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <GlassCard className="mb-4 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Current journey</p>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">21 Days to Better Sleep</h2>
            <p className="mt-2 text-slate-400">Day 08: Deep delta waves and thought offloading.</p>
          </div>
          <Button><PlayCircle className="h-5 w-5" /> Resume</Button>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-cyanGlow to-iris" />
        </div>
      </GlassCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {programs.map((program) => (
          <GlassCard key={program.title} className="p-5">
            <div className={`mb-5 h-2 rounded-full bg-gradient-to-r ${program.accent}`} />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{program.duration}</p>
            <h3 className="mt-2 text-xl font-semibold">{program.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{program.body}</p>
            <Button className="mt-5 w-full" variant="secondary">Start plan</Button>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-4 p-5">
        <h3 className="text-xl font-semibold">Weekly roadmap</h3>
        <div className="mt-4 space-y-3">
          {["Reflective release", "Deep delta waves", "Circadian alignment"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
              {index < 2 ? <CheckCircle2 className="h-5 w-5 text-mint" /> : <Lock className="h-5 w-5 text-slate-600" />}
              <span>{item}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </main>
  );
}
