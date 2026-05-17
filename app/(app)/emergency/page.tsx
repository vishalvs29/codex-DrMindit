import { HeartPulse, LifeBuoy, MessageSquare, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const groundingTools = [
  { title: "5 things you can see", body: "Look around and name five objects slowly.", icon: HeartPulse },
  { title: "4 things you can feel", body: "Press your feet into the floor and notice contact.", icon: LifeBuoy },
  { title: "3 sounds you can hear", body: "Let each sound arrive without judging it.", icon: HeartPulse },
  { title: "2 breaths, longer out", body: "Inhale for four, exhale for six.", icon: LifeBuoy }
];

export default function EmergencyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <GlassCard className="border-roseGlow/30 p-6 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-roseGlow" />
        <h2 className="mt-4 text-3xl font-semibold">You are safe here.</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          If you may hurt yourself or someone else, contact emergency services now. DrMindit can help you ground while you reach a person.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="tel:988"><Button className="w-full" variant="danger"><Phone className="h-5 w-5" /> Crisis hotline 988</Button></a>
          <a href="sms:988"><Button className="w-full" variant="secondary"><MessageSquare className="h-5 w-5" /> Text 988</Button></a>
        </div>
      </GlassCard>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {groundingTools.map(({ title, body, icon: Icon }) => (
          <GlassCard key={title} className="p-5">
            <Icon className="mb-4 h-7 w-7 text-cyanGlow" />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-slate-400">{body}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-4 p-5">
        <h3 className="text-xl font-semibold">Quick resources</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="secondary">Find nearest clinic</Button>
          <Button variant="secondary">Create emergency care plan</Button>
        </div>
      </GlassCard>
    </main>
  );
}
