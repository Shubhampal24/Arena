import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Briefcase, FileText, Eye, Activity,
  CheckCircle, User, Award, Users,
  ArrowUpRight, Sparkles, Target, Zap, ChevronRight,
  ShieldCheck, MapPin, Globe, ExternalLink
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dashboardAPI.get()
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const score = data?.profileScore || user?.profileScore || 0;
  const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? 'var(--primary)' : '#f59e0b';

  const stats = [
    { label: 'Profile Authority', value: `${score}%`, icon: <TrendingUp size={18}/>, color: scoreColor },
    { label: 'Active Pipeline', value: data?.applications?.length || 0, icon: <Target size={18}/>, color: '#6366f1' },
    { label: 'Network Pulse', value: data?.recentPosts?.length || 0, icon: <Activity size={18}/>, color: '#f59e0b' },
    { label: 'Ecosystem Reach', value: user?.profileViews || 0, icon: <Eye size={18}/>, color: '#10b981' },
  ];

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1000 }}>
        
        {/* Modern Dashboard Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full inline-flex items-center gap-2 mb-4"
            >
              <Sparkles size={12} className="text-primary" />
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">Professional Overview</span>
            </motion.div>
            <h1 className="h1 leading-tight mb-2">Greetings, <span className="text-gradient">{user?.displayName?.split(' ')[0]}</span></h1>
            <p className="text-secondary font-medium max-w-md">Your professional identity is active in the ecosystem. Here's your impact data.</p>
          </div>
          
          <div className="flex gap-3">
            <Link to={`/u/${user?.username}`} className="btn btn-secondary px-6 py-3 rounded-xl gap-2 font-bold text-sm">
              <User size={18} /> Public Identity
            </Link>
            <Link to="/jobs" className="btn btn-primary px-8 py-3 rounded-xl shadow-primary gap-2 font-bold text-sm">
              <Briefcase size={18} /> Search Jobs
            </Link>
          </div>
        </header>

        {/* High-Impact Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="glass-surface p-7 rounded-[32px] relative overflow-hidden group hover:border-primary transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex-between mb-6">
                <div className="w-11 h-11 rounded-2xl bg-void border border-white/5 flex-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex-center text-muted group-hover:text-primary transition-colors">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-1 tracking-tighter">{loading ? '...' : stat.value}</h3>
              <p className="text-[10px] text-muted font-black uppercase tracking-widest">{stat.label}</p>
              <div className="auth-bg-glow" style={{ bottom: '-40%', right: '-40%', width: '100%', height: '100%', opacity: 0.05 }} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          
          {/* Main Information Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Identity Authority Card */}
            <section className="glass-surface p-8 rounded-[32px] border-white/5 shadow-xl relative overflow-hidden">
              <div className="flex-between mb-10">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                    <ShieldCheck size={22} className="text-primary" /> Identity Authority
                  </h3>
                  <p className="text-xs text-secondary font-medium mt-1">Strengthen your global footprint to attract elite entities.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black tracking-tighter" style={{ color: scoreColor }}>{score}%</span>
                </div>
              </div>

              <div className="w-full h-2.5 bg-void rounded-full overflow-hidden mb-12 shadow-inner">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ backgroundColor: scoreColor, boxShadow: `0 0 15px ${scoreColor}44` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CheckItem label="Verified Identity Name" done={!!(user?.displayName)} />
                <CheckItem label="Strategic Career Brief" done={!!user?.bio} />
                <CheckItem label="Intellectual Portfolio" done={(user?.portfolio?.length || 0) > 0} />
                <CheckItem label="Visual Recognition" done={!!user?.avatar} />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                <Link to="/profile/edit" className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline">
                  Optimize Credentials <ArrowUpRight size={14} />
                </Link>
              </div>
              <div className="auth-bg-glow" style={{ top: '-30%', right: '-30%', width: '100%', height: '100%', opacity: 0.03 }} />
            </section>

            {/* Active Engagement Pipeline */}
            <section className="glass-surface p-8 rounded-[32px] border-white/5 shadow-xl">
              <div className="flex-between mb-10">
                <div className="flex items-center gap-3">
                  <Target size={22} className="text-primary" />
                  <h3 className="text-lg font-bold text-white">Active Pipeline</h3>
                </div>
                <Link to="/jobs" className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest">Explore Board</Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => <div key={i} className="skeleton-shimmer h-24 rounded-3xl" />)}
                </div>
              ) : data?.applications?.length > 0 ? (
                <div className="space-y-4">
                  {data.applications.slice(0, 4).map(app => (
                    <div key={app._id} className="p-5 bg-void/40 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/40 transition-all group">
                      <div className="flex items-center gap-5 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-all p-1">
                          {app.jobId?.postedBy?.orgLogo ? <img src={app.jobId.postedBy.orgLogo} alt="" className="w-full h-full object-cover rounded-xl" /> : <Briefcase size={24} className="text-primary" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-base group-hover:text-primary transition-colors truncate mb-1">{app.jobId?.title}</p>
                          <p className="text-[10px] text-muted font-black uppercase tracking-widest">{app.jobId?.postedBy?.orgName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Status</p>
                          <p className={`text-[10px] font-bold uppercase tracking-tighter ${app.status === 'accepted' ? 'text-green-400' : app.status === 'rejected' ? 'text-red-400' : 'text-primary'}`}>{app.status}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-void border border-white/5 flex-center text-muted group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-void/20 rounded-3xl border border-dashed border-white/10">
                  <div className="w-16 h-16 bg-void rounded-full border border-white/5 flex-center text-muted mx-auto mb-4 opacity-30">
                    <Briefcase size={32} />
                  </div>
                  <h4 className="text-white font-bold">No Active Applications</h4>
                  <p className="text-xs text-secondary mt-2 max-w-[200px] mx-auto">Your career pipeline is currently empty. Start engaging with roles on the board.</p>
                </div>
              )}
            </section>
          </div>

          {/* Strategic Sidebar Column */}
          <aside className="space-y-8">
            
            {/* Ecosystem Discovery */}
            <section className="glass-surface p-8 rounded-[32px] relative overflow-hidden border-indigo-500/10">
              <div className="auth-bg-glow" style={{ top: '-10%', left: '-10%', width: '120%', height: '120%', opacity: 0.1 }} />
              <Zap size={32} className="text-primary mb-6 relative z-10" />
              <h4 className="text-base font-bold text-white mb-3 relative z-10">Ecosystem Discovery</h4>
              <p className="text-xs text-secondary font-medium leading-relaxed mb-10 relative z-10">
                AI-curated opportunities and elite organizations matching your professional profile.
              </p>
              <Link to="/discover" className="btn btn-primary btn-full py-4 rounded-2xl shadow-primary font-black uppercase tracking-widest text-[10px] relative z-10">
                Launch Discovery
              </Link>
            </section>

            {/* Quick Share Intel */}
            <section className="glass-surface p-8 rounded-[32px] border-white/5">
              <h4 className="text-xs font-black text-muted uppercase tracking-widest mb-8 flex items-center gap-3">
                <Activity size={18} className="text-primary" /> Share Pulse
              </h4>
              <textarea 
                className="w-full bg-void/50 border border-white/5 rounded-2xl p-5 text-sm text-white font-medium outline-none focus:border-primary/30 transition-all min-h-[140px] resize-none" 
                placeholder="Broadcast a victory or professional milestone..."
              />
              <button className="btn btn-secondary btn-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-6 border-white/5 hover:border-primary/20 transition-all">
                Broadcast Intel
              </button>
            </section>

            {/* Verification Incentive */}
            <section className="p-6 bg-void/40 rounded-[32px] border border-dashed border-white/10 flex items-center gap-5 group cursor-pointer hover:border-primary/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                <Award size={28} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white uppercase tracking-tighter">Verified Tier</p>
                <p className="text-[10px] text-muted font-medium truncate">Link social nodes for badge.</p>
              </div>
              <ChevronRight size={18} className="text-muted ml-auto group-hover:text-primary transition-all" />
            </section>
          </aside>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}

function CheckItem({ label, done }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-void/50 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
      <div className={`w-6 h-6 rounded-xl flex-center shrink-0 shadow-sm transition-all ${done ? 'bg-primary text-white' : 'bg-white/5 text-muted border border-white/5'}`}>
        {done ? <CheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-muted/40" />}
      </div>
      <span className={`text-xs font-bold transition-colors ${done ? 'text-white' : 'text-muted group-hover:text-secondary'}`}>{label}</span>
    </div>
  );
}