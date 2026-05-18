import { PrismaClient } from "@prisma/client";
import { audioCategoryCatalog, audioTrackCatalog, programCatalog } from "../lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const program of programCatalog) {
    const savedProgram = await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        description: program.description,
        duration: program.duration,
        category: program.category,
        accent: program.accent,
        benefits: program.benefits
      },
      create: {
        slug: program.slug,
        title: program.title,
        description: program.description,
        duration: program.duration,
        category: program.category,
        accent: program.accent,
        benefits: program.benefits
      }
    });

    for (const day of program.days) {
      const savedDay = await prisma.programDay.upsert({
        where: {
          programId_dayNumber: {
            programId: savedProgram.id,
            dayNumber: day.dayNumber
          }
        },
        update: {
          title: day.title,
          description: day.description
        },
        create: {
          programId: savedProgram.id,
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description
        }
      });

      for (const task of day.tasks) {
        await prisma.programTask.upsert({
          where: {
            programDayId_sortOrder: {
              programDayId: savedDay.id,
              sortOrder: task.sortOrder
            }
          },
          update: {
            title: task.title,
            description: task.description,
            durationMinutes: task.durationMinutes
          },
          create: {
            programDayId: savedDay.id,
            title: task.title,
            description: task.description,
            durationMinutes: task.durationMinutes,
            sortOrder: task.sortOrder
          }
        });
      }
    }
  }

  for (const [slug, name, description] of audioCategoryCatalog) {
    await prisma.audioCategory.upsert({
      where: { slug },
      update: { name, description },
      create: { slug, name, description }
    });
  }

  for (const track of audioTrackCatalog) {
    const category = await prisma.audioCategory.findUniqueOrThrow({
      where: { slug: track.categorySlug }
    });

    await prisma.audioTrack.upsert({
      where: { slug: track.slug },
      update: {
        categoryId: category.id,
        title: track.title,
        description: track.description,
        duration: track.duration,
        audioUrl: track.audioUrl,
        imageGradient: track.imageGradient,
        isPublished: true
      },
      create: {
        categoryId: category.id,
        slug: track.slug,
        title: track.title,
        description: track.description,
        duration: track.duration,
        audioUrl: track.audioUrl,
        imageGradient: track.imageGradient
      }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
