import { audioCategoryCatalog, audioTrackCatalog, programCatalog } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";

let catalogReady = false;

export async function ensureWellnessCatalog() {
  if (catalogReady) return;

  await prisma.$transaction(async (tx) => {
    for (const program of programCatalog) {
      const savedProgram = await tx.program.upsert({
        where: { slug: program.slug },
        create: {
          slug: program.slug,
          title: program.title,
          description: program.description,
          duration: program.duration,
          category: program.category,
          accent: program.accent,
          benefits: program.benefits
        },
        update: {
          title: program.title,
          description: program.description,
          duration: program.duration,
          category: program.category,
          accent: program.accent,
          benefits: program.benefits
        }
      });

      for (const day of program.days) {
        const savedDay = await tx.programDay.upsert({
          where: {
            programId_dayNumber: {
              programId: savedProgram.id,
              dayNumber: day.dayNumber
            }
          },
          create: {
            programId: savedProgram.id,
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description
          },
          update: {
            title: day.title,
            description: day.description
          }
        });

        for (const task of day.tasks) {
          await tx.programTask.upsert({
            where: {
              programDayId_sortOrder: {
                programDayId: savedDay.id,
                sortOrder: task.sortOrder
              }
            },
            create: {
              programDayId: savedDay.id,
              title: task.title,
              description: task.description,
              durationMinutes: task.durationMinutes,
              sortOrder: task.sortOrder
            },
            update: {
              title: task.title,
              description: task.description,
              durationMinutes: task.durationMinutes
            }
          });
        }
      }
    }

    for (const [slug, name, description] of audioCategoryCatalog) {
      await tx.audioCategory.upsert({
        where: { slug },
        create: { slug, name, description },
        update: { name, description }
      });
    }

    for (const track of audioTrackCatalog) {
      const category = await tx.audioCategory.findUniqueOrThrow({
        where: { slug: track.categorySlug }
      });

      await tx.audioTrack.upsert({
        where: { slug: track.slug },
        create: {
          categoryId: category.id,
          slug: track.slug,
          title: track.title,
          description: track.description,
          duration: track.duration,
          audioUrl: track.audioUrl,
          imageGradient: track.imageGradient
        },
        update: {
          categoryId: category.id,
          title: track.title,
          description: track.description,
          duration: track.duration,
          audioUrl: track.audioUrl,
          imageGradient: track.imageGradient,
          isPublished: true
        }
      });
    }
  });

  catalogReady = true;
}
