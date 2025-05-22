import { Request, Response, NextFunction } from "express";
import { auth, db } from "../config/firebase";

// Middleware para verificar el token de Firebase
export const verifyFirebaseToken: import("express").RequestHandler = (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res
      .status(401)
      .json({ message: "No se proporcionó token de autenticación" });
    return;
  }
  const token = authHeader.split(" ")[1] || authHeader;
  auth
    .verifyIdToken(token)
    .then((decoded) => {
      req.body.uid = decoded.uid;
      next();
    })
    .catch(() => {
      res.status(401).json({ message: "Token inválido" });
    });
};

// Handler para obtener el perfil del usuario autenticado
export const getProfile: import("express").RequestHandler = (req, res) => {
  const uid = req.body.uid;
  if (!uid) {
    res.status(400).json({ message: "No se pudo obtener el UID del usuario" });
    return;
  }
  db.collection("users")
    .doc(uid)
    .get()
    .then((userDoc) => {
      if (!userDoc.exists) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      const userData = userDoc.data();
      res.status(200).json({ user: { uid, ...userData } });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al obtener el perfil", error });
    });
};

// Handler para verificar si un usuario existe por correo electrónico
export const checkUserByEmail: import("express").RequestHandler = async (
  req,
  res
) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res
      .status(400)
      .json({ message: "Se requiere un correo electrónico válido" });
    return;
  }

  try {
    // Buscar usuario por correo en la colección de usuarios
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      res.status(200).json({ exists: false });
      return;
    }

    const userData = usersSnapshot.docs[0].data();

    res.status(200).json({
      exists: true,
      username: userData.username || userData.displayName || "Usuario",
      email: userData.email,
    });
  } catch (error) {
    console.error("Error al verificar usuario por correo:", error);
    res.status(500).json({ message: "Error al verificar usuario", error });
  }
};
