import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [jobs, setJobs]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoad]    = useState(true);
  const [games, setGames]     = useState([]);
  const [states, setStates]   = useState([]);
  const [page, setPage]       = useState(1);
  const [filters, setFilters] = useState({ game:'', state:'', workType:'', locationType:'', search:'' });
  const { isOrg } = useAuth();

  useEffect(() => {
    gamesAPI.getAll().then(r => setGames(r.data.data));
    gamesAPI.getStates().then(r => setStates(r.data.data));
  }, []);

  useEffect(() => { fetchJobs(); }, [filters, page]);

  const fetchJobs = async () => {
    setLoad(true);
    try {
      const { data } = await jobsAPI.getAll({ ...filters, page, limit: 20 });
      setJobs(data.data);
      setTotal(data.total);
    } catch {} finally { setLoad(false); }
  };

  const setF = (k,v) => { setFilters(p=>({...p,[k]:v})); setPage(1); };

  const workTypes    = ['Full-Time','Part-Time','Contract','Trial / Tryout','Internship'];
  const locationTypes= ['Bootcamp (Onsite)','Work From Home','Hybrid','Travel Required'];

  return (
    <div className="page" style={{paddingBottom:60}}>
      <div className="container">
        {/* Header */}
        <div style={{padding:'40px 0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{marginBottom:8}}>Gaming <span style={{color:'var(--saffron)'}}>Opportunities</span></h1>
            <p style={{color:'var(--text-secondary)'}}>
              {total} openings in India's gaming industry
            </p>
          </div>
          {isOrg && <Link to="/post-job" className="btn btn-primary">+ Post a Job</Link>}
        </div>

        {/* Filters */}
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:32,padding:'20px',background:'var(--bg-card)',borderRadius:12,border:'1px solid var(--border-dim)'}}>
          <input className="input" style={{flex:2,minWidth:200}} placeholder="🔍 Search by role, game, org..." value={filters.search} onChange={e=>setF('search',e.target.value)} />
          <select className="input select" style={{flex:1,minWidth:150}} value={filters.game} onChange={e=>setF('game',e.target.value)}>
            <option value="">All Games</option>
            {games.map(g=><option key={g.id} value={g.id}>{g.shortName}</option>)}
          </select>
          <select className="input select" style={{flex:1,minWidth:150}} value={filters.state} onChange={e=>setF('state',e.target.value)}>
            <option value="">All States</option>
            {states.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input select" style={{minWidth:160}} value={filters.workType} onChange={e=>setF('workType',e.target.value)}>
            <option value="">Work Type</option>
            {workTypes.map(w=><option key={w} value={w}>{w}</option>)}
          </select>
          <select className="input select" style={{minWidth:160}} value={filters.locationType} onChange={e=>setF('locationType',e.target.value)}>
            <option value="">Location</option>
            {locationTypes.map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          {Object.values(filters).some(v=>v) && (
            <button className="btn btn-ghost btn-sm" onClick={()=>{ setFilters({game:'',state:'',workType:'',locationType:'',search:''}); }}>Clear ✕</button>
          )}
        </div>

        {/* Job cards */}
        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:20}}>
            {[...Array(6)].map((_,i)=><div key={i} className="skeleton" style={{height:180,borderRadius:12}} />)}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 20px'}}>
            <div style={{fontSize:64,marginBottom:16}}>🔍</div>
            <h3 style={{color:'var(--text-secondary)'}}>No jobs found</h3>
            <p style={{color:'var(--text-muted)'}}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:20}}>
            {jobs.map(job=><JobCard key={job._id} job={job} />)}
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:40}}>
            {page > 1 && <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>p-1)}>← Prev</button>}
            <span style={{color:'var(--text-muted)',padding:'6px 16px'}}>Page {page} of {Math.ceil(total/20)}</span>
            {page < Math.ceil(total/20) && <button className="btn btn-primary btn-sm" onClick={()=>setPage(p=>p+1)}>Next →</button>}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }) {
  const typeColors = { 'Full-Time':'var(--saffron)', 'Part-Time':'var(--electric)', 'Contract':'var(--purple-light)', 'Trial / Tryout':'var(--india-green)', 'Internship':'#FFB347' };
  return (
    <Link to={"/jobs/"+job._id} style={{textDecoration:'none'}}>
      <div className="card card-glow" style={{padding:24,height:'100%',display:'flex',flexDirection:'column',gap:12}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
          {job.postedBy?.orgLogo ? (
            <img src={job.postedBy.orgLogo} alt={job.postedBy.orgName} style={{width:44,height:44,borderRadius:8,objectFit:'cover',border:'1px solid var(--border-dim)'}} />
          ) : (
            <div style={{width:44,height:44,borderRadius:8,background:'var(--bg-input)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,border:'1px solid var(--border-dim)'}}>🏢</div>
          )}
          <div style={{flex:1}}>
            <div style={{color:'var(--text-muted)',fontSize:'0.8rem',marginBottom:2}}>{job.postedBy?.orgName}</div>
            <h3 style={{fontSize:'1rem',lineHeight:1.3,color:'var(--text-white)'}}>{job.title}</h3>
          </div>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {job.gameName && <span className="badge badge-saffron">{job.gameName}</span>}
          {job.workType && <span style={{padding:'3px 10px',borderRadius:100,fontSize:'0.75rem',fontWeight:600,fontFamily:'var(--font-display)',background:'rgba(255,255,255,0.05)',color:typeColors[job.workType]||'var(--text-secondary)',border:'1px solid rgba(255,255,255,0.1)'}}>{job.workType}</span>}
          {job.locationType && <span className="badge badge-electric">{job.locationType}</span>}
        </div>

        <p style={{color:'var(--text-muted)',fontSize:'0.875rem',lineHeight:1.5,flex:1,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
          {job.description}
        </p>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:4}}>
          <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>
            📍 {job.location?.state || 'India'} · 👤 {job.applicantCount || 0} applied
          </div>
          <div style={{color:'var(--saffron)',fontSize:'0.8rem',fontFamily:'var(--font-display)',fontWeight:600}}>
            Apply →
          </div>
        </div>
      </div>
    </Link>
  );
}