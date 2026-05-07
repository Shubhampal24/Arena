import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, gamesAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Shield, MapPin, ChevronRight, ChevronLeft, Mail, Briefcase, Lock } from 'lucide-react';

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
    if (!form.email || !form.password || !form.orgName) return toast.error('Please fill all required fields');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.registerOrg(form);
      login(data);
      toast.success('Organization account created!');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const slideIn = { enter: { x: 20, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -20, opacity: 0 } };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />
      
      <motion.div
        className="auth-card glass-surface"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 480 }}
      >
        <div className="auth-header">
          <div className="auth-logo-icon">
            <Building2 size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: 16 }}>Partner with Arena</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Build and scale your organization</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Details</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1" 
                variants={slideIn} initial="enter" animate="center" exit="exit" 
                transition={{ duration: 0.4 }}
                className="form-step"
              >
                <div className="form-group">
                  <label className="form-label"><Building2 size={14} /> Organization Name</label>
                  <input type="text" name="orgName" className="input" placeholder="e.g. Global Tech Solutions" value={form.orgName} onChange={set} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Mail size={14} /> Business Email</label>
                  <input type="email" name="email" className="input" placeholder="contact@company.com" value={form.email} onChange={set} required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Lock size={14} /> Password</label>
                  <input type="password" name="password" className="input" placeholder="At least 8 characters" value={form.password} onChange={set} required />
                </div>
                <button type="button" className="btn btn-primary btn-full btn-lg" onClick={nextStep} style={{ marginTop: 8 }}>
                  Next Step <ChevronRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2" 
                variants={slideIn} initial="enter" animate="center" exit="exit" 
                transition={{ duration: 0.4 }}
                className="form-step"
              >
                <div className="form-group">
                  <label className="form-label"><Briefcase size={14} /> Organization Type</label>
                  <select name="orgType" className="input" value={form.orgType} onChange={set}>
                    <option value="Esports Team">Esports Team</option>
                    <option value="Tournament Organizer">Tournament Organizer</option>
                    <option value="Brand/Sponsor">Brand / Sponsor</option>
                    <option value="Agency">Agency</option>
                    <option value="Game Publisher">Game Publisher</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label"><MapPin size={14} /> Headquarter State</label>
                    <select name="state" className="input" value={form.state} onChange={set}>
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="input" placeholder="e.g. Bengaluru" value={form.city} onChange={set} />
                  </div>
                </div>
                <div className="flex gap-3" style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ padding: '0 16px' }}>
                    <ChevronLeft size={20} />
                  </button>
                  <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="text-link">Sign In</Link></p>
        </div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg-void);
          position: relative;
          overflow: hidden;
        }

        .auth-bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .auth-card {
          width: 100%;
          padding: 48px 40px;
          position: relative;
          z-index: 1;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-logo-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto;
          background: var(--primary-glow);
          color: var(--primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.8125rem;
        }

        .step.active { color: var(--text-white); }

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-void);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .step.active .step-num {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .step-line {
          width: 40px;
          height: 1px;
          background: var(--border);
        }

        .step-line.active { background: var(--primary); }

        .auth-form {
          min-height: 320px;
        }

        .form-step {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .auth-footer {
          margin-top: 32px;
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .text-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .text-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}