import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Briefcase, Clock, Calendar, Users, Target,
  CheckCircle2, PlusCircle, MonitorSmartphone, Share2, CornerUpRight,
  ShieldCheck, Gem, Building2, ExternalLink
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import toast from 'react-hot-toast';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isUser, isAuthenticated, user } = useAuth();

  useEffect(() => {
    jobsAPI.getById(id)
      .then(r => {
        setJob(r.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isUser, user]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="skeleton-shimmer rounded-2xl" style={{ height: 200, marginBottom: 24 }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="skeleton-shimmer rounded-2xl" style={{ height: 400 }} />
          </div>
          <div className="skeleton-shimmer rounded-2xl" style={{ height: 300 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  );

  if (!job) return (
    <div className="page-shell flex-center flex-col text-center">
      <div className="p-6 bg-void rounded-full border mb-4">
        <Briefcase size={48} className="text-muted" />
      </div>
      <h2 className="h2">Opening Not Found</h2>
      <p className="text-secondary mt-2">The role you are looking for might have been closed or removed.</p>
      <Link to="/jobs" className="btn btn-primary mt-6">Browse Other Openings</Link>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1000 }}>
        
        {/* Navigation Bar */}
        <div className="flex-between mb-8">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={18} /> Back to Openings
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="btn btn-secondary btn-sm gap-2">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        <div className="job-detail-grid">
          {/* Main Content Area */}
          <div className="job-detail-main">
            {/* Header Hero Card */}
            <motion.div 
              className="glass-surface p-8 rounded-3xl mb-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="auth-bg-glow" style={{ opacity: 0.1, top: '-20%', right: '-10%' }} />
              
              <div className="flex-between wrap gap-6 items-start">
                <div className="flex gap-6 items-start">
                  <div className="job-logo-lg glass-surface p-1">
                    {job.postedBy?.orgLogo ? (
                      <img src={job.postedBy.orgLogo} alt={job.postedBy?.orgName} className="rounded-xl w-full h-full object-cover" />
                    ) : (
                      <Building2 size={32} className="text-muted" />
                    )}
                  </div>
                  <div>
                    <h1 className="h2" style={{ lineHeight: 1.1 }}>{job.title}</h1>
                    <div className="flex items-center gap-3 mt-3">
                      <Link to={`/org/${job.postedBy?._id}`} className="text-primary font-semibold flex items-center gap-1 hover:underline">
                        {job.postedBy?.orgName} <ExternalLink size={14} />
                      </Link>
                      <span className="dot" />
                      <span className="text-secondary text-sm flex items-center gap-1">
                        <MapPin size={14} /> {job.location?.state || 'Remote'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 items-end hide-mobile">
                  <span className="chip chip-indigo">
                    <Gem size={14} /> Verified Opening
                  </span>
                  <span className="text-xs text-muted">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8 wrap">
                <span className="tag tag-indigo">{job.gameName || 'Esports'}</span>
                <span className="tag tag-slate">{job.workType}</span>
                <span className="tag tag-slate">{job.locationType}</span>
              </div>
            </motion.div>

            {/* Description & Requirements */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <section className="glass-surface p-8 rounded-3xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" /> About the Position
                </h3>
                <div className="prose text-secondary leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </section>

              {job.mustHaves?.length > 0 && (
                <section className="glass-surface p-8 rounded-3xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Target size={20} className="text-primary" /> Core Requirements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.mustHaves.map((req, i) => (
                      <div key={i} className="flex gap-3 items-start p-4 bg-void rounded-2xl border">
                        <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{req}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {job.niceToHaves?.length > 0 && (
                <section className="glass-surface p-8 rounded-3xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <PlusCircle size={20} className="text-indigo-400" /> Nice to Haves
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {job.niceToHaves.map((req, i) => (
                      <div key={i} className="flex gap-3 items-start p-4 bg-void rounded-2xl border border-dashed">
                        <PlusCircle size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-secondary">{req}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(job.deviceRequirements?.requiredDevice || job.deviceRequirements?.minRam) && (
                <section className="glass-surface p-8 rounded-3xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <MonitorSmartphone size={20} className="text-primary" /> Hardware Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-void rounded-2xl border text-center">
                      <span className="text-xs text-muted uppercase tracking-wider font-bold">Platform</span>
                      <p className="mt-1 font-bold text-white">{job.deviceRequirements.requiredDevice || 'Any'}</p>
                    </div>
                    <div className="p-4 bg-void rounded-2xl border text-center">
                      <span className="text-xs text-muted uppercase tracking-wider font-bold">Minimum RAM</span>
                      <p className="mt-1 font-bold text-white">{job.deviceRequirements.minRam || '8GB'}</p>
                    </div>
                    <div className="p-4 bg-void rounded-2xl border text-center">
                      <span className="text-xs text-muted uppercase tracking-wider font-bold">Storage</span>
                      <p className="mt-1 font-bold text-white">{job.deviceRequirements.minStorage || 'N/A'}</p>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          </div>

          {/* Sticky Sidebar Action Card */}
          <aside className="job-detail-sidebar">
            <motion.div 
              className="glass-surface p-6 rounded-3xl sticky top-24 shadow-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isUser ? (
                <Link to={`/jobs/${id}/apply`} className="btn btn-primary btn-lg btn-full shadow-primary mb-6">
                  Apply for this Role <CornerUpRight size={18} />
                </Link>
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn btn-secondary btn-lg btn-full mb-6">
                  Sign in to Apply
                </Link>
              ) : null}

              <div className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-void border flex-center text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wide">Work Type</p>
                    <p className="text-sm font-semibold text-white">{job.workType} • {job.locationType}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-void border flex-center text-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wide">Apply By</p>
                    <p className="text-sm font-semibold text-white">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Open until filled'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-void border flex-center text-primary">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-bold uppercase tracking-wide">Competition</p>
                    <p className="text-sm font-semibold text-white">{job.applicantCount || 0} Professionals Applied</p>
                  </div>
                </div>
                
                {job.salary?.type && job.salary.type !== 'Unpaid' && (
                  <div className="flex gap-4 items-center p-4 bg-void rounded-2xl border border-indigo-500/20">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex-center text-indigo-400">
                      💰
                    </div>
                    <div>
                      <p className="text-xs text-muted font-bold uppercase tracking-wide">Compensation</p>
                      <p className="text-sm font-bold text-white">
                        {job.salary.type} {job.salary.range?.min && ` • ₹${job.salary.range.min} - ₹${job.salary.range.max}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-xs text-muted">ID: {id}</p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
      <BottomNav />

      <style>{`
        .job-detail-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
          align-items: start;
        }

        .job-logo-lg {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 860px) {
          .job-detail-grid { grid-template-columns: 1fr; }
          .job-detail-sidebar { order: -1; }
          .hide-mobile { display: none; }
        }

        .prose p { margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
}