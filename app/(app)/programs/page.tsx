import { requireUser } from "@/lib/auth";
import { listPrograms } from "@/lib/services/program-service";
import { ProgramList } from "@/components/programs/program-list";

export default async function ProgramsPage() {
  const user = await requireUser();
  const programs = await listPrograms(user.id);

  return <ProgramList programs={programs} />;
}
