import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Link2, Gamepad2, Save, ExternalLink, MapPin, Search,
  ShieldCheck, Globe, Zap, MessageSquare, Youtube, Instagram, 
  Twitter, Twitch, Settings, CheckCircle2, AlertCircle
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('basic');
  const [games, setGames] = useState([]);
  const [states, setStates] = useState([]);
  const [roles, setRoles] = useState({});
  const [saving, setSave] = useState(false);
  const [form, setForm] = useState({ displayName: '', bio: '', tagline: '', state: '', city: '', primaryRole: '', openToWork: false, availability: '', social: { youtube: '', instagram: '', twitter: '', discord: '', twitch: '', website: '' } });

  useEffect(() => {
    if (user) setForm({ 
      displayName: user.displayName || '', 
      bio: user.bio || '', 
      tagline: user.tagline || '', 
      state: user.state || '', 
      city: user.city || '', 
      primaryRole: user.primaryRole || '', 
      openToWork: user.openToWork || false, 
      availability: user.availability || '', 
      social: user.social || { youtube: '', instagram: '', twitter: '', discord: '', twitch: '', website: '' } 
    });
    gamesAPI.getAll().then(r => setGames(r.data.data)).catch(() => {});
    gamesAPI.getStates().then(r => setStates(r.data.data)).catch(() => {});
    gamesAPI.getRoles().then(r => setRoles(r.data.data)).catch(() => {});
  }, [user]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (k, v) => setForm(p => ({ ...p, social: { ...p.social, [k]: v } }));

  const save = async () => {
    setSave(true);
    try {
      const { data } = await usersAPI.updateProfile(form);
      updateUser(data.data);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile.'); }
    finally { setSave(false); }
  };

  const score = user?.profileScore || 0;
  const scoreColor = score >= 80 ? 'var(--primary)' : score >= 50 ? 'var(--primary-glow)' : '#f59e0b';

  const menuItems = [
    { id: 'basic', label: 'General Info', icon: <User size={18}/> },
    { id: 'gaming', label: 'Career Profile', icon: <Gamepad2 size={18}/> },
    { id: 'social', label: 'Connections', icon: <Link2 size={18}/> },
  ];

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1000 }}>

        {/* Settings Header */}
        <div className="flex-between wrap gap-6 mb-10">
          <div>
            <h1 className="h1 flex items-center gap-3">
              <Settings className="text-primary" /> Profile <span className="text-gradient">Settings</span>
            </h1>
            <p className="text-secondary mt-1">Configure your professional identity and public presence.</p>
          </div>
          
          <div className="glass-surface p-4 rounded-2xl border-indigo-500/10 min-w-[280px]">
            <div className="flex-between mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Profile Authority</span>
              <span className="text-xs font-bold" style={{ color: scoreColor }}>{score}% Strong</span>
            </div>
            <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }} 
                animate={{ width: `${score}%` }} 
                style={{ backgroundColor: scoreColor }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Vertical Navigation */}
          <aside className="md:col-span-1 space-y-6">
            <nav className="flex flex-col gap-1">
              {menuItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${tab === item.id ? 'bg-primary text-white shadow-primary' : 'text-secondary hover:bg-white/5'}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            <div className="pt-6 border-t border-white/5 hide-mobile">
              <button 
                className="btn btn-primary btn-full mb-3" 
                onClick={save} 
                disabled={saving}
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link to={`/u/${user?.username}`} className="btn btn-secondary btn-full">
                <ExternalLink size={18} /> View Public
              </Link>
            </div>
          </aside>

          {/* Form Content Area */}
          <main className="md:col-span-3">
            <motion.div 
              className="glass-surface p-8 rounded-3xl"
              key={tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AnimatePresence mode="wait">
                {tab === 'basic' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <User size={22} className="text-primary" /> Identity & Bio
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="form-group">
                        <label className="form-label">Professional Name <span className="text-danger">*</span></label>
                        <input className="input" value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="How you want to be seen" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tagline / Headline</label>
                        <input className="input" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. Professional IGL @ Team Liquid" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Career Biography</label>
                        <textarea className="input min-h-[160px]" value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Describe your experience, achievements, and professional journey..." />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                          <label className="form-label">Location (State)</label>
                          <select className="input" value={form.state} onChange={e => set('state', e.target.value)}>
                            <option value="">Select State</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input className="input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Mumbai" />
                        </div>
                      </div>

                      <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex-between items-center">
                        <div>
                          <h4 className="font-bold text-white flex items-center gap-2">
                            <Zap size={16} className="text-primary" /> Availability Status
                          </h4>
                          <p className="text-xs text-secondary mt-1">Appear in recruitment searches for organizations.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={form.openToWork} onChange={e => set('openToWork', e.target.checked)} />
                          <div className="w-11 h-6 bg-void rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === 'gaming' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Gamepad2 size={22} className="text-primary" /> Career Path
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="form-group">
                        <label className="form-label">Primary Professional Role</label>
                        <select className="input" value={form.primaryRole} onChange={e => set('primaryRole', e.target.value)}>
                          <option value="">Choose your specialization</option>
                          {Object.entries(roles).map(([cat, roleList]) => (
                            <optgroup key={cat} label={cat}>
                              {roleList.map(r => <option key={r} value={r}>{r}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Working Preference</label>
                        <select className="input" value={form.availability} onChange={e => set('availability', e.target.value)}>
                          <option value="">Select work mode</option>
                          {['Full-Time', 'Part-Time', 'Contract', 'Consultation', 'Bootcamp Only'].map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>

                      <div className="p-5 bg-void rounded-2xl border flex gap-4">
                        <AlertCircle size={24} className="text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-white">Advanced Game Metrics</p>
                          <p className="text-xs text-secondary mt-1 leading-relaxed">
                            To update game-specific stats, ranks, and in-game achievements, please visit your public profile page and use the "Add Discipline" feature.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === 'social' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Globe size={22} className="text-primary" /> Digital Footprint
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { k: 'youtube', l: 'YouTube', icon: <Youtube size={16}/> },
                        { k: 'twitch', l: 'Twitch', icon: <Twitch size={16}/> },
                        { k: 'twitter', l: 'X (Twitter)', icon: <Twitter size={16}/> },
                        { k: 'instagram', l: 'Instagram', icon: <Instagram size={16}/> },
                        { k: 'discord', l: 'Discord ID', icon: <MessageSquare size={16}/> },
                        { k: 'website', l: 'Portfolio', icon: <Globe size={16}/> }
                      ].map(({ k, l, icon }) => (
                        <div className="form-group" key={k}>
                          <label className="form-label flex items-center gap-2">{icon} {l}</label>
                          <input 
                            className="input" 
                            type="text" 
                            placeholder={k === 'discord' ? 'username#0000' : 'https://...'} 
                            value={form.social[k] || ''} 
                            onChange={e => setSocial(k, e.target.value)} 
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Sticky/Bottom Mobile Actions */}
            <div className="mt-8 flex gap-3 md:hidden">
              <button className="btn btn-primary btn-lg flex-1" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
              <Link to={`/u/${user?.username}`} className="btn btn-secondary btn-lg p-4">
                <ExternalLink size={20} />
              </Link>
            </div>
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}