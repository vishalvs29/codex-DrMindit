import { Prisma } from "@prisma/client";
import { notFound } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";

const programInclude = {
  days: {
    orderBy: { dayNumber: "asc" as const },
    include: {
      tasks: {
        orderBy: { sortOrder: "asc" as const }
      }
    }
  }
} satisfies Prisma.ProgramInclude;

function calculateCompletion(totalTasks: number, completedTaskIds: string[]) {
  if (totalTasks === 0) return 0;
  return Math.round((completedTaskIds.length / totalTasks) * 100);
}

function currentDayFromTasks(program: Prisma.ProgramGetPayload<{ include: typeof programInclude }>, completedTaskIds: string[]) {
  const firstIncomplete = program.days.find((day) => day.tasks.some((task) => !completedTaskIds.includes(task.id)));
  return firstIncomplete?.dayNumber ?? program.duration;
}

export async function listPrograms(userId: string) {
  const programs = await prisma.program.findMany({
    include: {
      ...programInclude,
      progress: {
        where: { userId },
        take: 1
      }
    },
    orderBy: { duration: "asc" }
  });

  return programs.map((program) => ({
    ...program,
    userProgress: program.progress[0] ?? null,
    totalTasks: program.days.reduce((sum, day) => sum + day.tasks.length, 0)
  }));
}

export async function getProgramBySlug(userId: string, slug: string) {
  const program = await prisma.program.findUnique({
    where: { slug },
    include: {
      ...programInclude,
      progress: {
        where: { userId },
        take: 1
      }
    }
  });

  if (!program) throw notFound("Program not found.");

  return {
    ...program,
    userProgress: program.progress[0] ?? null,
    totalTasks: program.days.reduce((sum, day) => sum + day.tasks.length, 0)
  };
}

export async function updateProgramTaskProgress({
  userId,
  programId,
  slug,
  taskId,
  completed
}: {
  userId: string;
  programId?: string;
  slug?: string;
  taskId: string;
  completed: boolean;
}) {
  const program = await prisma.program.findFirst({
    where: programId ? { id: programId } : { slug },
    include: programInclude
  });

  if (!program) throw notFound("Program not found.");

  const taskExists = program.days.some((day) => day.tasks.some((task) => task.id === taskId));
  if (!taskExists) throw notFound("Program task not found.");

  const existing = await prisma.userProgramProgress.findUnique({
    where: {
      userId_programId: {
        userId,
        programId: program.id
      }
    }
  });

  const completedTaskIds = new Set(existing?.completedTaskIds ?? []);
  if (completed) {
    completedTaskIds.add(taskId);
  } else {
    completedTaskIds.delete(taskId);
  }

  const totalTasks = program.days.reduce((sum, day) => sum + day.tasks.length, 0);
  const nextCompletedTaskIds = [...completedTaskIds];
  const completionPercentage = calculateCompletion(totalTasks, nextCompletedTaskIds);
  const currentDay = currentDayFromTasks(program, nextCompletedTaskIds);

  const progress = await prisma.userProgramProgress.upsert({
    where: {
      userId_programId: {
        userId,
        programId: program.id
      }
    },
    create: {
      userId,
      programId: program.id,
      completedTaskIds: nextCompletedTaskIds,
      completionPercentage,
      currentDay,
      completedAt: completionPercentage === 100 ? new Date() : null
    },
    update: {
      completedTaskIds: nextCompletedTaskIds,
      completionPercentage,
      currentDay,
      completedAt: completionPercentage === 100 ? new Date() : null
    }
  });

  return { progress, completionPercentage };
}
