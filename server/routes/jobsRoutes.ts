import { Router } from 'express';
import { createJob } from '../controllers/jobsController';

const router = Router();

router.post('/', createJob);

export default router;