import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, isUser, isOrg, user, org, logout } = useAuth();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [searchQ,    setSearchQ]    = useState('');
  const [searching,  setSearching]  = useState(false);
  const navigate = useNavigate();
  const dropRef  = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out. GG! 👋');
    navigate('/');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/discover?q=${encodeURIComponent(searchQ)}`);
    setSearchQ('');
  };

  const account     = isUser ? user : org;
  const displayName = isUser ? account?.displayName : account?.orgName;
  const avatar      = isUser ? account?.avatar : account?.logo;
  const initials    = displayName?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="container flex-between" style={{ width: '100%' }}>
        {/* Logo */}
        <Link to="/" className="nav-logo glitch">
          ARENA<span>X</span>
        </Link>

        {/* Desktop nav links */}
        <div className="flex gap-4" style={{ display: 'none', alignItems: 'center' }} id="desktop-links">
          <NavLink to="/jobs"    className={({isActive}) => isActive ? 'text-saffron font-display uppercase' : 'text-secondary font-display uppercase'} style={{fontSize:'0.9rem',fontWeight:600,letterSpacing:'0.08em'}}>Jobs</NavLink>
          <NavLink to="/discover" className={({isActive}) => isActive ? 'text-saffron font-display uppercase' : 'text-secondary font-display uppercase'} style={{fontSize:'0.9rem',fontWeight:600,letterSpacing:'0.08em'}}>Discover</NavLink>
          {isUser && <NavLink to="/feed" className={({isActive}) => isActive ? 'text-saffron font-display uppercase' : 'text-secondary font-display uppercase'} style={{fontSize:'0.9rem',fontWeight:600,letterSpacing:'0.08em'}}>Feed</NavLink>}
          {isOrg  && <NavLink to="/post-job" className={({isActive}) => isActive ? 'text-saffron font-display uppercase' : 'text-secondary font-display uppercase'} style={{fontSize:'0.9rem',fontWeight:600,letterSpacing:'0.08em'}}>Post Job</NavLink>}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 320, margin: '0 24px' }}>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              style={{ padding: '8px 16px 8px 36px', fontSize: '0.875rem' }}
              placeholder="Search gamers, orgs, jobs..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
          </div>
        </form>

        {/* Right side */}
        <div className="flex gap-4" style={{ alignItems: 'center' }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Arena</Link>
            </>
          ) : (
            <div style={{ position: 'relative' }} ref={dropRef}>
              {/* Avatar button */}
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
              >
                {avatar ? (
                  <img src={avatar} alt={displayName} className="avatar avatar-sm" />
                ) : (
                  <div className="avatar avatar-sm flex-center" style={{ background: 'linear-gradient(135deg, var(--saffron-dark), var(--saffron))', fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>
                    {initials}
                  </div>
                )}
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {displayName?.split(' ')[0]}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▼</span>
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, minWidth: 200, zIndex: 1000, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-dim)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {isOrg ? '🏢 Organization' : '🎮 Gamer'}
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', marginTop: 2 }}>{displayName}</div>
                  </div>

                  {[
                    isUser && { label: '👤 My Profile',  to: `/u/${user?.username}` },
                    isUser && { label: '✏️ Edit Profile', to: '/profile/edit' },
                    isUser && { label: '📊 Dashboard',   to: '/dashboard' },
                    isOrg  && { label: '🏢 Org Dashboard', to: '/org/dashboard' },
                    isOrg  && { label: '📋 Post a Job',  to: '/post-job' },
                    { label: '💼 Browse Jobs', to: '/jobs' },
                    { label: '🔍 Discover',    to: '/discover' },
                  ].filter(Boolean).map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDropOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-card-hover)'; }}
                      onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border-dim)' }}>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'block', width: '100%', padding: '10px 16px', color: '#FF4444', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { e.target.style.background = 'rgba(255,68,68,0.1)'; }}
                      onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) { #desktop-links { display: flex !important; } }
      `}</style>
    </nav>
  );
}
