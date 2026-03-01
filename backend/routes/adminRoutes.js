const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUser,
    getStats,
    approveUser,
    approveJob,
    getAllJobsAdmin
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/users', protect, isAdmin, getUsers);
router.put('/users/:id/approve', protect, isAdmin, approveUser);
router.delete('/users/:id', protect, isAdmin, deleteUser);
router.get('/stats', protect, isAdmin, getStats);
router.get('/jobs', protect, isAdmin, getAllJobsAdmin);
router.put('/jobs/:id/approve', protect, isAdmin, approveJob);

module.exports = router;
