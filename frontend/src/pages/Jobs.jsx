import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const queryParams = new URLSearchParams(location.search).toString();
                const res = await api.get(`/jobs?${queryParams}`);
                setJobs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [location.search]);

    const handleApply = async (jobId) => {
        try {
            setMessage('');
            setError('');
            // Need a resumeURL for applying, mock for now if not uploaded
            await api.post(`/applications/${jobId}`, { message: 'I am interested' });
            setMessage('Successfully applied to job!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply. Make sure you are logged in as a job seeker.');
        }
    };

    if (loading) return <div className="loader mt-8"></div>;

    return (
        <div className="animate-fade-in mb-8">
            <h1 className="mb-8 font-bold" style={{ fontSize: '2.5rem' }}>Explore Jobs</h1>

            {message && <div className="badge badge-approved p-4 mb-4 text-center text-lg">{message}</div>}
            {error && <div className="badge badge-rejected p-4 mb-4 text-center text-lg">{error}</div>}

            <div className="grid-2">
                {jobs.length === 0 ? (
                    <p className="text-muted">No jobs found matching your criteria.</p>
                ) : (
                    jobs.map(job => (
                        <div key={job._id} className="job-card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '600' }}>{job.title}</h3>
                                    <p className="text-primary mt-1 font-medium">{job.companyName}</p>
                                </div>
                                <span className="badge badge-approved">{job.jobType}</span>
                            </div>

                            <div className="text-sm text-muted mb-4 line-clamp-2" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {job.description}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted mb-6">
                                <div className="flex items-center gap-1"><MapPin size={16} /> {job.location}</div>
                                <div className="flex items-center gap-1"><Briefcase size={16} /> {job.experienceLevel}</div>
                                <div className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</div>
                                <div className="flex items-center gap-1"><Clock size={16} /> {new Date(job.createdAt).toLocaleDateString()}</div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                {user?.role === 'jobseeker' ? (
                                    <button onClick={() => handleApply(job._id)} className="btn-primary w-full block text-center" style={{ width: '100%' }}>Apply Now</button>
                                ) : user?.role === 'recruiter' || user?.role === 'admin' ? (
                                    <button className="btn-outline w-full cursor-default" style={{ width: '100%' }} disabled>Cannot apply as {user.role}</button>
                                ) : (
                                    <Link to="/login" className="btn-outline w-full block text-center mt-2">Login to Apply</Link>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Jobs;
