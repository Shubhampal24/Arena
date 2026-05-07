import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, User, Building2, Mail, Lock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const [accountType, setAccountType] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Security protocol requires full credentials.');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password, accountType });
      login(data);
      toast.success('Access granted. Welcome back.');
      if (data.accountType === 'organization') navigate('/org/dashboard');
      else navigate('/feed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Premium Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none banner-noise" />
      
      <motion.div
        className="w-full max-w-[460px] glass-surface p-12 rounded-[48px] relative z-10 shadow-2xl border-white/5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-[20px] flex-center text-primary mx-auto mb-6 shadow-lg"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">System Access</h1>
          <p className="text-secondary font-medium">Re-authenticating your professional node</p>
        </header>

        {/* Tactical Identity Toggle */}
        <div className="flex p-1.5 bg-void/50 border border-white/5 rounded-2xl mb-10 shadow-inner">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${accountType === 'user' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-secondary'}`}
            onClick={() => setAccountType('user')}
          >
            <User size={14} /> Professional
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${accountType === 'organization' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-secondary'}`}
            onClick={() => setAccountType('organization')}
          >
            <Building2 size={14} /> Entity
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <Mail size={12} className="text-primary" /> Global Identifier
            </label>
            <input
              type="email"
              className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner"
              placeholder="id@nexus.arena"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                <Lock size={12} className="text-primary" /> Security Key
              </label>
              <button type="button" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Reset</button>
            </div>
            <input
              type="password"
              className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-5 rounded-[24px] shadow-primary font-black uppercase tracking-[0.2em] text-sm flex-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98] mt-4"
            disabled={loading}
          >
            {loading ? 'Validating Nodes...' : (
              <>
                Authorize Access <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <footer className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs font-bold text-muted uppercase tracking-widest">
            New to the ecosystem? <Link to={accountType === 'user' ? '/register' : '/register/org'} className="text-primary hover:underline ml-1">Create Identity</Link>
          </p>
        </footer>
        
        <div className="auth-bg-glow" style={{ top: '-30%', right: '-30%', width: '100%', height: '100%', opacity: 0.05 }} />
      </motion.div>
      
      <style>{`
        .banner-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
