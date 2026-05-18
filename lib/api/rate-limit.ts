import { Redis } from "@upstash/redis";
import { ApiError } from "@/lib/api/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const inMemoryBuckets = new Map<string, Bucket>();
let redisClient: Redis | null | undefined;
let redisUnavailable = false;
let redisWarned = false;

function resolveRateLimiterBackend() {
  return process.env.RATE_LIMITER_BACKEND?.toLowerCase() === "memory"
    ? "memory"
    : process.env.RATE_LIMITER_BACKEND?.toLowerCase() === "none"
    ? "none"
    : process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? "redis"
    : "memory";
}

function getRedisClient() {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisClient = null;
    return null;
  }

  try {
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (error) {
    if (!redisWarned) {
      console.warn("Rate limiter: failed to initialize Upstash Redis client.", error);
      redisWarned = true;
    }
    redisClient = null;
    return null;
  }
}

function getWindowSeconds(windowMs: number) {
  return Math.max(1, Math.ceil(windowMs / 1000));
}

function assertMemoryRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = inMemoryBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    inMemoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new ApiError("Too many requests. Please slow down and try again shortly.", 429, "RATE_LIMITED");
  }

  bucket.count += 1;
}

export function resetRateLimitState() {
  inMemoryBuckets.clear();
  redisClient = undefined;
  redisUnavailable = false;
  redisWarned = false;
}

export async function assertRateLimit(key: string, limit: number, windowMs: number) {
  const backend = resolveRateLimiterBackend();

  if (backend === "none") {
    return;
  }

  if (backend === "memory") {
    return assertMemoryRateLimit(key, limit, windowMs);
  }

  const client = getRedisClient();
  if (!client) {
    return assertMemoryRateLimit(key, limit, windowMs);
  }

  if (redisUnavailable) {
    return assertMemoryRateLimit(key, limit, windowMs);
  }

  const redisKey = `rate-limit:${key}`;
  const windowSeconds = getWindowSeconds(windowMs);

  try {
    const count = await client.incr(redisKey);
    if (count === 1) {
      await client.expire(redisKey, windowSeconds);
    }

    if (count > limit) {
      throw new ApiError("Too many requests. Please slow down and try again shortly.", 429, "RATE_LIMITED");
    }
  } catch (error) {
    redisUnavailable = true;
    if (!redisWarned) {
      console.warn("Rate limiter: Upstash Redis request failed, falling back to memory limiter.", error);
      redisWarned = true;
    }
    return assertMemoryRateLimit(key, limit, windowMs);
  }
}
