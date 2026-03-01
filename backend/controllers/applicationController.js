const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (JobSeeker)
const applyForJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check if user already applied
    const alreadyApplied = await Application.findOne({
        jobId: req.params.jobId,
        jobSeekerId: req.user.id,
    });

    if (alreadyApplied) {
        res.status(400);
        throw new Error('You have already applied for this job');
    }

    if (!req.user.resumeUrl) {
        res.status(400);
        throw new Error('Please upload a resume in your profile to apply');
    }

    const application = await Application.create({
        jobId: req.params.jobId,
        jobSeekerId: req.user.id,
        resumeUrl: req.user.resumeUrl,
        message: req.body.message || '',
    });

    // Notify recruiter
    await Notification.create({
        userId: job.recruiter,
        message: `New application received for ${job.title} from ${req.user.name}`,
    });

    res.status(201).json(application);
});

// @desc    Get user's applied jobs
// @route   GET /api/applications/me
// @access  Private (JobSeeker)
const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ jobSeekerId: req.user.id })
        .populate('jobId', 'title companyName location')
        .sort({ createdAt: -1 });

    res.status(200).json(applications);
});

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplications = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check if authorized
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    const applications = await Application.find({ jobId: req.params.jobId })
        .populate('jobSeekerId', 'name email skills experience education resumeUrl profilePic')
        .sort({ createdAt: -1 });

    res.status(200).json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Recruiter)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    const job = await Job.findById(application.jobId);

    // Check if authorized
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    application.status = req.body.status || application.status;
    const updatedApplication = await application.save();

    // Notify job seeker
    await Notification.create({
        userId: application.jobSeekerId,
        message: `Your application status for ${job.title} has been updated to: ${application.status}`,
    });

    res.status(200).json(updatedApplication);
});

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
};
