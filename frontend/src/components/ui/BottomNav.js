import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Briefcase, MessageCircle, User, BarChart2, PlusSquare } from 'lucide-react';

export default function BottomNav() {
  const { isAuthenticated, isUser, isOrg, user, org } = useAuth();
  const location = useLocation();

  const userLinks = [
    { to: '/feed',      icon: <Home size={22}/>,          label: 'Feed' },
    { to: '/jobs',      icon: <Briefcase size={22}/>,     label: 'Jobs' },
    { to: '/discover',  icon: <PlusSquare size={22}/>,    label: 'Discover' },
    { to: '/dashboard', icon: <BarChart2 size={22}/>,     label: 'Stats' },
    { to: `/u/${user?.username||'me'}`, icon: <User size={22}/>, label: 'Profile' },
  ];

  const orgLinks = [
    { to: '/org/dashboard', icon: <Home size={22}/>,       label: 'Home' },
    { to: '/jobs',          icon: <Briefcase size={22}/>,  label: 'Jobs' },
    { to: '/post-job',      icon: <PlusSquare size={22}/>, label: 'Post Job' },
    { to: '/discover',      icon: <MessageCircle size={22}/>, label: 'Discover' },
    { to: `/org/${org?.slug||'me'}`, icon: <User size={22}/>, label: 'Profile' },
  ];

  if (!isAuthenticated) return null;

  const links = isUser ? userLinks : orgLinks;

  return (
    <>
      <nav className="bottom-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 500;
          height: 64px;
          display: none;
          align-items: center;
          justify-content: space-around;
          background: rgba(10,10,15,0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 0 8px;
          padding-bottom: env(safe-area-inset-bottom);
        }
        @media (max-width: 1024px) { .bottom-nav { display: flex; } }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          flex: 1;
          padding: 8px 4px;
          color: var(--text-muted);
          text-decoration: none;
          font-family: var(--font-display);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .bottom-nav-item:hover { color: var(--text-secondary); }
        .bottom-nav-item--active { color: var(--saffron); }
        .bottom-nav-item--active svg { filter: drop-shadow(0 0 6px rgba(255,107,0,0.4)); }
      `}</style>
    </>
  );
}
