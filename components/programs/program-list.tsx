"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type ProgramSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  accent: string;
  benefits: string[];
  totalTasks: number;
  userProgress: {
    completionPercentage: number;
    currentDay: number;
    completedAt: string | Date | null;
  } | null;
};

export function ProgramList({ programs }: { programs: ProgramSummary[] }) {
  const activeProgram = programs.find((program) => program.userProgress && !program.userProgress.completedAt);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {activeProgram && (
        <GlassCard className="mb-4 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Current journey</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">{activeProgram.title}</h2>
              <p className="mt-2 text-slate-400">
                Day {activeProgram.userProgress?.currentDay} of {activeProgram.duration}
              </p>
            </div>
            <Link href={`/programs/${activeProgram.slug}`}>
              <Button><PlayCircle className="h-5 w-5" /> Resume</Button>
            </Link>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activeProgram.userProgress?.completionPercentage ?? 0}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-iris"
            />
          </div>
        </GlassCard>
      )}
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Guided programs</p>
        <h2 className="mt-3 text-4xl font-semibold">Choose a path that meets your nervous system today.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {programs.map((program, index) => {
          const completion = program.userProgress?.completionPercentage ?? 0;
          return (
            <motion.div key={program.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <GlassCard className="flex h-full flex-col p-5">
                <div className={`mb-5 h-2 rounded-full bg-gradient-to-r ${program.accent}`} />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{program.duration} days</p>
                <h3 className="mt-2 text-xl font-semibold">{program.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{program.description}</p>
                <div className="mt-4 space-y-2">
                  {program.benefits.slice(0, 2).map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-mint" /> {benefit}
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-iris" style={{ width: `${completion}%` }} />
                </div>
                <Link href={`/programs/${program.slug}`} className="mt-5">
                  <Button className="w-full" variant={completion > 0 ? "primary" : "secondary"}>
                    {completion > 0 ? "Continue" : "Start plan"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
