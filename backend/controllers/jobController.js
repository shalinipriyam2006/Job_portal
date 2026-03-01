const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

// @desc    Get jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
    let { keyword, location, jobType, remote } = req.query;

    const query = { isApproved: true, status: 'Open' };

    if (keyword && keyword.trim() !== '') {
        keyword = keyword.trim();
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { companyName: { $regex: keyword, $options: 'i' } },
            { requirements: { $regex: keyword, $options: 'i' } },
            { location: { $regex: keyword, $options: 'i' } },
        ];
    }

    if (location && location.trim() !== '') {
        location = location.trim();
        query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
        query.jobType = jobType;
    }

    if (remote === 'true') {
        query.remote = true;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json(jobs);
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email companyName');

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    res.status(200).json(job);
});

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = asyncHandler(async (req, res) => {
    const { title, description, companyName, location, jobType, salary, requirements, experienceLevel, remote } = req.body;

    if (!title || !description || !companyName || !location || !jobType || !salary || !requirements || !experienceLevel) {
        res.status(400);
        throw new Error('Please add all essential fields');
    }

    const job = await Job.create({
        recruiter: req.user.id,
        title,
        description,
        companyName,
        location,
        jobType,
        salary,
        requirements: requirements.split(',').map(req => req.trim()),
        experienceLevel,
        remote: remote || false,
    });

    res.status(201).json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check for recruiter user
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    let updatedData = req.body;

    if (req.body.requirements && typeof req.body.requirements === 'string') {
        updatedData.requirements = req.body.requirements.split(',').map(req => req.trim());
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
    });

    res.status(200).json(updatedJob);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Check for recruiter user
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized');
    }

    await job.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Get logged in recruiter jobs
// @route   GET /api/jobs/me
// @access  Private
const getRecruiterJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
});


module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getRecruiterJobs,
};
