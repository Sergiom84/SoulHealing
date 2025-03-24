import { type Name, type Note, type InsertName, type InsertNote, type InsertUser, type User } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import crypto from 'crypto';

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private names: Map<number, Name>;
  private notes: Map<number, Note>;
  private users: Map<string, User>;
  private nameId: number;
  private noteId: number;
  sessionStore: session.Store;

  constructor() {
    this.names = new Map();
    this.notes = new Map();
    this.users = new Map();
    this.nameId = 1;
    this.noteId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Limpiar entradas expiradas cada 24h
    });
  }

  async getNames(userId: string, exerciseId: number): Promise<Name[]> {
    return Array.from(this.names.values())
      .filter(name => name.userId === userId && name.exerciseId === exerciseId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async addName(insertName: InsertName): Promise<Name> {
    const id = this.nameId++;
    const name: Name = { 
      id, 
      ...insertName,
      createdAt: new Date()
    };
    this.names.set(id, name);
    return name;
  }

  async updateName(id: number, forgiven: boolean): Promise<Name> {
    const name = this.names.get(id);
    if (!name) throw new Error("Name not found");
    const updated = { ...name, forgiven };
    this.names.set(id, updated);
    return updated;
  }

  async deleteName(id: number): Promise<void> {
    if (!this.names.delete(id)) {
      throw new Error("Name not found");
    }
  }

  async getNotes(userId: string, exerciseId: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.userId === userId && note.exerciseId === exerciseId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async addNote(insertNote: InsertNote): Promise<Note> {
    const id = this.noteId++;
    const note: Note = { 
      id, 
      ...insertNote,
      createdAt: new Date()
    };
    this.notes.set(id, note);
    return note;
  }

  async deleteNote(id: number): Promise<void> {
    if (!this.notes.delete(id)) {
      throw new Error("Note not found");
    }
  }

  // Implementación de métodos de usuario
  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
}

export const storage = new MemStorage();