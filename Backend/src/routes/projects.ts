import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUser,
} from "../handlers/projectsHandler";
import tasksRouter from "./task";
const router = Router();

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.post("/", createProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

router.use("/:projectId/tasks", tasksRouter);

router.get("/user/:userId", getProjectsByUser);

export default router;
