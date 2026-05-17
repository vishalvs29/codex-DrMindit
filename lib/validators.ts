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
