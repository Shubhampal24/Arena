import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, gamesAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STEPS = ['Account', 'Identity', 'Gaming', 'Done'];

export default function RegisterUser() {
  const [step, setStep]     = useState(0);
  const [loading, setLoad]  = useState(false);
  const [games, setGames]   = useState([]);
  const [roles, setRoles]   = useState({});
  const [states, setStates] = useState([]);

  const [form, setForm] = useState({
    email: '', password: '', confirmPass: '',
    username: '', displayName: '',
    state: '', city: '',
    primaryRole: '', primaryGame: '',
    bio: '',
  });

  const { login } = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    gamesAPI.getAll().then(r => setGames(r.data.data));
    gamesAPI.getRoles().then(r => setRoles(r.data.data));
    gamesAPI.getStates().then(r => setStates(r.data.data));
  }, []);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const allRoleOptions = Object.values(roles).flat();

  const handleSubmit = async () => {
    if (form.password !== form.confirmPass) { toast.error('Passwords do not match!'); return; }
    setLoad(true);
    try {
      const { data } = await authAPI.registerUser({
        email: form.email, password: form.password, username: form.username,
        displayName: form.displayName, state: form.state, city: form.city,
        primaryRole: form.primaryRole, primaryGame: form.primaryGame, bio: form.bio,
      });
      login(data);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoad(false);
    }
  };

  const progressPct = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="page flex-center" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'radial-gradient(ellipse at 20% 60%, rgba(255,107,0,0.07) 0%, transparent 60%)' }} />

      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-white)' }}>
            ARENA<span style={{ color: 'var(--saffron)' }}>X</span>
          </Link>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '0.85rem' }}>Create your Gamer Profile</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              padding: '4px 14px', borderRadius: 100, fontSize: '0.75rem',
              fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.06em',
              background: i <= step ? 'var(--saffron)' : 'var(--bg-card)',
              color: i <= step ? 'white' : 'var(--text-muted)',
              border: `1px solid ${i <= step ? 'transparent' : 'var(--border-dim)'}`,
              transition: 'all 0.3s',
            }}>{s}</div>
          ))}
        </div>
        <div className="progress-bar" style={{ marginBottom: 32 }}>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="card" style={{ padding: '36px 32px', border: '1px solid var(--border)' }}>

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ marginBottom: 4 }}>Create Your Account</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>The basics — your login credentials.</p>

              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input className="input" type="email" placeholder="pro@gaming.com" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Password *</label>
                <input className="input" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Confirm Password *</label>
                <input className="input" type="password" placeholder="••••••••" value={form.confirmPass} onChange={e => set('confirmPass', e.target.value)} required />
              </div>
              <button className="btn btn-primary btn-full" onClick={() => { if (!form.email || !form.password || form.password !== form.confirmPass) { toast.error('Fill all fields correctly.'); return; } setStep(1); }}>
                Next: Your Identity →
              </button>
            </div>
          )}

          {/* STEP 1 — Identity */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ marginBottom: 4 }}>Your Gaming Identity</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>How the community will know you.</p>

              <div className="input-group">
                <label className="input-label">Display Name *</label>
                <input className="input" placeholder="Your name / alias" value={form.displayName} onChange={e => set('displayName', e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Username * <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontSize: '0.8rem' }}>(arenax.gg/u/<b>{form.username || '...'}</b>)</span></label>
                <input className="input" placeholder="no spaces, letters/numbers/_" value={form.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} required />
              </div>
              <div className="input-group">
                <label className="input-label">Bio (optional)</label>
                <textarea className="input" rows={3} placeholder="Tell the community about yourself..." value={form.bio} onChange={e => set('bio', e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="input-group">
                  <label className="input-label">State *</label>
                  <select className="input select" value={form.state} onChange={e => set('state', e.target.value)} required>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">City</label>
                  <input className="input" placeholder="e.g. Mumbai" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>

              <div className="flex gap-4">
                <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { if (!form.displayName || !form.username || !form.state) { toast.error('Fill required fields.'); return; } setStep(2); }}>
                  Next: Gaming Profile →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Gaming */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ marginBottom: 4 }}>Your Gaming Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>Tell us what you play and what you do.</p>

              <div className="input-group">
                <label className="input-label">Primary Role *</label>
                <select className="input select" value={form.primaryRole} onChange={e => set('primaryRole', e.target.value)} required>
                  <option value="">Select your main role</option>
                  {Object.entries(roles).map(([cat, roleList]) => (
                    <optgroup key={cat} label={cat}>
                      {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Primary Game *</label>
                <select className="input select" value={form.primaryGame} onChange={e => set('primaryGame', e.target.value)} required>
                  <option value="">Select main game</option>
                  {games.map(g => <option key={g.id} value={g.id}>{g.name} ({g.genre})</option>)}
                </select>
              </div>

              <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: 16, border: '1px solid var(--border-dim)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  ℹ️ You can add detailed game stats, rank tiers, highlight clips, and achievements from your <b>profile dashboard</b> after registration.
                </p>
              </div>

              <div className="flex gap-4">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={loading} onClick={handleSubmit}>
                  {loading ? '⏳ Creating...' : '🎮 Create My Profile!'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
              <h2 style={{ color: 'var(--saffron)', marginBottom: 12 }}>You're in the Arena!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
                Welcome to ArenaX, <b style={{ color: 'var(--text-primary)' }}>{form.displayName}</b>!<br />
                Your profile is ready. Complete it to unlock maximum visibility.
              </p>
              <div className="flex-col gap-4">
                <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/profile/edit')}>
                  Complete My Profile →
                </button>
                <button className="btn btn-ghost btn-full" onClick={() => navigate('/feed')}>
                  Explore the Feed
                </button>
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 20 }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--saffron)' }}>Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
