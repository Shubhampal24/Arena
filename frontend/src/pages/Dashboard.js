import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  TrendingUp, Briefcase, FileText, Eye, Activity,
  CheckCircle, ChevronRight, User, Award, Users
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dashboardAPI.get()
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const score = data?.profileScore || user?.profileScore || 0;

  const scoreColor = score >= 80 ? 'var(--india-green)' : score >= 50 ? 'var(--electric)' : 'var(--saffron)';

  const stats = [
    { label: 'Profile Score', value: `${score}%`, icon: <TrendingUp size={20}/>, color: scoreColor, bg: 'rgba(0,229,255,0.06)' },
    { label: 'Applications', value: data?.applications?.length || 0, icon: <FileText size={20}/>, color: 'var(--saffron)', bg: 'rgba(255,107,0,0.06)' },
    { label: 'Profile Views', value: user?.profileViews || 0, icon: <Eye size={20}/>, color: 'var(--purple-light)', bg: 'rgba(168,85,247,0.06)' },
    { label: 'Posts', value: data?.recentPosts?.length || 0, icon: <Activity size={20}/>, color: 'var(--electric)', bg: 'rgba(0,229,255,0.06)' },
  ];

  const profileCompleted = [
    { label: 'Basic info', done: !!(user?.displayName && user?.email) },
    { label: 'Bio added', done: !!user?.bio },
    { label: 'Game profile', done: (user?.gameProfiles?.length || 0) > 0 },
    { label: 'Profile photo', done: !!user?.avatar },
    { label: 'Portfolio item', done: (user?.portfolio?.length || 0) > 0 },
  ];

  return (
    <div className="dash-shell">
      <div className="dash-container">

        {/* Header */}
        <div className="dash-header">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1>
              Hey, <span style={{ color: 'var(--saffron)' }}>{user?.displayName?.split(' ')[0]}</span> 👋
            </h1>
            <p className="dash-subtitle">Here's what's happening in your arena</p>
          </motion.div>
          <div className="dash-header-actions">
            <Link to="/feed" className="dash-header-btn">Go to Feed</Link>
            <Link to="/jobs" className="dash-header-btn dash-header-btn--primary">Browse Jobs</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="dash-stat-card"
              style={{ '--accent': s.color, '--accent-bg': s.bg }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <div className="dash-stat-icon">{s.icon}</div>
              <div className="dash-stat-value">{loading ? '–' : s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="dash-grid">

          {/* Profile Completion */}
          <motion.div className="dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="dash-card-header">
              <h3>Profile Strength</h3>
              <span style={{ color: scoreColor, fontWeight: 700 }}>{score}%</span>
            </div>
            <div className="dash-progress-bar">
              <motion.div
                className="dash-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                style={{ background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})` }}
              />
            </div>
            <div className="dash-checklist">
              {profileCompleted.map(item => (
                <div key={item.label} className="dash-check-item">
                  <CheckCircle size={16} style={{ color: item.done ? 'var(--india-green)' : 'var(--border)' }}/>
                  <span style={{ color: item.done ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: item.done ? 'none' : 'none' }}>
                    {item.label}
                  </span>
                  {!item.done && <span className="dash-check-cta">Add →</span>}
                </div>
              ))}
            </div>
            <Link to="/profile/edit" className="dash-card-action">
              Complete Profile <ChevronRight size={16}/>
            </Link>
          </motion.div>

          {/* Applications */}
          <motion.div className="dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="dash-card-header">
              <h3>My Applications</h3>
              <Link to="/jobs" style={{ fontSize: '0.82rem', color: 'var(--electric)' }}>Browse Jobs</Link>
            </div>
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10, marginBottom: 10 }}/>)
            ) : data?.applications?.length > 0 ? (
              <div className="dash-app-list">
                {data.applications.map(app => (
                  <div key={app._id} className="dash-app-item">
                    <div className="dash-app-logo">
                      {app.jobId?.postedBy?.orgLogo
                        ? <img src={app.jobId.postedBy.orgLogo} alt=""/>
                        : <Briefcase size={18}/>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dash-app-title">{app.jobId?.title || 'Unknown Role'}</div>
                      <div className="dash-app-org">{app.jobId?.postedBy?.orgName}</div>
                    </div>
                    <span className={`dash-status dash-status--${app.status}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dash-empty">
                <Briefcase size={32} style={{ color: 'var(--text-muted)', marginBottom: 8 }}/>
                <p>No applications yet. Start exploring!</p>
                <Link to="/jobs" className="dash-card-action" style={{ justifyContent: 'center', marginTop: 12 }}>Find Jobs</Link>
              </div>
            )}
          </motion.div>

          {/* Game Profiles */}
          <motion.div className="dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="dash-card-header">
              <h3>Game Profiles</h3>
              <Link to="/profile/edit" style={{ fontSize: '0.82rem', color: 'var(--electric)' }}>+ Add</Link>
            </div>
            {user?.gameProfiles?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {user.gameProfiles.map(g => (
                  <div key={g._id} className="dash-game-row">
                    <div className="dash-game-icon">🎮</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-white)', fontSize: '0.9rem' }}>{g.gameName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{g.inGameRoles?.join(', ')}</div>
                    </div>
                    {g.currentTier && <span className="badge-tier">{g.currentTier}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="dash-empty">
                <p>Add your game profiles to attract orgs.</p>
                <Link to="/profile/edit" className="dash-card-action" style={{ justifyContent: 'center', marginTop: 12 }}>Add Game Profile</Link>
              </div>
            )}
          </motion.div>

          {/* Recent Posts */}
          <motion.div className="dash-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="dash-card-header">
              <h3>My Posts</h3>
              <Link to="/feed" style={{ fontSize: '0.82rem', color: 'var(--electric)' }}>View Feed</Link>
            </div>
            {data?.recentPosts?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.recentPosts.map(p => (
                  <div key={p._id} className="dash-post-row">
                    <p className="dash-post-text">{p.content}</p>
                    <div className="dash-post-meta">
                      <span>❤️ {p.likesCount||0}</span>
                      <span>💬 {p.commentsCount||0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dash-empty">
                <p>Share your first post and let the community know you!</p>
                <Link to="/feed" className="dash-card-action" style={{ justifyContent: 'center', marginTop: 12 }}>Go to Feed</Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
      <BottomNav />

      <style>{`
        .dash-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .dash-container { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
        .dash-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
        .dash-header h1 { font-size: 1.8rem; margin-bottom: 4px; }
        .dash-subtitle { color: var(--text-muted); font-size: 0.9rem; }
        .dash-header-actions { display: flex; gap: 10px; align-items: center; }
        .dash-header-btn { padding: 9px 18px; border-radius: 10px; font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; text-decoration: none; border: 1px solid var(--border); color: var(--text-secondary); transition: all 0.2s; }
        .dash-header-btn:hover { border-color: var(--saffron); color: var(--saffron); }
        .dash-header-btn--primary { background: var(--saffron); color: white; border-color: var(--saffron); }
        .dash-header-btn--primary:hover { background: var(--saffron-light); color: white; }

        .dash-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        @media (max-width: 768px) { .dash-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .dash-stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; position: relative; overflow: hidden; cursor: default; }
        .dash-stat-card::before { content:''; position:absolute; top:0; right:0; width:80px; height:80px; background:var(--accent-bg, rgba(255,107,0,0.06)); border-radius:50%; transform:translate(20px,-20px); }
        .dash-stat-icon { color: var(--accent, var(--saffron)); margin-bottom: 12px; }
        .dash-stat-value { font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--text-white); line-height: 1; margin-bottom: 4px; }
        .dash-stat-label { color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }

        .dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
        .dash-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .dash-card-header { display: flex; align-items: center; justify-content: space-between; }
        .dash-card-header h3 { font-size: 1rem; color: var(--text-white); }

        .dash-progress-bar { height: 8px; background: var(--bg-input); border-radius: 4px; overflow: hidden; }
        .dash-progress-fill { height: 100%; border-radius: 4px; }

        .dash-checklist { display: flex; flex-direction: column; gap: 10px; }
        .dash-check-item { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; }
        .dash-check-cta { color: var(--electric); font-size: 0.78rem; font-weight: 700; margin-left: auto; }

        .dash-card-action { display: flex; align-items: center; gap: 6px; color: var(--saffron); font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; text-decoration: none; margin-top: auto; }
        .dash-card-action:hover { color: var(--saffron-light); }

        .dash-app-list { display: flex; flex-direction: column; gap: 10px; }
        .dash-app-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-input); border-radius: 12px; }
        .dash-app-logo { width: 40px; height: 40px; border-radius: 10px; background: var(--bg-base); border: 1px solid var(--border-dim); display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; overflow: hidden; }
        .dash-app-logo img { width: 100%; height: 100%; object-fit: cover; }
        .dash-app-title { font-weight: 600; color: var(--text-primary); font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dash-app-org { font-size: 0.75rem; color: var(--text-muted); }
        .dash-status { padding: 3px 10px; border-radius: 20px; font-family: var(--font-display); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; flex-shrink: 0; }
        .dash-status--submitted { background: rgba(255,107,0,0.1); color: var(--saffron); }
        .dash-status--reviewed { background: rgba(0,229,255,0.1); color: var(--electric); }
        .dash-status--accepted { background: rgba(19,136,8,0.1); color: var(--india-green); }
        .dash-status--rejected { background: rgba(255,68,68,0.1); color: #ff4444; }

        .dash-game-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--bg-input); border-radius: 10px; }
        .dash-game-icon { font-size: 1.3rem; }
        .badge-tier { background: rgba(255,107,0,0.15); color: var(--saffron); font-family: var(--font-mono); font-size: 0.72rem; padding: 3px 10px; border-radius: 20px; font-weight: 700; flex-shrink: 0; }

        .dash-post-row { padding: 12px 14px; background: var(--bg-input); border-radius: 10px; }
        .dash-post-text { font-size: 0.85rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; }
        .dash-post-meta { display: flex; gap: 12px; font-size: 0.75rem; color: var(--text-muted); }

        .dash-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px 0; color: var(--text-muted); font-size: 0.88rem; }
      `}</style>
    </div>
  );
}