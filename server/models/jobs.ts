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
        default: 'remote',
        required: true
    },
    link: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time',
        required: true
    },
    salaryType: {
        type: String,
        enum: ['hourly', 'monthly', 'yearly'],
        default: 'yearly',
        required: true
    },
    salary: {
        type: Number,
        default: 0,
        required: true
    },
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {},
        required: false
    }
});

export const Job = mongoose.model("Job", jobSchema);