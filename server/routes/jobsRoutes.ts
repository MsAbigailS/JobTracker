import { Router } from 'express';
import { createJob, getJobs, updateJob } from '../controllers/jobsController';
import { get } from 'http';

const router = Router();

router.get('/getJobs', getJobs);
router.post('/createJob', createJob);
router.patch('/updateJob/:id', updateJob);

export default router;