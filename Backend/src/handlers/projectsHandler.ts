import { Request, Response , NextFunction } from 'express';
import { db } from '../config/firebase';
import axios from 'axios';
import { Project } from '../types/type';


export const getProjects = async(req: Request, res: Response ,  next: NextFunction) =>{

    try {
        const snapshot = await db.collection('projects').get();
        const projects:Project[] = []

        snapshot.forEach(doc=>{
            projects.push({id:doc.id, ...doc.data()} as Project)
        })

        res.status(200).json(projects);

    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const projectDoc = await db.collection('projects').doc(id).get();
      if (!projectDoc.exists) {
        res.status(404).json({ message: 'Proyecto no encontrado' });
        return
      }
      const project = { id: projectDoc.id, ...projectDoc.data() } as Project;
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const projectData: Project = req.body;
      const projectRef = await db.collection('projects').add(projectData);
      res.status(201).json({ message: 'Proyecto creado correctamente', id: projectRef.id });
    } catch (error) {
      next(error);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { id } = req.params;
      const updateData = req.body;
      await db.collection('projects').doc(id).update(updateData);
      res.status(200).json({ message: 'Proyecto actualizado correctamente' });
    } catch (error) {
      next(error);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { id } = req.params;
      await db.collection('projects').doc(id).delete();
      res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
      next(error);
    }
};