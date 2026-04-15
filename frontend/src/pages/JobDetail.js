import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob]   = useState(null);
  const [load, setLoad] = useState(true);
  const { isUser, isAuthenticated } = useAuth();

  useEffect(() => {
    jobsAPI.getById(id).then(r => { setJob(r.data.data); setLoad(false); }).catch(()=>setLoad(false));
  }, [id]);

  if (load) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Loading...</div></div>;
  if (!job) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Job not found.</div></div>;

  return (
    <div className="page" style={{paddingBottom:80}}>
      <div className="container" style={{maxWidth:900}}>
        <div style={{paddingTop:40,paddingBottom:24}}>
          <Link to="/jobs" style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>← Back to Jobs</Link>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:32,alignItems:'start'}}>
          {/* Main */}
          <div>
            <div className="card" style={{padding:36,marginBottom:24}}>
              <div style={{display:'flex',gap:16,marginBottom:24}}>
                <div style={{width:64,height:64,borderRadius:12,background:'var(--bg-input)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,border:'1px solid var(--border-dim)'}}>🏢</div>
                <div>
                  <h1 style={{fontSize:'1.6rem',marginBottom:6}}>{job.title}</h1>
                  <div style={{color:'var(--text-secondary)',fontSize:'0.95rem'}}>{job.postedBy?.orgName}</div>
                </div>
              </div>

              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:24}}>
                {job.gameName       && <span className="badge badge-saffron">🎮 {job.gameName}</span>}
                {job.workType       && <span className="badge badge-electric">{job.workType}</span>}
                {job.locationType   && <span className="badge badge-green">{job.locationType}</span>}
                {job.language       && <span className="badge badge-purple">🗣️ {job.language}</span>}
              </div>

              <div className="divider" />
              <h3 style={{marginBottom:12}}>About this Role</h3>
              <p style={{color:'var(--text-secondary)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{job.description}</p>

              {job.mustHaves?.length > 0 && <>
                <div className="divider" />
                <h3 style={{marginBottom:12}}>Must Have</h3>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:8}}>
                  {job.mustHaves.map((m,i)=><li key={i} style={{color:'var(--text-secondary)',display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'var(--saffron)'}}>✓</span>{m}</li>)}
                </ul>
              </>}

              {job.niceToHaves?.length > 0 && <>
                <div className="divider" />
                <h3 style={{marginBottom:12}}>Nice to Have</h3>
                <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:8}}>
                  {job.niceToHaves.map((m,i)=><li key={i} style={{color:'var(--text-muted)',display:'flex',gap:8,alignItems:'flex-start'}}><span style={{color:'var(--electric)'}}>+</span>{m}</li>)}
                </ul>
              </>}

              {job.deviceRequirements?.requiredDevice && <>
                <div className="divider" />
                <h3 style={{marginBottom:12}}>Device Requirements</h3>
                <div style={{background:'var(--bg-input)',borderRadius:10,padding:16,border:'1px solid var(--border-dim)'}}>
                  {Object.entries(job.deviceRequirements).filter(([k,v])=>v && k!=='customNote').map(([k,v])=>(
                    <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border-dim)'}}>
                      <span style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>{k.replace(/([A-Z])/g,' $1').trim()}</span>
                      <span style={{color:'var(--text-primary)',fontSize:'0.875rem'}}>{Array.isArray(v)?v.join(', '):v}</span>
                    </div>
                  ))}
                </div>
              </>}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{position:'sticky',top:80}}>
            <div className="card" style={{padding:28,marginBottom:16,border:'1px solid var(--border)'}}>
              {isUser ? (
                <Link to={"/jobs/"+id+"/apply"} className="btn btn-primary btn-full btn-lg" style={{marginBottom:12}}>
                  Apply Now →
                </Link>
              ) : !isAuthenticated ? (
                <Link to="/login" className="btn btn-primary btn-full btn-lg" style={{marginBottom:12}}>
                  Login to Apply
                </Link>
              ) : null}

              <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:16}}>
                {[
                  ['💼 Work Type',  job.workType],
                  ['📍 Location',   job.locationType],
                  ['🏙️ State',      job.location?.state],
                  ['🎮 Game',       job.gameName],
                  ['🏅 Min Tier',   job.minTier],
                  ['📅 Deadline',   job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN') : null],
                  ['👥 Openings',   job.openSlots ? job.openSlots+' slot(s)' : null],
                  ['💰 Salary',     job.salary?.type],
                ].filter(([,v])=>v).map(([label,value])=>(
                  <div key={label} style={{display:'flex',justifyContent:'space-between',gap:12}}>
                    <span style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{label}</span>
                    <span style={{color:'var(--text-primary)',fontSize:'0.85rem',fontWeight:500,textAlign:'right'}}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{color:'var(--text-muted)',fontSize:'0.8rem',textAlign:'center'}}>
              👁️ {job.views} views · 👤 {job.applicantCount} applicants
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}