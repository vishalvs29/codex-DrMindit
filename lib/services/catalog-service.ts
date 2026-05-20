import type { PrismaClient } from "@prisma/client";
import { audioCategoryCatalog, audioTrackCatalog, programCatalog } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import {
  resolveSessionAssetUrl,
  resolveSessionThumbnailUrl
} from "@/lib/audio-assets";

export async function seedWellnessCatalog(client: PrismaClient = prisma) {
  for (const program of programCatalog) {
    const savedProgram = await client.program.upsert({
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
      const savedDay = await client.programDay.upsert({
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
        await client.programTask.upsert({
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
    await client.audioCategory.upsert({
      where: { slug },
      create: { slug, name, description },
      update: { name, description }
    });
  }

  for (const track of audioTrackCatalog) {
    const category = await client.audioCategory.findUniqueOrThrow({
      where: { slug: track.categorySlug }
    });

    await client.audioTrack.upsert({
      where: { slug: track.slug },
      create: {
        categoryId: category.id,
        slug: track.slug,
        title: track.title,
        description: track.description,
        duration: track.duration,
        // prefer session-named helpers for new naming, remain backwards compatible
        audioUrl: resolveSessionAssetUrl(track.audioPath),
        thumbnailUrl: resolveSessionThumbnailUrl(track.thumbnailPath),
        narrator: track.narrator,
        tags: [...track.tags],
        accessTier: track.accessTier,
        imageGradient: track.imageGradient
      },
      update: {
        categoryId: category.id,
        title: track.title,
        description: track.description,
        duration: track.duration,
        audioUrl: resolveSessionAssetUrl(track.audioPath),
        thumbnailUrl: resolveSessionThumbnailUrl(track.thumbnailPath),
        narrator: track.narrator,
        tags: [...track.tags],
        accessTier: track.accessTier,
        imageGradient: track.imageGradient,
        isPublished: true
      }
    });
  }
}
