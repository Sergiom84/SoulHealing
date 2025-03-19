import { type Name, type Note, type InsertName, type InsertNote } from "@shared/schema";

export interface IStorage {
  getNames(): Promise<Name[]>;
  addName(name: InsertName): Promise<Name>;
  updateName(id: number, forgiven: boolean): Promise<Name>;
  deleteName(id: number): Promise<void>;
  getNotes(): Promise<Note[]>;
  addNote(note: InsertNote): Promise<Note>;
  deleteNote(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private names: Map<number, Name>;
  private notes: Map<number, Note>;
  private nameId: number;
  private noteId: number;

  constructor() {
    this.names = new Map();
    this.notes = new Map();
    this.nameId = 1;
    this.noteId = 1;
  }

  async getNames(): Promise<Name[]> {
    return Array.from(this.names.values());
  }

  async addName(insertName: InsertName): Promise<Name> {
    const id = this.nameId++;
    const name: Name = { id, ...insertName };
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

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
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
}

export const storage = new MemStorage();
