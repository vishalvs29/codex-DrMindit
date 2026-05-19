"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { FavoriteButton, PlayerTrack, useAudioPlayer } from "@/components/audio/audio-player";

type AudioLibraryProps = {
  categories: Array<{ id: string; slug: string; name: string; description: string }>;
  tracks: PlayerTrack[];
  recentlyPlayed: Array<{
    id: string;
    positionSeconds: number;
    completed: boolean;
    audioTrack: PlayerTrack;
  }>;
};

function formatMinutes(seconds: number) {
  return `${Math.round(seconds / 60)} min`;
}

export function AudioLibrary({ categories, tracks, recentlyPlayed }: AudioLibraryProps) {
  const { playTrack } = useAudioPlayer();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyanGlow">Guided Sessions</p>
        <h2 className="mt-3 text-4xl font-semibold">Curated sessions for emotional and neurological wellbeing.</h2>
      </div>
      {recentlyPlayed.length > 0 && (
        <GlassCard className="mb-4 p-5">
          <h3 className="text-xl font-semibold">Continue listening</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {recentlyPlayed.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => playTrack(item.audioTrack)}
                className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-left transition hover:bg-white/10"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: item.audioTrack.imageGradient }}>
                  <Play className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{item.audioTrack.title}</span>
                  <span className="text-sm text-slate-500">{Math.round(item.positionSeconds / 60)} min listened</span>
                </span>
              </button>
            ))}
          </div>
        </GlassCard>
      )}
      <div className="hide-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyanGlow/50 hover:text-white"
          >
            {category.name}
          </a>
        ))}
      </div>
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryTracks = tracks.filter((track) => track.category.slug === category.slug);
          if (categoryTracks.length === 0) return null;

          return (
            <section key={category.id} id={category.slug}>
              <div className="mb-3">
                <h3 className="text-2xl font-semibold">{category.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{category.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {categoryTracks.map((track, index) => (
                  <motion.div key={track.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                    <GlassCard className="overflow-hidden">
                      <Link href={`/sessions/${track.slug}`}>
                        <div className="h-44 p-5" style={{ background: track.imageGradient }}>
                          <span className="rounded-full bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                            {track.category.name}
                          </span>
                        </div>
                      </Link>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xl font-semibold">{track.title}</h4>
                            <p className="mt-2 text-sm text-slate-400">{formatMinutes(track.duration)} guided session</p>
                            {track.isLocked && (
                              <span className="mt-2 inline-flex rounded-full bg-roseGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-roseGlow">
                                Premium
                              </span>
                            )}
                          </div>
                          <FavoriteButton track={track} />
                        </div>
                        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">{track.description}</p>
                        <div className="mt-5 flex gap-2">
                          {track.isLocked ? (
                            track.slug === "brain-heart-coherence" ? (
                              <Link href="/billing" className="flex-1">
                                <Button className="flex-1" variant="primary">
                                  Unlock Brain-Heart Coherence — Premium
                                </Button>
                              </Link>
                            ) : (
                              <Link href="/billing" className="flex-1">
                                <Button className="flex-1" variant="secondary">
                                  Upgrade to unlock
                                </Button>
                              </Link>
                            )
                          ) : (
                            <Button className="flex-1" variant="secondary" onClick={() => playTrack(track)}>
                              <Play className="h-4 w-4" /> Play
                            </Button>
                          )}
                          <Link href={`/sessions/${track.slug}`}>
                            <Button size="icon" variant="secondary" aria-label="Open track">
                              <Star className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
