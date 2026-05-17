import { InstitutionPage } from "@/components/marketing/institution-page";

export default function MilitaryPage() {
  return (
    <InstitutionPage
      label="Military"
      title="Resilience support for service members, veterans, and families."
      body="Trauma-informed grounding, sleep, anxiety, transition, and family stress programs with immediate resources when someone needs urgent support."
      stats={["PTSD", "24/7", "100%", "Care"]}
      benefits={["Grounding tools", "Family support", "Sleep recovery", "Crisis resources"]}
    />
  );
}
