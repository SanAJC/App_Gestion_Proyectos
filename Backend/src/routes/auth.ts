import { Router} from 'express';
import { githubCallback, githubRedirect, login, register } from '../handlers/authHandler';

const router = Router();

router.post('/login', login);
router.post('/register', register);

router.get('/github',githubRedirect);
router.get('/github/callback',githubCallback);

export default router;  