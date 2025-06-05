import express from 'express';
import jobRoutes from './routes/jobsRoutes';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/jobs', jobRoutes);

export default app;