import { Router } from 'express';
import { createJob, getJobs, updateJob, deleteJob } from '../controllers/jobsController';
import { get } from 'http';

const router = Router();

router.get('/getJobs', getJobs);
router.post('/createJob', createJob);
router.patch('/updateJob/:id', updateJob);
router.patch('/deleteJob/:id', deleteJob);

export default router;