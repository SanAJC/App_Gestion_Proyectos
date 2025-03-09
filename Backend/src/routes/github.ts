import { Router } from 'express';
import { getUserRepos, getLanguages , getEvents } from '../handlers/githubHandler';

const router = Router();
router.get('/repos', getUserRepos);
router.get('/languages/:owner/:repo',getLanguages);
router.get('/events/:owner/:repo',getEvents);

export default router;