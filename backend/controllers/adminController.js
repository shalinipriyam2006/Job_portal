const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Approve/Block user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
const approveUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot modify admin user');
        }

        user.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : true;
        await user.save();
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Approve/Reject job
// @route   PUT /api/admin/jobs/:id/approve
// @access  Private/Admin
const approveJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        job.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : true;
        await job.save();
        res.status(200).json(job);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments({ role: 'jobseeker' });
    const recruitersCount = await User.countDocuments({ role: 'recruiter' });
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();
    const pendingUsers = await User.countDocuments({ isApproved: false, role: 'recruiter' });
    const pendingJobs = await Job.countDocuments({ isApproved: false });

    res.status(200).json({
        users: usersCount,
        recruiters: recruitersCount,
        jobs: jobsCount,
        applications: applicationsCount,
        pendingUsers: pendingUsers,
        pendingJobs: pendingJobs
    });
});

// @desc    Get all jobs (Admin needs to see unapproved ones)
// @route   GET /api/admin/jobs
// @access  Private/Admin
const getAllJobsAdmin = asyncHandler(async (req, res) => {
    const jobs = await Job.find({}).populate('recruiter', 'name email').sort({ createdAt: -1 });
    res.status(200).json(jobs);
});

module.exports = {
    getUsers,
    deleteUser,
    getStats,
    approveUser,
    approveJob,
    getAllJobsAdmin
};
