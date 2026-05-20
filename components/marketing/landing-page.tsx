import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import { AnimatedAIShell } from "@/components/marketing/animated-shell";
import { LandingNav } from "@/components/marketing/landing-nav";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Section } from "@/components/ui/section";
import { featureCards, programs } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-aurora-grid text-white">
      <LandingNav />
      <section className="fine-grid relative min-h-[92vh] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyanGlow/25 bg-cyanGlow/10 px-4 py-2 text-sm text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-mint shadow-[0_0_18px_#5af3c7]" />
              AI-powered support for modern mental wellness
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
              DrMindit
              <span className="block bg-gradient-to-r from-cyanGlow via-blue-300 to-iris bg-clip-text text-transparent">
                calm intelligence for the mind.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A premium mental health platform combining supportive AI chat, mood analytics, guided sessions, guided programs,
              emergency care flows, and privacy-first institutional insights.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up">
                <Button size="lg">
                  Start 7-day reset <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/corporate">
                <Button size="lg" variant="secondary">For organizations</Button>
              </Link>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 text-center">
              { ["82% calmer check-ins", "24/7 AI support", "HIPAA-ready architecture"].map((item) => (
                <GlassCard key={item} className="p-3 text-xs text-slate-300 sm:text-sm">
                  {item}
                </GlassCard>
              ))}
            </div>
          </div>
          <AnimatedAIShell />
        </div>
      </section>
      <Section id="features">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyanGlow">Platform</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Care that feels personal, private, and present.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, body }) => (
            <GlassCard key={title} className="p-5">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-cyanGlow/10 text-cyanGlow">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <Section>
        <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-cyanGlow">Guided journeys</p>
            <h2 className="mt-3 text-3xl font-semibold">Structured programs that build emotional momentum.</h2>
            <p className="mt-4 text-slate-400">
              DrMindit translates complex therapeutic practices into daily sessions users can actually complete.
            </p>
          </GlassCard>
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <GlassCard key={program.title} className="p-5">
                <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${program.accent}`} />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{program.duration}</p>
                <h3 className="mt-2 text-xl font-semibold">{program.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{program.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {["It feels like a calm room in my phone.", "Our care team finally has privacy-safe signals.", "The emergency flow is thoughtful and fast."].map((quote, index) => (
            <GlassCard key={quote} className="p-6">
              <Quote className="mb-5 h-7 w-7 text-cyanGlow" />
              <p className="text-lg leading-7 text-slate-100">{quote}</p>
              <p className="mt-5 text-sm text-slate-500">{["Member", "Clinical director", "Military family advocate"][index]}</p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <Section id="pricing">
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Personal", 1599, "AI chat, mood tracking, audio therapy"],
            ["Family", 3499, "Shared support plans and private member profiles"],
            ["Institutional", "Custom", "Aggregated insights, onboarding, and reporting"]
          ].map(([name, price, body]) => (
            <GlassCard key={name} className="p-6">
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="mt-4 text-4xl font-semibold">{typeof price === "number" ? formatCurrency(price) : price}</p>
              <p className="mt-3 min-h-12 text-sm text-slate-400">{body}</p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                {["Secure account", "Streaming AI support", "Personalized insights"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-mint" /> {item}
                  </div>
                ))}
              </div>
              <Link href="/sign-up" className="mt-6 block">
                <Button className="w-full" variant={name === "Institutional" ? "secondary" : "primary"}>Choose plan</Button>
              </Link>
            </GlassCard>
          ))}
        </div>
      </Section>
      <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-slate-500">
        DrMindit is not a replacement for emergency care. If you are in immediate danger, contact local emergency services.
      </footer>
    </main>
  );
}
