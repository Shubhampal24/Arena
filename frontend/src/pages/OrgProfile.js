import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orgsAPI, jobsAPI } from '../utils/api';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, CheckCircle, Trophy, Briefcase, Eye, Users, CheckCircle2, ChevronRight, Share2, Globe, ArrowRight
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function OrgProfile() {
  const { slug } = useParams();
  const [org, setOrg] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    orgsAPI.getBySlug(slug).then(r => {
      setOrg(r.data.data);
      setLoad(false);
      return jobsAPI.getAll({ 'postedBy.orgId': r.data.data._id, isActive: true, limit: 6 });
    }).then(r => { if (r) setJobs(r.data.data); }).catch(() => setLoad(false));
  }, [slug]);

  if (loading) return <div className="page flex-center" style={{ height: '80vh' }}><div className="skeleton" style={{ width: 120, height: 120, borderRadius: 20 }} /></div>;
  if (!org) return <div className="page flex-center" style={{ height: '80vh' }}><h2>Organization not found</h2></div>;

  return (
    <div className="org-profile-shell">
      
      {/* ── Banner ── */}
      <div className="org-banner">
        <div className="banner-glow-overlay" />
      </div>

      <div className="org-profile-container">
        
        {/* ── Header ── */}
        <div className="org-header-section">
          <div className="org-header-left">
            <div className="org-avatar-large">
              {org.logo ? <img src={org.logo} alt="" /> : <Building2 size={40} className="text-purple-light" />}
            </div>
            <div className="org-info-block">
              <div className="org-title-row">
                <h1>{org.orgName}</h1>
                {org.isVerifiedOrg && <span className="badge badge-electric" style={{ gap: 4 }}><CheckCircle2 size={12}/> Verified</span>}
              </div>
              <p className="org-role-text">{org.orgType}</p>
              <div className="org-meta-row">
                <span><MapPin size={14}/> {org.city ? `${org.city}, ` : ''}{org.state || 'Global'}</span>
                <span className="dot">·</span>
                {org.foundedYear && <span>Est. {org.foundedYear}</span>}
              </div>
            </div>
          </div>
          <div className="org-header-actions">
            <button className="btn-follow"><Building2 size={16}/> Follow Org</button>
            <button className="btn-share-ghost"><Share2 size={16}/></button>
          </div>
        </div>

        {/* ── Layout Grid ── */}
        <div className="org-grid-layout">
          
          {/* Main Column */}
          <div className="org-main">
            
            {org.description && (
              <motion.div className="org-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="card-title">About Us</h3>
                <p className="about-text">{org.description}</p>
              </motion.div>
            )}

            {org.achievements?.length > 0 && (
              <motion.div className="org-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="card-title"><Trophy size={20} className="text-saffron" /> Team Achievements</h3>
                <div className="achievements-list">
                  {org.achievements.map((a, i) => (
                    <div key={i} className="achievement-item">
                      <div className="achievement-icon">🏆</div>
                      <div>
                        <div className="achievement-title">{a.title}</div>
                        <div className="achievement-desc">
                          {a.tournament} {a.year && `· ${a.year}`} {a.placement && `· ${a.placement}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {jobs.length > 0 && (
              <motion.div className="org-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="jobs-header-row">
                  <h3 className="card-title"><Briefcase size={20} className="text-electric" /> Open Positions</h3>
                  <Link to={`/jobs?search=${org.orgName}`} className="view-all-link">View All <ArrowRight size={14}/></Link>
                </div>
                <div className="jobs-list">
                  {jobs.map((j) => (
                    <Link key={j._id} to={`/jobs/${j._id}`} className="job-list-card">
                      <div className="job-info-left">
                        <div className="job-list-title">{j.title}</div>
                        <div className="job-list-meta">
                          {j.gameName && <span className="text-saffron font-bold">{j.gameName}</span>}
                          {j.gameName && <span className="dot">·</span>}
                          <span>{j.workType}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="job-arrow" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="org-sidebar">
            
            {(org.activeGames?.length > 0) && (
              <motion.div className="org-side-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <h4 className="side-title">Active Rosters</h4>
                <div className="side-tags">
                  {org.activeGames.map((g, i) => <span key={i} className="badge badge-saffron">{g.toUpperCase()}</span>)}
                </div>
              </motion.div>
            )}

            <motion.div className="org-side-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h4 className="side-title">Community Metrics</h4>
              <div className="metrics-list">
                <div className="metric-item">
                  <div className="metric-icon-wrap"><Briefcase size={16} className="text-purple-light"/></div>
                  <div className="metric-content">
                    <span className="metric-value">{org.activeJobs || 0}</span>
                    <span className="metric-label">Open Jobs</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon-wrap"><Users size={16} className="text-electric"/></div>
                  <div className="metric-content">
                    <span className="metric-value">{org.followersCount || 0}</span>
                    <span className="metric-label">Followers</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon-wrap"><Eye size={16} className="text-saffron"/></div>
                  <div className="metric-content">
                    <span className="metric-value">{org.profileViews || 0}</span>
                    <span className="metric-label">Profile Views</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {org.website && (
              <motion.div className="org-side-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noreferrer" className="website-link">
                  <Globe size={18}/> Visit Official Website
                </a>
              </motion.div>
            )}
          </div>

        </div>
      </div>
      <BottomNav />

      <style>{`
        .org-profile-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        
        .org-banner { height: 240px; background: linear-gradient(135deg, rgba(123,47,190,0.2), rgba(0,229,255,0.15)); border-bottom: 1px solid var(--border-dim); position: relative; overflow: hidden; }
        .banner-glow-overlay { position: absolute; bottom: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: var(--purple-light); filter: blur(120px); opacity: 0.2; }

        .org-profile-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; position: relative; top: -60px; }

        .org-header-section { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
        
        .org-header-left { display: flex; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
        .org-avatar-large { width: 140px; height: 140px; border-radius: 20px; background: var(--bg-card); display: flex; align-items: center; justify-content: center; border: 4px solid var(--border); box-shadow: 0 12px 32px rgba(0,0,0,0.4); overflow: hidden; flex-shrink: 0; }
        .org-avatar-large img { width: 100%; height: 100%; object-fit: cover; }
        
        .org-info-block { padding-bottom: 10px; }
        .org-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
        .org-title-row h1 { font-size: 2.2rem; font-weight: 800; color: var(--text-white); line-height: 1.1; }
        .org-role-text { color: var(--purple-light); font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        .org-meta-row { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem; }

        .org-header-actions { display: flex; gap: 12px; margin-bottom: 10px; }
        .btn-follow { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, var(--purple), var(--purple-light)); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-family: var(--font-display); font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(123,47,190,0.3); }
        .btn-follow:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(123,47,190,0.4); }
        .btn-share-ghost { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-dim); border-radius: 12px; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .btn-share-ghost:hover { background: rgba(255,255,255,0.1); color: var(--text-white); border-color: var(--border); }

        .org-grid-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        @media (max-width: 860px) { .org-grid-layout { grid-template-columns: 1fr; } }
        
        .org-main { display: flex; flex-direction: column; gap: 24px; }
        
        .org-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: var(--shadow-card); }
        .card-title { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 700; color: var(--text-white); margin-bottom: 24px; }
        .about-text { color: var(--text-secondary); line-height: 1.8; font-size: 1rem; white-space: pre-wrap; }

        .achievements-list { display: flex; flex-direction: column; gap: 16px; }
        .achievement-item { display: flex; gap: 16px; padding: 16px; background: var(--bg-input); border-radius: 12px; border: 1px solid rgba(123,47,190,0.15); transition: border-color 0.2s; }
        .achievement-item:hover { border-color: rgba(123,47,190,0.4); }
        .achievement-icon { font-size: 2rem; line-height: 1; }
        .achievement-title { font-weight: 700; color: var(--text-white); font-size: 1.05rem; margin-bottom: 6px; }
        .achievement-desc { color: var(--text-muted); font-size: 0.9rem; }

        .jobs-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .jobs-header-row .card-title { margin-bottom: 0; }
        .view-all-link { display: flex; align-items: center; gap: 4px; color: var(--electric); font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; text-decoration: none; transition: filter 0.2s; }
        .view-all-link:hover { filter: brightness(1.2); }

        .jobs-list { display: flex; flex-direction: column; gap: 12px; }
        .job-list-card { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-input); border: 1px solid var(--border-dim); border-radius: 12px; text-decoration: none; transition: all 0.2s; }
        .job-list-card:hover { background: var(--bg-card-hover); border-color: var(--electric); transform: translateY(-2px); }
        .job-info-left { display: flex; flex-direction: column; gap: 6px; }
        .job-list-title { color: var(--text-white); font-size: 1.05rem; font-weight: 700; }
        .job-list-meta { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); }
        .job-arrow { color: var(--text-muted); transition: color 0.2s, transform 0.2s; }
        .job-list-card:hover .job-arrow { color: var(--electric); transform: translateX(4px); }

        .org-sidebar { display: flex; flex-direction: column; gap: 24px; position: sticky; top: 96px; }
        .org-side-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow-card); }
        .side-title { color: var(--text-secondary); font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
        
        .side-tags { display: flex; flex-wrap: wrap; gap: 8px; }

        .metrics-list { display: flex; flex-direction: column; gap: 20px; }
        .metric-item { display: flex; align-items: center; gap: 16px; }
        .metric-icon-wrap { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-dim); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .metric-content { display: flex; flex-direction: column; gap: 2px; }
        .metric-value { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--text-white); line-height: 1; }
        .metric-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }

        .website-link { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-dim); border-radius: 12px; color: var(--text-primary); font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .website-link:hover { background: rgba(255,255,255,0.08); color: white; border-color: var(--border); }
      `}</style>
    </div>
  );
}