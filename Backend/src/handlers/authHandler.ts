import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';

// Endpoint para iniciar sesión usando la API REST de Firebase
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const apiKey = process.env.FIREBASE_API_KEY_; 

  if (!apiKey) {
    res.status(500).json({ message: "FIREBASE_API_KEY no configurada" });
    return;
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    if (!response.ok) {
      const errorData = await response.json();
      res.status(400).json({ message: "Error al iniciar sesión", error: errorData });
      return
    }

    const data = await response.json();
    res.status(200).json({ message: "Login exitoso", data });
  } catch (error) {
    next(error);
  }
};

// Endpoint para registrar un nuevo usuario
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, rol } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username
    });
    const userDoc = {
      username,
      email,
      rol: rol || "user" 
    };
    await db.collection('users').doc(userRecord.uid).set(userDoc);

    res.status(201).json({ message: "Usuario registrado correctamente", uid: userRecord.uid });
  } catch (error) {
    next(error);
  }
};
