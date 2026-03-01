import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'jobseeker'
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await register(formData);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '60vh', marginBottom: '40px' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
                <h2 className="text-center mb-6" style={{ fontSize: '1.8rem' }}>Create an Account</h2>
                {error && <div className="badge badge-rejected text-center mb-4 p-2">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-muted mb-2 block" style={{ fontSize: '0.9rem' }}>Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                        <label className="text-muted mb-2 block" style={{ fontSize: '0.9rem' }}>Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                        <label className="text-muted mb-2 block" style={{ fontSize: '0.9rem' }}>Password</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="input-field" required />
                    </div>
                    <div>
                        <label className="text-muted mb-2 block" style={{ fontSize: '0.9rem' }}>I am a...</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="input-field"
                            style={{ background: '#1E293B', color: 'white' }}
                        >
                            <option value="jobseeker">Job Seeker</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary mt-4" style={{ padding: '12px' }}>Register</button>
                </form>
                <p className="text-center text-muted mt-6" style={{ fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
