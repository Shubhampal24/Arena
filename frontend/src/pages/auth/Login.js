import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, User, Building2, Mail, Lock, Gamepad2 } from 'lucide-react';

export default function Login() {
  const [accountType, setAccountType] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password, accountType });
      login(data);
      toast.success('Welcome back!');
      if (data.accountType === 'organization') navigate('/org/dashboard');
      else navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Gamepad2 size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue to ArenaX</p>
        </div>

        {/* Account Type Toggle */}
        <div className="auth-toggle">
          <button
            className={`auth-toggle-btn ${accountType === 'user' ? 'active' : ''}`}
            onClick={() => setAccountType('user')}
            type="button"
          >
            <User size={18} />
            <span>Gamer</span>
          </button>
          <button
            className={`auth-toggle-btn ${accountType === 'organization' ? 'active' : ''}`}
            onClick={() => setAccountType('organization')}
            type="button"
          >
            <Building2 size={18} />
            <span>Organization</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label className="form-label">
              <Mail size={14} />
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <Lock size={14} />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">Signing in...</span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to={accountType === 'user' ? '/register' : '/register/org'}>
            Create Account
          </Link>
        </div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .auth-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }
        .auth-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.4;
        }
        .auth-bg-orb--1 {
          width: 500px;
          height: 500px;
          background: var(--saffron);
          top: -200px;
          right: -100px;
          opacity: 0.08;
        }
        .auth-bg-orb--2 {
          width: 400px;
          height: 400px;
          background: var(--electric);
          bottom: -150px;
          left: -100px;
          opacity: 0.06;
        }
        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(17, 17, 24, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255, 0.06);
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.4);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-icon-wrap {
          width: 56px;
          height: 56px;
          margin: 0 auto 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(255,107,0,0.25);
        }
        .auth-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 6px;
        }
        .auth-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .auth-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 28px;
          padding: 4px;
          background: var(--bg-base);
          border-radius: 12px;
        }
        .auth-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .auth-toggle-btn.active {
          background: var(--saffron);
          color: white;
          box-shadow: 0 4px 12px rgba(255,107,0,0.3);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-input);
          border: 1.5px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          border-color: var(--saffron);
          box-shadow: 0 0 0 3px rgba(255,107,0,0.12);
        }
        .form-input::placeholder {
          color: var(--text-muted);
        }
        .btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 24px;
          margin-top: 4px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
          border: none;
          border-radius: 12px;
          color: white;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(255,107,0,0.3);
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,107,0,0.4);
        }
        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .auth-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .auth-footer a {
          color: var(--electric);
          font-weight: 600;
          margin-left: 6px;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
