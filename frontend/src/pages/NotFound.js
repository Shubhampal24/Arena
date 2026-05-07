import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Search, Ghost, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-shell flex-center text-center p-6 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="auth-bg-glow" style={{ top: '20%', left: '20%', width: '60%', height: '60%', opacity: 0.1 }} />
      <div className="auth-bg-glow" style={{ bottom: '10%', right: '10%', width: '40%', height: '40%', opacity: 0.05 }} />

      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-void border border-primary/20 rounded-3xl flex-center text-primary mx-auto mb-8 shadow-2xl">
            <Ghost size={48} />
          </div>
          
          <h1 className="text-[120px] font-black text-white/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
            404
          </h1>
          
          <h2 className="h2 mb-4">Out of Bounds</h2>
          <p className="text-secondary text-lg mb-10 max-w-sm mx-auto">
            You've ventured into the digital void. The page you're looking for has moved or no longer exists.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/" className="btn btn-primary gap-2 shadow-primary py-4">
              <Home size={18} /> Return Home
            </Link>
            <Link to="/discover" className="btn btn-secondary gap-2 py-4">
              <Compass size={18} /> Explore Arena
            </Link>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5">
            <Link to="/jobs" className="text-sm font-bold text-muted hover:text-primary flex items-center justify-center gap-2 transition-colors">
              <Search size={14} /> Looking for career opportunities?
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .page-shell {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}