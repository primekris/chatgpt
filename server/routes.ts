import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { aiService } from "./ai-service";
import { chatRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/chat/stream - Stream AI responses using SSE
  app.post("/api/chat/stream", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedRequest = chatRequestSchema.parse(req.body);

      // Set headers for Server-Sent Events
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no"); // Disable buffering in nginx

      // Stream the AI response
      try {
        for await (const chunk of aiService.streamChat(validatedRequest)) {
          // Send each chunk as SSE data
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        // Send completion signal
        res.write("data: [DONE]\n\n");
        res.end();
      } catch (streamError) {
        console.error("Streaming error:", streamError);
        res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error("Chat endpoint error:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Invalid request",
          details: error.errors,
        });
      } else {
        res.status(500).json({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      models: {
        together: !!process.env.TOGETHER_API_KEY,
      },
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
