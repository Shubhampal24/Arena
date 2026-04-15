import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usersAPI, orgsAPI, gamesAPI, searchAPI } from '../utils/api';

export default function Discover() {
  const [params]         = useSearchParams();
  const [tab, setTab]    = useState('gamers');
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs]  = useState([]);
  const [loading, setLoad] = useState(true);
  const [games, setGames] = useState([]);
  const [states, setStates] = useState([]);
  const [filters, setFilters] = useState({ game:'', state:'', role:'', openToWork:'' });

  const q = params.get('q');

  useEffect(() => {
    gamesAPI.getAll().then(r=>setGames(r.data.data));
    gamesAPI.getStates().then(r=>setStates(r.data.data));
  }, []);

  useEffect(() => { fetch(); }, [filters, tab, q]);

  const fetch = async () => {
    setLoad(true);
    try {
      if (q) {
        const { data } = await searchAPI.search(q);
        setUsers(data.data.users||[]);
        setOrgs(data.data.organizations||[]);
      } else if (tab === 'gamers') {
        const { data } = await usersAPI.getAll({ ...filters, limit:24 });
        setUsers(data.data);
      } else {
        const { data } = await orgsAPI.getAll({ game: filters.game, state: filters.state, limit:24 });
        setOrgs(data.data);
      }
    } catch {} finally { setLoad(false); }
  };

  const setF = (k,v) => setFilters(p=>({...p,[k]:v}));

  return (
    <div className="page" style={{paddingBottom:60}}>
      <div className="container">
        <div style={{paddingTop:40,paddingBottom:24}}>
          <h1>Discover <span style={{color:'var(--saffron)'}}>Talent & Orgs</span></h1>
          {q && <p style={{color:'var(--text-secondary)',marginTop:8}}>Results for: "<b>{q}</b>"</p>}
        </div>

        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {['gamers','organizations'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className="btn" style={{
              background: tab===t ? 'var(--saffron)' : 'var(--bg-card)',
              color: tab===t ? 'white' : 'var(--text-secondary)',
              border: tab===t ? 'none' : '1px solid var(--border-dim)',
            }}>{t==='gamers'?'🎮 Gamers & Creators':'🏢 Organizations'}</button>
          ))}
        </div>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:28}}>
          <select className="input select" style={{minWidth:150}} value={filters.game} onChange={e=>setF('game',e.target.value)}>
            <option value="">All Games</option>
            {games.map(g=><option key={g.id} value={g.id}>{g.shortName}</option>)}
          </select>
          <select className="input select" style={{minWidth:150}} value={filters.state} onChange={e=>setF('state',e.target.value)}>
            <option value="">All States</option>
            {states.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          {tab==='gamers' && (
            <>
              <input className="input" style={{minWidth:160}} placeholder="Role (e.g. IGL)" value={filters.role} onChange={e=>setF('role',e.target.value)} />
              <label style={{display:'flex',alignItems:'center',gap:8,color:'var(--text-secondary)',cursor:'pointer',padding:'0 8px'}}>
                <input type="checkbox" checked={!!filters.openToWork} onChange={e=>setF('openToWork',e.target.checked?'true':'')} />
                Open to Work
              </label>
            </>
          )}
        </div>

        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
            {[...Array(8)].map((_,i)=><div key={i} className="skeleton" style={{height:200,borderRadius:12}} />)}
          </div>
        ) : tab==='gamers' ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
            {users.map(u=>(
              <Link key={u._id} to={"/u/"+u.username} style={{textDecoration:'none'}}>
                <div className="card card-glow" style={{padding:24,textAlign:'center'}}>
                  <div style={{width:64,height:64,borderRadius:'50%',margin:'0 auto 12px',background:'linear-gradient(135deg,var(--saffron-dark),var(--saffron))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',fontWeight:700,color:'white',border:'2px solid rgba(255,107,0,0.3)'}}>
                    {u.displayName?.[0]?.toUpperCase()||'G'}
                  </div>
                  <div style={{color:'var(--text-white)',fontWeight:700,marginBottom:4}}>{u.displayName}</div>
                  <div style={{color:'var(--saffron)',fontSize:'0.8rem',fontFamily:'var(--font-display)',marginBottom:8}}>{u.primaryRole}</div>
                  {u.openToWork && <span className="badge badge-green" style={{marginBottom:8}}>Open to Work</span>}
                  <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>📍 {u.state}</div>
                  <div style={{marginTop:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>Profile</span>
                      <span style={{color:'var(--saffron)',fontSize:'0.75rem'}}>{u.profileScore}%</span>
                    </div>
                    <div className="progress-bar" style={{height:4}}>
                      <div className="progress-bar-fill" style={{width:u.profileScore+'%'}} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
            {orgs.map(o=>(
              <Link key={o._id} to={"/org/"+o.slug} style={{textDecoration:'none'}}>
                <div className="card card-glow" style={{padding:24}}>
                  <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
                    <div style={{width:48,height:48,borderRadius:10,background:'var(--bg-input)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🏢</div>
                    <div>
                      <div style={{color:'var(--text-white)',fontWeight:700}}>{o.orgName}</div>
                      {o.isVerifiedOrg && <span className="badge badge-electric" style={{fontSize:'0.65rem'}}>✓ Verified</span>}
                    </div>
                  </div>
                  <div style={{color:'var(--text-muted)',fontSize:'0.8rem',marginBottom:8}}>{o.orgType}</div>
                  <div style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>📍 {o.state} · 👥 {o.followersCount||0} followers</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}