import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, User, LogOut, LayoutDashboard, Briefcase, Compass, Rss, PlusCircle, ChevronDown, Bell, Shield, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, isUser, isOrg, user, org, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Safe travels, professional.');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/discover?q=${encodeURIComponent(searchQ)}`);
    setSearchQ('');
  };

  const account = isUser ? user : org;
  const displayName = isUser ? account?.displayName : account?.orgName;
  const avatar = isUser ? account?.avatar : account?.logo;
  const initials = displayName?.[0]?.toUpperCase() || '?';

  return (
    <nav className={`navbar-modern ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container-xl flex-between h-full">
        
        {/* Brand & Desktop Links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="brand-logo group">
            <div className="logo-box">
              <Sparkles size={18} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
            <span className="brand-name">ARENA<span className="text-primary">X</span></span>
          </Link>

          <div className="hidden md-flex gap-8 nav-links">
            <NavLink to="/discover" className="nav-item">Discover</NavLink>
            <NavLink to="/jobs" className="nav-item">Board</NavLink>
            {isUser && <NavLink to="/feed" className="nav-item">Network</NavLink>}
            {isOrg && <NavLink to="/post-job" className="nav-item">Post Role</NavLink>}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg-block flex-1 max-w-md mx-10">
          <form onSubmit={handleSearch} className="search-pill">
            <Search size={16} className="text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search professionals, orgs, or roles..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="search-pill-input"
            />
            <div className="search-shortcut">/</div>
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn btn-ghost btn-sm px-5">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm px-6 shadow-primary">Get Started</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="icon-btn-glass relative">
                <Bell size={20} />
                <span className="notification-dot" />
              </button>

              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="profile-trigger"
                >
                  <div className="profile-avatar">
                    {avatar ? (
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="avatar-placeholder">{initials}</div>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.98 }}
                      className="dropdown-menu"
                    >
                      <div className="dropdown-header">
                        <p className="dropdown-name truncate">{displayName}</p>
                        <p className="dropdown-meta truncate">{isOrg ? 'Organization Entity' : 'Professional Account'}</p>
                      </div>

                      <div className="dropdown-body">
                        <MenuLink to={isUser ? `/u/${user?.username}` : `/org/${org?.slug}`} icon={<User size={16} />} label="My Identity" onClick={() => setDropOpen(false)} />
                        <MenuLink to={isUser ? '/dashboard' : '/org/dashboard'} icon={<LayoutDashboard size={16} />} label="Command Center" onClick={() => setDropOpen(false)} />
                        <MenuLink to="/profile/edit" icon={<Settings size={16} />} label="Preferences" onClick={() => setDropOpen(false)} />
                        {isOrg && <MenuLink to="/post-job" icon={<PlusCircle size={16} />} label="List New Role" onClick={() => setDropOpen(false)} />}
                      </div>

                      <div className="dropdown-footer">
                        <button onClick={handleLogout} className="dropdown-item text-danger">
                          <LogOut size={16} />
                          <span>Terminate Session</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-modern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: rgba(10, 10, 20, 0.5);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.03);
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar-scrolled {
          background: rgba(10, 10, 20, 0.85);
          height: 64px;
          border-bottom-color: rgba(99, 102, 241, 0.15);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .logo-box {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--primary), var(--primary-glow));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
        }

        .brand-name {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.3rem;
          letter-spacing: 0.1em;
          color: white;
        }

        .nav-item {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }

        .nav-item:hover, .nav-item.active {
          color: white;
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--primary);
        }

        .search-pill {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 100px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .search-pill:focus-within {
          background: rgba(255,255,255,0.06);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
        }

        .search-pill-input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          width: 100%;
        }

        .search-shortcut {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-muted);
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .icon-btn-glass {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .icon-btn-glass:hover {
          background: rgba(255,255,255,0.08);
          color: white;
          border-color: rgba(255,255,255,0.1);
        }

        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 6px;
          height: 6px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--primary);
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px 4px 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-trigger:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.1);
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--primary);
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 12px;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 260px;
          background: #11111d;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          z-index: 1100;
          overflow: hidden;
        }

        .dropdown-header {
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .dropdown-name {
          font-weight: 800;
          color: white;
          font-size: 0.95rem;
        }

        .dropdown-meta {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
          font-weight: 700;
        }

        .dropdown-body {
          padding: 8px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .dropdown-footer {
          padding: 8px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.1);
        }

        .text-danger {
          color: #ef4444 !important;
        }

        .text-danger:hover {
          background: rgba(239, 68, 68, 0.05) !important;
        }

        @media (max-width: 768px) {
          .nav-links, .search-pill { display: none; }
        }
      `}</style>
    </nav>
  );
}

function MenuLink({ to, icon, label, onClick }) {
  return (
    <Link to={to} className="dropdown-item" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
