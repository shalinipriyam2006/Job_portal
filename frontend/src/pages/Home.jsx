import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase } from 'lucide-react';
import api from '../api';

const Home = () => {
    const [stats, setStats] = useState({ jobs: 0, recruiters: 0 });

    useEffect(() => {
        // Optionally fetch some public stats if available, else mock
        setStats({ jobs: 124, recruiters: 42 });
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    Find Your <span className="text-primary">Dream Job</span> Today
                </h1>
                <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '32px' }}>
                    Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
                </p>

                <form action="/jobs" className="flex gap-4 items-center justify-center m-auto" style={{ maxWidth: '800px', background: 'rgba(15,23,42,0.8)', padding: '12px', borderRadius: '12px', flexWrap: 'wrap' }}>
                    <div className="flex items-center gap-2 flex-1" style={{ minWidth: '200px', padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        <Search size={20} className="text-muted" />
                        <input name="keyword" type="text" placeholder="Job title or keyword" style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', padding: '8px' }} />
                    </div>
                    <div className="flex items-center gap-2 flex-1" style={{ minWidth: '200px', padding: '0 16px' }}>
                        <MapPin size={20} className="text-muted" />
                        <input name="location" type="text" placeholder="City or location" style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', padding: '8px' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>Search</button>
                </form>
            </div>

            <div className="grid-3 mt-8">
                <div className="glass-panel text-center" style={{ padding: '32px' }}>
                    <Briefcase size={40} className="text-primary mb-4 m-auto" />
                    <h2 style={{ fontSize: '2rem' }}>{stats.jobs}+</h2>
                    <p className="text-muted mt-2">Active Jobs</p>
                </div>
                <div className="glass-panel text-center" style={{ padding: '32px' }}>
                    <Search size={40} className="text-primary mb-4 m-auto" />
                    <h2 style={{ fontSize: '2rem' }}>{stats.recruiters}+</h2>
                    <p className="text-muted mt-2">Companies Hiring</p>
                </div>
                <div className="glass-panel text-center" style={{ padding: '32px' }}>
                    <MapPin size={40} className="text-primary mb-4 m-auto" />
                    <h2 style={{ fontSize: '2rem' }}>100+</h2>
                    <p className="text-muted mt-2">Locations</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
