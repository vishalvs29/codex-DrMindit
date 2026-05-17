import { Play, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { audioTracks } from "@/lib/data";

export default function AudioPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Audio therapy</p>
        <h2 className="mt-3 text-4xl font-semibold">Curated soundscapes for neurological wellbeing.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {audioTracks.map((track) => (
          <GlassCard key={track.title} className="overflow-hidden">
            <div className="h-44 p-5" style={{ background: track.image }}>
              <span className="rounded-full bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                {track.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold">{track.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{track.minutes} min guided session</p>
              <Button className="mt-5 w-full" variant="secondary">
                <Play className="h-4 w-4" /> Play now
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-4 p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyanGlow/10 text-cyanGlow">
            <Waves className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Deep Forest Rainfall</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-cyanGlow to-iris" />
            </div>
          </div>
          <Button size="icon"><Play className="h-5 w-5" /></Button>
        </div>
      </GlassCard>
    </main>
  );
}
