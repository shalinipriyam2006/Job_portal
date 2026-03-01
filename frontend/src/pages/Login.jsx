import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('seeker@user.com');
    const [password, setPassword] = useState('seeker123');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="animate-fade-in flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
                <h2 className="text-center mb-6" style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
                {error && <div className="badge badge-rejected text-center mb-4 p-2">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-muted mb-2 block" style={{ fontSize: '0.9rem' }}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" required />
                    </div>
                    <div>
                        <label className="text-muted mb-2 block" style={{ fontSize: '0.9rem' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required />
                    </div>
                    <button type="submit" className="btn-primary mt-4" style={{ padding: '12px' }}>Login</button>
                </form>
                <p className="text-center text-muted mt-6" style={{ fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" className="text-primary font-semibold">Register</Link>
                </p>

                <div className="mt-6 pt-6 flex flex-col gap-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-center text-muted text-sm mb-2 scale-90">Demo Credentials</p>
                    <button onClick={() => { setEmail('admin@jobportal.com'); setPassword('admin123'); }} type="button" className="btn-outline text-xs p-2">Admin</button>
                    <button onClick={() => { setEmail('recruiter@company.com'); setPassword('recruiter123'); }} type="button" className="btn-outline text-xs p-2">Recruiter</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
