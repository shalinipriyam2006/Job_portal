const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a job title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a job description'],
        },
        companyName: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        jobType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
            required: [true, 'Please specify job type'],
        },
        salary: {
            type: String,
            required: [true, 'Please specify a salary range or amount'],
        },
        requirements: {
            type: [String],
            required: [true, 'Please add requirements/skills needed'],
        },
        experienceLevel: {
            type: String,
            enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
            required: [true, 'Please specify experience level'],
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open',
        },
        remote: {
            type: Boolean,
            default: false,
        },
        isApproved: {
            type: Boolean,
            default: false, // all jobs need admin approval by default
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Job', jobSchema);
