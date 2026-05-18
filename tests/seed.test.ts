import assert from "node:assert";
import { seedWellnessCatalog } from "@/lib/services/catalog-service";

export async function runSeedTests() {
  let programUpsertCalls = 0;
  let programDayUpsertCalls = 0;
  let programTaskUpsertCalls = 0;
  let audioCategoryUpsertCalls = 0;
  let audioTrackUpsertCalls = 0;

  const mockPrisma = {
    program: {
      upsert: async (params: any) => {
        programUpsertCalls++;
        return { id: params.where.slug ?? "program" };
      },
    },
    programDay: {
      upsert: async (params: any) => {
        programDayUpsertCalls++;
        return { id: `${params.where.programId_dayNumber.programId}-${params.where.programId_dayNumber.dayNumber}` };
      },
    },
    programTask: {
      upsert: async () => {
        programTaskUpsertCalls++;
        return { id: "task" };
      },
    },
    audioCategory: {
      findUniqueOrThrow: async (params: any) => ({ id: `${params.where.slug}-id` }),
      upsert: async () => {
        audioCategoryUpsertCalls++;
        return { id: "audio-category" };
      },
    },
    audioTrack: {
      upsert: async () => {
        audioTrackUpsertCalls++;
        return { id: "audio-track" };
      },
    },
  };

  await seedWellnessCatalog(mockPrisma as any);

  assert.ok(programUpsertCalls > 0, "Expected at least one program upsert call");
  assert.ok(programDayUpsertCalls > 0, "Expected at least one program day upsert call");
  assert.ok(programTaskUpsertCalls > 0, "Expected at least one program task upsert call");
  assert.ok(audioCategoryUpsertCalls > 0, "Expected at least one audio category upsert call");
  assert.ok(audioTrackUpsertCalls > 0, "Expected at least one audio track upsert call");
  console.log("✅ seed.test.ts passed");
}
