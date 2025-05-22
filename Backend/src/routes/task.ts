import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../handlers/taskHandler";

const router = Router({ mergeParams: true });
// Rutas para proyecto específico
router.get("/:projectId", getTasks); 

router.get("/:projectId/:taskId", getTaskById); 

router.post("/:projectId", createTask); 

router.put("/:projectId/:taskId", updateTask); 

router.delete("/:projectId/:taskId", deleteTask); 

export default router;
