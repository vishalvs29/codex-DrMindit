"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, ChevronDown, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PlayerTrack, useAudioPlayer } from "@/components/sessions/audio-player";

type ProgramDetailData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  accent: string;
  benefits: string[];
  totalTasks: number;
  days: Array<{
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      durationMinutes: number;
    }>;
  }>;
  userProgress: {
    completionPercentage: number;
    completedTaskIds: string[];
    currentDay: number;
    completedAt: string | Date | null;
  } | null;
};

export function ProgramDetail({
  program,
  recommendedTracks
}: {
  program: ProgramDetailData;
  recommendedTracks: PlayerTrack[];
}) {
  const { playTrack } = useAudioPlayer();
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set(program.userProgress?.completedTaskIds ?? []));
  const [openDay, setOpenDay] = useState(program.userProgress?.currentDay ?? 1);
  const [isPending, startTransition] = useTransition();

  const completion = useMemo(
    () => Math.round((completedTaskIds.size / Math.max(1, program.totalTasks)) * 100),
    [completedTaskIds.size, program.totalTasks]
  );

  const router = useRouter();

  function findRecommendedSession(task: { title: string; description: string }) {
    const taskText = `${task.title} ${task.description}`.toLowerCase();
    const taskKeywords = taskText.split(/[^a-z0-9]+/).filter(Boolean);

    const exactMatch = recommendedTracks.find((track) =>
      track.title.toLowerCase().includes(task.title.toLowerCase()) ||
      taskText.includes(track.category.name.toLowerCase())
    );

    if (exactMatch) return exactMatch;

    const categoryMatch = recommendedTracks.find((track) =>
      taskKeywords.some(
        (keyword) =>
          track.title.toLowerCase().includes(keyword) ||
          track.category.name.toLowerCase().includes(keyword) ||
          track.category.slug.toLowerCase().includes(keyword)
      )
    );

    if (categoryMatch) return categoryMatch;

    return recommendedTracks[0];
  }

  function handleTaskClick(task: { id: string; title: string; description: string; durationMinutes: number }) {
    // mark progress locally and in background
    toggleTask(task.id);

    const match = findRecommendedSession(task);
    if (match) {
      void router.push(`/sessions/${match.slug}`);
      return;
    }

    void router.push(`/sessions`);
  }

  function toggleTask(taskId: string) {
    const nextCompleted = !completedTaskIds.has(taskId);
    const nextSet = new Set(completedTaskIds);
    if (nextCompleted) nextSet.add(taskId);
    else nextSet.delete(taskId);
    setCompletedTaskIds(nextSet);

    startTransition(async () => {
      const response = await fetch("/api/programs/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: program.id,
          taskId,
          completed: nextCompleted
        })
      });

      if (!response.ok) {
        setCompletedTaskIds(completedTaskIds);
      }
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <GlassCard className="overflow-hidden">
        <div className={`bg-gradient-to-r ${program.accent} p-6 sm:p-10`}>
          <p className="text-sm uppercase tracking-[0.24em] text-white/80">{program.duration}-day journey</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold sm:text-6xl">{program.title}</h2>
          <p className="mt-5 max-w-2xl text-white/80">{program.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setOpenDay(program.userProgress?.currentDay ?? 1)}>
              Continue day {program.userProgress?.currentDay ?? 1}
            </Button>
            <Link href="/chat">
              <Button size="lg" variant="secondary"><Brain className="h-5 w-5" /> Ask DrMindit</Button>
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Completion</span>
            <span className="text-cyanGlow">{completion}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-iris" animate={{ width: `${completion}%` }} />
          </div>
        </div>
      </GlassCard>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {program.days.map((day) => {
            const open = openDay === day.dayNumber;
            const dayComplete = day.tasks.every((task) => completedTaskIds.has(task.id));
            return (
              <GlassCard key={day.id} className="overflow-hidden">
                <button
                  onClick={() => setOpenDay(open ? 0 : day.dayNumber)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-cyanGlow">Day {day.dayNumber}</p>
                    <h3 className="mt-1 text-xl font-semibold">{day.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{day.description}</p>
                  </div>
                  {dayComplete ? <CheckCircle2 className="h-6 w-6 text-mint" /> : <ChevronDown className={`h-6 w-6 transition ${open ? "rotate-180" : ""}`} />}
                </button>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-white/10 p-5">
                    <div className="space-y-3">
                          {day.tasks.map((task) => {
                        const checked = completedTaskIds.has(task.id);
                        const recommendation = findRecommendedSession(task);
                        return (
                          <div key={task.id}>
                            <button
                              disabled={isPending}
                              onClick={() => handleTaskClick(task)}
                              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                                checked ? "border-mint/50 bg-mint/10" : "border-white/10 bg-white/5 hover:border-cyanGlow/50"
                              }`}
                            >
                              <CheckCircle2 className={`mt-1 h-5 w-5 ${checked ? "text-mint" : "text-slate-600"}`} />
                              <span className="flex-1">
                                <span className="block font-semibold">{task.title}</span>
                                <span className="mt-1 block text-sm leading-6 text-slate-400">{task.description}</span>
                                <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-slate-600">{task.durationMinutes} min</span>
                              </span>
                            </button>
                            {recommendation ? (
                              <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/5 p-3 text-xs text-slate-400">
                                <div>
                                  <p className="font-medium text-slate-100">Recommended session</p>
                                  <p>{recommendation.title}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => playTrack(recommendation)}>
                                  Play session
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            );
          })}
        </div>
        <aside className="space-y-4">
          <GlassCard className="p-5">
            <Sparkles className="mb-4 h-6 w-6 text-cyanGlow" />
            <h3 className="font-semibold">AI wellness recommendation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Pair this journey with one short session after completing a task. Your progress and recent mood check-ins will inform future DrMindit recommendations.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="font-semibold">Recommended sessions</h3>
            <div className="mt-4 space-y-3">
              {recommendedTracks.map((track) => (
                <button key={track.id} onClick={() => playTrack(track)} className="flex w-full items-center gap-3 rounded-2xl bg-white/5 p-3 text-left hover:bg-white/10">
                  <Headphones className="h-5 w-5 text-cyanGlow" />
                  <span>
                    <span className="block text-sm font-medium">{track.title}</span>
                    <span className="text-xs text-slate-500">{track.category.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </aside>
      </div>
    </main>
  );
}
