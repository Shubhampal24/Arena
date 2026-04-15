import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applyAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Apply() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob]     = useState(null);
  const [loading, setLoad] = useState(true);
  const [submitting, setSub] = useState(false);
  const [form, setForm]   = useState({ coverNote:'', portfolioLinks:'', discordId:'', availability:'', videoIntroUrl:'' });

  useEffect(() => {
    jobsAPI.getById(id).then(r=>{setJob(r.data.data);setLoad(false);}).catch(()=>setLoad(false));
  }, [id]);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true);
    try {
      await applyAPI.apply(id, {
        ...form,
        portfolioLinks: form.portfolioLinks.split('\n').filter(Boolean),
        gameStats: { currentTier: user?.gameProfiles?.[0]?.currentTier, kd: user?.gameProfiles?.[0]?.stats?.kd },
      });
      toast.success('Application submitted! Good luck! 🎮');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application.');
    } finally { setSub(false); }
  };

  if (load) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Loading...</div></div>;

  return (
    <div className="page" style={{paddingBottom:60}}>
      <div className="container" style={{maxWidth:680}}>
        <div style={{paddingTop:40,paddingBottom:24}}>
          <h1 style={{marginBottom:8}}>Apply for <span style={{color:'var(--saffron)'}}>{job?.title}</span></h1>
          <p style={{color:'var(--text-secondary)'}}>at {job?.postedBy?.orgName}</p>
        </div>

        <div className="card" style={{padding:36,border:'1px solid var(--border)'}}>
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:24}}>
            <div className="input-group">
              <label className="input-label">Cover Note *</label>
              <textarea className="input" rows={5} placeholder="Tell the org why you're the right fit. Mention your tier, experience, availability, and passion..." value={form.coverNote} onChange={e=>set('coverNote',e.target.value)} required style={{resize:'vertical'}} />
            </div>

            <div className="input-group">
              <label className="input-label">Portfolio / Highlight Links</label>
              <textarea className="input" rows={4} placeholder="One URL per line:\nYouTube highlight reel\nInstagram gaming page\nTournament proof\nGFX portfolio" value={form.portfolioLinks} onChange={e=>set('portfolioLinks',e.target.value)} style={{resize:'vertical',fontFamily:'var(--font-mono)',fontSize:'0.875rem'}} />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group">
                <label className="input-label">Discord ID</label>
                <input className="input" placeholder="username#0000" value={form.discordId} onChange={e=>set('discordId',e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Availability</label>
                <select className="input select" value={form.availability} onChange={e=>set('availability',e.target.value)}>
                  <option value="">Select availability</option>
                  {['Full-Time','Part-Time','Bootcamp','WFH Only','Weekends Only','Tournaments Only'].map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Video Introduction (optional)</label>
              <input className="input" type="url" placeholder="Link to a 60-second intro video (YouTube, Drive, etc.)" value={form.videoIntroUrl} onChange={e=>set('videoIntroUrl',e.target.value)} />
            </div>

            {job?.applicationProcess?.trialMatch && (
              <div style={{background:'rgba(0,229,255,0.05)',border:'1px solid rgba(0,229,255,0.2)',borderRadius:10,padding:16}}>
                <p style={{color:'var(--electric)',fontSize:'0.875rem'}}>⚔️ This role requires a <b>trial match</b>. If shortlisted, the org will schedule an in-game evaluation.</p>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
              {submitting ? '⏳ Submitting...' : '🎯 Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}