import React, { useEffect, useState } from 'react';
import api from '../api';
import { UserCheck, Briefcase, Users, LayoutDashboard, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, jobsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/jobs')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data.filter(u => u.role === 'recruiter'));
            setJobs(jobsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApproveRecruiter = async (id, isApproved) => {
        try {
            await api.put(`/admin/users/${id}/approve`, { isApproved });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleApproveJob = async (id, isApproved) => {
        try {
            await api.put(`/admin/jobs/${id}/approve`, { isApproved });
            fetchData();
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="loader mt-10"></div>;

    return (
        <div className="animate-fade-in mb-10">
            <div className="flex items-center gap-3 mb-8">
                <LayoutDashboard size={32} className="text-primary" />
                <h1 style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
            </div>

            <div className="grid-3 mb-10">
                <div className="glass-panel text-center p-6">
                    <Users size={32} className="text-primary mx-auto mb-2" />
                    <h2 style={{ fontSize: '2rem' }}>{stats.users + stats.recruiters}</h2>
                    <p className="text-muted">Total Users</p>
                </div>
                <div className="glass-panel text-center p-6">
                    <Briefcase size={32} className="text-primary mx-auto mb-2" />
                    <h2 style={{ fontSize: '2rem' }}>{stats.jobs}</h2>
                    <p className="text-muted">Total Jobs</p>
                </div>
                <div className="glass-panel text-center p-6" style={{ borderColor: stats.pendingUsers > 0 ? 'var(--warning)' : '' }}>
                    <UserCheck size={32} className={stats.pendingUsers > 0 ? "text-warning mx-auto mb-2" : "text-primary mx-auto mb-2"} />
                    <h2 style={{ fontSize: '2rem' }}>{stats.pendingUsers}</h2>
                    <p className="text-muted">Pending Recruiters</p>
                </div>
            </div>

            <h2 className="mb-4 font-bold text-xl">Recruiter Approvals</h2>
            <div className="glass-panel p-4 mb-8 overflow-x-auto">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(rec => (
                            <tr key={rec._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td className="p-4">{rec.name}</td>
                                <td className="p-4">{rec.email}</td>
                                <td className="p-4">{rec.companyName}</td>
                                <td className="p-4">
                                    <span className={`badge ${rec.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                                        {rec.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {!rec.isApproved ? (
                                        <button onClick={() => handleApproveRecruiter(rec._id, true)} className="btn-success" style={{ padding: '4px 12px' }}>Approve</button>
                                    ) : (
                                        <button onClick={() => handleApproveRecruiter(rec._id, false)} className="btn-danger" style={{ padding: '4px 12px' }}>Block</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-muted">No recruiters found</td></tr>}
                    </tbody>
                </table>
            </div>

            <h2 className="mb-4 font-bold text-xl">Job Approvals</h2>
            <div className="glass-panel p-4 overflow-x-auto mb-8">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th className="p-4">Job Title</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td className="p-4">{job.title}</td>
                                <td className="p-4">{job.companyName}</td>
                                <td className="p-4">
                                    <span className={`badge ${job.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                                        {job.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {!job.isApproved ? (
                                        <button onClick={() => handleApproveJob(job._id, true)} className="btn-success" style={{ padding: '4px 12px' }}>Approve</button>
                                    ) : (
                                        <button onClick={() => handleApproveJob(job._id, false)} className="btn-danger" style={{ padding: '4px 12px' }}>Reject</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-muted">No jobs found</td></tr>}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminDashboard;
