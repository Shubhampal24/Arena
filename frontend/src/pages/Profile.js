import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Share2, Mail, MessageSquare, Edit3,
  Award, Gamepad2, PlaySquare, Target, UserPlus, Eye, Youtube,
  Instagram, Twitter, Twitch, Globe, Medal, ShieldCheck, 
  ExternalLink, Verified, Zap, Calendar, Building2, ChevronRight
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import toast from 'react-hot-toast';

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link copied!');
  };

  if (loading) return (
    <div className="page-shell">
      <div className="skeleton-shimmer h-[300px] w-full" />
      <div className="container" style={{ maxWidth: 1000, marginTop: -80 }}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-12 px-6">
          <div className="skeleton-shimmer w-36 h-36 rounded-[40px] border-4 border-void" />
          <div className="space-y-4 flex-1 pb-4">
            <div className="skeleton-shimmer w-64 h-10 rounded-xl" />
            <div className="skeleton-shimmer w-40 h-6 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="skeleton-shimmer h-48 rounded-[32px]" />
            <div className="skeleton-shimmer h-96 rounded-[32px]" />
          </div>
          <div className="skeleton-shimmer h-[500px] rounded-[32px]" />
        </div>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="page-shell flex-center flex-col text-center">
      <div className="w-20 h-20 bg-void rounded-full border flex-center text-muted mb-6 opacity-30">
        <Target size={40} />
      </div>
      <h2 className="h2 mb-2">Entity Not Found</h2>
      <p className="text-secondary font-medium">The professional identity profile you are searching for is not active in this node.</p>
      <Link to="/discover" className="btn btn-primary mt-8 px-8 py-4 rounded-2xl shadow-primary font-black uppercase tracking-widest text-xs">Explore Ecosystem</Link>
    </div>
  );

  const isOwn = me?.username === username;
  const social = profile.social || {};

  const getSocialIcon = (key) => {
    switch (key) {
      case 'youtube': return <Youtube size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'twitch': return <Twitch size={18} />;
      case 'discord': return <MessageSquare size={18} />;
      default: return <Globe size={18} />;
    }
  };

  return (
    <div className="page-shell p-0">
      
      {/* High-Fidelity Banner Section */}
      <div className="relative h-[320px] bg-void overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-void" />
        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-radial-gradient opacity-[0.08] pointer-events-none" />
        <div className="banner-noise" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent" />
      </div>

      <div className="container relative" style={{ maxWidth: 1000, marginTop: -100 }}>
        
        {/* Profile Identity Core */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-12 px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="w-36 h-36 rounded-[48px] bg-void border-[6px] border-void shadow-2xl relative group overflow-hidden"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover rounded-[42px]" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex-center text-primary font-black text-5xl uppercase tracking-tighter rounded-[42px]">{profile.displayName?.[0]}</div>
              )}
              {profile.profileScore >= 90 && (
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-primary rounded-2xl border-4 border-void flex-center text-white shadow-xl">
                  <ShieldCheck size={20} />
                </div>
              )}
            </motion.div>
            
            <div className="pb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tighter">{profile.displayName}</h1>
                <Verified size={24} className="text-primary" />
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-secondary font-bold text-sm tracking-wide">
                <span className="text-primary">@{profile.username}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> {profile.state || 'India'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4">
            {isOwn ? (
              <Link to="/profile/edit" className="btn btn-primary px-8 py-4 rounded-2xl gap-2 font-black uppercase tracking-widest text-xs shadow-primary">
                <Edit3 size={18} /> Edit Identity
              </Link>
            ) : (
              <>
                <button className="btn btn-primary px-8 py-4 rounded-2xl gap-2 font-black uppercase tracking-widest text-xs shadow-primary"><UserPlus size={18} /> Connect</button>
                <button className="btn btn-secondary px-8 py-4 rounded-2xl gap-2 font-black uppercase tracking-widest text-xs"><Mail size={18} /> Message</button>
              </>
            )}
            <button onClick={handleShare} className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center text-secondary hover:text-white hover:border-primary/40 transition-all shadow-xl">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Tactical Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-2">
          <div className="sm:col-span-2 glass-surface p-7 rounded-[32px] flex items-center gap-8 group hover:border-primary transition-all shadow-xl relative overflow-hidden">
            <div className="relative w-16 h-16 flex-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                <circle 
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" 
                  strokeDasharray={176} 
                  strokeDashoffset={176 - (176 * profile.profileScore) / 100}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black tracking-tighter text-white">{profile.profileScore}%</span>
            </div>
            <div>
              <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-1">Identity Authority</p>
              <p className="text-sm text-secondary font-medium leading-relaxed">Composite score of ecosystem activity and professional verified milestones.</p>
            </div>
            <div className="auth-bg-glow" style={{ top: '-40%', left: '-40%', width: '100%', height: '100%', opacity: 0.05 }} />
          </div>
          
          <div className="glass-surface p-7 rounded-[32px] text-center group hover:border-primary transition-all shadow-xl relative overflow-hidden">
            <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-2">Network Size</p>
            <div className="flex flex-center gap-3">
              <Award size={22} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-black text-white tracking-tighter">{profile.followersCount || 0}</p>
            </div>
            <div className="auth-bg-glow" style={{ top: '-60%', right: '-30%', width: '100%', height: '100%', opacity: 0.05 }} />
          </div>
          
          <div className="glass-surface p-7 rounded-[32px] text-center group hover:border-primary transition-all shadow-xl relative overflow-hidden">
            <p className="text-[10px] text-muted font-black uppercase tracking-widest mb-2">Ecosystem Views</p>
            <div className="flex flex-center gap-3">
              <Eye size={22} className="text-primary group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-black text-white tracking-tighter">{profile.profileViews || 0}</p>
            </div>
            <div className="auth-bg-glow" style={{ bottom: '-60%', left: '-30%', width: '100%', height: '100%', opacity: 0.05 }} />
          </div>
        </div>

        {/* Primary Content Stream */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 px-2">
          
          {/* Main Dossier Column */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Bio Dossier */}
            <section className="glass-surface p-10 rounded-[40px] border-white/5 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck size={24} className="text-primary" />
                <h3 className="text-xl font-bold text-white tracking-tight">Professional Dossier</h3>
              </div>
              <p className="text-secondary font-medium leading-loose text-lg whitespace-pre-wrap mb-10">
                {profile.bio || "No tactical professional brief provided. The candidate's background remains classified."}
              </p>
              {profile.tagline && (
                <div className="p-6 bg-void/50 rounded-3xl border border-white/5 border-l-4 border-l-primary shadow-inner">
                  <p className="italic text-base text-white/90 font-medium leading-relaxed">"{profile.tagline}"</p>
                </div>
              )}
              <div className="auth-bg-glow" style={{ top: '-20%', right: '-20%', width: '80%', height: '80%', opacity: 0.03 }} />
            </section>

            {/* Strategic Disciplines */}
            {profile.gameProfiles?.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3 px-4">
                   <Gamepad2 size={24} className="text-primary" />
                   <h3 className="text-xl font-bold text-white tracking-tight">Ecosystem Disciplines</h3>
                </div>
                <div className="space-y-6">
                  {profile.gameProfiles.map((g, i) => (
                    <motion.div 
                      key={g._id} 
                      className="glass-surface p-8 rounded-[36px] relative overflow-hidden group hover:border-primary/40 transition-all shadow-xl"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex-between items-start mb-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                            <Zap size={28} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">{g.gameName}</h4>
                            <p className="text-[10px] text-muted font-black uppercase tracking-widest">{g.device || 'Advanced Hardware'}</p>
                          </div>
                        </div>
                        {g.currentTier && (
                          <div className="px-5 py-2 bg-primary/10 border border-primary/20 rounded-2xl shadow-inner">
                            <span className="text-xs font-black text-primary uppercase tracking-widest">{g.currentTier}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 flex-wrap mb-8">
                        {g.inGameRoles?.map(role => (
                          <span key={role} className="px-4 py-1.5 bg-void/50 border border-white/5 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest">{role}</span>
                        ))}
                      </div>

                      {g.stats && (
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 relative z-10">
                          {g.stats.kd && (
                            <div className="text-center">
                              <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Efficiency (K/D)</p>
                              <p className="text-lg font-black text-white tracking-tighter">{g.stats.kd}</p>
                            </div>
                          )}
                          {g.stats.winRate && (
                            <div className="text-center">
                              <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Engagement Success</p>
                              <p className="text-lg font-black text-white tracking-tighter">{g.stats.winRate}%</p>
                            </div>
                          )}
                          {g.stats.matches && (
                            <div className="text-center">
                              <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Total Operations</p>
                              <p className="text-lg font-black text-white tracking-tighter">{g.stats.matches}</p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="auth-bg-glow" style={{ bottom: '-30%', right: '-10%', width: '40%', height: '100%', opacity: 0.05 }} />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievement Archive */}
            {profile.achievements?.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3 px-4">
                   <Medal size={24} className="text-indigo-400" />
                   <h3 className="text-xl font-bold text-white tracking-tight">Achievement Archive</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {profile.achievements.map((a, i) => (
                    <div key={i} className="glass-surface p-6 rounded-[28px] flex gap-6 items-center group hover:border-indigo-500/40 transition-all shadow-lg">
                      <div className="w-16 h-16 rounded-[20px] bg-indigo-500/10 border border-indigo-500/20 flex-center text-indigo-400 shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                        <Award size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors truncate">{a.title}</h4>
                        <p className="text-sm text-secondary font-medium line-clamp-1">{a.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="px-3 py-1 bg-void rounded-xl border border-white/5 text-[10px] font-black text-muted uppercase tracking-widest">
                           {a.date ? new Date(a.date).getFullYear() : 'Active'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Visual Intel Portfolio */}
            {profile.portfolio?.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3 px-4">
                   <PlaySquare size={24} className="text-primary" />
                   <h3 className="text-xl font-bold text-white tracking-tight">Visual Intel</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.portfolio.map((p, i) => (
                    <a key={i} href={p.url} target="_blank" rel="noreferrer" className="block glass-surface group rounded-[32px] overflow-hidden hover:border-primary/40 transition-all shadow-xl relative">
                      <div className="aspect-video bg-void flex-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-all" />
                        {p.type === 'video' ? <PlaySquare size={48} className="text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all z-10" /> : <Globe size={48} className="text-secondary/40 group-hover:text-secondary group-hover:scale-110 transition-all z-10" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-6 flex-between items-center relative z-10 bg-void/50">
                        <span className="text-sm font-black text-white uppercase tracking-widest truncate max-w-[80%]">{p.title || 'Classified Intel'}</span>
                        <div className="w-8 h-8 rounded-lg bg-void border border-white/5 flex-center text-muted group-hover:text-primary group-hover:border-primary/40 transition-all">
                           <ExternalLink size={16} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Tactical Sidebar Column */}
          <aside className="space-y-8">
            
            {/* Career Context Dossier */}
            <section className="glass-surface p-8 rounded-[36px] border-white/5 shadow-xl space-y-10 relative overflow-hidden">
              <h4 className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-2">Professional Identity</h4>
              
              <div className="space-y-8">
                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                    <Gamepad2 size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Primary Discipline</p>
                    <p className="text-base font-bold text-white tracking-tight">{profile.primaryGame || 'Multi-Identity'}</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Ecosystem Role</p>
                    <p className="text-base font-bold text-white tracking-tight">{profile.primaryRole || 'Contractor'}</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-1">Current Availability</p>
                    <p className="text-base font-bold text-white tracking-tight">{profile.availability || 'Classified Status'}</p>
                  </div>
                </div>

                {profile.lookingFor?.length > 0 && (
                  <div className="pt-8 border-t border-white/5">
                    <p className="text-[9px] text-muted uppercase font-black tracking-widest mb-4">Strategic Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.lookingFor.map(l => (
                        <span key={l} className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-black text-primary uppercase tracking-tighter">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="auth-bg-glow" style={{ bottom: '-30%', left: '-20%', width: '100%', height: '100%', opacity: 0.05 }} />
            </section>

            {/* Global Digital Nodes */}
            {Object.keys(social).some(k => social[k]) && (
              <section className="glass-surface p-8 rounded-[36px] border-white/5 shadow-xl space-y-8">
                <h4 className="text-[10px] text-muted font-black uppercase tracking-[0.2em]">Digital Nodes</h4>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(social).map(([k, v]) => v && (
                    <a 
                      key={k} 
                      href={v.startsWith('http') ? v : `https://${v}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-4 p-4 bg-void/50 rounded-2xl border border-white/5 hover:border-primary/40 transition-all group text-secondary hover:text-white shadow-inner"
                    >
                      <div className="text-primary group-hover:scale-110 transition-transform">{getSocialIcon(k)}</div>
                      <span className="text-sm font-black uppercase tracking-widest capitalize">{k}</span>
                      <div className="ml-auto w-6 h-6 rounded-lg bg-void border border-white/5 flex-center group-hover:border-primary/20 transition-all">
                        <ChevronRight size={14} className="opacity-40 group-hover:opacity-100" />
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Contract Authority Card */}
            <section className="glass-surface p-8 rounded-[36px] text-center border-indigo-500/10 shadow-xl relative overflow-hidden">
              <div className="auth-bg-glow" style={{ top: '-10%', right: '-10%', width: '120%', height: '120%', opacity: 0.08 }} />
              <Building2 size={32} className="text-muted mx-auto mb-6 relative z-10" />
              <p className="text-[10px] text-muted uppercase font-black tracking-widest mb-2 relative z-10">Contractual Authority</p>
              <div className="relative z-10">
                {profile.openToWork ? (
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-black text-primary uppercase tracking-[0.1em] shadow-lg">
                     Free Identity
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-black text-secondary uppercase tracking-[0.1em]">
                     Encrypted Node
                  </div>
                )}
                <p className="text-[11px] text-secondary font-medium mt-6 leading-relaxed">
                  {profile.openToWork ? "This professional identity is currently open for strategic ecosystem alignment." : "Identity is currently committed to a private organization node."}
                </p>
              </div>
            </section>
          </div>

        </div>
      </div>
      
      <div className="pb-32" />
      <BottomNav />

      <style>{`
        .banner-noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .bg-radial-gradient {
          background: radial-gradient(circle at center, var(--primary) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}