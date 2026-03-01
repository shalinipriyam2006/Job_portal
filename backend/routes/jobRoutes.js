const express = require('express');
const router = express.Router();
const {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getRecruiterJobs,
} = require('../controllers/jobController');
const { protect, isRecruiter } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, isRecruiter, createJob);
router.route('/me').get(protect, isRecruiter, getRecruiterJobs);
router
    .route('/:id')
    .get(getJob)
    .put(protect, isRecruiter, updateJob)
    .delete(protect, isRecruiter, deleteJob);

module.exports = router;
