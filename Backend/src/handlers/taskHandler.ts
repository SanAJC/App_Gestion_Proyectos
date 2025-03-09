import { Request, Response , NextFunction } from 'express';
import { db } from '../config/firebase';
import axios from 'axios';
import { Task } from '../types/type';


export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const snapshot = await db.collection('projects').doc(projectId).collection('tasks').get();
      const tasks: Task[] = [];

      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
      });

      res.status(200).json({ tasks });
    } catch (error) {
      next(error);
    }
  };

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, taskId } = req.params;
    const taskDoc = await db.collection('projects').doc(projectId).collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }
    res.status(200).json({ task: { id: taskDoc.id, ...taskDoc.data() } });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const taskData: Task = req.body;
        // Se agrega la tarea a la subcolección "tasks" del documento del proyecto
        const taskRef = await db.collection('projects').doc(projectId).collection('tasks').add(taskData);

        res.status(201).json({ message: 'Tarea creada correctamente', taskId: taskRef.id });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, taskId } = req.params;

        const updateData = req.body;

        await db.collection('projects').doc(projectId).collection('tasks').doc(taskId).update(updateData);

        res.status(200).json({ message: 'Tarea actualizada correctamente' });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, taskId } = req.params;

        await db.collection('projects').doc(projectId).collection('tasks').doc(taskId).delete();

        res.status(200).json({ message: 'Tarea eliminada correctamente' });

    } catch (error) {
        next(error);
    }
};