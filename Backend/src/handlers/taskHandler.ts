import { Request, Response, NextFunction } from "express";
import { db } from "../config/firebase";
import axios from "axios";
import { Task } from "../types/type";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const snapshot = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .get();
    const tasks: Task[] = [];

    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, taskId } = req.params;
    const taskDoc = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId)
      .get();
    if (!taskDoc.exists) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }
    res.status(200).json({ task: { id: taskDoc.id, ...taskDoc.data() } });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const taskData: Task = req.body;

    // Asegurarse de que los campos de listas estén correctamente inicializados
    if (taskData.commentsList && Array.isArray(taskData.commentsList)) {
      taskData.comments = taskData.commentsList.length;
    }

    if (taskData.attachmentsList && Array.isArray(taskData.attachmentsList)) {
      taskData.attachments = taskData.attachmentsList.length;
    }

    // Se agrega la tarea a la subcolección "tasks" del documento del proyecto
    const taskRef = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .add(taskData);

    // Recuperamos la tarea recién creada para devolverla completa en la respuesta
    const newTaskDoc = await taskRef.get();
    const newTask = { id: taskRef.id, ...newTaskDoc.data() };

    // Devolvemos la tarea completa para que el frontend pueda actualizar su estado
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, taskId } = req.params;

    const updateData = req.body;

    // Actualizar contadores basados en las listas de comentarios y archivos
    if (updateData.commentsList && Array.isArray(updateData.commentsList)) {
      updateData.comments = updateData.commentsList.length;
    }

    if (
      updateData.attachmentsList &&
      Array.isArray(updateData.attachmentsList)
    ) {
      updateData.attachments = updateData.attachmentsList.length;
    }

    await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId)
      .update(updateData);

    // Recuperamos la tarea actualizada para devolverla completa en la respuesta
    const updatedTaskDoc = await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId)
      .get();

    const updatedTask = { id: taskId, ...updatedTaskDoc.data() };

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, taskId } = req.params;

    await db
      .collection("projects")
      .doc(projectId)
      .collection("tasks")
      .doc(taskId)
      .delete();

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
