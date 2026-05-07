import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Briefcase, Compass, User, LayoutDashboard, PlusCircle, Rss, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const { isAuthenticated, isUser, isOrg, user, org } = useAuth();

  const userLinks = [
    { to: '/feed',      icon: <Rss size={20}/>,          label: 'Feed' },
    { to: '/jobs',      icon: <Briefcase size={20}/>,     label: 'Board' },
    { to: '/discover',  icon: <Compass size={22}/>,       label: 'Explore' },
    { to: '/dashboard', icon: <Target size={20}/>,        label: 'Goal' },
    { to: `/u/${user?.username||'me'}`, icon: <User size={20}/>, label: 'You' },
  ];

  const orgLinks = [
    { to: '/org/dashboard', icon: <LayoutDashboard size={20}/>, label: 'Dash' },
    { to: '/jobs',          icon: <Briefcase size={20}/>,  label: 'Board' },
    { to: '/post-job',      icon: <PlusCircle size={24}/>, label: 'List' },
    { to: '/discover',      icon: <Compass size={20}/>, label: 'Explore' },
    { to: `/org/${org?.slug||'me'}`, icon: <User size={20}/>, label: 'Entity' },
  ];

  if (!isAuthenticated) return null;

  const links = isUser ? userLinks : orgLinks;

  return (
    <>
      <nav className="bottom-nav-modern">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}
          >
            <div className="bottom-tab-icon-wrap">
              {link.icon}
            </div>
            <span className="bottom-tab-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .bottom-nav-modern {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 68px;
          background: rgba(10, 10, 20, 0.8);
          backdrop-filter: blur(24px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: none;
          align-items: center;
          justify-content: space-around;
          padding-bottom: env(safe-area-inset-bottom);
          z-index: 1000;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.4);
        }

        @media (max-width: 768px) {
          .bottom-nav-modern { display: flex; }
        }

        .bottom-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex: 1;
          height: 100%;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .bottom-tab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .bottom-tab-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s;
        }

        .bottom-tab:hover {
          color: var(--text-secondary);
        }

        .bottom-tab.active {
          color: var(--primary);
        }

        .bottom-tab.active .bottom-tab-icon-wrap {
          background: rgba(99, 102, 241, 0.1);
          transform: translateY(-2px);
          color: var(--primary);
        }

        .bottom-tab.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: var(--primary);
          border-radius: 0 0 2px 2px;
          box-shadow: 0 2px 10px var(--primary);
        }
      `}</style>
    </>
  );
}
