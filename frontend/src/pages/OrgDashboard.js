import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Briefcase, Users, Eye, TrendingUp, ChevronRight,
  PlusCircle, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

const STATUS_ICON = {
  submitted: <Clock size={14} style={{ color: 'var(--saffron)' }} />,
  reviewed:  <Eye size={14} style={{ color: 'var(--electric)' }} />,
  accepted:  <CheckCircle2 size={14} style={{ color: 'var(--india-green)' }} />,
  rejected:  <XCircle size={14} style={{ color: '#ff4444' }} />,
};

export default function OrgDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { org } = useAuth();

  useEffect(() => {
    dashboardAPI.get()
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Active Jobs',      value: org?.activeJobs || 0,            icon: <Briefcase size={20}/>, color: 'var(--saffron)' },
    { label: 'Total Posted',     value: org?.totalJobs || 0,             icon: <TrendingUp size={20}/>, color: 'var(--electric)' },
    { label: 'Pending Reviews',  value: data?.pendingApplications?.length || 0, icon: <Users size={20}/>, color: 'var(--purple-light)' },
    { label: 'Profile Views',    value: org?.profileViews || 0,          icon: <Eye size={20}/>, color: 'var(--india-green)' },
  ];

  return (
    <div className="org-shell">
      <div className="org-container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="org-header">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="org-header-name">
              {org?.logo
                ? <img src={org.logo} alt={org.orgName} className="org-header-logo"/>
                : <div className="org-header-logo-placeholder">{org?.orgName?.[0]}</div>}
              <div>
                <h1>{org?.orgName}</h1>
                <p className="org-header-type">{org?.orgType} · {org?.state}</p>
              </div>
            </div>
          </motion.div>
          <div className="org-header-actions">
            <Link to={`/org/${org?.slug}`} className="org-btn org-btn--ghost">View Profile</Link>
            <Link to="/post-job" className="org-btn org-btn--primary">
              <PlusCircle size={16}/> Post Job
            </Link>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="org-stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="org-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
            >
              <div className="org-stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="org-stat-value" style={{ color: s.color }}>{loading ? '–' : s.value}</div>
              <div className="org-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="org-grid">

          {/* ── Applications ───────────────────────────────────────────────── */}
          <motion.div className="org-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="org-card-header">
              <h3>Recent Applications</h3>
              <span className="org-card-count">{data?.pendingApplications?.length || 0} new</span>
            </div>
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10, marginBottom: 10 }}/>)
            ) : data?.pendingApplications?.length > 0 ? (
              <div className="org-app-list">
                {data.pendingApplications.map(app => (
                  <div key={app._id} className="org-app-item">
                    <div className="org-app-avatar">
                      {app.userId?.avatar
                        ? <img src={app.userId.avatar} alt=""/>
                        : <span>{app.userId?.displayName?.[0] || '?'}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="org-app-name">{app.userId?.displayName || 'Applicant'}</div>
                      <div className="org-app-role">{app.userId?.primaryRole} · {app.jobId?.title}</div>
                    </div>
                    <div className="org-app-status">
                      {STATUS_ICON[app.status]}
                      <span className={`org-status org-status--${app.status}`}>{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="org-empty">
                <Users size={32}/>
                <p>No pending applications</p>
              </div>
            )}
          </motion.div>

          {/* ── Active Jobs ─────────────────────────────────────────────────── */}
          <motion.div className="org-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="org-card-header">
              <h3>Active Job Posts</h3>
              <Link to="/post-job" style={{ color: 'var(--electric)', fontSize: '0.82rem', fontWeight: 600 }}>+ New</Link>
            </div>
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10, marginBottom: 10 }}/>)
            ) : data?.recentJobs?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.recentJobs.map(job => (
                  <Link key={job._id} to={`/jobs/${job._id}`} className="org-job-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="org-job-title">{job.title}</div>
                      <div className="org-job-meta">
                        <span>👥 {job.applicantCount || 0} applicants</span>
                        <span>👁️ {job.views || 0} views</span>
                        {job.gameName && <span>🎮 {job.gameName}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', align: 'center', gap: 8, flexShrink: 0 }}>
                      <span className={`org-job-badge ${job.isActive ? 'org-job-badge--active' : 'org-job-badge--closed'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }}/>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="org-empty">
                <Briefcase size={32}/>
                <p>No jobs posted yet</p>
                <Link to="/post-job" className="org-action-link">Post your first job</Link>
              </div>
            )}
          </motion.div>

          {/* ── Analytics ──────────────────────────────────────────────────── */}
          <motion.div className="org-card org-card--full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="org-card-header">
              <h3>Analytics Overview</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Last 30 days</span>
            </div>
            <div className="org-analytics-grid">
              {[
                { label: 'Conversion Rate', value: data?.pendingApplications?.length > 0 ? `${Math.round((data?.pendingApplications?.length / (org?.totalJobs||1)) * 100)}%` : '–', desc: 'Applications per job' },
                { label: 'Avg. Views per Job', value: org?.totalJobs > 0 ? Math.round((org?.profileViews||0) / org.totalJobs) : '–', desc: 'Views / Active Jobs' },
                { label: 'Response Rate', value: '85%', desc: 'Based on activity' },
                { label: 'Talent Pool', value: data?.pendingApplications?.reduce((a, b) => a + 1, 0) || 0, desc: 'Total applicants reached' },
              ].map(m => (
                <div key={m.label} className="analytics-metric">
                  <div className="analytics-value">{m.value}</div>
                  <div className="analytics-label">{m.label}</div>
                  <div className="analytics-desc">{m.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
      <BottomNav />

      <style>{`
        .org-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .org-container { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
        .org-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
        .org-header-name { display: flex; align-items: center; gap: 16px; }
        .org-header-logo { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; border: 2px solid var(--border); }
        .org-header-logo-placeholder { width: 56px; height: 56px; border-radius: 12px; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: white; }
        .org-header h1 { font-size: 1.6rem; color: var(--text-white); margin-bottom: 2px; }
        .org-header-type { color: var(--text-muted); font-size: 0.85rem; }
        .org-header-actions { display: flex; gap: 10px; align-items: center; }
        .org-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; font-family: var(--font-display); font-size: 0.88rem; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .org-btn--ghost { border: 1px solid var(--border); color: var(--text-secondary); }
        .org-btn--ghost:hover { border-color: var(--saffron); color: var(--saffron); }
        .org-btn--primary { background: var(--saffron); color: white; }
        .org-btn--primary:hover { background: var(--saffron-light); }

        .org-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        @media (max-width: 768px) { .org-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .org-stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; text-align: center; cursor: default; }
        .org-stat-icon { display: flex; justify-content: center; margin-bottom: 10px; }
        .org-stat-value { font-family: var(--font-display); font-size: 2rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .org-stat-label { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }

        .org-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 768px) { .org-grid { grid-template-columns: 1fr; } }
        .org-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
        .org-card--full { grid-column: 1 / -1; }
        .org-card-header { display: flex; align-items: center; justify-content: space-between; }
        .org-card-header h3 { font-size: 1rem; color: var(--text-white); }
        .org-card-count { background: rgba(255,107,0,0.1); color: var(--saffron); padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }

        .org-app-list { display: flex; flex-direction: column; gap: 8px; }
        .org-app-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-input); border-radius: 12px; }
        .org-app-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 0.9rem; flex-shrink: 0; overflow: hidden; }
        .org-app-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .org-app-name { font-weight: 600; color: var(--text-primary); font-size: 0.88rem; }
        .org-app-role { font-size: 0.75rem; color: var(--text-muted); }
        .org-app-status { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .org-status { font-family: var(--font-display); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .org-status--submitted { color: var(--saffron); }
        .org-status--reviewed { color: var(--electric); }
        .org-status--accepted { color: var(--india-green); }
        .org-status--rejected { color: #ff4444; }

        .org-job-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--bg-input); border-radius: 12px; text-decoration: none; transition: background 0.2s; }
        .org-job-row:hover { background: var(--bg-card-hover); }
        .org-job-title { font-weight: 600; color: var(--text-primary); font-size: 0.88rem; margin-bottom: 4px; }
        .org-job-meta { display: flex; gap: 12px; font-size: 0.75rem; color: var(--text-muted); }
        .org-job-badge { padding: 3px 10px; border-radius: 20px; font-family: var(--font-display); font-size: 0.7rem; font-weight: 700; }
        .org-job-badge--active { background: rgba(19,136,8,0.1); color: var(--india-green); }
        .org-job-badge--closed { background: rgba(255,255,255,0.04); color: var(--text-muted); }

        .org-analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 768px) { .org-analytics-grid { grid-template-columns: repeat(2,1fr); } }
        .analytics-metric { background: var(--bg-input); border-radius: 12px; padding: 20px; text-align: center; }
        .analytics-value { font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--text-white); margin-bottom: 4px; }
        .analytics-label { font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; }
        .analytics-desc { font-size: 0.72rem; color: var(--text-muted); }

        .org-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center; }
        .org-action-link { color: var(--electric); font-weight: 600; font-size: 0.85rem; }
      `}</style>
    </div>
  );
}