import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { User, FileText, Upload, CheckCircle } from 'lucide-react';

const SeekerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({});
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meRes, appRes] = await Promise.all([
                    api.get('/users/me'),
                    api.get('/applications/me')
                ]);
                setProfile(meRes.data);
                setApplications(appRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        const formData = new FormData();
        formData.append('resume', resumeFile);
        try {
            const res = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data);
            alert('Resume Uploaded Successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loader mt-8"></div>;

    return (
        <div className="animate-fade-in mb-10">
            <h1 className="font-bold flex items-center gap-2 mb-8" style={{ fontSize: '2.5rem' }}>
                <User className="text-primary" /> My Dashboard
            </h1>

            <div className="grid-2 mb-8">
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
                    <p><span className="text-muted">Name:</span> {profile.name}</p>
                    <p className="mt-2"><span className="text-muted">Email:</span> {profile.email}</p>
                    <p className="mt-2 text-primary">Score: {profile.profileScore || 'N/A'}/100</p>

                    <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                        <h3 className="font-medium mb-3">Upload Resume</h3>
                        <form onSubmit={handleResumeUpload} className="flex gap-2 items-center">
                            <input type="file" onChange={e => setResumeFile(e.target.files[0])} accept=".pdf,.doc,.docx" className="text-sm text-muted outline-none" />
                            <button type="submit" className="btn-outline px-4 py-2 text-sm flex gap-1 items-center"><Upload size={16} /> Upload</button>
                        </form>
                        {profile.resumeUrl && <p className="text-success text-sm mt-2 flex gap-1 items-center"><CheckCircle size={14} /> Resume currently on file</p>}
                    </div>
                </div>

                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
                    <FileText size={48} className="text-primary mb-4" />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{applications.length}</h2>
                    <p className="text-muted mt-2" style={{ fontSize: '1.2rem' }}>Jobs Applied</p>
                </div>
            </div>

            <h2 className="font-semibold text-xl mb-4">My Applications</h2>
            {applications.length === 0 ? (
                <p className="text-muted glass-panel p-6 text-center">You haven't applied to any jobs yet.</p>
            ) : (
                <div className="glass-panel p-4 overflow-x-auto">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th className="p-4">Job Title</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date Applied</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td className="p-4 font-medium">{app.jobId?.title || 'Job Deleted'}</td>
                                    <td className="p-4 text-muted">{app.jobId?.companyName || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`badge ${app.status === 'Pending' ? 'badge-pending' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-approved'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted">{new Date(app.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SeekerDashboard;
