import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [type, setType]       = useState('user'); // 'user' | 'organization'
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShow]   = useState(false);

  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password, accountType: type });
      login(data);
      toast.success(`Welcome back! GG 🎮`);
      navigate(type === 'organization' ? '/org/dashboard' : '/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page flex-center" style={{ minHeight: '100vh', padding: '40px 20px' }}>

      {/* BG effect */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,107,0,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,229,255,0.04) 0%, transparent 60%)' }} />

      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text-white)' }}>
              ARENA<span style={{ color: 'var(--saffron)' }}>X</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>India's Gaming Career Platform</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '40px 36px', border: '1px solid var(--border)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32, fontSize: '0.9rem' }}>Log in to continue your journey</p>

          {/* Account type toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 10, padding: 4, marginBottom: 32 }}>
            {[
              { value: 'user',         label: '🎮 Gamer / Creator' },
              { value: 'organization', label: '🏢 Organization' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                  background: type === opt.value ? 'var(--saffron)' : 'transparent',
                  color:      type === opt.value ? 'white' : 'var(--text-secondary)',
                  boxShadow:  type === opt.value ? '0 4px 12px rgba(255,107,0,0.3)' : 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Forgot password?</a>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Logging in...' : 'Login to Arena →'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            New to ArenaX?{' '}
            <Link to={type === 'organization' ? '/register/org' : '/register'} style={{ color: 'var(--saffron)', fontWeight: 600 }}>
              Create Account
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 24 }}>
          By logging in, you agree to our{' '}
          <a href="#" style={{ color: 'var(--text-secondary)' }}>Terms</a>{' & '}
          <a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
