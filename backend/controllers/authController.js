const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'jobseeker',
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isApproved) {
            res.status(401);
            throw new Error('Your account is blocked or pending admin approval.');
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.title = req.body.title || user.title;
        user.skills = req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : user.skills;
        user.experience = req.body.experience || user.experience;
        user.education = req.body.education || user.education;
        user.companyName = req.body.companyName || user.companyName;
        user.companyDescription = req.body.companyDescription || user.companyDescription;
        user.companyLocation = req.body.companyLocation || user.companyLocation;

        if (req.files) {
            if (req.files.resume && req.files.resume.length > 0) {
                user.resumeUrl = `/uploads/${req.files.resume[0].filename}`;
            }
            if (req.files.profilePic && req.files.profilePic.length > 0) {
                user.profilePic = `/uploads/${req.files.profilePic[0].filename}`;
            }
        } else if (req.file) {
            if (req.file.fieldname === 'resume') {
                user.resumeUrl = `/uploads/${req.file.filename}`;
            } else if (req.file.fieldname === 'profilePic') {
                user.profilePic = `/uploads/${req.file.filename}`;
            }
        }

        const updatedUser = await user.save();

        // Check if score needs update
        const score = calculateProfileScore(updatedUser);

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            title: updatedUser.title,
            skills: updatedUser.skills,
            experience: updatedUser.experience,
            education: updatedUser.education,
            resumeUrl: updatedUser.resumeUrl,
            profilePic: updatedUser.profilePic,
            companyName: updatedUser.companyName,
            companyDescription: updatedUser.companyDescription,
            companyLocation: updatedUser.companyLocation,
            profileScore: score,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Helper: Calculate Profile Score
const calculateProfileScore = (user) => {
    let score = 0;
    if (user.name) score += 20;
    if (user.title) score += 20;
    if (user.skills && user.skills.length > 0) score += 20;
    if (user.experience || user.education) score += 20;
    if (user.resumeUrl) score += 20;
    return score;
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
};
