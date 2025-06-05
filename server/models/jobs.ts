import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true }
});

export const Job = mongoose.model("Job", jobSchema);