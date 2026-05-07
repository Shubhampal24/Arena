import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Compass, 
  Rss, 
  User, 
  Settings, 
  Bell,
  PlusCircle
} from 'lucide-react';

export default function Sidebar() {
  const { isUser, isOrg, user, org } = useAuth();

  const navItems = [
    { label: 'Dashboard', to: isUser ? '/dashboard' : '/org/dashboard', icon: <LayoutDashboard size={20} /> },
    isUser && { label: 'Feed', to: '/feed', icon: <Rss size={20} /> },
    { label: 'Jobs', to: '/jobs', icon: <Briefcase size={20} /> },
    { label: 'Discover', to: '/discover', icon: <Compass size={20} /> },
    isOrg && { label: 'Post Job', to: '/post-job', icon: <PlusCircle size={20} /> },
    { label: 'Profile', to: isUser ? `/u/${user?.username}` : `/org/${org?.slug}`, icon: <User size={20} /> },
    isUser && { label: 'Settings', to: '/profile/edit', icon: <Settings size={20} /> },
  ].filter(Boolean);

  return (
    <aside className="sidebar">
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <style>{`
        .sidebar {
          width: 240px;
          height: calc(100vh - 64px);
          position: fixed;
          top: 64px;
          left: 0;
          background: var(--bg-base);
          border-right: 1px solid var(--border);
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          z-index: 900;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s;
          margin-bottom: 4px;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.03);
          color: var(--text-white);
        }

        .sidebar-link.active {
          background: var(--primary-glow);
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          .sidebar { width: 80px; }
          .sidebar span { display: none; }
          .sidebar-link { justify-content: center; padding: 12px; }
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
}
