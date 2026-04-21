import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, gamesAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Shield, MapPin, ChevronRight, ChevronLeft, Mail, Briefcase } from 'lucide-react';

export default function RegisterOrg() {
  const [step, setStep] = useState(1);
  const [states, setStates] = useState([]);
  const [form, setForm] = useState({
    email: '', password: '', orgName: '', orgType: 'Esports Team', state: '', city: ''
  });

  React.useEffect(() => {
    gamesAPI.getStates().then(r => setStates(r.data.data)).catch(() => {});
  }, []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (!form.email || !form.password || !form.orgName) return toast.error('Fill required fields');
    if (form.password.length < 8) return toast.error('Password must be 8+ characters');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.registerOrg(form);
      login(data);
      toast.success('Organization registered!');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const slideIn = { enter: { x: 40, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -40, opacity: 0 } };

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-bg-orb auth-bg-orb--1" /><div className="auth-bg-orb auth-bg-orb--2" /></div>
      <motion.div className="auth-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ maxWidth: 460 }}>
        <div className="auth-header">
          <div className="auth-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--purple), var(--purple-light))' }}>
            <Building2 size={28} />
          </div>
          <h1 className="auth-title">Register Organization</h1>
          <p className="auth-subtitle">Build your esports brand on ArenaX</p>
        </div>

        <div className="step-bar">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`} style={step >= 1 ? { background: 'var(--purple-light)', borderColor: 'var(--purple-light)' } : {}}>1</div>
          <div className="step-line"><div className="step-line-fill" style={{ width: step >= 2 ? '100%' : '0%', background: 'var(--purple-light)' }} /></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`} style={step >= 2 ? { background: 'var(--purple-light)', borderColor: 'var(--purple-light)' } : {}}>2</div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="s1" variants={slideIn} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="auth-form">
                <div className="form-field">
                  <label className="form-label"><Building2 size={14} /> Organization Name</label>
                  <input type="text" name="orgName" className="form-input" placeholder="e.g. GodLike Esports" value={form.orgName} onChange={set} required />
                </div>
                <div className="form-field">
                  <label className="form-label"><Mail size={14} /> Business Email</label>
                  <input type="email" name="email" className="form-input" placeholder="contact@org.com" value={form.email} onChange={set} required />
                </div>
                <div className="form-field">
                  <label className="form-label"><Shield size={14} /> Password</label>
                  <input type="password" name="password" className="form-input" placeholder="Min 8 characters" value={form.password} onChange={set} required />
                </div>
                <button type="button" className="btn-submit" onClick={nextStep} style={{ background: 'linear-gradient(135deg, var(--purple), var(--purple-light))', boxShadow: '0 4px 16px rgba(123,47,190,0.3)' }}>
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="s2" variants={slideIn} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="auth-form">
                <div className="form-field">
                  <label className="form-label"><Briefcase size={14} /> Organization Type</label>
                  <select name="orgType" className="form-input form-select" value={form.orgType} onChange={set}>
                    <option value="Esports Team">Esports Team</option>
                    <option value="Tournament Organizer">Tournament Organizer</option>
                    <option value="Brand/Sponsor">Brand / Sponsor</option>
                    <option value="Agency">Agency</option>
                    <option value="Game Publisher">Game Publisher</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label"><MapPin size={14} /> State HQ</label>
                    <select name="state" className="form-input form-select" value={form.state} onChange={set}>
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-input" placeholder="Bengaluru" value={form.city} onChange={set} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn-back" onClick={() => setStep(1)}><ChevronLeft size={18} /></button>
                  <button type="submit" className="btn-submit" disabled={loading} style={{ background: 'linear-gradient(135deg, var(--purple), var(--purple-light))', boxShadow: '0 4px 16px rgba(123,47,190,0.3)' }}>
                    {loading ? 'Registering...' : 'Create Organization'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login">Sign In</Link>
        </div>
      </motion.div>

      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; position:relative; overflow:hidden; }
        .auth-bg { position:fixed; inset:0; z-index:0; }
        .auth-bg-orb { position:absolute; border-radius:50%; filter:blur(120px); }
        .auth-bg-orb--1 { width:500px; height:500px; background:var(--purple-light); top:-200px; right:-100px; opacity:0.08; }
        .auth-bg-orb--2 { width:400px; height:400px; background:var(--saffron); bottom:-150px; left:-100px; opacity:0.06; }
        .auth-card { position:relative; z-index:1; width:100%; max-width:420px; background:rgba(17,17,24,0.85); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.06); border-radius:20px; padding:40px 32px; box-shadow:0 24px 48px rgba(0,0,0,0.4); }
        .auth-header { text-align:center; margin-bottom:28px; }
        .auth-icon-wrap { width:56px; height:56px; margin:0 auto 16px; border-radius:16px; display:flex; align-items:center; justify-content:center; color:white; }
        .auth-title { font-size:1.6rem; font-weight:700; color:var(--text-white); margin-bottom:6px; }
        .auth-subtitle { color:var(--text-muted); font-size:0.9rem; }
        .auth-form { display:flex; flex-direction:column; gap:18px; margin-bottom:24px; }
        .form-field { display:flex; flex-direction:column; gap:6px; }
        .form-label { display:flex; align-items:center; gap:6px; font-family:var(--font-display); font-size:0.78rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-secondary); }
        .form-input { width:100%; padding:11px 14px; background:var(--bg-input); border:1.5px solid rgba(255,255,255,0.06); border-radius:10px; color:var(--text-primary); font-family:var(--font-body); font-size:0.95rem; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
        .form-input:focus { border-color:var(--purple-light); box-shadow:0 0 0 3px rgba(123,47,190,0.15); }
        .form-input::placeholder { color:var(--text-muted); }
        .form-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A855F7' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .btn-submit { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:13px 24px; border:none; border-radius:12px; color:white; font-family:var(--font-display); font-size:1rem; font-weight:700; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; }
        .btn-submit:hover:not(:disabled) { transform:translateY(-1px); }
        .btn-submit:disabled { opacity:0.7; cursor:not-allowed; }
        .btn-back { width:48px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; color:var(--text-secondary); cursor:pointer; transition:all 0.2s; flex-shrink:0; }
        .btn-back:hover { background:rgba(255,255,255,0.08); color:white; }
        .auth-footer { text-align:center; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); font-size:0.9rem; color:var(--text-muted); }
        .auth-footer a { color:var(--electric); font-weight:600; margin-left:6px; }
        .step-bar { display:flex; align-items:center; margin-bottom:28px; padding:0 20px; }
        .step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:0.8rem; font-weight:700; background:rgba(255,255,255,0.04); color:var(--text-muted); border:1.5px solid rgba(255,255,255,0.08); transition:all 0.3s; flex-shrink:0; }
        .step-dot.active { color:var(--bg-void); }
        .step-line { flex:1; height:2px; background:rgba(255,255,255,0.06); margin:0 8px; overflow:hidden; border-radius:2px; }
        .step-line-fill { height:100%; transition:width 0.4s ease; border-radius:2px; }
      `}</style>
    </div>
  );
}