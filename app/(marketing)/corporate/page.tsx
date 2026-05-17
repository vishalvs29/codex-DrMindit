import { InstitutionPage } from "@/components/marketing/institution-page";

export default function CorporatePage() {
  return (
    <InstitutionPage
      label="Corporate"
      title="Employee mental wellness that leaders can support responsibly."
      body="A modern AI wellness benefit with measurable engagement, privacy-first analytics, guided resilience programs, and support that fits into the workday."
      stats={["38%", "91%", "5 min", "SAML"]}
      benefits={["Burnout signals", "Team insights", "Manager toolkits", "Global rollout"]}
    />
  );
}
