import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, gamesAPI, uploadAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]   = useState('basic');
  const [games, setGames] = useState([]);
  const [states, setStates] = useState([]);
  const [roles, setRoles]   = useState({});
  const [saving, setSave]   = useState(false);
  const [form, setForm] = useState({ displayName:'', bio:'', tagline:'', state:'', city:'', primaryRole:'', openToWork:false, availability:'', social:{ youtube:'',instagram:'',twitter:'',discord:'',twitch:'',website:'' } });

  useEffect(() => {
    if (user) setForm({ displayName:user.displayName||'', bio:user.bio||'', tagline:user.tagline||'', state:user.state||'', city:user.city||'', primaryRole:user.primaryRole||'', openToWork:user.openToWork||false, availability:user.availability||'', social: user.social||{ youtube:'',instagram:'',twitter:'',discord:'',twitch:'',website:'' } });
    gamesAPI.getAll().then(r=>setGames(r.data.data));
    gamesAPI.getStates().then(r=>setStates(r.data.data));
    gamesAPI.getRoles().then(r=>setRoles(r.data.data));
  }, [user]);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const setSocial = (k,v) => setForm(p=>({...p,social:{...p.social,[k]:v}}));

  const save = async () => {
    setSave(true);
    try {
      const { data } = await usersAPI.updateProfile(form);
      updateUser(data.data);
      toast.success('Profile updated! 🎮');
    } catch { toast.error('Save failed.'); }
    finally { setSave(false); }
  };

  const score = user?.profileScore || 0;

  return (
    <div className="page" style={{paddingBottom:80}}>
      <div className="container" style={{maxWidth:800}}>
        <div style={{paddingTop:40,paddingBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{marginBottom:4}}>Edit Profile</h1>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>Profile Score:</div>
              <div style={{display:'flex',alignItems:'center',gap:8,flex:1,maxWidth:200}}>
                <div className="progress-bar" style={{flex:1,height:8}}>
                  <div className="progress-bar-fill" style={{width:score+'%'}} />
                </div>
                <span style={{color:'var(--saffron)',fontWeight:700,fontFamily:'var(--font-display)'}}>{score}%</span>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:28,background:'var(--bg-card)',padding:4,borderRadius:10,border:'1px solid var(--border-dim)'}}>
          {[['basic','👤 Basic'],['social','🔗 Social'],['gaming','🎮 Gaming']].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:'10px',borderRadius:8,border:'none',cursor:'pointer',fontFamily:'var(--font-display)',fontWeight:600,fontSize:'0.875rem',transition:'all 0.2s',background:tab===k?'var(--saffron)':'transparent',color:tab===k?'white':'var(--text-secondary)'}}>
              {l}
            </button>
          ))}
        </div>

        <div className="card" style={{padding:32,border:'1px solid var(--border)'}}>
          {tab === 'basic' && (
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div className="input-group"><label className="input-label">Display Name *</label><input className="input" value={form.displayName} onChange={e=>set('displayName',e.target.value)} placeholder="Your name / alias" /></div>
              <div className="input-group"><label className="input-label">Tagline</label><input className="input" value={form.tagline} onChange={e=>set('tagline',e.target.value)} placeholder="India's #1 BGMI IGL | 4x Conqueror" /></div>
              <div className="input-group"><label className="input-label">Bio</label><textarea className="input" rows={4} value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Tell your story..." style={{resize:'vertical'}} /></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="input-group"><label className="input-label">State *</label>
                  <select className="input select" value={form.state} onChange={e=>set('state',e.target.value)}>
                    <option value="">Select State</option>
                    {states.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="input-group"><label className="input-label">City</label><input className="input" value={form.city} onChange={e=>set('city',e.target.value)} placeholder="e.g. Pune" /></div>
              </div>
              <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer',padding:'16px',background:'var(--bg-input)',borderRadius:10,border:'1px solid var(--border-dim)'}}>
                <input type="checkbox" checked={form.openToWork} onChange={e=>set('openToWork',e.target.checked)} style={{width:18,height:18,accentColor:'var(--saffron)'}} />
                <div>
                  <div style={{color:'var(--text-primary)',fontWeight:600}}>Open to Work / Opportunities</div>
                  <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Organizations can see you're available for hire</div>
                </div>
              </label>
            </div>
          )}

          {tab === 'social' && (
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <p style={{color:'var(--text-secondary)',marginBottom:8}}>Add your social links to increase profile score and discoverability.</p>
              {[['youtube','🎬 YouTube','https://youtube.com/@yourchannel'],['instagram','📸 Instagram','https://instagram.com/yourhandle'],['twitter','🐦 Twitter / X','https://twitter.com/yourhandle'],['twitch','📺 Twitch','https://twitch.tv/yourchannel'],['discord','💬 Discord','yourDiscordUsername#0000'],['website','🌐 Website','https://yoursite.com']].map(([k,l,ph])=>(
                <div className="input-group" key={k}><label className="input-label">{l}</label><input className="input" type={k==='discord'?'text':'url'} placeholder={ph} value={form.social[k]||''} onChange={e=>setSocial(k,e.target.value)} /></div>
              ))}
            </div>
          )}

          {tab === 'gaming' && (
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div className="input-group">
                <label className="input-label">Primary Role *</label>
                <select className="input select" value={form.primaryRole} onChange={e=>set('primaryRole',e.target.value)}>
                  <option value="">Select your main role</option>
                  {Object.entries(roles).map(([cat,roleList])=>(
                    <optgroup key={cat} label={cat}>{roleList.map(r=><option key={r} value={r}>{r}</option>)}</optgroup>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Availability</label>
                <select className="input select" value={form.availability} onChange={e=>set('availability',e.target.value)}>
                  <option value="">Select availability</option>
                  {['Full-Time','Part-Time','Bootcamp','WFH Only','Tournament Only'].map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div style={{background:'var(--bg-input)',borderRadius:10,padding:16,border:'1px solid rgba(0,229,255,0.15)'}}>
                <p style={{color:'var(--electric)',fontSize:'0.875rem',marginBottom:8}}>🎮 Game Profiles</p>
                <p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>Detailed game profiles (rank tiers, stats, match history) can be added from your main profile page after saving basic info.</p>
              </div>
            </div>
          )}
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:24}}>
          <button className="btn btn-ghost" onClick={()=>navigate('/u/'+(user?.username))}>View Profile</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Saving...':'Save All Changes'}</button>
        </div>
      </div>
    </div>
  );
}