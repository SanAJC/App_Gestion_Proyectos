import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects';
import tasksRouter from './routes/task';
import authRouter from './routes/auth';
import githubRoutes from './routes/github';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);
app.use('/api/github', githubRoutes);

app.use(errorHandler);

export default app;