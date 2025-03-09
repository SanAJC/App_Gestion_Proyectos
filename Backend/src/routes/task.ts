import { Router } from 'express';
import { getTasks,getTaskById,createTask,updateTask,deleteTask } from '../handlers/taskHandler';

const router = Router({ mergeParams: true });
router.get('/',getTasks);

router.get('/:id',getTaskById);

router.post('/',createTask);

router.put('/:id',updateTask);

router.delete('/:id',deleteTask);


export default router;
