import assert from "node:assert";
import { prisma as prismaA } from "@/lib/prisma";
import { prisma as prismaB } from "@/lib/prisma";

export function runPrismaSingletonTests() {
  assert.strictEqual(prismaA, prismaB, "Prisma client should be singleton");
  console.log("✅ prisma-singleton.test.ts passed");
}
