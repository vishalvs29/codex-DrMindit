import { Prisma } from "@prisma/client";
import { notFound } from "@/lib/api/errors";
import { prisma } from "@/lib/prisma";
import { ensureWellnessCatalog } from "@/lib/services/catalog-service";

const trackInclude = {
  category: true
} satisfies Prisma.AudioTrackInclude;

export async function listAudioTracks(userId: string) {
  await ensureWellnessCatalog();

  const [categories, tracks, recent] = await Promise.all([
    prisma.audioCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.audioTrack.findMany({
      where: { isPublished: true },
      include: {
        ...trackInclude,
        progress: { where: { userId }, take: 1 },
        favorites: { where: { userId }, take: 1 }
      },
      orderBy: { title: "asc" }
    }),
    prisma.userAudioProgress.findMany({
      where: { userId },
      include: { audioTrack: { include: { category: true } } },
      orderBy: { lastPlayedAt: "desc" },
      take: 6
    })
  ]);

  return {
    categories,
    tracks: tracks.map((track) => ({
      ...track,
      userProgress: track.progress[0] ?? null,
      favorite: track.favorites.length > 0
    })),
    recentlyPlayed: recent
  };
}

export async function getAudioTrack(userId: string, slugOrId: string) {
  await ensureWellnessCatalog();

  const track = await prisma.audioTrack.findFirst({
    where: {
      isPublished: true,
      OR: [{ id: slugOrId }, { slug: slugOrId }]
    },
    include: {
      ...trackInclude,
      progress: { where: { userId }, take: 1 },
      favorites: { where: { userId }, take: 1 }
    }
  });

  if (!track) throw notFound("Audio track not found.");

  return {
    ...track,
    userProgress: track.progress[0] ?? null,
    favorite: track.favorites.length > 0
  };
}

export async function updateAudioProgress({
  userId,
  trackId,
  slug,
  positionSeconds,
  listeningSeconds,
  completed
}: {
  userId: string;
  trackId?: string;
  slug?: string;
  positionSeconds: number;
  listeningSeconds: number;
  completed: boolean;
}) {
  const track = await getAudioTrack(userId, trackId ?? slug ?? "");
  const boundedPosition = Math.min(positionSeconds, track.duration);

  const progress = await prisma.userAudioProgress.upsert({
    where: {
      userId_audioTrackId: {
        userId,
        audioTrackId: track.id
      }
    },
    create: {
      userId,
      audioTrackId: track.id,
      positionSeconds: completed ? track.duration : boundedPosition,
      listeningSeconds,
      completed,
      lastPlayedAt: new Date()
    },
    update: {
      positionSeconds: completed ? track.duration : boundedPosition,
      listeningSeconds: { increment: listeningSeconds },
      completed,
      lastPlayedAt: new Date()
    }
  });

  if (listeningSeconds > 0 || completed) {
    await prisma.audioSession.create({
      data: {
        userId,
        audioTrackId: track.id,
        title: track.title,
        category: track.category.name,
        duration: track.duration,
        listenedSeconds: listeningSeconds,
        completed
      }
    });
  }

  return progress;
}

export async function setFavoriteTrack({
  userId,
  trackId,
  slug,
  favorite
}: {
  userId: string;
  trackId?: string;
  slug?: string;
  favorite: boolean;
}) {
  const track = await getAudioTrack(userId, trackId ?? slug ?? "");

  if (favorite) {
    return prisma.favoriteTrack.upsert({
      where: {
        userId_audioTrackId: {
          userId,
          audioTrackId: track.id
        }
      },
      create: {
        userId,
        audioTrackId: track.id
      },
      update: {}
    });
  }

  await prisma.favoriteTrack.deleteMany({
    where: {
      userId,
      audioTrackId: track.id
    }
  });

  return null;
}
