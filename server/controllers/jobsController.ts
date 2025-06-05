import { Request, Response } from 'express';
import { Job } from '../models/jobs';

export const createJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, company } = req.body;
        const job = new Job({ role, company });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
