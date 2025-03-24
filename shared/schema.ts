import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabla de usuarios
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  audioUrl: text("audio_url"),
});

// Modificamos la tabla names para incluir userId y exerciseId
export const names = pgTable("names", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  forgiven: boolean("forgiven").default(false),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Modificamos la tabla notes para incluir userId y exerciseId
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Esquemas de inserción
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertNameSchema = createInsertSchema(names).omit({ id: true, createdAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true });

// Tipos
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertName = z.infer<typeof insertNameSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type User = typeof users.$inferSelect;
export type Name = typeof names.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;