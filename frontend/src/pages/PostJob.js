import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Briefcase, Send, Target, MonitorSmartphone, PlusCircle, X,
  MapPin, Clock, Gamepad2, FileText, IndianRupee, Languages, Users, Sparkles
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
    gamesAPI.getAll().then(r => setGames(r.data.data)).catch(() => {});
    gamesAPI.getRoles().then(r => setRoles(r.data.data)).catch(() => {});
    gamesAPI.getStates().then(r => setStates(r.data.data)).catch(() => {});
    gamesAPI.getJobFields().then(r => setFields(r.data.data)).catch(() => {});
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
    if (!form.title || !form.description || !form.specificRole) { toast.error('Required intelligence missing.'); return; }
    setSave(true);
    try {
      await jobsAPI.create({
        ...form,
        location: { state: form.locationState, country: 'India' },
        salary: { type: form.salaryType, min: form.salaryMin, max: form.salaryMax, currency: 'INR' },
        mustHaves: form.mustHaves.filter(Boolean),
        niceToHaves: form.niceToHaves.filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success('Opportunity broadcasted!');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Broadcast failure.');
    } finally { setSave(false); }
  };

  const selectedGame = games.find(g => g.id === form.gameId);

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 850 }}>
        
        {/* Professional Header Section */}
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full inline-flex items-center gap-2 mb-6"
          >
            <Sparkles size={12} className="text-primary" />
            <span className="text-[10px] font-black text-primary tracking-widest uppercase">Opportunity Generation</span>
          </motion.div>
          <h1 className="h1 mb-4 leading-tight">Create a <span className="text-gradient">Professional Opening</span></h1>
          <p className="text-secondary font-medium max-w-lg mx-auto">Identify and secure elite talent for your organization's mission critical roles.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Module: Role Intelligence */}
          <motion.section 
            className="glass-surface p-10 rounded-[40px] border-white/5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                <FileText size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Role Intelligence</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Functional Title <span className="text-danger">*</span></label>
                <input 
                  className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner" 
                  placeholder="e.g. Lead Tactical Architect (IGL)" 
                  value={form.title} 
                  onChange={e => set('title', e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Mission Brief <span className="text-danger">*</span></label>
                <textarea 
                  className="w-full bg-void/50 border border-white/5 rounded-3xl px-6 py-5 text-white font-medium outline-none focus:border-primary/30 transition-all shadow-inner min-h-[220px] resize-none leading-relaxed" 
                  placeholder="Detail the operational responsibilities, technical expectations, and tactical evaluation process..." 
                  value={form.description} 
                  onChange={e => set('description', e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Sector Category</label>
                  <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.roleCategory} onChange={e => set('roleCategory', e.target.value)} required>
                    <option value="">Select Sector</option>
                    {Object.keys(roles).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Operational Role</label>
                  <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.specificRole} onChange={e => set('specificRole', e.target.value)} required>
                    <option value="">Select Role</option>
                    {(roles[form.roleCategory] || []).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Core Discipline / Game</label>
                  <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.gameId} onChange={e => handleGameChange(e.target.value)}>
                    <option value="">Agnostic / Not Specific</option>
                    {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                {selectedGame && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Minimum Capability Tier</label>
                    <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.minTier} onChange={e => set('minTier', e.target.value)}>
                      <option value="">Unrestricted</option>
                      {selectedGame.tiers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="auth-bg-glow" style={{ top: '-40%', right: '-40%', width: '100%', height: '100%', opacity: 0.03 }} />
          </motion.section>

          {/* Module: Operational Logistics */}
          <motion.section 
            className="glass-surface p-10 rounded-[40px] border-white/5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                <Clock size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Operational Logistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Engagement Model</label>
                <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.workType} onChange={e => set('workType', e.target.value)}>
                  <option value="">Select Model</option>
                  {(fields.WORK_TYPE || []).map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Environment Mode</label>
                <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.locationType} onChange={e => set('locationType', e.target.value)}>
                  <option value="">Select Mode</option>
                  {(fields.LOCATION_TYPE || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Geographic Base</label>
                <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.locationState} onChange={e => set('locationState', e.target.value)}>
                  <option value="">Distributed (Remote)</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Linguistic Protocol</label>
                <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.language} onChange={e => set('language', e.target.value)}>
                  {(fields.LANGUAGE || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-white/5">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Comp Protocol</label>
                <select className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none cursor-pointer" value={form.salaryType} onChange={e => set('salaryType', e.target.value)}>
                  <option value="">Classified (Not Disclosed)</option>
                  {(fields.SALARY_TYPE || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Active Slots</label>
                <input className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner" type="number" min={1} value={form.openSlots} onChange={e => set('openSlots', e.target.value)} />
              </div>
            </div>

            {['Monthly Stipend', 'Revenue Share'].includes(form.salaryType) && (
              <div className="grid grid-cols-2 gap-6 mt-8 p-8 bg-void/40 rounded-3xl border border-white/5 shadow-inner">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest px-1">Floor (INR)</label>
                  <input className="w-full bg-void border border-white/5 rounded-xl px-5 py-3 text-white font-bold outline-none" type="number" placeholder="e.g. 20000" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-muted uppercase tracking-widest px-1">Ceiling (INR)</label>
                  <input className="w-full bg-void border border-white/5 rounded-xl px-5 py-3 text-white font-bold outline-none" type="number" placeholder="e.g. 50000" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} />
                </div>
              </div>
            )}
            <div className="auth-bg-glow" style={{ bottom: '-40%', left: '-20%', width: '100%', height: '100%', opacity: 0.03 }} />
          </motion.section>

          {/* Module: Personnel Criteria */}
          <motion.section 
            className="glass-surface p-10 rounded-[40px] border-white/5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Personnel Criteria</h3>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Essential Assets (Must Have)</label>
                <div className="space-y-3">
                  {form.mustHaves.map((m, i) => (
                    <div key={i} className="flex gap-3">
                      <input className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-primary/30 transition-all shadow-inner" value={m} placeholder="e.g. Verified Tier 1 operational experience" onChange={e => updateList('mustHaves', i, e.target.value)} />
                      {i > 0 && (
                        <button type="button" className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center text-danger hover:border-danger/40 transition-all shrink-0" onClick={() => removeItem('mustHaves', i)}>
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest px-2 hover:underline transition-all" onClick={() => addItem('mustHaves')}>
                    <PlusCircle size={16} /> Integrate Requirement
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Tactical Advantages (Optional)</label>
                <div className="space-y-3">
                  {form.niceToHaves.map((n, i) => (
                    <div key={i} className="flex gap-3">
                      <input className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-primary/30 transition-all shadow-inner" value={n} placeholder="e.g. Multilingual communication capability" onChange={e => updateList('niceToHaves', i, e.target.value)} />
                      {i > 0 && (
                        <button type="button" className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center text-danger hover:border-danger/40 transition-all shrink-0" onClick={() => removeItem('niceToHaves', i)}>
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest px-2 hover:underline transition-all" onClick={() => addItem('niceToHaves')}>
                    <PlusCircle size={16} /> Integrate Advantage
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Module: Tactical Timeline */}
          <motion.section 
            className="glass-surface p-10 rounded-[40px] border-white/5 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-void border border-white/5 flex-center text-primary shadow-lg">
                <MonitorSmartphone size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Tactical Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Indexing Tags (Comma delimited)</label>
                <input className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner" placeholder="e.g. Tier1, Lead, HighValue" value={form.tags} onChange={e => set('tags', e.target.value)} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Operational Deadline</label>
                <input className="w-full bg-void/50 border border-white/5 rounded-2xl px-6 py-4 text-white font-semibold outline-none focus:border-primary/30 transition-all shadow-inner appearance-none" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1 mb-6 block">Hardware Specifications (Classified)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input className="w-full bg-void/50 border border-white/5 rounded-xl px-5 py-4 text-sm text-white font-medium outline-none focus:border-primary/30" placeholder="Platform/Node" value={form.deviceRequirements.requiredDevice} onChange={e => setDev('requiredDevice', e.target.value)} />
                <input className="w-full bg-void/50 border border-white/5 rounded-xl px-5 py-4 text-sm text-white font-medium outline-none focus:border-primary/30" placeholder="Minimum Cache (RAM)" value={form.deviceRequirements.minRAM} onChange={e => setDev('minRAM', e.target.value)} />
                <input className="w-full bg-void/50 border border-white/5 rounded-xl px-5 py-4 text-sm text-white font-medium outline-none focus:border-primary/30" placeholder="Software Protocols" value={form.deviceRequirements.softwareTools} onChange={e => setDev('softwareTools', e.target.value)} />
              </div>
            </div>
            <div className="auth-bg-glow" style={{ top: '-40%', left: '-20%', width: '100%', height: '100%', opacity: 0.03 }} />
          </motion.section>

          <div className="pt-10 pb-20">
            <button 
              type="submit" 
              className="btn btn-primary w-full py-5 rounded-[24px] shadow-primary font-black uppercase tracking-[0.2em] text-sm flex-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98]" 
              disabled={saving}
            >
              {saving ? 'Transmitting Broadcast...' : (
                <>
                  <Send size={20} /> Publish Tactical Opening
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}