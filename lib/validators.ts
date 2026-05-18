import { z } from "zod";

export const moodEntrySchema = z.object({
  mood: z.string().min(2).max(32),
  score: z.number().int().min(1).max(100),
  sleep: z.number().int().min(1).max(100).optional(),
  stress: z.number().int().min(1).max(100).optional(),
  journal: z.string().max(4000).optional(),
  tags: z.array(z.string().min(1).max(32)).max(8).default([])
});

export const chatRequestSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(5000)
});

export const createSessionSchema = z.object({
  title: z.string().min(1).max(120).optional()
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  archived: z.boolean().optional()
});

export const messageQuerySchema = z.object({
  sessionId: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().optional()
});

export const messagesPostSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(5000)
});

export const programProgressSchema = z.object({
  programId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  taskId: z.string().min(1),
  completed: z.boolean()
});

export const audioProgressSchema = z.object({
  trackId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  positionSeconds: z.number().int().min(0),
  listeningSeconds: z.number().int().min(0).default(0),
  completed: z.boolean().default(false)
});

export const audioFavoriteSchema = z.object({
  trackId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  favorite: z.boolean()
});
