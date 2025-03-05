import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectsRouter from './routes/projects';
import authRouter from './routes/auth';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/projects', projectsRouter);
app.use('/api/auth', authRouter);


app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Servidor corriendo en http://localhost:${port}`);
});