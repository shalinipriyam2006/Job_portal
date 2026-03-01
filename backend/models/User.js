const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['jobseeker', 'recruiter', 'admin'],
            default: 'jobseeker',
        },
        profilePic: {
            type: String,
            default: '',
        },
        title: {
            type: String, // e.g., "Full Stack Developer"
            default: '',
        },
        companyName: {
            type: String, // For recruiters
            default: '',
        },
        companyDescription: {
            type: String,
            default: '',
        },
        companyLocation: {
            type: String,
            default: '',
        },
        skills: {
            type: [String],
            default: [],
        },
        resumeUrl: {
            type: String,
            default: '',
        },
        experience: {
            type: String,
            default: '',
        },
        education: {
            type: String,
            default: '',
        },
        isApproved: {
            type: Boolean,
            default: function () {
                // If the role is recruiter, default is false (needs admin approval)
                return this.role !== 'recruiter';
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
