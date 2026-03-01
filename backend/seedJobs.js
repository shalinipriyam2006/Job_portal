const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const seedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        const recruiter = await User.findOne({ email: 'recruiter@company.com' });

        if (!recruiter) {
            console.error('Recruiter not found!');
            process.exit(1);
        }

        const jobs = [
            {
                recruiter: recruiter._id,
                title: 'Senior Frontend Developer',
                description: 'We are looking for an experienced frontend developer proficient in React and modern UI/UX design.',
                companyName: 'Tech Innovators',
                location: 'San Francisco, CA',
                jobType: 'Full-time',
                salary: '$120,000 - $150,000',
                requirements: ['React', 'JavaScript', 'CSS/SCSS', '3+ years experience'],
                experienceLevel: 'Senior Level',
                status: 'Open',
                remote: true,
                isApproved: true
            },
            {
                recruiter: recruiter._id,
                title: 'Backend Engineer (Node.js)',
                description: 'Join our backend team to scale our microservices using Node.js, Express, and MongoDB.',
                companyName: 'Tech Innovators',
                location: 'Austin, TX',
                jobType: 'Full-time',
                salary: '$110,000 - $140,000',
                requirements: ['Node.js', 'MongoDB', 'Express', 'API Design'],
                experienceLevel: 'Mid Level',
                status: 'Open',
                remote: false,
                isApproved: true
            },
            {
                recruiter: recruiter._id,
                title: 'UI/UX Designer',
                description: 'Seeking a creative UI/UX designer to craft beautiful and intuitive user interfaces.',
                companyName: 'Design Studio LLC',
                location: 'New York, NY',
                jobType: 'Contract',
                salary: '$60 - $80 / hr',
                requirements: ['Figma', 'Adobe XD', 'Prototyping', 'Portfolio required'],
                experienceLevel: 'Mid Level',
                status: 'Open',
                remote: true,
                isApproved: true
            }
        ];

        await Job.insertMany(jobs);
        console.log('Jobs seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedJobs();
