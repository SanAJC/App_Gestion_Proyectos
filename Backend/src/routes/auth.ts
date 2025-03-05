import { Router} from 'express';
import { login, register } from '../handlers/authHandler';

const router = Router();

router.post('/login', login);
router.post('/register', register);

export default router;  