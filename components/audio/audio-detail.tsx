"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { FavoriteButton, PlayerTrack, useAudioPlayer } from "@/components/audio/audio-player";

export function AudioDetail({ track }: { track: PlayerTrack }) {
  const { playTrack } = useAudioPlayer();
  const progress = track.userProgress?.positionSeconds ?? 0;
  const percent = track.duration ? Math.round((progress / track.duration) * 100) : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <GlassCard className="overflow-hidden">
        <div className="min-h-72 p-6 sm:p-10" style={{ background: track.imageGradient }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm uppercase tracking-[0.24em] text-white/80">{track.category.name}</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">{track.title}</h2>
            <p className="mt-5 max-w-2xl text-white/80">{track.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {track.isLocked ? (
                <Link href="/billing">
                  <Button size="lg" variant="secondary">
                    Upgrade to unlock
                  </Button>
                </Link>
              ) : (
                <Button size="lg" onClick={() => playTrack(track)}>
                  <Play className="h-5 w-5" /> {progress > 0 && percent < 98 ? "Continue" : "Play session"}
                </Button>
              )}
              {track.slug === "brain-heart-coherence" && track.isLocked ? (
                <div className="mt-4 rounded-lg border border-roseGlow/20 bg-roseGlow/5 p-3 text-sm text-roseGlow">
                  <p className="font-medium">Brain-Heart Coherence is a premium practice.</p>
                  <p className="mt-1">Unlock advanced coherence training with a Premium subscription.</p>
                </div>
              ) : null}
              <FavoriteButton track={track} />
            </div>
          </motion.div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Playback progress</span>
            <span className="text-cyanGlow">{percent}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-iris" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </GlassCard>
      <GlassCard className="mt-4 p-6">
        <div className="flex items-center gap-3">
          <RotateCcw className="h-6 w-6 text-cyanGlow" />
          <div>
            <h3 className="font-semibold">Listening guidance</h3>
            <p className="mt-1 text-sm text-slate-400">
              Use headphones if available, keep the volume gentle, and stop if the practice feels activating rather than calming.
            </p>
          </div>
        </div>
      </GlassCard>
    </main>
  );
}
