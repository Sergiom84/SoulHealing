import { SupabaseStorage } from "./supabaseStorage";
import { type Name, type Note, type InsertName, type InsertNote, type InsertUser, type User } from "@shared/schema";
import session from "express-session";

export interface IStorage {
  getNames(userId: string, exerciseId: number): Promise<Name[]>;
  addName(name: InsertName): Promise<Name>;
  updateName(id: number, forgiven: boolean): Promise<Name>;
  deleteName(id: number): Promise<void>;
  getNotes(userId: string, exerciseId: number): Promise<Note[]>;
  addNote(note: InsertNote): Promise<Note>;
  deleteNote(id: number): Promise<void>;

    // Nuevos métodos para usuarios
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;

  // Store de sesiones
  sessionStore: session.Store;
}

// Exportar implementación real con Supabase
export const storage = new SupabaseStorage();
