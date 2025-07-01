import { createClient } from "@supabase/supabase-js";
import type { IStorage } from "./storage";
import type { Name, Note, InsertName, InsertNote, User, InsertUser } from "@shared/schema";
import session from "express-session";

// Verificación de variables de entorno
console.log("⚙️ Verificando variables de entorno:");
console.log("SUPABASE_URL presente:", Boolean(process.env.SUPABASE_URL));
console.log(
  "SUPABASE_ANON_KEY longitud:",
  process.env.SUPABASE_ANON_KEY?.length || 0
);

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
    console.log("→ addName ejecutado con:", input);

    const { data, error } = await supabase
      .from("names")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("🛑 Error al agregar nombre:", error);
      throw error;
    }

    console.log("✅ Nombre agregado:", data);
    return data as Name;
  }

  async updateName(id: number, forgiven: boolean): Promise<Name> {
    console.log("→ updateName ejecutado con:", { id, forgiven });

    const { data, error } = await supabase
      .from("names")
      .update({ forgiven })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("🛑 Error al actualizar nombre:", error);
      throw error;
    }

    console.log("✅ Nombre actualizado:", data);
    return data as Name;
  }

  async deleteName(id: number): Promise<void> {
    console.log("→ deleteName ejecutado con ID:", id);

    const { error } = await supabase
      .from("names")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("🛑 Error al eliminar nombre:", error);
      throw error;
    }

    console.log("✅ Nombre eliminado");
  }

  // --- NOTES ---
  async getNotes(userId: string, exerciseId: number): Promise<Note[]> {
    console.log("→ getNotes ejecutado con:", { userId, exerciseId });

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("🛑 Error al obtener notas:", error);
      throw error;
    }

    console.log("✅ Notas obtenidas:", data);
    return data as Note[];
  }

  async addNote(input: InsertNote): Promise<Note> {
    console.log("→ addNote ejecutado con:", input);

    const { data, error } = await supabase
      .from("notes")
      .insert([input])
      .select()
      .single();

    if (error) {
      console.error("🛑 Error al agregar nota:", error);
      throw error;
    }

    console.log("✅ Nota agregada:", data);
    return data as Note;
  }

  async deleteNote(id: number): Promise<void> {
    console.log("→ deleteNote ejecutado con ID:", id);

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("🛑 Error al eliminar nota:", error);
      throw error;
    }

    console.log("✅ Nota eliminada");
  }

  // --- USERS ---
  async createUser(user: InsertUser): Promise<User> {
    console.log("→ createUser ejecutado con:", user);

    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) {
      console.error("🛑 Error al crear usuario:", error);
      throw error;
    }

    console.log("✅ Usuario creado:", data);
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    console.log("→ getUserByEmail ejecutado con email:", email);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("🛑 Error al obtener usuario por email:", error);
      throw error;
    }

    console.log("✅ Usuario obtenido por email:", data);
    return data || null;
  }

  async getUserById(id: string): Promise<User | null> {
    console.log("→ getUserById ejecutado con ID:", id);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("🛑 Error al obtener usuario por ID:", error);
      throw error;
    }

    console.log("✅ Usuario obtenido por ID:", data);
    return data || null;
  }
}
