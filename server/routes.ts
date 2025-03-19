import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertNameSchema, insertNoteSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Names routes
  app.get("/api/names", async (_req, res) => {
    const names = await storage.getNames();
    res.json(names);
  });

  app.post("/api/names", async (req, res) => {
    const result = insertNameSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const name = await storage.addName(result.data);
    res.json(name);
  });

  app.patch("/api/names/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { forgiven } = req.body;
    if (typeof forgiven !== "boolean") {
      return res.status(400).json({ error: "Invalid forgiven status" });
    }
    const name = await storage.updateName(id, forgiven);
    res.json(name);
  });

  app.delete("/api/names/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteName(id);
    res.status(204).end();
  });

  // Notes routes
  app.get("/api/notes", async (_req, res) => {
    const notes = await storage.getNotes();
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    const result = insertNoteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const note = await storage.addNote(result.data);
    res.json(note);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNote(id);
    res.status(204).end();
  });

  return createServer(app);
}
