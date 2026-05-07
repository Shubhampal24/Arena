import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orgsAPI, jobsAPI } from '../utils/api';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Trophy, Briefcase, Eye, Users, 
  CheckCircle2, ChevronRight, Share2, Globe, ArrowRight,
  ShieldCheck, Calendar, Zap, ExternalLink, Verified
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import toast from 'react-hot-toast';

export default function OrgProfile() {
  const { slug } = useParams();
  const [org, setOrg] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    orgsAPI.getBySlug(slug).then(r => {
      setOrg(r.data.data);
      setLoad(false);
      return jobsAPI.getAll({ 'postedBy.orgId': r.data.data._id, isActive: true, limit: 6 });
    }).then(r => { 
      if (r) setJobs(r.data.data); 
    }).catch(() => setLoad(false));
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Organization link copied!');
  };

  if (loading) return (
    <div className="page-shell">
      <div className="skeleton-shimmer" style={{ height: 300, width: '100%' }} />
      <div className="container" style={{ maxWidth: 1000, marginTop: -70 }}>
        <div className="flex gap-6 items-end mb-10">
          <div className="skeleton-shimmer rounded-3xl" style={{ width: 140, height: 140, border: '4px solid var(--bg-void)' }} />
          <div className="space-y-4 pb-4">
            <div className="skeleton-shimmer rounded-lg" style={{ width: 300, height: 40 }} />
            <div className="skeleton-shimmer rounded-lg" style={{ width: 180, height: 24 }} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="skeleton-shimmer rounded-3xl" style={{ height: 250 }} />
            <div className="skeleton-shimmer rounded-3xl" style={{ height: 400 }} />
          </div>
          <div className="skeleton-shimmer rounded-3xl" style={{ height: 350 }} />
        </div>
      </div>
    </div>
  );

  if (!org) return (
    <div className="page-shell flex-center flex-col text-center">
      <div className="p-6 bg-void rounded-full border mb-4 text-muted">
        <Building2 size={48} />
      </div>
      <h2 className="h2">Organization Not Found</h2>
      <p className="text-secondary mt-2">The organization you are looking for does not exist on Arena.</p>
      <Link to="/discover" className="btn btn-primary mt-6">Explore Organizations</Link>
    </div>
  );

  return (
    <div className="page-shell p-0">
      
      {/* Premium Organization Banner */}
      <div className="org-banner-wrap">
        <div className="org-banner-bg">
          <div className="auth-bg-glow" style={{ top: '-40%', right: '10%', width: '60%', height: '100%', opacity: 0.1 }} />
          <div className="auth-bg-glow" style={{ bottom: '-40%', left: '10%', width: '50%', height: '100%', opacity: 0.15 }} />
        </div>
        <div className="banner-grid-lines" />
      </div>

      <div className="container relative" style={{ maxWidth: 1000, marginTop: -90 }}>
        
        {/* Org Identity Header */}
        <div className="flex-between wrap gap-8 items-end mb-10 px-4">
          <div className="flex gap-8 items-end wrap">
            <div className="org-logo-xl">
              {org.logo ? (
                <img src={org.logo} alt={org.orgName} />
              ) : (
                <div className="logo-placeholder"><Building2 size={40} /></div>
              )}
              {org.isVerifiedOrg && (
                <div className="verified-badge-lg" title="Verified Organization">
                  <ShieldCheck size={24} />
                </div>
              )}
            </div>
            
            <div className="org-id-info pb-3">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="h1" style={{ fontSize: '2.5rem' }}>{org.orgName}</h1>
                <Verified size={24} className="text-primary" />
              </div>
              <div className="flex items-center gap-4 text-secondary font-semibold">
                <span className="text-primary tracking-widest uppercase text-xs">{org.orgType || 'Esports Organization'}</span>
                <span className="dot" />
                <span className="flex items-center gap-1"><MapPin size={16} /> {org.city ? `${org.city}, ` : ''}{org.state || 'Global'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-3">
            <button className="btn btn-primary px-8 shadow-primary">Follow Org</button>
            <button onClick={handleShare} className="btn btn-secondary p-3"><Share2 size={20} /></button>
          </div>
        </div>

        {/* Global Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            
            {/* About Section */}
            {org.description && (
              <motion.section 
                className="glass-surface p-8 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-primary" /> Mission & Identity
                </h3>
                <div className="prose text-secondary leading-relaxed text-lg">
                  {org.description}
                </div>
              </motion.section>
            )}

            {/* Achievements */}
            {org.achievements?.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-xl font-bold px-2 flex items-center gap-3">
                  <Trophy size={24} className="text-primary" /> Legacy & Achievements
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {org.achievements.map((a, i) => (
                    <motion.div 
                      key={i} 
                      className="glass-surface p-6 rounded-3xl flex gap-6 items-center border-l-4 border-primary"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex-center text-primary shrink-0">
                        <Trophy size={28} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{a.title}</h4>
                        <p className="text-secondary font-medium mt-1">
                          {a.tournament} {a.placement && `• ${a.placement}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-muted bg-void px-3 py-1 rounded-full border">{a.year || 'N/A'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Open Positions */}
            {jobs.length > 0 && (
              <section className="space-y-6">
                <div className="flex-between items-center px-2">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Briefcase size={24} className="text-primary" /> Active Opportunities
                  </h3>
                  <Link to={`/jobs?search=${org.orgName}`} className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                    View Board <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map((j) => (
                    <Link 
                      key={j._id} 
                      to={`/jobs/${j._id}`} 
                      className="glass-surface p-6 rounded-3xl flex-between hover:border-primary transition-all group"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-void border flex-center text-primary">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-primary transition-colors">{j.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-secondary">
                            <span className="text-primary font-bold">{j.gameName}</span>
                            <span className="dot" />
                            <span>{j.workType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted hide-mobile">Apply Now</span>
                        <ChevronRight size={20} className="text-muted group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="space-y-6">
            
            {/* Quick Metrics Card */}
            <div className="glass-surface p-8 rounded-3xl space-y-8">
              <h4 className="text-xs text-muted uppercase tracking-widest font-bold">Organization Performance</h4>
              
              <div className="space-y-6">
                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-void border flex-center text-primary">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted uppercase font-bold tracking-wider">Fanbase</p>
                    <p className="text-xl font-bold text-white">{org.followersCount || 0}</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-void border flex-center text-primary">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted uppercase font-bold tracking-wider">Hiring Capacity</p>
                    <p className="text-xl font-bold text-white">{org.activeJobs || 0} Openings</p>
                  </div>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-void border flex-center text-primary">
                    <Eye size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted uppercase font-bold tracking-wider">Engagement</p>
                    <p className="text-xl font-bold text-white">{org.profileViews || 0} Visits</p>
                  </div>
                </div>
              </div>

              {org.foundedYear && (
                <div className="pt-6 border-t border-white/5 flex items-center gap-3 text-secondary">
                  <Calendar size={16} />
                  <span className="text-sm font-semibold">Established in {org.foundedYear}</span>
                </div>
              )}
            </div>

            {/* Active Disciplines */}
            {org.activeGames?.length > 0 && (
              <div className="glass-surface p-8 rounded-3xl space-y-4">
                <h4 className="text-xs text-muted uppercase tracking-widest font-bold">Active Rosters</h4>
                <div className="flex flex-wrap gap-2">
                  {org.activeGames.map((g, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary uppercase">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {org.website && (
              <a 
                href={org.website.startsWith('http') ? org.website : `https://${org.website}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary btn-lg btn-full gap-2"
              >
                <Globe size={18} /> Official Website <ExternalLink size={14} />
              </a>
            )}

            <div className="glass-surface p-6 rounded-3xl text-center">
              <Zap size={24} className="text-primary mx-auto mb-3" />
              <p className="text-[10px] text-muted uppercase font-bold">Partnership Inquiries</p>
              <p className="text-sm font-bold text-white mt-1">contact@{slug}.pro</p>
            </div>
          </aside>

        </div>
      </div>
      
      <div className="pb-24" />
      <BottomNav />

      <style>{`
        .org-banner-wrap {
          height: 320px;
          position: relative;
          background: #0a0a14;
          overflow: hidden;
        }

        .org-banner-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%);
        }

        .banner-grid-lines {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0);
          background-size: 32px 32px;
        }

        .org-logo-xl {
          width: 160px;
          height: 160px;
          border-radius: 36px;
          background: var(--bg-void);
          border: 6px solid var(--bg-void);
          position: relative;
          box-shadow: 0 24px 48px rgba(0,0,0,0.5);
          overflow: visible;
          flex-shrink: 0;
        }

        .org-logo-xl img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 30px;
        }

        .logo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary), var(--primary-glow));
          color: white;
        }

        .verified-badge-lg {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 44px;
          height: 44px;
          background: var(--primary);
          border: 6px solid var(--bg-void);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        @media (max-width: 768px) {
          .org-logo-xl { width: 120px; height: 120px; border-radius: 28px; }
          .org-logo-xl img { border-radius: 22px; }
          .logo-placeholder { border-radius: 22px; }
          .verified-badge-lg { width: 36px; height: 36px; top: -5px; right: -5px; border-width: 4px; }
          .h1 { font-size: 2rem !important; }
        }
      `}</style>
    </div>
  );
}