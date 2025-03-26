import { createClient } from "@supabase/supabase-js";
import type { IStorage } from "./storage";
import type { Name, Note, InsertName, InsertNote, User, InsertUser } from "@shared/schema";
import session from "express-session";

// Cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export class SupabaseStorage implements IStorage {
  sessionStore = new session.MemoryStore(); // puedes migrar a uno persistente si lo deseas

  // --- NAMES ---
  async getNames(userId: string, exerciseId: number): Promise<Name[]> {
    console.log("→ getNames ejecutado con:", { userId, exerciseId });
  
    const { data, error } = await supabase
      .from("names")
      .select("*")
      .eq("user_id", userId)
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("🛑 Error al obtener nombres:", error);
      throw error;
    }
  
    console.log("✅ Datos obtenidos:", data);
    return data as Name[];
  }
  

  async addName(input: InsertName): Promise<Name> {
    const { data, error } = await supabase
      .from("names")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data as Name;
  }

  async updateName(id: number, forgiven: boolean): Promise<Name> {
    const { data, error } = await supabase
      .from("names")
      .update({ forgiven })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Name;
  }

  async deleteName(id: number): Promise<void> {
    const { error } = await supabase
      .from("names")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // --- NOTES ---
  async getNotes(userId: string, exerciseId: number): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Note[];
  }

  async addNote(input: InsertNote): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  }

  async deleteNote(id: number): Promise<void> {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  // --- USERS ---
  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  }
}
