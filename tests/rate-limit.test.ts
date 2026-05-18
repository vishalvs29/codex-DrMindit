import assert from "node:assert";
import { ApiError } from "@/lib/api/errors";
import { assertRateLimit, resetRateLimitState } from "@/lib/api/rate-limit";

export async function runRateLimitTests() {
  process.env.UPSTASH_REDIS_REST_URL = "";
  process.env.UPSTASH_REDIS_REST_TOKEN = "";
  process.env.RATE_LIMITER_BACKEND = "memory";

  await resetRateLimitState();
  await assertRateLimit("test-key", 2, 1000);
  await assertRateLimit("test-key", 2, 1000);

  let threw = false;
  try {
    await assertRateLimit("test-key", 2, 1000);
  } catch (error) {
    threw = true;
    assert.ok(error instanceof ApiError, "Expected ApiError when rate limit is exceeded");
  }

  assert.strictEqual(threw, true, "Expected rate limit to reject after exceeding limit");
  await resetRateLimitState();
  console.log("✅ rate-limit.test.ts passed");
}
