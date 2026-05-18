/*
  Warnings:

  - You are about to drop the column `lessons` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `ProgramProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgramProgress" DROP CONSTRAINT "ProgramProgress_programId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramProgress" DROP CONSTRAINT "ProgramProgress_userId_fkey";

-- AlterTable
ALTER TABLE "AudioSession" ADD COLUMN     "audioTrackId" TEXT,
ADD COLUMN     "listenedSeconds" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "lessons",
ADD COLUMN     "accent" TEXT NOT NULL DEFAULT 'from-cyanGlow to-mint',
ADD COLUMN     "benefits" TEXT[];

-- DropTable
DROP TABLE "ProgramProgress";

-- CreateTable
CREATE TABLE "ProgramDay" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramTask" (
    "id" TEXT NOT NULL,
    "programDayId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 5,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgramProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "completedTaskIds" TEXT[],
    "currentDay" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgramProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioTrack" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "imageGradient" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAudioProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audioTrackId" TEXT NOT NULL,
    "positionSeconds" INTEGER NOT NULL DEFAULT 0,
    "listeningSeconds" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAudioProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteTrack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audioTrackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgramDay_programId_dayNumber_idx" ON "ProgramDay"("programId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramDay_programId_dayNumber_key" ON "ProgramDay"("programId", "dayNumber");

-- CreateIndex
CREATE INDEX "ProgramTask_programDayId_sortOrder_idx" ON "ProgramTask"("programDayId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramTask_programDayId_sortOrder_key" ON "ProgramTask"("programDayId", "sortOrder");

-- CreateIndex
CREATE INDEX "UserProgramProgress_userId_completedAt_idx" ON "UserProgramProgress"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "UserProgramProgress_programId_idx" ON "UserProgramProgress"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgramProgress_userId_programId_key" ON "UserProgramProgress"("userId", "programId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioCategory_slug_key" ON "AudioCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_slug_key" ON "AudioTrack"("slug");

-- CreateIndex
CREATE INDEX "AudioTrack_categoryId_idx" ON "AudioTrack"("categoryId");

-- CreateIndex
CREATE INDEX "AudioTrack_isPublished_idx" ON "AudioTrack"("isPublished");

-- CreateIndex
CREATE INDEX "UserAudioProgress_userId_lastPlayedAt_idx" ON "UserAudioProgress"("userId", "lastPlayedAt");

-- CreateIndex
CREATE INDEX "UserAudioProgress_audioTrackId_idx" ON "UserAudioProgress"("audioTrackId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAudioProgress_userId_audioTrackId_key" ON "UserAudioProgress"("userId", "audioTrackId");

-- CreateIndex
CREATE INDEX "FavoriteTrack_userId_createdAt_idx" ON "FavoriteTrack"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteTrack_userId_audioTrackId_key" ON "FavoriteTrack"("userId", "audioTrackId");

-- CreateIndex
CREATE INDEX "AudioSession_audioTrackId_idx" ON "AudioSession"("audioTrackId");

-- AddForeignKey
ALTER TABLE "ProgramDay" ADD CONSTRAINT "ProgramDay_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTask" ADD CONSTRAINT "ProgramTask_programDayId_fkey" FOREIGN KEY ("programDayId") REFERENCES "ProgramDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramProgress" ADD CONSTRAINT "UserProgramProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgramProgress" ADD CONSTRAINT "UserProgramProgress_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AudioCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioSession" ADD CONSTRAINT "AudioSession_audioTrackId_fkey" FOREIGN KEY ("audioTrackId") REFERENCES "AudioTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAudioProgress" ADD CONSTRAINT "UserAudioProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAudioProgress" ADD CONSTRAINT "UserAudioProgress_audioTrackId_fkey" FOREIGN KEY ("audioTrackId") REFERENCES "AudioTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FavoriteTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FavoriteTrack_audioTrackId_fkey" FOREIGN KEY ("audioTrackId") REFERENCES "AudioTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
