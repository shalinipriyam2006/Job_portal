const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, isRecruiter } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, applyForJob);
router.get('/me', protect, getMyApplications);
router.get('/job/:jobId', protect, isRecruiter, getJobApplications);
router.put('/:id', protect, isRecruiter, updateApplicationStatus);

module.exports = router;
