import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, Eye, TrendingUp, ChevronRight,
  PlusCircle, CheckCircle2, Clock, XCircle, Building2,
  BarChart3, UserPlus, Zap, Settings, ArrowUpRight, Sparkles
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

const STATUS_CONFIG = {
  submitted: { icon: <Clock size={14} />, color: '#f59e0b', label: 'Pending' },
  reviewed:  { icon: <Eye size={14} />, color: 'var(--primary)', label: 'Reviewed' },
  accepted:  { icon: <CheckCircle2 size={14} />, color: '#10b981', label: 'Accepted' },
  rejected:  { icon: <XCircle size={14} />, color: '#ef4444', label: 'Rejected' },
};

export default function OrgDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { org } = useAuth();

  useEffect(() => {
    dashboardAPI.get()
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Live Postings', value: org?.activeJobs || 0, icon: <Briefcase size={20}/>, trend: '+12%', color: 'var(--primary)' },
    { label: 'Active Pipeline', value: data?.pendingApplications?.length || 0, icon: <Users size={20}/>, trend: '+5%', color: '#6366f1' },
    { label: 'Talent Reach', value: org?.profileViews || 0, icon: <Eye size={20}/>, trend: '+24%', color: '#10b981' },
    { label: 'Hire Velocity', value: '8.4d', icon: <Zap size={20}/>, trend: '-2d', color: '#f59e0b' },
  ];

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1100 }}>

        {/* Professional Header Area */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 rounded-[24px] bg-void border border-primary/20 overflow-hidden shadow-2xl shrink-0 group relative"
            >
              {org?.logo ? (
                <img src={org.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex-center text-primary font-black text-2xl uppercase">{org?.orgName?.[0]}</div>
              )}
              <div className="absolute inset-0 bg-primary/5 group-hover:opacity-0 transition-opacity" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <Sparkles size={14} className="text-primary" />
                 <span className="text-[10px] font-black text-primary tracking-widest uppercase">Command Center</span>
              </div>
              <h1 className="h1 leading-none mb-1">Operational <span className="text-gradient">Control</span></h1>
              <p className="text-secondary font-medium">Enterprise Management Suite for <span className="text-white font-bold">{org?.orgName}</span></p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to={`/org/${org?.slug}`} className="btn btn-secondary px-6 py-3 rounded-xl gap-2 font-bold text-sm">
              <Eye size={18} /> Public Profile
            </Link>
            <Link to="/post-job" className="btn btn-primary px-8 py-3 rounded-xl shadow-primary gap-2 font-bold text-sm">
              <PlusCircle size={18} /> New Posting
            </Link>
          </div>
        </header>

        {/* High-Fidelity Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="glass-surface p-7 rounded-[32px] relative overflow-hidden group hover:border-primary transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex-between mb-6">
                <div className="w-11 h-11 rounded-2xl bg-void border border-white/5 flex-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg" style={{ color: s.color }}>
                  {s.icon}
                </div>
                <div className="px-2 py-1 bg-green-400/10 border border-green-400/20 rounded-lg text-[10px] font-black text-green-400">
                   {s.trend}
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-1 tracking-tighter">{loading ? '...' : s.value}</h3>
              <p className="text-[10px] text-muted font-black uppercase tracking-widest">{s.label}</p>
              <div className="auth-bg-glow" style={{ top: '-40%', right: '-40%', width: '100%', height: '100%', opacity: 0.05 }} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          
          {/* Central Pipeline Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-surface p-8 rounded-[32px] border-white/5 shadow-xl relative overflow-hidden">
              <div className="flex-between mb-8">
                <div className="flex items-center gap-3">
                  <UserPlus size={22} className="text-primary" />
                  <h3 className="text-lg font-bold text-white">Talent Pipeline</h3>
                </div>
                <div className="text-[10px] font-black text-muted uppercase tracking-widest px-3 py-1 bg-void/50 rounded-full border border-white/5">
                  Live Stream
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton-shimmer h-24 rounded-3xl" />)}
                </div>
              ) : data?.pendingApplications?.length > 0 ? (
                <div className="space-y-4">
                  {data.pendingApplications.map((app, i) => (
                    <motion.div 
                      key={app._id} 
                      className="p-5 bg-void/40 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/40 transition-all cursor-pointer group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center gap-5 min-w-0">
                        <div className="w-14 h-14 rounded-2xl border border-white/5 overflow-hidden group-hover:border-primary/20 transition-all shrink-0 p-1 bg-void">
                          {app.userId?.avatar ? <img src={app.userId.avatar} alt="" className="w-full h-full object-cover rounded-xl" /> : <div className="w-full h-full bg-primary/10 flex-center text-primary font-black text-xl">{app.userId?.displayName?.[0]}</div>}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-base group-hover:text-primary transition-colors truncate">{app.userId?.displayName || 'Elite Candidate'}</p>
                          <p className="text-xs text-secondary font-medium truncate">Applying for <span className="text-white font-bold">{app.jobId?.title || 'Active Role'}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-1">Identity</p>
                          <p className="text-[11px] font-bold text-white uppercase">{app.userId?.primaryRole || 'Professional'}</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2.5 rounded-[20px] border border-white/5 bg-void/50 min-w-[120px] justify-center shadow-inner">
                          <span style={{ color: STATUS_CONFIG[app.status]?.color }}>{STATUS_CONFIG[app.status]?.icon}</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-tighter">{STATUS_CONFIG[app.status]?.label}</span>
                        </div>
                        <ChevronRight size={20} className="text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-void/20 rounded-3xl border border-dashed border-white/10">
                  <div className="w-16 h-16 bg-void rounded-full border border-white/5 flex-center text-muted mx-auto mb-4 opacity-30">
                    <Users size={32} />
                  </div>
                  <h4 className="text-white font-bold">Pipeline is Empty</h4>
                  <p className="text-xs text-secondary mt-2 max-w-[200px] mx-auto">New talent matches will appear here as they engage with your postings.</p>
                </div>
              )}
              <div className="auth-bg-glow" style={{ top: '-20%', left: '-20%', width: '100%', height: '100%', opacity: 0.03 }} />
            </section>
          </div>

          {/* Strategic Insight Column */}
          <aside className="space-y-8">
            {/* Active Inventory */}
            <section className="glass-surface p-8 rounded-[32px] border-white/5 shadow-xl">
              <div className="flex-between mb-8">
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="text-primary" />
                  <h3 className="text-base font-bold text-white">Board Pulse</h3>
                </div>
                <Link to="/jobs" className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest">Board</Link>
              </div>

              <div className="space-y-4">
                {data?.recentJobs?.map(job => (
                  <div key={job._id} className="p-5 bg-void/50 rounded-3xl border border-white/5 space-y-4 group hover:border-primary/20 transition-all">
                    <div className="flex-between items-start">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors max-w-[150px]">{job.title}</h4>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${job.isActive ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-white/5 text-muted border border-white/5'}`}>
                        {job.isActive ? 'Live' : 'Off'}
                      </span>
                    </div>
                    <div className="flex-between items-end">
                      <div className="flex gap-5">
                        <div>
                          <p className="text-[9px] text-muted font-black uppercase tracking-widest">Intel</p>
                          <p className="text-[10px] font-bold text-white mt-0.5">{job.applicantCount || 0} Apps</p>
                        </div>
                        <div className="w-px h-6 bg-white/5" />
                        <div>
                          <p className="text-[9px] text-muted font-black uppercase tracking-widest">Impact</p>
                          <p className="text-[10px] font-bold text-white mt-0.5">{job.views || 0} View</p>
                        </div>
                      </div>
                      <Link to={`/jobs/${job._id}`} className="w-9 h-9 rounded-xl bg-void border border-white/5 flex-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="btn btn-secondary btn-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-8 border-white/5 hover:border-primary/20">
                Performance Audit
              </button>
            </section>

            {/* Entity Authority Card */}
            <section className="glass-surface p-8 rounded-[32px] text-center relative overflow-hidden border-indigo-500/10">
              <div className="auth-bg-glow" style={{ top: '-10%', left: '-10%', width: '120%', height: '120%', opacity: 0.1 }} />
              <Building2 size={32} className="text-primary mx-auto mb-4 relative z-10" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2 relative z-10">Entity Authority</h4>
              <p className="text-xs text-secondary font-medium leading-relaxed mb-8 relative z-10">Your organization currently maintains a <span className="text-primary font-bold">Tier 1</span> hiring status in the regional ecosystem.</p>
              
              <div className="p-4 bg-void/80 rounded-2xl border border-white/5 relative z-10">
                 <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Ecosystem Ranking</p>
                 <p className="text-xl font-black text-white tracking-tighter">#144 <span className="text-[10px] text-green-400">▲ 12</span></p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                <button className="flex items-center justify-center gap-2 w-full text-[10px] font-black text-muted uppercase tracking-widest hover:text-white transition-colors">
                  <Settings size={14} /> Global Entity Settings
                </button>
              </div>
            </section>
          </div>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}