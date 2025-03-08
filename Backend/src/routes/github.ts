import { Router } from 'express';
import { getUserRepos } from '../handlers/githubHandler';

const router = Router();
router.get('/repos', getUserRepos);

export default router;