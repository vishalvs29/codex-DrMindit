"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Heart, Pause, Play, SkipBack, Volume2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export type PlayerTrack = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  audioUrl?: string | null;
  imageGradient: string;
  isLocked?: boolean;
  favorite?: boolean;
  userProgress?: {
    positionSeconds: number;
    completed: boolean;
  } | null;
  category: {
    name: string;
    slug: string;
  };
};

type AudioPlayerContextValue = {
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  playTrack: (track: PlayerTrack) => void;
  toggle: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used inside AudioPlayerProvider.");
  }
  return context;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPersistRef = useRef(0);
  const shouldAutoplayRef = useRef(false);
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.82);

  const percent = useMemo(
    () => (currentTrack?.duration ? Math.min(100, (position / currentTrack.duration) * 100) : 0),
    [currentTrack?.duration, position]
  );

  const persistProgress = useCallback(async (track: PlayerTrack, positionSeconds: number, completed = false, listeningSeconds = 0) => {
    await fetch("/api/sessions/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackId: track.id,
        positionSeconds: Math.floor(completed ? track.duration : positionSeconds),
        listeningSeconds,
        completed
      })
    }).catch(() => undefined);
  }, []);

  function playTrack(track: PlayerTrack) {
    if (track.isLocked) {
      console.warn("Attempted to play a locked premium track. Upgrade is required.");
      return;
    }

    shouldAutoplayRef.current = true;
    setCurrentTrack(track);
    setPosition(track.userProgress?.completed ? 0 : track.userProgress?.positionSeconds ?? 0);
    setIsPlaying(true);
  }

  function toggle() {
    setIsPlaying((value) => !value);
  }

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const startPosition = currentTrack.userProgress?.completed ? 0 : currentTrack.userProgress?.positionSeconds ?? 0;
    if (currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
    } else {
      audio.removeAttribute("src");
    }
    audio.currentTime = startPosition;
    lastPersistRef.current = startPosition;

    if (shouldAutoplayRef.current) {
      shouldAutoplayRef.current = false;
      void audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!currentTrack) return;
      if (e.code === "Space" && (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")) {
        e.preventDefault();
        setIsPlaying((v) => !v);
      }
      if (e.code === "ArrowLeft") {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.max(0, audio.currentTime - 10);
      }
      if (e.code === "ArrowRight") {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.min(currentTrack.duration, audio.currentTime + 10);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      void persistProgress(currentTrack, position, false, Math.max(0, Math.floor(position - lastPersistRef.current)));
    }
  }, [currentTrack, isPlaying, persistProgress, position]);

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, toggle }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => {
          const nextPosition = event.currentTarget.currentTime;
          setPosition(nextPosition);

          if (currentTrack && nextPosition - lastPersistRef.current >= 15) {
            const listenedSeconds = Math.floor(nextPosition - lastPersistRef.current);
            lastPersistRef.current = nextPosition;
            void persistProgress(currentTrack, nextPosition, false, listenedSeconds);
          }
        }}
        onEnded={() => {
          if (currentTrack) void persistProgress(currentTrack, currentTrack.duration, true, Math.max(1, currentTrack.duration - lastPersistRef.current));
          setIsPlaying(false);
        }}
      >
        <track kind="captions" src="" srcLang="en" label="English captions" />
      </audio>
      {currentTrack && (
        <div role="region" aria-label="Media player" className="fixed bottom-20 left-3 right-3 z-50 lg:bottom-4 lg:left-[19rem] lg:right-4">
          <GlassCard className="p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white" style={{ background: currentTrack.imageGradient }} aria-hidden>
                <Waves className={`h-6 w-6 ${isPlaying ? "animate-pulse" : ""}`} />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/sessions/${currentTrack.slug}`} className="truncate font-semibold hover:text-cyanGlow" aria-label={`Open session ${currentTrack.title}`}>
                  {currentTrack.title}
                </Link>
                <span className="sr-only" aria-live="polite">Now playing: {currentTrack.title}</span>

                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-white/10 cursor-pointer"
                  role="slider"
                  tabIndex={0}
                  aria-valuemin={0}
                  aria-valuemax={currentTrack.duration}
                  aria-valuenow={Math.floor(position)}
                  aria-valuetext={`${formatTime(position)} of ${formatTime(currentTrack.duration)}`}
                  aria-label="Playback position"
                  onClick={(e) => {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const clickX = (e as React.MouseEvent).clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, clickX / rect.width));
                    const audio = audioRef.current;
                    if (audio && currentTrack) audio.currentTime = pct * currentTrack.duration;
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    const audio = audioRef.current;
                    if (!audio || !currentTrack) return;
                    const step = Math.max(1, Math.floor(currentTrack.duration * 0.05));
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      audio.currentTime = Math.max(0, audio.currentTime - step);
                    } else if (e.key === "ArrowRight") {
                      e.preventDefault();
                      audio.currentTime = Math.min(currentTrack.duration, audio.currentTime + step);
                    } else if (e.key === "Home") {
                      e.preventDefault();
                      audio.currentTime = 0;
                    } else if (e.key === "End") {
                      e.preventDefault();
                      audio.currentTime = currentTrack.duration;
                    }
                  }}
                >
                  <div className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-iris" style={{ width: `${percent}%` }} />
                </div>

                <p className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                  <span>{formatTime(position)}</span>
                  <span aria-hidden>•</span>
                  <span>Remaining {formatTime(Math.max(0, currentTrack.duration - Math.floor(position)))}</span>
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button size="icon" variant="secondary" onClick={() => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  audio.currentTime = Math.max(0, audio.currentTime - 15);
                }} aria-label="Rewind 15 seconds" className="p-3 touch-manipulation">
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button size="icon" onClick={toggle} aria-pressed={isPlaying} aria-label={isPlaying ? "Pause" : "Play"} className="p-3 touch-manipulation">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button size="icon" variant="secondary" onClick={() => {
                  const audio = audioRef.current;
                  if (!audio || !currentTrack) return;
                  audio.currentTime = Math.min(currentTrack.duration, audio.currentTime + 15);
                }} aria-label="Forward 15 seconds" className="p-3 touch-manipulation">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19V5l11 7-11 7z"/><path d="M19 19V5"/></svg>
                </Button>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <Volume2 className="h-4 w-4 text-slate-500" />
                <input
                  aria-label="Volume"
                  className="w-20 accent-cyanGlow"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </AudioPlayerContext.Provider>
  );
}

export function FavoriteButton({ track }: { track: PlayerTrack }) {
  const [favorite, setFavorite] = useState(Boolean(track.favorite));

  async function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    await fetch("/api/sessions/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId: track.id, favorite: next })
    }).catch(() => setFavorite(!next));
  }

  return (
    <Button size="icon" variant="secondary" onClick={toggleFavorite} aria-label={favorite ? "Remove favorite" : "Add favorite"}>
      <Heart className={`h-5 w-5 ${favorite ? "fill-roseGlow text-roseGlow" : ""}`} />
    </Button>
  );
}
