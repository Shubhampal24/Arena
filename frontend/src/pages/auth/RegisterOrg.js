import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, gamesAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ORG_TYPES = ['Esports Organization','Content Studio','Gaming Cafe Chain','Event Management Company','Esports Talent Agency','Game Publisher / Developer','Gaming Hardware Brand','Esports Tournament Organizer','Gaming Media / News','Streaming Platform','Gaming Academy / Training Center','University Esports Club'];

export default function RegisterOrg() {
  const [form, setForm] = useState({ email:'', password:'', orgName:'', orgType:'', description:'', state:'', city:'', foundedYear:'' });
  const [games, setGames]   = useState([]);
  const [states, setStates] = useState([]);
  const [selectedGames, setSelGames] = useState([]);
  const [loading, setLoad]  = useState(false);
  const { login } = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    gamesAPI.getAll().then(r => setGames(r.data.data));
    gamesAPI.getStates().then(r => setStates(r.data.data));
  }, []);

  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const toggleGame = (id) => setSelGames(prev => prev.includes(id) ? prev.filter(g=>g!==id) : [...prev, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const { data } = await authAPI.registerOrg({ ...form, activeGames: selectedGames });
      login(data);
      toast.success('Organization registered! 🏢');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally { setLoad(false); }
  };

  return (
    <div className="page flex-center" style={{minHeight:'100vh',padding:'40px 20px'}}>
      <div style={{width:'100%',maxWidth:560}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <Link to="/" style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:700,color:'var(--text-white)'}}>
            ARENA<span style={{color:'var(--saffron)'}}>X</span>
          </Link>
          <p style={{color:'var(--text-muted)',marginTop:6,fontSize:'0.85rem'}}>Register Your Organization</p>
        </div>

        <div className="card" style={{padding:'36px 32px',border:'1px solid rgba(0,229,255,0.2)'}}>
          <h3 style={{marginBottom:4,color:'var(--electric)'}}>🏢 Organization Account</h3>
          <p style={{color:'var(--text-muted)',fontSize:'0.875rem',marginBottom:28}}>Set up your org profile and start recruiting India's top gaming talent.</p>

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:20}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input className="input" type="email" placeholder="org@esports.gg" value={form.email} onChange={e=>set('email',e.target.value)} required />
              </div>
              <div className="input-group">
                <label className="input-label">Password *</label>
                <input className="input" type="password" placeholder="Min 8 chars" value={form.password} onChange={e=>set('password',e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Organization Name *</label>
              <input className="input" placeholder="e.g. S8UL, GodLike Esports" value={form.orgName} onChange={e=>set('orgName',e.target.value)} required />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group">
                <label className="input-label">Org Type *</label>
                <select className="input select" value={form.orgType} onChange={e=>set('orgType',e.target.value)} required>
                  <option value="">Select type</option>
                  {ORG_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Founded Year</label>
                <input className="input" type="number" placeholder="2020" min={2000} max={2025} value={form.foundedYear} onChange={e=>set('foundedYear',e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea className="input" rows={3} placeholder="About your organization..." value={form.description} onChange={e=>set('description',e.target.value)} style={{resize:'vertical'}} />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div className="input-group">
                <label className="input-label">State *</label>
                <select className="input select" value={form.state} onChange={e=>set('state',e.target.value)} required>
                  <option value="">Select State</option>
                  {states.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">City</label>
                <input className="input" placeholder="e.g. Mumbai" value={form.city} onChange={e=>set('city',e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Active Games (select all that apply)</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:6}}>
                {games.map(g=>(
                  <button type="button" key={g.id} onClick={()=>toggleGame(g.id)}
                    style={{padding:'6px 14px',borderRadius:100,border:'1px solid',fontSize:'0.8rem',fontFamily:'var(--font-display)',fontWeight:600,cursor:'pointer',transition:'all 0.2s',
                      borderColor: selectedGames.includes(g.id) ? 'var(--saffron)' : 'var(--border-dim)',
                      background:  selectedGames.includes(g.id) ? 'var(--saffron-glow)' : 'transparent',
                      color:       selectedGames.includes(g.id) ? 'var(--saffron)' : 'var(--text-muted)',
                    }}>
                    {g.shortName}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-electric btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Registering...' : '🏢 Register Organization →'}
            </button>
          </form>
        </div>

        <p style={{textAlign:'center',color:'var(--text-muted)',fontSize:'0.875rem',marginTop:20}}>
          Already registered? <Link to="/login" style={{color:'var(--saffron)'}}>Login</Link> | 
          Gamer? <Link to="/register" style={{color:'var(--saffron)'}}> Create Gamer Account</Link>
        </p>
      </div>
    </div>
  );
}