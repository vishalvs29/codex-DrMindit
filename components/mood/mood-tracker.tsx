"use client";

import { useState, useTransition } from "react";
import { Frown, Laugh, Meh, Moon, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const moods = [
  { label: "Joyful", score: 88, icon: Laugh },
  { label: "Calm", score: 76, icon: SmilePlus },
  { label: "Neutral", score: 55, icon: Meh },
  { label: "Stressed", score: 32, icon: Frown }
];

export function MoodTracker() {
  const [selected, setSelected] = useState(moods[1]);
  const [stress, setStress] = useState(42);
  const [journal, setJournal] = useState("");
  const [status, setStatus] = useState<string>();
  const [isPending, startTransition] = useTransition();

  function saveEntry() {
    startTransition(async () => {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selected.label,
          score: selected.score,
          stress,
          sleep: 72,
          journal,
          tags: ["daily-check-in"]
        })
      });

      setStatus(response.ok ? "Mood saved. DrMindit will use this in your future insights." : "Could not save this check-in.");
    });
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
      <GlassCard className="p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Personalization</p>
        <h2 className="mt-3 text-3xl font-semibold">How are you feeling today?</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const active = selected.label === mood.label;
            return (
              <button
                key={mood.label}
                onClick={() => setSelected(mood)}
                className={`rounded-2xl border p-5 text-left transition ${
                  active ? "border-cyanGlow bg-cyanGlow/10" : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <Icon className="mb-4 h-7 w-7 text-cyanGlow" />
                <p className="font-semibold">{mood.label}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-400">Current stress level</span>
            <span className="text-cyanGlow">{stress}%</span>
          </div>
          <input
            aria-label="Stress level"
            min={1}
            max={100}
            value={stress}
            onChange={(event) => setStress(Number(event.target.value))}
            type="range"
            className="w-full accent-cyanGlow"
          />
        </div>
        <textarea
          value={journal}
          onChange={(event) => setJournal(event.target.value)}
          placeholder="A private reflection for your future self..."
          className="mt-6 min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyanGlow/50"
        />
        <Button className="mt-4 w-full" disabled={isPending} onClick={saveEntry}>
          {isPending ? "Saving..." : "Continue journey"}
        </Button>
        {status && <p className="mt-4 text-sm text-slate-400">{status}</p>}
      </GlassCard>
      <div className="space-y-4">
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold">Emotional trend</h3>
          <div className="mt-6 flex h-64 items-end gap-3">
            {[45, 58, 51, 66, 61, 73, selected.score].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-blue-700 to-cyanGlow" style={{ height: `${height}%` }} />
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/20 text-cyanGlow">
              <Moon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">Personalized suggestion</h3>
              <p className="text-sm text-slate-400">Try a 12-minute breath session before your next work block.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
