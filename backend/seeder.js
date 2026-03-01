const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    try {
        await connectDB();

        // Remove existing users to cleanly seed (optional, but let's just create if not exists)
        const existingAdmin = await User.findOne({ email: 'admin@jobportal.com' });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@jobportal.com',
                password: hashedPassword,
                role: 'admin',
                isApproved: true
            });
            console.log('Admin user created: admin@jobportal.com / admin123');
        } else {
            console.log('Admin user already exists');
        }

        const existingRecruiter = await User.findOne({ email: 'recruiter@company.com' });
        if (!existingRecruiter) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('recruiter123', salt);

            await User.create({
                name: 'Tech Recruiter',
                email: 'recruiter@company.com',
                password: hashedPassword,
                role: 'recruiter',
                companyName: 'Tech Innovators',
                isApproved: true
            });
            console.log('Recruiter user created: recruiter@company.com / recruiter123');
        }

        const existingSeeker = await User.findOne({ email: 'seeker@user.com' });
        if (!existingSeeker) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('seeker123', salt);

            await User.create({
                name: 'John Doe',
                email: 'seeker@user.com',
                password: hashedPassword,
                role: 'jobseeker',
                isApproved: true
            });
            console.log('Seeker user created: seeker@user.com / seeker123');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
