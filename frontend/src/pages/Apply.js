import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI, applyAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Briefcase, Send, FileText, CheckCircle2, ChevronLeft,
  AlertCircle, UploadCloud, Video, Target, Link2
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [load, setLoad] = useState(true);
  const [submitting, setSub] = useState(false);
  const [form, setForm] = useState({ coverNote: '', portfolioLinks: '', discordId: '', availability: '', videoIntroUrl: '' });

  useEffect(() => {
    jobsAPI.getById(id)
      .then(r => { setJob(r.data.data); setLoad(false); })
      .catch(() => setLoad(false));
  }, [id]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      await applyAPI.apply(id, {
        ...form,
        portfolioLinks: form.portfolioLinks.split('\n').filter(Boolean),
        gameStats: { currentTier: user?.gameProfiles?.[0]?.currentTier, kd: user?.gameProfiles?.[0]?.stats?.kd },
      });
      toast.success('Application submitted! Good luck! 🎮');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    } finally { setSub(false); }
  };

  if (load) return <div className="page flex-center" style={{ height: '60vh' }}><div className="skeleton" style={{ height: 400, width: '100%', maxWidth: 600, borderRadius: 16 }} /></div>;

  return (
    <div className="apply-shell">
      <div className="apply-container">

        {/* Header */}
        <div className="apply-header">
          <Link to={`/jobs/${id}`} className="back-link">
            <ChevronLeft size={16} /> Back to Job
          </Link>
          <div className="apply-title-row">
            <div className="apply-logo">
              {job?.postedBy?.orgLogo ? <img src={job.postedBy.orgLogo} alt="" /> : <Briefcase size={24} />}
            </div>
            <div>
              <h1>Apply for <span className="text-saffron">{job?.title}</span></h1>
              <p className="apply-org">at {job?.postedBy?.orgName}</p>
            </div>
          </div>
        </div>

        {/* Progress Alert */}
        <div className="profile-alert">
          <CheckCircle2 size={18} className="text-india-green" />
          <span>Your ArenaX Gamer Profile will be attached automatically. Make sure your stats are up to date!</span>
          <Link to="/profile/edit" className="alert-link">Edit Profile</Link>
        </div>

        {/* Form Card */}
        <motion.div className="apply-form-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="apply-form">
            
            <div className="form-section">
              <h3 className="form-section-title"><FileText size={18} /> Pitch Yourself</h3>
              
              <div className="form-group">
                <label className="form-label">Cover Note <span className="req">*</span></label>
                <textarea
                  className="form-input"
                  rows={5}
                  placeholder="Tell the org why you're the right fit. Highlight your synergy, tier, experience, and what you bring to the roster..."
                  value={form.coverNote}
                  onChange={e => set('coverNote', e.target.value)}
                  required
                />
                <span className="input-hint">Make it stand out. Orgs read hundreds of these.</span>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Availability</label>
                <select className="form-input form-select" value={form.availability} onChange={e => set('availability', e.target.value)}>
                  <option value="">Select availability</option>
                  {['Full-Time', 'Part-Time', 'Bootcamp', 'WFH Only', 'Weekends Only', 'Tournaments Only'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Discord ID</label>
                <input className="form-input" placeholder="username#0000" value={form.discordId} onChange={e => set('discordId', e.target.value)} />
              </div>
            </div>

            <div className="form-divider" />

            <div className="form-section">
              <h3 className="form-section-title"><Target size={18} /> Media & Links</h3>
              
              <div className="form-group">
                <label className="form-label"><Link2 size={14} style={{ marginRight: 6 }} /> Portfolio / Highlight Links</label>
                <textarea
                  className="form-input form-input--mono"
                  rows={4}
                  placeholder="Paste URLs here, one per line (YouTube, Instagram, Tracker.gg, etc.)"
                  value={form.portfolioLinks}
                  onChange={e => set('portfolioLinks', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Video size={14} style={{ marginRight: 6 }} /> Video Introduction (Optional)</label>
                <input
                  className="form-input"
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={form.videoIntroUrl}
                  onChange={e => set('videoIntroUrl', e.target.value)}
                />
                <span className="input-hint">A 60s intro video drastically increases your chances.</span>
              </div>
            </div>

            {job?.applicationProcess?.trialMatch && (
              <div className="trial-alert">
                <AlertCircle size={20} className="text-electric" />
                <div>
                  <h4>Trial Match Required</h4>
                  <p>This role requires passing an in-game evaluation. If shortlisted, the org will contact you to schedule a trial match.</p>
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? (
                <span className="btn-loading">Submitting...</span>
              ) : (
                <><Send size={18} /> Send Application</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
      <BottomNav />

      <style>{`
        .apply-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .apply-container { max-width: 760px; margin: 0 auto; padding: 24px 16px; }

        .apply-header { margin-bottom: 24px; }
        .back-link { display: inline-flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; text-decoration: none; margin-bottom: 20px; transition: color 0.2s; }
        .back-link:hover { color: var(--text-primary); }
        .apply-title-row { display: flex; align-items: center; gap: 16px; }
        .apply-logo { width: 56px; height: 56px; border-radius: 14px; background: var(--bg-input); border: 1px solid var(--border-dim); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
        .apply-logo img { width: 100%; height: 100%; object-fit: cover; }
        .apply-header h1 { font-size: 1.8rem; line-height: 1.2; margin-bottom: 4px; }
        .apply-org { color: var(--text-secondary); font-size: 1rem; }

        .profile-alert { display: flex; align-items: center; gap: 12px; background: rgba(19,136,8,0.06); border: 1px solid rgba(19,136,8,0.2); padding: 14px 16px; border-radius: 12px; margin-bottom: 24px; font-size: 0.88rem; color: var(--text-primary); }
        .alert-link { color: var(--india-green); font-weight: 700; text-decoration: underline; margin-left: auto; flex-shrink: 0; }

        .apply-form-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: var(--shadow-card); }
        .apply-form { display: flex; flex-direction: column; gap: 28px; }

        .form-section { display: flex; flex-direction: column; gap: 16px; }
        .form-section-title { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; color: var(--text-white); padding-bottom: 8px; border-bottom: 1px solid var(--border-dim); }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
        
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { display: flex; align-items: center; font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
        .req { color: #ff4444; margin-left: 4px; }
        .form-input { width: 100%; padding: 12px 14px; background: var(--bg-input); border: 1.5px solid var(--border-dim); border-radius: 12px; font-family: var(--font-body); font-size: 0.95rem; color: var(--text-primary); outline: none; transition: all 0.2s; resize: vertical; }
        .form-input:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
        .form-input--mono { font-family: var(--font-mono); font-size: 0.88rem; }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23606078' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .input-hint { font-size: 0.75rem; color: var(--text-muted); }

        .form-divider { height: 1px; background: var(--border-dim); }

        .trial-alert { display: flex; gap: 16px; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.2); border-radius: 12px; padding: 20px; align-items: flex-start; }
        .trial-alert h4 { color: var(--electric); margin-bottom: 4px; font-size: 1rem; }
        .trial-alert p { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; }

        .submit-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--saffron), var(--saffron-dark)); color: white; font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(255,107,0,0.3); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,0,0.4); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}