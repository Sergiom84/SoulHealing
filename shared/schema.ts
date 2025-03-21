import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url"),
});

export const names = pgTable("names", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  forgiven: boolean("forgiven").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNameSchema = createInsertSchema(names).pick({
  name: true,
  forgiven: true,
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  content: true,
});

export type InsertName = z.infer<typeof insertNameSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Name = typeof names.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;