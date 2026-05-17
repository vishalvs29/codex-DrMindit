import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const programs = [
    {
      slug: "seven-day-mental-reset",
      title: "7-Day Mental Reset",
      description: "A gentle first week of grounding, breathwork, reflection, and sleep rhythm.",
      duration: 7,
      category: "reset",
      lessons: [{ day: 1, title: "Arrive and breathe" }]
    },
    {
      slug: "twenty-one-day-anxiety-reduction",
      title: "21-Day Anxiety Reduction",
      description: "Daily practices for anticipatory worry, cognitive reframing, and nervous system recovery.",
      duration: 21,
      category: "anxiety",
      lessons: [{ day: 1, title: "Name the loop" }]
    },
    {
      slug: "sleep-improvement",
      title: "Sleep Improvement",
      description: "Wind-down rituals, audio therapy, and reflective offloading for deeper rest.",
      duration: 14,
      category: "sleep",
      lessons: [{ day: 1, title: "Design the landing" }]
    }
  ];

  for (const program of programs) {
    await prisma.program.upsert({
      where: { slug: program.slug },
      update: program,
      create: program
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
