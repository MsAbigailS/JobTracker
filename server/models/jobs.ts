import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    dateApplied: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'offer', 'rejected'],
        default: 'applied',
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    workArrangement: {
        type: String,
        enum: ['remote', 'on-site', 'hybrid'],
        default: 'remote'
    },
    link: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    salaryType: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly'
    },
    salary: {
        type: Number,
        default: 0
    }
});

export const Job = mongoose.model("Job", jobSchema);