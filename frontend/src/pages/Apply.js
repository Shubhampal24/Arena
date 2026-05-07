import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsAPI, applyAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Briefcase, Send, FileText, CheckCircle2, ChevronLeft,
  AlertCircle, UploadCloud, Video, Target, Link2, User, Sparkles
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [load, setLoad] = useState(true);
  const [submitting, setSub] = useState(false);
  const [form, setForm] = useState({ coverNote: '', portfolioLinks: '', discordId: '', availability: '', videoIntroUrl: '' });

  useEffect(() => {
    jobsAPI.getById(id)
      .then(r => { setJob(r.data.data); setLoad(false); })
      .catch(() => setLoad(false));
  }, [id]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      await applyAPI.apply(id, {
        ...form,
        portfolioLinks: form.portfolioLinks.split('\n').filter(Boolean),
        gameStats: { currentTier: user?.gameProfiles?.[0]?.currentTier, kd: user?.gameProfiles?.[0]?.stats?.kd },
      });
      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    } finally { setSub(false); }
  };

  if (load) return (
    <div className="page-shell flex-center">
      <div className="skeleton-shimmer rounded-3xl" style={{ height: 600, width: '100%', maxWidth: 700 }} />
    </div>
  );

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 800 }}>
        
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2 mb-6">
            <ChevronLeft size={18} /> Back to Job Details
          </button>
          
          <div className="flex gap-6 items-center">
            <div className="job-logo-lg glass-surface p-1" style={{ width: 64, height: 64 }}>
              {job?.postedBy?.orgLogo ? (
                <img src={job.postedBy.orgLogo} alt="" className="rounded-xl w-full h-full object-cover" />
              ) : (
                <Briefcase size={24} className="text-muted" />
              )}
            </div>
            <div>
              <h1 className="h2">Apply for {job?.title}</h1>
              <p className="text-secondary font-medium">at {job?.postedBy?.orgName}</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-surface p-4 rounded-2xl mb-8 flex items-center gap-4 border-indigo-500/20">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex-center text-indigo-400">
            <User size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Your Professional Profile will be attached.</p>
            <p className="text-xs text-muted">Your stats, experience, and achievements are automatically included.</p>
          </div>
          <Link to="/profile/edit" className="btn btn-ghost btn-sm text-primary">Update Profile</Link>
        </div>

        {/* Application Form */}
        <motion.div 
          className="glass-surface p-8 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Your Pitch
              </h3>
              <div className="form-group">
                <label className="form-label">Cover Note <span className="text-danger">*</span></label>
                <textarea
                  className="input min-h-[160px]"
                  placeholder="Tell the hiring manager why you're the perfect fit for this role. Highlight your specific skills and experiences..."
                  value={form.coverNote}
                  onChange={e => set('coverNote', e.target.value)}
                  required
                />
                <p className="text-xs text-muted mt-2">Write a compelling case for yourself. Be professional and concise.</p>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Availability</label>
                <select className="input" value={form.availability} onChange={e => set('availability', e.target.value)}>
                  <option value="">Select your availability</option>
                  {['Immediate', '1-2 Weeks', '1 Month', 'Part-Time Only', 'Contract Only'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Discord ID / Contact</label>
                <input 
                  className="input" 
                  placeholder="username#0000" 
                  value={form.discordId} 
                  onChange={e => set('discordId', e.target.value)} 
                />
              </div>
            </div>

            <section className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Target size={20} className="text-primary" /> Professional Assets
              </h3>
              <div className="form-group">
                <label className="form-label flex-between">
                  <span><Link2 size={14} className="inline mr-1" /> Portfolio / Highlight Links</span>
                  <span className="text-xs text-muted">One URL per line</span>
                </label>
                <textarea
                  className="input font-mono text-sm"
                  rows={4}
                  placeholder="https://youtube.com/highlights\nhttps://portfolio.me/pro"
                  value={form.portfolioLinks}
                  onChange={e => set('portfolioLinks', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Video size={14} className="inline mr-1" /> Video Introduction (Link)</label>
                <input
                  className="input"
                  type="url"
                  placeholder="https://vimeo.com/..."
                  value={form.videoIntroUrl}
                  onChange={e => set('videoIntroUrl', e.target.value)}
                />
                <p className="text-xs text-muted mt-2">Highly recommended. A short 30-60s intro video can double your chances.</p>
              </div>
            </section>

            {job?.applicationProcess?.trialMatch && (
              <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex gap-4">
                <Sparkles size={24} className="text-indigo-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Trial Phase Required</h4>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    This position involves a practical evaluation. If your profile is shortlisted, you will be invited to participate in a trial match or assessment.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-6">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg btn-full shadow-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting Application...' : (
                  <span className="flex-center gap-2">
                    <Send size={18} /> Submit Application
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}