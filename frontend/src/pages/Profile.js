import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  MapPin, Link as LinkIcon, Share2, Mail, MessageSquare, Edit3,
  Award, Gamepad2, PlaySquare, Target, UserPlus, Eye, Youtube,
  Instagram, Twitter, Twitch, Globe, Medal
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoad] = useState(true);
  const { user: me } = useAuth();

  useEffect(() => {
    usersAPI.getByUsername(username)
      .then(r => { setProfile(r.data.data); setLoad(false); })
      .catch(() => setLoad(false));
  }, [username]);

  if (loading) return <div className="page flex-center" style={{ height: '80vh' }}><div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%' }} /></div>;
  if (!profile) return <div className="page flex-center" style={{ height: '80vh' }}><h2>Player not found</h2></div>;

  const isOwn = me?.username === username;
  const social = profile.social || {};

  const getSocialIcon = (key) => {
    switch (key) {
      case 'youtube': return <Youtube size={16} />;
      case 'instagram': return <Instagram size={16} />;
      case 'twitter': return <Twitter size={16} />;
      case 'twitch': return <Twitch size={16} />;
      case 'discord': return <MessageSquare size={16} />;
      default: return <Globe size={16} />;
    }
  };

  return (
    <div className="profile-shell">
      
      {/* ── Banner ── */}
      <div className="profile-banner">
        <div className="banner-grid-overlay" />
      </div>

      <div className="profile-container">
        
        {/* ── Header ── */}
        <div className="profile-header-section">
          <div className="profile-header-left">
            <div className="profile-avatar-large">
              {profile.avatar ? <img src={profile.avatar} alt="" /> : <span>{profile.displayName?.[0]?.toUpperCase()}</span>}
            </div>
            <div className="profile-info-block">
              <div className="profile-title-row">
                <h1>{profile.displayName}</h1>
                {profile.openToWork && <span className="badge badge-green">Open to Work</span>}
              </div>
              <p className="profile-role-text">{profile.primaryRole}</p>
              {profile.tagline && <p className="profile-tagline">“{profile.tagline}”</p>}
              <div className="profile-meta-row">
                <span>📍 {profile.city ? `${profile.city}, ` : ''}{profile.state || 'India'}</span>
                <span className="dot">·</span>
                <span>@{profile.username}</span>
              </div>
            </div>
          </div>
          <div className="profile-header-actions">
            {isOwn ? (
              <Link to="/profile/edit" className="btn-edit-profile">
                <Edit3 size={16} /> Edit Profile
              </Link>
            ) : (
              <>
                <button className="btn-connect"><UserPlus size={16} /> Connect</button>
                <button className="btn-message"><Mail size={16} /> Message</button>
              </>
            )}
            <button className="btn-share"><Share2 size={16} /></button>
          </div>
        </div>

        {/* ── Score & Stats ── */}
        <div className="profile-stats-card">
          <div className="score-section">
            <div className="score-header">
              <span className="score-label">Profile Strength</span>
              <span className="score-value">{profile.profileScore}%</span>
            </div>
            <div className="score-bar-bg">
              <motion.div
                className="score-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${profile.profileScore}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ background: profile.profileScore >= 80 ? 'var(--india-green)' : profile.profileScore >= 50 ? 'var(--electric)' : 'var(--saffron)' }}
              />
            </div>
          </div>
          <div className="stats-divider" />
          <div className="stats-group">
            <div className="stat-item">
              <div className="stat-number"><Eye size={18} className="text-electric" /> {profile.profileViews || 0}</div>
              <div className="stat-label">Profile Views</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><Award size={18} className="text-saffron" /> {profile.followersCount || 0}</div>
              <div className="stat-label">Followers</div>
            </div>
          </div>
        </div>

        {/* ── Layout Grid ── */}
        <div className="profile-grid">
          
          {/* Main Column */}
          <div className="profile-main">
            
            {profile.bio && (
              <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h3 className="card-title">About</h3>
                <p className="about-text">{profile.bio}</p>
              </motion.div>
            )}

            {profile.gameProfiles?.length > 0 && (
              <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="card-title"><Gamepad2 size={20} className="text-electric" /> Game Profiles</h3>
                <div className="game-profiles-list">
                  {profile.gameProfiles.map(g => (
                    <div key={g._id} className="game-profile-item">
                      <div className="gp-header">
                        <span className="gp-name">{g.gameName}</span>
                        {g.currentTier && <span className="gp-tier">{g.currentTier}</span>}
                      </div>
                      <div className="gp-roles">
                        {g.inGameRoles?.map(r => <span key={r} className="badge badge-glass">{r}</span>)}
                        {g.device && <span className="badge badge-saffron">{g.device}</span>}
                      </div>
                      {g.stats && (
                        <div className="gp-stats">
                          {g.stats.kd && <span>K/D: <strong>{g.stats.kd}</strong></span>}
                          {g.stats.winRate && <span>WR: <strong>{g.stats.winRate}%</strong></span>}
                          {g.stats.matches && <span>Matches: <strong>{g.stats.matches}</strong></span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {profile.achievements?.length > 0 && (
              <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="card-title"><Medal size={20} className="text-saffron" /> Achievements</h3>
                <div className="achievements-list">
                  {profile.achievements.map((a, i) => (
                    <div key={i} className="achievement-item">
                      <div className="achievement-icon">🏆</div>
                      <div>
                        <div className="achievement-title">{a.title}</div>
                        {a.description && <div className="achievement-desc">{a.description}</div>}
                        {a.date && <div className="achievement-date">{new Date(a.date).getFullYear()}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {profile.portfolio?.length > 0 && (
              <motion.div className="profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="card-title"><PlaySquare size={20} className="text-purple-light" /> Highlights & Portfolio</h3>
                <div className="portfolio-grid">
                  {profile.portfolio.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noreferrer" className="portfolio-item">
                      <div className="portfolio-thumb">
                        {p.type === 'video' ? <PlaySquare size={32} /> : p.type === 'image' ? <Target size={32} /> : <LinkIcon size={32} />}
                      </div>
                      <div className="portfolio-info">
                        <span className="portfolio-title truncate">{p.title || p.type}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="profile-sidebar">
            <motion.div className="profile-side-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h4 className="side-title">Overview</h4>
              <div className="side-list">
                {profile.primaryGame && (
                  <div className="side-item">
                    <span className="side-label">Main Game</span>
                    <span className="side-value">{profile.primaryGame}</span>
                  </div>
                )}
                {profile.primaryRole && (
                  <div className="side-item">
                    <span className="side-label">Role</span>
                    <span className="side-value">{profile.primaryRole}</span>
                  </div>
                )}
                {profile.availability && (
                  <div className="side-item">
                    <span className="side-label">Availability</span>
                    <span className="side-value">{profile.availability}</span>
                  </div>
                )}
                {profile.lookingFor?.length > 0 && (
                  <div className="side-item">
                    <span className="side-label">Looking For</span>
                    <div className="side-tags">
                      {profile.lookingFor.map(l => <span key={l} className="side-tag">{l}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {Object.keys(social).some(k => social[k]) && (
              <motion.div className="profile-side-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h4 className="side-title">Social Links</h4>
                <div className="social-links-list">
                  {Object.entries(social).map(([k, v]) => v && (
                    <a key={k} href={v.startsWith('http') ? v : `https://${v}`} target="_blank" rel="noreferrer" className="social-link-item">
                      {getSocialIcon(k)}
                      <span className="social-link-text">{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
      <BottomNav />

      <style>{`
        .profile-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        
        .profile-banner { height: 220px; background: linear-gradient(135deg, rgba(255,107,0,0.2), rgba(0,229,255,0.1), rgba(123,47,190,0.15)); border-bottom: 1px solid var(--border-dim); position: relative; overflow: hidden; }
        .banner-grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,107,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.05) 1px, transparent 1px); background-size: 40px 40px; }

        .profile-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; position: relative; top: -60px; }

        .profile-header-section { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 32px; }
        
        .profile-header-left { display: flex; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
        .profile-avatar-large { width: 130px; height: 130px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; color: white; border: 4px solid var(--bg-void); box-shadow: 0 12px 32px rgba(255,107,0,0.2); overflow: hidden; flex-shrink: 0; }
        .profile-avatar-large img { width: 100%; height: 100%; object-fit: cover; }
        
        .profile-info-block { padding-bottom: 8px; }
        .profile-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 4px; }
        .profile-title-row h1 { font-size: 2.2rem; font-weight: 800; color: var(--text-white); line-height: 1.1; }
        .profile-role-text { color: var(--saffron); font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; }
        .profile-tagline { color: var(--text-secondary); font-size: 0.95rem; font-style: italic; margin-bottom: 8px; }
        .profile-meta-row { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.85rem; }

        .profile-header-actions { display: flex; gap: 10px; margin-bottom: 8px; }
        .btn-edit-profile, .btn-connect, .btn-message, .btn-share { display: flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; padding: 10px 20px; border-radius: 12px; transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .btn-edit-profile { border: 1.5px solid var(--saffron); color: var(--saffron); }
        .btn-edit-profile:hover { background: rgba(255,107,0,0.1); }
        .btn-connect { background: linear-gradient(135deg, var(--electric), #0099bb); color: var(--bg-void); border: none; }
        .btn-connect:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,229,255,0.3); }
        .btn-message { background: transparent; border: 1.5px solid var(--border-dim); color: var(--text-primary); }
        .btn-message:hover { background: rgba(255,255,255,0.05); }
        .btn-share { padding: 10px; background: transparent; border: 1px solid transparent; color: var(--text-muted); }
        .btn-share:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); border-color: var(--border-dim); }

        .profile-stats-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 32px; margin-bottom: 24px; box-shadow: var(--shadow-card); }
        @media (max-width: 600px) { .profile-stats-card { flex-direction: column; gap: 24px; align-items: stretch; } .stats-divider { display: none; } }
        
        .score-section { flex: 1; }
        .score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .score-label { font-family: var(--font-display); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
        .score-value { font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; color: var(--text-white); }
        .score-bar-bg { height: 8px; background: var(--bg-input); border-radius: 4px; overflow: hidden; }
        .score-bar-fill { height: 100%; border-radius: 4px; }
        
        .stats-divider { width: 1px; height: 40px; background: var(--border-dim); }
        .stats-group { display: flex; gap: 32px; justify-content: center; }
        .stat-item { text-align: center; }
        .stat-number { display: flex; align-items: center; justify-content: center; gap: 6px; font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: var(--text-white); margin-bottom: 4px; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

        .profile-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
        @media (max-width: 860px) { .profile-grid { grid-template-columns: 1fr; } }
        
        .profile-main { display: flex; flex-direction: column; gap: 20px; }
        
        .profile-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; }
        .card-title { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; color: var(--text-white); margin-bottom: 20px; }
        .about-text { color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; white-space: pre-wrap; }

        .game-profiles-list { display: flex; flex-direction: column; gap: 16px; }
        .game-profile-item { background: var(--bg-input); border: 1px solid var(--border-dim); border-radius: 12px; padding: 20px; transition: border-color 0.2s; }
        .game-profile-item:hover { border-color: rgba(0,229,255,0.3); }
        .gp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .gp-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--text-white); }
        .gp-tier { color: var(--saffron); font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; padding: 4px 10px; background: rgba(255,107,0,0.1); border-radius: 20px; text-transform: uppercase; }
        .gp-roles { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .gp-stats { display: flex; gap: 24px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--border-dim); font-size: 0.85rem; color: var(--text-muted); }
        .gp-stats strong { color: var(--text-primary); font-family: var(--font-mono); font-weight: 600; margin-left: 4px; }

        .achievements-list { display: flex; flex-direction: column; gap: 12px; }
        .achievement-item { display: flex; gap: 16px; padding: 16px; background: var(--bg-input); border-radius: 12px; border: 1px solid rgba(255,107,0,0.1); }
        .achievement-icon { font-size: 1.8rem; line-height: 1; }
        .achievement-title { font-weight: 700; color: var(--text-white); font-size: 1rem; margin-bottom: 4px; }
        .achievement-desc { color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; }
        .achievement-date { color: var(--saffron); font-size: 0.75rem; font-weight: 600; margin-top: 6px; }

        .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .portfolio-item { display: block; border-radius: 12px; overflow: hidden; background: var(--bg-input); border: 1px solid var(--border-dim); text-decoration: none; transition: transform 0.2s, border-color 0.2s; }
        .portfolio-item:hover { transform: translateY(-4px); border-color: var(--purple-light); }
        .portfolio-thumb { height: 120px; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .portfolio-info { padding: 12px; }
        .portfolio-title { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }

        .profile-sidebar { display: flex; flex-direction: column; gap: 20px; }
        .profile-side-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
        .side-title { color: var(--text-white); font-size: 1rem; margin-bottom: 20px; border-bottom: 1px solid var(--border-dim); padding-bottom: 10px; }
        
        .side-list { display: flex; flex-direction: column; gap: 16px; }
        .side-item { display: flex; flex-direction: column; gap: 4px; }
        .side-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600; }
        .side-value { font-size: 0.95rem; color: var(--text-primary); font-weight: 500; }
        .side-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .side-tag { font-size: 0.75rem; padding: 4px 10px; background: rgba(255,255,255,0.05); border-radius: 20px; color: var(--text-secondary); }

        .social-links-list { display: flex; flex-direction: column; gap: 12px; }
        .social-link-item { display: flex; align-items: center; gap: 12px; color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; padding: 8px; border-radius: 8px; transition: background 0.2s, color 0.2s; }
        .social-link-item:hover { background: rgba(255,255,255,0.05); color: var(--text-white); }
      `}</style>
    </div>
  );
}