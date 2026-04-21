import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Briefcase, Clock, Calendar, Users, Target,
  CheckCircle2, PlusCircle, MonitorSmartphone, Share2, CornerUpRight
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isUser, isAuthenticated, user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    jobsAPI.getById(id)
      .then(r => {
        setJob(r.data.data);
        if (isUser && user) {
          // Check if user already applied (needs a separate API call in a real app, assuming false for now unless we fetch user's apps)
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isUser, user]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="job-detail-shell">
      <div className="job-detail-container">
        <div className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 24 }} />
        <div className="job-grid">
          <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  );

  if (!job) return (
    <div className="job-detail-shell flex-center" style={{ minHeight: '80vh', flexDirection: 'column' }}>
      <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
      <h2 style={{ color: 'var(--text-secondary)' }}>Job Not Found</h2>
      <Link to="/jobs" className="btn btn-ghost mt-4">Back to Jobs</Link>
    </div>
  );

  return (
    <div className="job-detail-shell">
      <div className="job-detail-container">

        {/* Top Nav */}
        <div className="job-top-nav">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={18} /> Back
          </button>
          <button onClick={handleShare} className="share-btn">
            <Share2 size={16} /> Share
          </button>
        </div>

        <div className="job-grid">
          {/* ── Main Content ── */}
          <div className="job-main">
            {/* Header Card */}
            <motion.div className="job-header-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="job-header-top">
                <div className="job-logo-large">
                  {job.postedBy?.orgLogo ? <img src={job.postedBy.orgLogo} alt="" /> : <Briefcase size={32} />}
                </div>
                <div>
                  <h1 className="job-title-large">{job.title}</h1>
                  <Link to={`/org/${job.postedBy?._id}`} className="job-org-link">
                    {job.postedBy?.orgName}
                  </Link>
                </div>
              </div>

              <div className="job-badges">
                {job.gameName && <span className="badge badge-saffron">🎮 {job.gameName}</span>}
                {job.workType && <span className="badge badge-electric"><Briefcase size={14} /> {job.workType}</span>}
                {job.locationType && <span className="badge badge-green"><MapPin size={14} /> {job.locationType}</span>}
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div className="job-section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="section-title">About the Role</h3>
              <p className="job-description">{job.description}</p>
            </motion.div>

            {job.mustHaves?.length > 0 && (
              <motion.div className="job-section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h3 className="section-title">Must Have <Target size={18} className="text-saffron" style={{ marginLeft: 8 }} /></h3>
                <ul className="req-list">
                  {job.mustHaves.map((req, i) => (
                    <li key={i}><CheckCircle2 size={18} className="text-saffron flex-shrink-0" /> <span>{req}</span></li>
                  ))}
                </ul>
              </motion.div>
            )}

            {job.niceToHaves?.length > 0 && (
              <motion.div className="job-section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="section-title">Nice to Have <PlusCircle size={18} className="text-electric" style={{ marginLeft: 8 }} /></h3>
                <ul className="req-list">
                  {job.niceToHaves.map((req, i) => (
                    <li key={i}><PlusCircle size={18} className="text-electric flex-shrink-0" /> <span>{req}</span></li>
                  ))}
                </ul>
              </motion.div>
            )}

            {(job.deviceRequirements?.requiredDevice || job.deviceRequirements?.minRam || job.deviceRequirements?.minStorage) && (
              <motion.div className="job-section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h3 className="section-title">Hardware Requirements <MonitorSmartphone size={18} className="text-purple-light" style={{ marginLeft: 8 }} /></h3>
                <div className="hardware-grid">
                  {job.deviceRequirements.requiredDevice && (
                    <div className="hw-item">
                      <span className="hw-label">Device</span>
                      <span className="hw-value">{Array.isArray(job.deviceRequirements.requiredDevice) ? job.deviceRequirements.requiredDevice.join(', ') : job.deviceRequirements.requiredDevice}</span>
                    </div>
                  )}
                  {job.deviceRequirements.minStorage && (
                    <div className="hw-item">
                      <span className="hw-label">Storage</span>
                      <span className="hw-value">{job.deviceRequirements.minStorage}</span>
                    </div>
                  )}
                  {job.deviceRequirements.minRam && (
                    <div className="hw-item">
                      <span className="hw-label">RAM</span>
                      <span className="hw-value">{job.deviceRequirements.minRam}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="job-sidebar">
            <motion.div className="job-apply-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              {isUser ? (
                <Link to={`/jobs/${id}/apply`} className="job-apply-btn">
                  <span>Apply Now</span>
                  <CornerUpRight size={18} />
                </Link>
              ) : !isAuthenticated ? (
                <Link to="/login" className="job-apply-btn job-apply-btn--login">
                  <span>Login to Apply</span>
                </Link>
              ) : null}

              <div className="job-meta-list">
                <div className="job-meta-item">
                  <div className="job-meta-icon"><MapPin size={16} /></div>
                  <div className="job-meta-text">
                    <span className="label">Location</span>
                    <span className="value">{job.location?.state || 'Anywhere'}</span>
                  </div>
                </div>
                <div className="job-meta-item">
                  <div className="job-meta-icon"><Briefcase size={16} /></div>
                  <div className="job-meta-text">
                    <span className="label">Work Type</span>
                    <span className="value">{job.workType} ({job.locationType})</span>
                  </div>
                </div>
                {job.salary?.type && job.salary.type !== 'Unpaid' && (
                  <div className="job-meta-item">
                    <div className="job-meta-icon">💰</div>
                    <div className="job-meta-text">
                      <span className="label">Compensation</span>
                      <span className="value">
                        {job.salary.type}
                        {job.salary.range?.min && ` • ₹${job.salary.range.min} - ₹${job.salary.range.max}`}
                      </span>
                    </div>
                  </div>
                )}
                {job.deadline && (
                  <div className="job-meta-item">
                    <div className="job-meta-icon"><Calendar size={16} /></div>
                    <div className="job-meta-text">
                      <span className="label">Application Deadline</span>
                      <span className="value" style={{ color: 'var(--saffron)' }}>
                        {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="job-stats">
                <div className="job-stat-pill">
                  <Users size={14} />
                  <span>{job.applicantCount || 0} Applicants</span>
                </div>
                <div className="job-stat-pill">
                  <Clock size={14} />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .job-detail-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .job-detail-container { max-width: 1000px; margin: 0 auto; padding: 24px 16px; }

        .job-top-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .back-btn, .share-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--border-dim); color: var(--text-secondary); padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .back-btn:hover, .share-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); border-color: var(--border); }

        .job-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        @media (max-width: 860px) { .job-grid { grid-template-columns: 1fr; } .job-sidebar { order: -1; } }

        .job-main { display: flex; flex-direction: column; gap: 16px; }
        
        .job-header-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
        .job-header-top { display: flex; align-items: center; gap: 24px; margin-bottom: 24px; }
        @media (max-width: 600px) { .job-header-top { flex-direction: column; align-items: flex-start; gap: 16px; } }
        .job-logo-large { width: 80px; height: 80px; border-radius: 16px; background: var(--bg-input); border: 1px solid var(--border-dim); display: flex; align-items: center; justify-content: center; color: var(--text-muted); overflow: hidden; flex-shrink: 0; }
        .job-logo-large img { width: 100%; height: 100%; object-fit: cover; }
        .job-title-large { font-size: 2rem; font-weight: 800; color: var(--text-white); margin-bottom: 6px; line-height: 1.2; }
        .job-org-link { color: var(--text-secondary); font-size: 1.1rem; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .job-org-link:hover { color: var(--saffron); text-decoration: underline; }
        
        .job-badges { display: flex; flex-wrap: wrap; gap: 10px; }
        .job-badges .badge { padding: 6px 14px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; }

        .job-section-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
        .section-title { display: flex; align-items: center; font-size: 1.25rem; font-weight: 700; color: var(--text-white); margin-bottom: 20px; border-bottom: 1px solid var(--border-dim); padding-bottom: 12px; }
        .job-description { color: var(--text-secondary); font-size: 1rem; line-height: 1.75; white-space: pre-wrap; }

        .req-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
        .req-list li { display: flex; align-items: flex-start; gap: 12px; color: var(--text-primary); font-size: 0.95rem; line-height: 1.5; }

        .hardware-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .hw-item { background: var(--bg-input); border: 1px solid var(--border-dim); padding: 16px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .hw-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; }
        .hw-value { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }

        .job-sidebar { position: sticky; top: 96px; }
        .job-apply-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: var(--shadow-card); }
        
        .job-apply-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: linear-gradient(135deg, var(--saffron), var(--saffron-dark)); color: white; border-radius: 12px; font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(255,107,0,0.3); margin-bottom: 24px; }
        .job-apply-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,0,0.4); border: none; color: white;}
        .job-apply-btn--login { background: transparent; border: 1.5px solid var(--electric); color: var(--electric); box-shadow: none; }
        .job-apply-btn--login:hover { background: rgba(0,229,255,0.1); box-shadow: 0 0 16px rgba(0,229,255,0.2); border-color: var(--electric);}

        .job-meta-list { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .job-meta-item { display: flex; align-items: flex-start; gap: 12px; }
        .job-meta-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--bg-input); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); flex-shrink: 0; }
        .job-meta-text { display: flex; flex-direction: column; gap: 2px; }
        .job-meta-text .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; }
        .job-meta-text .value { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }

        .job-stats { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-dim); }
        .job-stat-pill { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-dim); border-radius: 20px; color: var(--text-secondary); font-size: 0.8rem; font-weight: 600; }
      `}</style>
    </div>
  );
}