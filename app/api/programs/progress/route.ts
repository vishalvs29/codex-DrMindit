import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/api/errors";
import { parseJson } from "@/lib/api/request";
import { updateProgramTaskProgress } from "@/lib/services/program-service";
import { programProgressSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = await parseJson(request, programProgressSchema);
    const progress = await updateProgramTaskProgress({
      userId: user.id,
      programId: input.programId,
      slug: input.slug,
      taskId: input.taskId,
      completed: input.completed
    });
    return NextResponse.json(progress);
  } catch (error) {
    return handleApiError(error);
  }
}
