import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Briefcase, Send, Target, MonitorSmartphone, PlusCircle, X,
  MapPin, Clock, Edit3, Type, Gamepad2, AlertCircle, FileText
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function PostJob() {
  const navigate = useNavigate();
  const { org } = useAuth();
  const [games, setGames] = useState([]);
  const [roles, setRoles] = useState({});
  const [states, setStates] = useState([]);
  const [fields, setFields] = useState({});
  const [saving, setSave] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', roleCategory: '', specificRole: '',
    gameId: '', gameName: '', workType: '', locationType: '',
    locationState: '', language: 'Hindi + English',
    mustHaves: [''], niceToHaves: [''],
    minTier: '', deviceRequirements: { requiredDevice: '', minRAM: '', internetSpeed: '', softwareTools: [] },
    salaryType: '', salaryMin: '', salaryMax: '', openSlots: 1,
    deadline: '', tags: '',
  });

  useEffect(() => {
    gamesAPI.getAll().then(r => setGames(r.data.data));
    gamesAPI.getRoles().then(r => setRoles(r.data.data));
    gamesAPI.getStates().then(r => setStates(r.data.data));
    gamesAPI.getJobFields().then(r => setFields(r.data.data));
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setDev = (k, v) => setForm(p => ({ ...p, deviceRequirements: { ...p.deviceRequirements, [k]: v } }));

  const updateList = (key, idx, val) => {
    const arr = [...(form[key] || [])];
    arr[idx] = val;
    set(key, arr);
  };
  const addItem = (key) => set(key, [...(form[key] || []), '']);
  const removeItem = (key, idx) => set(key, (form[key] || []).filter((_, i) => i !== idx));

  const handleGameChange = (gameId) => {
    const g = games.find(g => g.id === gameId);
    set('gameId', gameId);
    set('gameName', g?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.specificRole) { toast.error('Fill all required fields.'); return; }
    setSave(true);
    try {
      await jobsAPI.create({
        title: form.title,
        description: form.description,
        roleCategory: form.roleCategory,
        specificRole: form.specificRole,
        gameId: form.gameId,
        gameName: form.gameName,
        workType: form.workType,
        locationType: form.locationType,
        location: { state: form.locationState, country: 'India' },
        language: form.language,
        minTier: form.minTier,
        deviceRequirements: form.deviceRequirements,
        mustHaves: form.mustHaves.filter(Boolean),
        niceToHaves: form.niceToHaves.filter(Boolean),
        salary: { type: form.salaryType, min: form.salaryMin, max: form.salaryMax, currency: 'INR' },
        openSlots: form.openSlots,
        deadline: form.deadline || undefined,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success('Job posted successfully! 🚀');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.');
    } finally { setSave(false); }
  };

  const selectedGame = games.find(g => g.id === form.gameId);

  return (
    <div className="postjob-shell">
      <div className="postjob-container">

        {/* Header */}
        <div className="postjob-header">
          <div className="header-icon-wrap">
            <Briefcase size={28} />
          </div>
          <div>
            <h1>Create <span className="text-electric">Job Post</span></h1>
            <p className="subtitle">Find top talent for your esports organization</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="postjob-form">
          
          {/* Section: Basic Info */}
          <motion.div className="form-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="card-title text-electric"><FileText size={18}/> Basic Details</h3>
            
            <div className="form-group">
              <label className="form-label">Job Title <span className="req">*</span></label>
              <input className="form-input" placeholder="e.g. BGMI IGl, Senior Video Editor" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Full Description <span className="req">*</span></label>
              <textarea className="form-input" rows={6} placeholder="Describe the role, responsibilities, trial process, and what you're looking for..." value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Category <span className="req">*</span></label>
                <select className="form-input form-select" value={form.roleCategory} onChange={e => set('roleCategory', e.target.value)} required>
                  <option value="">Select category</option>
                  {Object.keys(roles).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Specific Role <span className="req">*</span></label>
                <select className="form-input form-select" value={form.specificRole} onChange={e => set('specificRole', e.target.value)} required>
                  <option value="">Select role</option>
                  {(roles[form.roleCategory] || []).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label text-saffron"><Gamepad2 size={14} style={{ marginRight: 4, display:'inline'}}/> Game Context</label>
                <select className="form-input form-select" value={form.gameId} onChange={e => handleGameChange(e.target.value)}>
                  <option value="">Not specific to a game</option>
                  {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              {selectedGame && (
                <div className="form-group">
                  <label className="form-label text-saffron">Minimum Tier Requirement</label>
                  <select className="form-input form-select" value={form.minTier} onChange={e => set('minTier', e.target.value)}>
                    <option value="">Any Tier</option>
                    {selectedGame.tiers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
            </div>
          </motion.div>

          {/* Section: Work Terms */}
          <motion.div className="form-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="card-title text-purple-light"><Clock size={18}/> Terms & Compensation</h3>
            
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Work Type</label>
                <select className="form-input form-select" value={form.workType} onChange={e => set('workType', e.target.value)}>
                  <option value="">Select type</option>
                  {(fields.WORK_TYPE || []).map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Location Type</label>
                <select className="form-input form-select" value={form.locationType} onChange={e => set('locationType', e.target.value)}>
                  <option value="">Select</option>
                  {(fields.LOCATION_TYPE || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-input form-select" value={form.locationState} onChange={e => set('locationState', e.target.value)}>
                  <option value="">Any State (Remote allowed)</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-input form-select" value={form.language} onChange={e => set('language', e.target.value)}>
                  {(fields.LANGUAGE || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Salary Type</label>
                <select className="form-input form-select" value={form.salaryType} onChange={e => set('salaryType', e.target.value)}>
                  <option value="">Not Disclosed</option>
                  {(fields.SALARY_TYPE || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Positions Open</label>
                <input className="form-input" type="number" min={1} value={form.openSlots} onChange={e => set('openSlots', e.target.value)} />
              </div>
            </div>

            {['Monthly Stipend', 'Revenue Share'].includes(form.salaryType) && (
              <div className="form-grid alert-box mt-4">
                <div className="form-group">
                  <label className="form-label">Min Range (INR)</label>
                  <input className="form-input font-mono" type="number" placeholder="5000" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Range (INR)</label>
                  <input className="form-input font-mono" type="number" placeholder="25000" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Section: Requirements */}
          <motion.div className="form-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="card-title text-saffron"><Target size={18}/> Skill Requirements</h3>
            
            <div className="form-group mb-6">
              <label className="form-label text-saffron">Must Have Elements (Dealbreakers)</label>
              <div className="dynamic-list">
                {form.mustHaves.map((m, i) => (
                  <div key={i} className="dynamic-list-item">
                    <input className="form-input" value={m} placeholder={`Requirement ${i + 1}`} onChange={e => updateList('mustHaves', i, e.target.value)} />
                    {i > 0 && <button type="button" className="btn-icon-remove" onClick={() => removeItem('mustHaves', i)}><X size={16}/></button>}
                  </div>
                ))}
                <button type="button" className="btn-add-ghost text-saffron" onClick={() => addItem('mustHaves')}><PlusCircle size={14}/> Add Requirement</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label text-electric">Nice To Have (Bonus Points)</label>
              <div className="dynamic-list">
                {form.niceToHaves.map((n, i) => (
                  <div key={i} className="dynamic-list-item">
                    <input className="form-input" value={n} placeholder={`Bonus Skill ${i + 1}`} onChange={e => updateList('niceToHaves', i, e.target.value)} />
                    {i > 0 && <button type="button" className="btn-icon-remove" onClick={() => removeItem('niceToHaves', i)}><X size={16}/></button>}
                  </div>
                ))}
                <button type="button" className="btn-add-ghost text-electric" onClick={() => addItem('niceToHaves')}><PlusCircle size={14}/> Add Bonus Skill</button>
              </div>
            </div>
          </motion.div>

          {/* Section: Details & SEO */}
          <motion.div className="form-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="card-title text-india-green"><MapPin size={18}/> Final Details</h3>
            
            <div className="form-grid mb-6">
              <div className="form-group">
                <label className="form-label">Search Tags (Comma separated)</label>
                <input className="form-input" placeholder="BGMI, Entry Fragger, Content Creator..." value={form.tags} onChange={e => set('tags', e.target.value)} />
                <span className="input-hint">Helps candidates find your job in search</span>
              </div>
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input className="form-input" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
              </div>
            </div>

            <div className="divider" />

            <div className="form-group mt-4">
              <label className="form-label"><MonitorSmartphone size={14} style={{ marginRight: 4, display:'inline'}}/> Hardware Requirements (Optional)</label>
              <div className="form-grid-3">
                <input className="form-input" placeholder="Required Device (e.g. iPad Pro)" value={form.deviceRequirements.requiredDevice} onChange={e => setDev('requiredDevice', e.target.value)} />
                <input className="form-input" placeholder="Min RAM (e.g. 16GB)" value={form.deviceRequirements.minRAM} onChange={e => setDev('minRAM', e.target.value)} />
                <input className="form-input" placeholder="Internet Speed (e.g. 100Mbps)" value={form.deviceRequirements.internetSpeed} onChange={e => setDev('internetSpeed', e.target.value)} />
              </div>
            </div>
          </motion.div>

          <button type="submit" className="submit-btn-lg" disabled={saving}>
            {saving ? <span className="btn-loading">Publishing...</span> : <><Send size={20} /> Publish Job Post <span style={{ opacity: 0.5, fontWeight: 500, fontSize:'0.9rem', marginLeft:8}}>Press Enter</span></>}
          </button>
        </form>
      </div>
      <BottomNav />

      <style>{`
        .postjob-shell { min-height: 100vh; padding-top: 50px; padding-bottom: 80px; }
        .postjob-container { max-width: 860px; margin: 0 auto; padding: 24px 16px; }

        .postjob-header { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
        .header-icon-wrap { width: 64px; height: 64px; background: linear-gradient(135deg, rgba(0,229,255,0.1), rgba(123,47,190,0.1)); border: 1px solid rgba(0,229,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--electric); flex-shrink: 0; }
        .postjob-header h1 { font-size: 2rem; margin-bottom: 4px; }
        .subtitle { color: var(--text-muted); font-size: 1rem; }

        .postjob-form { display: flex; flex-direction: column; gap: 24px; }

        .form-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; box-shadow: var(--shadow-card); }
        .card-title { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; margin-bottom: 24px; font-weight: 700; border-bottom: 1px solid var(--border-dim); padding-bottom: 12px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        @media (max-width: 600px) { .form-grid, .form-grid-3 { grid-template-columns: 1fr; } }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { display: flex; align-items: center; font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); }
        .req { color: #ff4444; margin-left: 4px; }
        .form-input { width: 100%; padding: 12px 16px; background: var(--bg-input); border: 1.5px solid var(--border-dim); border-radius: 12px; font-family: var(--font-body); font-size: 0.95rem; color: var(--text-primary); outline: none; transition: all 0.2s; resize: vertical; }
        .form-input:focus { border-color: var(--electric); box-shadow: 0 0 0 3px rgba(0,229,255,0.1); }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23606078' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .input-hint { font-size: 0.75rem; color: var(--text-muted); }
        .font-mono { font-family: var(--font-mono); }
        
        .dynamic-list { display: flex; flex-direction: column; gap: 10px; }
        .dynamic-list-item { display: flex; align-items: center; gap: 8px; }
        .btn-icon-remove { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.2); border-radius: 12px; color: #ff4444; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .btn-icon-remove:hover { background: #ff4444; color: white; }
        .btn-add-ghost { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; background: transparent; border: 1.5px dashed var(--border-dim); border-radius: 12px; font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-add-ghost:hover { border-style: solid; background: rgba(255,255,255,0.03); }

        .alert-box { background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); border-radius: 12px; padding: 20px; }
        .divider { height: 1px; background: var(--border-dim); margin: 8px 0; }
        .mb-6 { margin-bottom: 24px; }
        .mt-4 { margin-top: 16px; }

        .submit-btn-lg { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 18px; border: none; border-radius: 16px; background: linear-gradient(135deg, var(--electric), #0099bb); color: var(--bg-void); font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 24px rgba(0,229,255,0.3); margin-top: 8px; }
        .submit-btn-lg:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,229,255,0.4); filter: brightness(1.1); }
        .submit-btn-lg:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}