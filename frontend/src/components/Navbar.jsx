import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, UserCircle, LogOut, Home, Key } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 font-bold" style={{ fontSize: '1.25rem' }}>
                    <Briefcase className="text-primary" />
                    Job<span className="text-primary">Portal</span>
                </Link>
                <div className="nav-links flex gap-4 items-center">
                    <Link to="/"><Home size={18} inline="true" /> Home</Link>
                    <Link to="/jobs"><Briefcase size={18} inline="true" /> Jobs</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                            {user.role === 'recruiter' && <Link to="/recruiter">Dashboard</Link>}
                            {user.role === 'jobseeker' && <Link to="/dashboard">Dashboard</Link>}
                            <button onClick={handleLogout} className="btn-danger flex items-center gap-2">
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-outline flex items-center gap-2">
                                <Key size={16} /> Login
                            </Link>
                            <Link to="/register" className="btn-primary flex items-center gap-2">
                                <UserCircle size={16} /> Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
