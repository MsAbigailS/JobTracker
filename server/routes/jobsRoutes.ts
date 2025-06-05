import { Router } from 'express';
import { createJob, getJobs } from '../controllers/jobsController';
import { get } from 'http';

const router = Router();

router.get('/getJobs', getJobs);
router.post('/createJob', createJob);

export default router;