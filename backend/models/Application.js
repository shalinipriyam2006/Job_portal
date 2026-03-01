const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Job',
        },
        jobSeekerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        resumeUrl: {
            type: String,
            required: [true, 'Please provide a resume'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Shortlisted', 'Rejected', 'Interviewing', 'Hired'],
            default: 'Pending',
        },
        message: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Application', applicationSchema);
