import { Request, Response } from 'express';
import { Job } from '../models/jobs';

export const createJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            role,
            company,
            dateApplied,
            status,
            notes,
            location,
            workArrangement,
            type,
            salaryType,
            salary
        } = req.body;
        const job = new Job(
            {
                role,
                company,
                dateApplied,
                status,
                notes,
                location,
                workArrangement,
                type,
                salaryType,
                salary
            }
        );
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const updateFields = req.body

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { $set: updateFields },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedJob) {
            console.log("ERROR: Could not find job to update")
            res.status(500).json({ message: "Job not found" })
        }

        res.status(201).json('successfulUpdate');
    } catch (err) {
        console.log("ERROR: Unable to update job record.", err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}