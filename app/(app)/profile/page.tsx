import { EyeOff, Settings, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <GlassCard className="p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Your wellbeing journey</p>
          <h2 className="mt-3 text-4xl font-semibold">Daily insights</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <GlassCard className="p-5">
              <p className="text-sm text-slate-500">Mood continuum</p>
              <div className="mt-5 flex h-28 items-end gap-2">
                {[42, 56, 49, 63, 82].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-700 to-cyanGlow" style={{ height: `${height}%` }} />
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-5">
              <Sparkles className="mb-5 h-6 w-6 text-cyanGlow" />
              <p className="text-3xl font-semibold">42</p>
              <p className="mt-2 text-sm text-slate-400">Focus flow minutes today</p>
            </GlassCard>
          </div>
          <GlassCard className="mt-4 p-5">
            <h3 className="font-semibold">AI-generated pattern</h3>
            <p className="mt-3 text-slate-400">
              Reflective notes show anxiety rising before unscheduled meetings. Try a two-minute grounding practice before context switches.
            </p>
          </GlassCard>
        </GlassCard>
        <div className="space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <EyeOff className="h-6 w-6 text-cyanGlow" />
              <div className="flex-1">
                <h3 className="font-semibold">Anonymous mode</h3>
                <p className="text-sm text-slate-500">Hide personal identifiers from shared reports.</p>
              </div>
              <Button size="sm" variant="secondary">On</Button>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <Settings className="mb-4 h-6 w-6 text-cyanGlow" />
            <h3 className="font-semibold">Preferences</h3>
            <p className="mt-2 text-sm text-slate-400">Tone: calm. Session memory: enabled. Audio focus: sleep.</p>
          </GlassCard>
          <GlassCard className="p-5">
            <ShieldAlert className="mb-4 h-6 w-6 text-roseGlow" />
            <h3 className="font-semibold">Emergency support</h3>
            <p className="mt-2 text-sm text-slate-400">Immediate resources and your grounding plan.</p>
            <Button className="mt-4 w-full" variant="danger">Open support</Button>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
