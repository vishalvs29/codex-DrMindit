import Link from "next/link";
import { ArrowRight, BarChart3, Lock, ShieldCheck, Users } from "lucide-react";
import { LandingNav } from "@/components/marketing/landing-nav";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Section } from "@/components/ui/section";

type InstitutionPageProps = {
  label: string;
  title: string;
  body: string;
  stats: string[];
  benefits: string[];
};

export function InstitutionPage({ label, title, body, stats, benefits }: InstitutionPageProps) {
  return (
    <main className="min-h-screen bg-aurora-grid text-white">
      <LandingNav />
      <section className="fine-grid px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyanGlow">{label}</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{body}</p>
            <Link href="/sign-up" className="mt-8 inline-block">
              <Button size="lg">Book strategy session <ArrowRight className="h-5 w-5" /></Button>
            </Link>
          </div>
          <GlassCard className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {[Users, BarChart3, Lock, ShieldCheck].map((Icon, index) => (
                <div key={index} className="rounded-2xl bg-white/5 p-4">
                  <Icon className="mb-5 h-6 w-6 text-cyanGlow" />
                  <p className="text-2xl font-semibold">{stats[index]}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <GlassCard key={benefit} className="p-5">
              <h3 className="text-lg font-semibold">{benefit}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Built for privacy-first deployment, stakeholder trust, measurable engagement, and fast access to supportive care.
              </p>
            </GlassCard>
          ))}
        </div>
      </Section>
      <Section>
        <GlassCard className="p-8 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-cyanGlow">Trusted architecture</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-5xl">
            De-identified analytics for leaders. Private, compassionate support for every member.
          </h2>
          <Link href="/sign-up" className="mt-8 inline-block">
            <Button size="lg">Launch DrMindit</Button>
          </Link>
        </GlassCard>
      </Section>
    </main>
  );
}
