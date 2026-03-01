import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Plus, FileText, CheckCircle, XCircle } from 'lucide-react';

const RecruiterDashboard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', companyName: user?.companyName || '',
        location: '', jobType: 'Full-time', salary: '', requirements: '', experienceLevel: 'Mid Level'
    });

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/me');
            setJobs(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', formData);
            setShowForm(false);
            setFormData({
                title: '', description: '', companyName: user?.companyName || '',
                location: '', jobType: 'Full-time', salary: '', requirements: '', experienceLevel: 'Mid Level'
            });
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job?')) {
            try {
                await api.delete(`/jobs/${id}`);
                fetchJobs();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div className="animate-fade-in mb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-bold flex items-center gap-2" style={{ fontSize: '2.5rem' }}>
                        <Briefcase className="text-primary" /> Recruiter Dashboard
                    </h1>
                    <p className="text-muted mt-2">Welcome, {user?.name} from {user?.companyName || 'your company'}</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    <Plus size={18} /> {showForm ? 'Cancel' : 'Post New Job'}
                </button>
            </div>

            {showForm && (
                <div className="glass-panel p-6 mb-8 max-w-2xl animate-fade-in">
                    <h2 className="mb-4 text-xl font-semibold">Post a Job</h2>
                    <form onSubmit={handlePostJob} className="flex flex-col gap-4">
                        <div className="grid-2">
                            <input type="text" placeholder="Job Title" className="input-field" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            <input type="text" placeholder="Company Name" className="input-field" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
                            <input type="text" placeholder="Location" className="input-field" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                            <input type="text" placeholder="Salary" className="input-field" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} required />
                            <select className="input-field" style={{ background: '#1E293B', color: 'white' }} value={formData.jobType} onChange={e => setFormData({ ...formData, jobType: e.target.value })}>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                            <select className="input-field" style={{ background: '#1E293B', color: 'white' }} value={formData.experienceLevel} onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}>
                                <option value="Entry Level">Entry Level</option>
                                <option value="Mid Level">Mid Level</option>
                                <option value="Senior Level">Senior Level</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>
                        <textarea placeholder="Job Description" className="input-field" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required></textarea>
                        <textarea placeholder="Requirements (comma separated)" className="input-field" rows="2" value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} required></textarea>
                        <button type="submit" className="btn-primary mt-2">Submit Job</button>
                    </form>
                </div>
            )}

            <h2 className="font-semibold text-xl mb-4">Your Posted Jobs</h2>
            <div className="grid-3">
                {jobs.length === 0 ? <p className="text-muted">You haven't posted any jobs yet.</p> : jobs.map(job => (
                    <div key={job._id} className="job-card glass-panel flex flex-col">
                        <h3 className="text-lg font-bold">{job.title}</h3>
                        <p className="text-muted text-sm">{job.location} • {job.jobType}</p>

                        <div className="mt-4 mb-4">
                            <span className={`badge ${job.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                                {job.isApproved ? 'Approved by Admin' : 'Pending Approval'}
                            </span>
                        </div>

                        <div className="mt-auto flex gap-2">
                            <button onClick={() => handleDelete(job._id)} className="btn-danger w-full">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
