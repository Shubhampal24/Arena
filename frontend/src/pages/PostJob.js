import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PostJob() {
  const navigate   = useNavigate();
  const { org }    = useAuth();
  const [games, setGames]   = useState([]);
  const [roles, setRoles]   = useState({});
  const [states, setStates] = useState([]);
  const [fields, setFields] = useState({});
  const [saving, setSave]   = useState(false);

  const [form, setForm] = useState({
    title:'', description:'', roleCategory:'', specificRole:'',
    gameId:'', gameName:'', workType:'', locationType:'',
    locationState:'', language:'Hindi + English',
    mustHaves:[''], niceToHaves:[''],
    minTier:'', deviceRequirements:{ requiredDevice:'', minRAM:'', internetSpeed:'', softwareTools:[] },
    salaryType:'', salaryMin:'', salaryMax:'', openSlots:1,
    deadline:'', tags:'',
  });

  useEffect(() => {
    gamesAPI.getAll().then(r=>setGames(r.data.data));
    gamesAPI.getRoles().then(r=>setRoles(r.data.data));
    gamesAPI.getStates().then(r=>setStates(r.data.data));
    gamesAPI.getJobFields().then(r=>setFields(r.data.data));
  }, []);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const setDev = (k,v) => setForm(p=>({...p,deviceRequirements:{...p.deviceRequirements,[k]:v}}));

  const updateList = (key, idx, val) => {
    const arr = [...(form[key]||[])];
    arr[idx] = val;
    set(key, arr);
  };
  const addItem  = (key) => set(key, [...(form[key]||[]), '']);
  const removeItem = (key, idx) => set(key, (form[key]||[]).filter((_,i)=>i!==idx));

  const handleGameChange = (gameId) => {
    const g = games.find(g=>g.id===gameId);
    set('gameId', gameId);
    set('gameName', g?.name||'');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.specificRole) { toast.error('Fill all required fields.'); return; }
    setSave(true);
    try {
      await jobsAPI.create({
        title:       form.title,
        description: form.description,
        roleCategory:form.roleCategory,
        specificRole:form.specificRole,
        gameId:      form.gameId,
        gameName:    form.gameName,
        workType:    form.workType,
        locationType:form.locationType,
        location:    { state: form.locationState, country: 'India' },
        language:    form.language,
        minTier:     form.minTier,
        deviceRequirements: form.deviceRequirements,
        mustHaves:   form.mustHaves.filter(Boolean),
        niceToHaves: form.niceToHaves.filter(Boolean),
        salary:      { type: form.salaryType, min: form.salaryMin, max: form.salaryMax, currency: 'INR' },
        openSlots:   form.openSlots,
        deadline:    form.deadline || undefined,
        tags:        form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      });
      toast.success('Job posted! 🎮');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.');
    } finally { setSave(false); }
  };

  const selectedGame = games.find(g=>g.id===form.gameId);

  return (
    <div className="page" style={{paddingBottom:80}}>
      <div className="container" style={{maxWidth:800}}>
        <div style={{paddingTop:40,paddingBottom:32}}>
          <h1 style={{marginBottom:8}}>Post a <span style={{color:'var(--saffron)'}}>Job / Vacancy</span></h1>
          <p style={{color:'var(--text-secondary)'}}>Find the right talent for your organization.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="card" style={{padding:32,marginBottom:20,border:'1px solid var(--border)'}}>
            <h3 style={{marginBottom:20,color:'var(--saffron)'}}>📋 Basic Information</h3>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div className="input-group"><label className="input-label">Job Title *</label><input className="input" placeholder="e.g. BGMI IGL Wanted | Looking for Video Editor" value={form.title} onChange={e=>set('title',e.target.value)} required /></div>
              <div className="input-group"><label className="input-label">Full Description *</label><textarea className="input" rows={6} placeholder="Describe the role, responsibilities, your organization's expectations, trial process..." value={form.description} onChange={e=>set('description',e.target.value)} required style={{resize:'vertical'}} /></div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="input-group">
                  <label className="input-label">Role Category *</label>
                  <select className="input select" value={form.roleCategory} onChange={e=>set('roleCategory',e.target.value)} required>
                    <option value="">Select category</option>
                    {Object.keys(roles).map(k=><option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Specific Role *</label>
                  <select className="input select" value={form.specificRole} onChange={e=>set('specificRole',e.target.value)} required>
                    <option value="">Select role</option>
                    {(roles[form.roleCategory]||[]).map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="input-group">
                  <label className="input-label">Game</label>
                  <select className="input select" value={form.gameId} onChange={e=>handleGameChange(e.target.value)}>
                    <option value="">Select game (if applicable)</option>
                    {games.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                {selectedGame && (
                  <div className="input-group">
                    <label className="input-label">Minimum Tier</label>
                    <select className="input select" value={form.minTier} onChange={e=>set('minTier',e.target.value)}>
                      <option value="">No tier requirement</option>
                      {selectedGame.tiers.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="card" style={{padding:32,marginBottom:20}}>
            <h3 style={{marginBottom:20,color:'var(--electric)'}}>⚙️ Work Terms</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group"><label className="input-label">Work Type</label><select className="input select" value={form.workType} onChange={e=>set('workType',e.target.value)}><option value="">Select</option>{(fields.WORK_TYPE||[]).map(w=><option key={w} value={w}>{w}</option>)}</select></div>
              <div className="input-group"><label className="input-label">Location Type</label><select className="input select" value={form.locationType} onChange={e=>set('locationType',e.target.value)}><option value="">Select</option>{(fields.LOCATION_TYPE||[]).map(l=><option key={l} value={l}>{l}</option>)}</select></div>
              <div className="input-group"><label className="input-label">State</label><select className="input select" value={form.locationState} onChange={e=>set('locationState',e.target.value)}><option value="">Any state</option>{states.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div className="input-group"><label className="input-label">Language</label><select className="input select" value={form.language} onChange={e=>set('language',e.target.value)}>{(fields.LANGUAGE||[]).map(l=><option key={l} value={l}>{l}</option>)}</select></div>
              <div className="input-group"><label className="input-label">Salary Type</label><select className="input select" value={form.salaryType} onChange={e=>set('salaryType',e.target.value)}><option value="">Not specified</option>{(fields.SALARY_TYPE||[]).map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div className="input-group"><label className="input-label">Open Slots</label><input className="input" type="number" min={1} max={50} value={form.openSlots} onChange={e=>set('openSlots',e.target.value)} /></div>
            </div>
            {['Monthly Stipend','Revenue Share'].includes(form.salaryType) && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16}}>
                <div className="input-group"><label className="input-label">Min (INR/month)</label><input className="input" type="number" placeholder="e.g. 5000" value={form.salaryMin} onChange={e=>set('salaryMin',e.target.value)} /></div>
                <div className="input-group"><label className="input-label">Max (INR/month)</label><input className="input" type="number" placeholder="e.g. 25000" value={form.salaryMax} onChange={e=>set('salaryMax',e.target.value)} /></div>
              </div>
            )}
          </div>

          {/* Device */}
          <div className="card" style={{padding:32,marginBottom:20}}>
            <h3 style={{marginBottom:20}}>📱 Device Requirements</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group"><label className="input-label">Required Device</label><input className="input" placeholder="e.g. Must have iPhone 13+ or Android 10+" value={form.deviceRequirements.requiredDevice} onChange={e=>setDev('requiredDevice',e.target.value)} /></div>
              <div className="input-group"><label className="input-label">Min RAM</label><input className="input" placeholder="e.g. 6GB minimum" value={form.deviceRequirements.minRAM} onChange={e=>setDev('minRAM',e.target.value)} /></div>
              <div className="input-group"><label className="input-label">Internet Speed</label><input className="input" placeholder="e.g. 50 Mbps stable" value={form.deviceRequirements.internetSpeed} onChange={e=>setDev('internetSpeed',e.target.value)} /></div>
            </div>
          </div>

          {/* Requirements */}
          <div className="card" style={{padding:32,marginBottom:20}}>
            <h3 style={{marginBottom:20}}>✅ Requirements</h3>
            <div style={{marginBottom:20}}>
              <label className="input-label" style={{marginBottom:10,display:'block'}}>Must Have</label>
              {form.mustHaves.map((m,i)=>(
                <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
                  <input className="input" value={m} placeholder={'Requirement '+(i+1)} onChange={e=>updateList('mustHaves',i,e.target.value)} />
                  {i>0&&<button type="button" className="btn btn-ghost btn-sm" onClick={()=>removeItem('mustHaves',i)}>✕</button>}
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>addItem('mustHaves')}>+ Add Requirement</button>
            </div>

            <div>
              <label className="input-label" style={{marginBottom:10,display:'block'}}>Nice to Have</label>
              {form.niceToHaves.map((n,i)=>(
                <div key={i} style={{display:'flex',gap:8,marginBottom:8}}>
                  <input className="input" value={n} placeholder={'Bonus '+(i+1)} onChange={e=>updateList('niceToHaves',i,e.target.value)} />
                  {i>0&&<button type="button" className="btn btn-ghost btn-sm" onClick={()=>removeItem('niceToHaves',i)}>✕</button>}
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>addItem('niceToHaves')}>+ Add Bonus</button>
            </div>
          </div>

          {/* Tags & deadline */}
          <div className="card" style={{padding:32,marginBottom:32}}>
            <h3 style={{marginBottom:20}}>🏷️ Tags & Deadline</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group"><label className="input-label">Tags (comma separated)</label><input className="input" placeholder="BGMI, IGL, Remote, Fresher OK" value={form.tags} onChange={e=>set('tags',e.target.value)} /></div>
              <div className="input-group"><label className="input-label">Application Deadline</label><input className="input" type="date" value={form.deadline} onChange={e=>set('deadline',e.target.value)} /></div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={saving}>
            {saving ? '⏳ Posting...' : '📋 Publish Job Post →'}
          </button>
        </form>
      </div>
    </div>
  );
}