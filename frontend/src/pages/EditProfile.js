import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  User, Link2, Gamepad2, Save, ExternalLink, MapPin, Search
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('basic');
  const [games, setGames] = useState([]);
  const [states, setStates] = useState([]);
  const [roles, setRoles] = useState({});
  const [saving, setSave] = useState(false);
  const [form, setForm] = useState({ displayName: '', bio: '', tagline: '', state: '', city: '', primaryRole: '', openToWork: false, availability: '', social: { youtube: '', instagram: '', twitter: '', discord: '', twitch: '', website: '' } });

  useEffect(() => {
    if (user) setForm({ displayName: user.displayName || '', bio: user.bio || '', tagline: user.tagline || '', state: user.state || '', city: user.city || '', primaryRole: user.primaryRole || '', openToWork: user.openToWork || false, availability: user.availability || '', social: user.social || { youtube: '', instagram: '', twitter: '', discord: '', twitch: '', website: '' } });
    gamesAPI.getAll().then(r => setGames(r.data.data));
    gamesAPI.getStates().then(r => setStates(r.data.data));
    gamesAPI.getRoles().then(r => setRoles(r.data.data));
  }, [user]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (k, v) => setForm(p => ({ ...p, social: { ...p.social, [k]: v } }));

  const save = async () => {
    setSave(true);
    try {
      const { data } = await usersAPI.updateProfile(form);
      updateUser(data.data);
      toast.success('Profile updated successfully! 🚀');
    } catch { toast.error('Failed to update profile.'); }
    finally { setSave(false); }
  };

  const score = user?.profileScore || 0;
  const scoreColor = score >= 80 ? 'var(--india-green)' : score >= 50 ? 'var(--electric)' : 'var(--saffron)';

  return (
    <div className="edit-profile-shell">
      <div className="edit-profile-container">

        {/* ── Header & Progress ── */}
        <div className="edit-header">
          <div className="edit-header-info">
            <h1>Settings & <span className="text-electric">Profile</span></h1>
            <p className="edit-subtitle">Manage your personal information and gaming identity.</p>
          </div>
          <div className="edit-header-stats">
            <div className="score-label">Profile Strength</div>
            <div className="score-row">
              <div className="score-bar-bg">
                <motion.div
                  className="score-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1 }}
                  style={{ background: scoreColor }}
                />
              </div>
              <span className="score-value" style={{ color: scoreColor }}>{score}%</span>
            </div>
          </div>
        </div>

        {/* ── Layout ── */}
        <div className="edit-grid">
          
          {/* Side Nav */}
          <div className="edit-sidebar">
            <div className="nav-tabs">
              <button className={`nav-tab ${tab === 'basic' ? 'active' : ''}`} onClick={() => setTab('basic')}>
                <User size={18}/> <span>Basic Info</span>
              </button>
              <button className={`nav-tab ${tab === 'social' ? 'active' : ''}`} onClick={() => setTab('social')}>
                <Link2 size={18}/> <span>Social Links</span>
              </button>
              <button className={`nav-tab ${tab === 'gaming' ? 'active' : ''}`} onClick={() => setTab('gaming')}>
                <Gamepad2 size={18}/> <span>Gaming Identity</span>
              </button>
            </div>
            
            <div className="sidebar-actions hidden-mobile">
              <button className="btn-save-lg" onClick={save} disabled={saving}>
                {saving ? "Saving..." : <><Save size={18}/> Save Changes</>}
              </button>
              <button className="btn-ghost-lg" onClick={() => navigate(`/u/${user?.username}`)}>
                <ExternalLink size={18}/> View Profile
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="edit-main">
            <motion.div className="edit-form-card" key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              
              {tab === 'basic' && (
                <div className="form-section">
                  <h3 className="section-title">Personal Information</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Display Name <span className="req">*</span></label>
                    <input className="form-input" value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="Your name or alias" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Tagline</label>
                    <input className="form-input" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. India's #1 BGMI IGL | Content Creator" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">About You</label>
                    <textarea className="form-input" rows={5} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell your story, your esports journey, and what you aim to achieve..." />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">State <span className="req">*</span></label>
                      <select className="form-input form-select" value={form.state} onChange={e => set('state', e.target.value)}>
                        <option value="">Select State</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Mumbai" />
                    </div>
                  </div>

                  <div className="toggle-card">
                    <div className="toggle-info">
                      <h4 className="text-white">Open to Opportunities</h4>
                      <p className="text-muted text-sm">Organizations will see you available for hire in talent search.</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={form.openToWork} onChange={e => set('openToWork', e.target.checked)} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}

              {tab === 'social' && (
                <div className="form-section">
                  <h3 className="section-title">Social Presences</h3>
                  <p className="text-muted text-sm mb-6">Linking your social accounts verifies your identity and boosts your profile visibility to top organizations.</p>
                  
                  <div className="social-inputs">
                    {[
                      { k: 'youtube', l: 'YouTube Channel', ph: 'https://youtube.com/@channel' },
                      { k: 'instagram', l: 'Instagram Profile', ph: 'https://instagram.com/handle' },
                      { k: 'twitter', l: 'X (Twitter)', ph: 'https://twitter.com/handle' },
                      { k: 'twitch', l: 'Twitch Channel', ph: 'https://twitch.tv/channel' },
                      { k: 'discord', l: 'Discord Tag', ph: 'username#0000' },
                      { k: 'website', l: 'Personal Website', ph: 'https://yourwebsite.com' }
                    ].map(({ k, l, ph }) => (
                      <div className="form-group" key={k}>
                        <label className="form-label">{l}</label>
                        <input className="form-input" type={k === 'discord' ? 'text' : 'url'} placeholder={ph} value={form.social[k] || ''} onChange={e => setSocial(k, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'gaming' && (
                <div className="form-section">
                  <h3 className="section-title">Professional Identity</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Primary Role <span className="req">*</span></label>
                    <select className="form-input form-select" value={form.primaryRole} onChange={e => set('primaryRole', e.target.value)}>
                      <option value="">Select your main expertise</option>
                      {Object.entries(roles).map(([cat, roleList]) => (
                        <optgroup key={cat} label={cat}>{roleList.map(r => <option key={r} value={r}>{r}</option>)}</optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Availability</label>
                    <select className="form-input form-select" value={form.availability} onChange={e => set('availability', e.target.value)}>
                      <option value="">Select availability</option>
                      {['Full-Time', 'Part-Time', 'Bootcamp', 'WFH Only', 'Tournament Only'].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div className="info-alert mt-6">
                    <Gamepad2 size={24} className="text-electric" />
                    <div>
                      <h4 className="text-white mb-2">Game Specific Profiles</h4>
                      <p className="text-muted text-sm">Detailed game profiles (ranks, KD, specific roles per game) can be added directly from your public View Profile page after saving basic info.</p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
            
            {/* Mobile Actions */}
            <div className="mobile-actions display-mobile">
              <button className="btn-save-full" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              <button className="btn-ghost-full" onClick={() => navigate(`/u/${user?.username}`)}>View Profile</button>
            </div>

          </div>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .edit-profile-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .edit-profile-container { max-width: 1000px; margin: 0 auto; padding: 24px 16px; }

        .edit-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 32px; }
        .edit-header h1 { font-size: 2rem; margin-bottom: 4px; }
        .edit-subtitle { color: var(--text-muted); font-size: 0.95rem; }

        .edit-header-stats { background: rgba(255,255,255,0.03); border: 1px solid var(--border-dim); padding: 12px 20px; border-radius: 12px; min-width: 240px; }
        .score-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; margin-bottom: 8px; }
        .score-row { display: flex; align-items: center; gap: 12px; }
        .score-bar-bg { flex: 1; height: 8px; background: var(--border-dim); border-radius: 4px; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 4px; }
        .score-value { font-family: var(--font-display); font-weight: 800; font-size: 0.9rem; }

        .edit-grid { display: grid; grid-template-columns: 240px 1fr; gap: 32px; align-items: start; }
        @media (max-width: 768px) { .edit-grid { grid-template-columns: 1fr; } }
        
        .edit-sidebar { display: flex; flex-direction: column; gap: 24px; position: sticky; top: 96px; }
        .nav-tabs { display: flex; flex-direction: column; gap: 8px; }
        @media (max-width: 768px) { .nav-tabs { flex-direction: row; overflow-x: auto; padding-bottom: 8px; } }
        
        .nav-tab { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: transparent; border: none; border-radius: 12px; color: var(--text-secondary); font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left; }
        @media (max-width: 768px) { .nav-tab { flex-shrink: 0; padding: 10px 16px; } }
        .nav-tab:hover { background: rgba(255,255,255,0.03); color: var(--text-primary); }
        .nav-tab.active { background: linear-gradient(135deg, rgba(0,229,255,0.1), transparent); color: var(--electric); border: 1px solid rgba(0,229,255,0.2); }

        .sidebar-actions { display: flex; flex-direction: column; gap: 12px; padding-top: 24px; border-top: 1px solid var(--border-dim); }
        .btn-save-lg { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; background: linear-gradient(135deg, var(--saffron), var(--saffron-dark)); border: none; border-radius: 12px; color: white; font-family: var(--font-display); font-size: 1rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 16px rgba(255,107,0,0.3); transition: transform 0.2s; }
        .btn-save-lg:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,0,0.4); }
        .btn-ghost-lg { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: transparent; border: 1.5px solid var(--border-dim); border-radius: 12px; color: var(--text-secondary); font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-ghost-lg:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); border-color: var(--border); }

        .edit-main { display: flex; flex-direction: column; gap: 24px; }
        .edit-form-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: var(--shadow-card); }
        .section-title { font-size: 1.25rem; font-weight: 700; color: var(--text-white); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--border-dim); }

        .form-section { display: flex; flex-direction: column; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
        
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-label { display: flex; align-items: center; font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
        .req { color: #ff4444; margin-left: 4px; }
        .form-input { width: 100%; padding: 12px 14px; background: var(--bg-input); border: 1.5px solid var(--border-dim); border-radius: 10px; font-family: var(--font-body); font-size: 0.95rem; color: var(--text-primary); outline: none; transition: all 0.2s; resize: vertical; }
        .form-input:focus { border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(255,107,0,0.1); }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23606078' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }

        .toggle-card { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: rgba(19,136,8,0.05); border: 1px solid rgba(19,136,8,0.2); border-radius: 12px; margin-top: 8px; }
        .toggle-info h4 { margin-bottom: 2px; font-size: 1rem; color: var(--india-green); }
        
        /* Toggle Switch */
        .toggle-switch { position: relative; display: inline-block; width: 50px; height: 26px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-dim); transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--india-green); }
        input:checked + .slider:before { transform: translateX(24px); }

        .social-inputs { display: flex; flex-direction: column; gap: 16px; }

        .info-alert { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); border-radius: 12px; }
        .text-sm { font-size: 0.85rem; }
        .mb-6 { margin-bottom: 24px; }
        .mt-6 { margin-top: 24px; }

        .display-mobile { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none; }
          .display-mobile { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
          .btn-save-full { padding: 14px; background: var(--saffron); color: white; border: none; border-radius: 10px; font-family: var(--font-display); font-weight: 700; font-size: 1rem; }
          .btn-ghost-full { padding: 14px; background: transparent; color: var(--text-secondary); border: 1px solid var(--border-dim); border-radius: 10px; font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; }
        }
      `}</style>
    </div>
  );
}