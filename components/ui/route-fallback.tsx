"use client";

import Link from "next/link";

interface RouteFallbackProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function RouteFallback({ title, description, actionLabel = "Go back home", actionHref = "/" }: RouteFallbackProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center text-slate-100">
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/10 backdrop-blur-xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyanGlow">DrMindit</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-6 text-base leading-7 text-slate-300">{description}</p>
        <Link
          href={actionHref}
          className="mt-8 inline-flex rounded-full bg-cyanGlow px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          {actionLabel}
        </Link>
      </div>
    </main>
  );
}
