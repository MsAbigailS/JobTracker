import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import app from './app';

dotenv.config({ path: path.resolve(__dirname, '../server/.env') }); // keeping .env in server

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;


if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env');
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('ERROR: Failed to connect to MongoDB:', error);
        process.exit(1);
    });
