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
