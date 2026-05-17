import { InstitutionPage } from "@/components/marketing/institution-page";

export default function SchoolsPage() {
  return (
    <InstitutionPage
      label="Schools"
      title="Mental wellness infrastructure for students and campus teams."
      body="DrMindit gives students private daily support while helping schools understand wellbeing trends without exposing individual conversations."
      stats={["12k", "84%", "24/7", "SOC2"]}
      benefits={["Student check-ins", "Counselor routing", "Risk-aware support", "Family resources"]}
    />
  );
}
