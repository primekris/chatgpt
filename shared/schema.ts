import { z } from "zod";

// Message Schema
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export const insertMessageSchema = messageSchema.omit({ id: true, timestamp: true });

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Session Schema
export const sessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(messageSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const insertSessionSchema = sessionSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type Session = z.infer<typeof sessionSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;

// System Prompt Schema
export const systemPromptSchema = z.object({
  content: z.string(),
});

export type SystemPrompt = z.infer<typeof systemPromptSchema>;

// Chat Request Schema
export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  temperature: z.number().min(0).max(2).default(0.7),
  systemPrompt: z.string().optional(),
  model: z.string().default("meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Model Configuration Schema
export const modelConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  enabled: z.boolean(),
  comingSoon: z.boolean().default(false),
});

export type ModelConfig = z.infer<typeof modelConfigSchema>;
