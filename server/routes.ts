import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // High scores API
  app.get("/api/scores", (req: Request, res: Response) => {
    // This would normally fetch from a database
    res.json({
      highScores: [
        { name: "Wizard1", score: 5000 },
        { name: "Magician", score: 4200 },
        { name: "Healer", score: 3800 },
        { name: "Spellcaster", score: 3500 },
        { name: "Enchanter", score: 3100 },
      ]
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
