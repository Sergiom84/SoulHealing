import { Express, Request, Response, NextFunction } from "express";
import session, { Session, SessionData } from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import type { User } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    throw new Error("SESSION_SECRET environment variable is not defined");
  }

  // Configuración de sesión
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      },
    })
  );

  // Ruta de registro
  app.post("/api/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const { email, password } = result.data;

      // Verificar si el usuario ya existe
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await storage.createUser({
        email,
        password: hashedPassword,
      });

      // Iniciar sesión
      req.session.userId = user.id;
      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  // Ruta de inicio de sesión
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  // Ruta de cierre de sesión
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error en logout:", err);
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.status(200).json({ message: "Sesión cerrada" });
    });
  });

  // Middleware para verificar autenticación
  app.use("/api/names", authenticateUser);
  app.use("/api/notes", authenticateUser);
}

// Middleware de autenticación
function authenticateUser(
  req: Request & { session: Session & Partial<SessionData> },
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "No autenticado" });
  }
  next();
}
