import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orgsAPI, jobsAPI } from '../utils/api';

export default function OrgProfile() {
  const { slug } = useParams();
  const [org, setOrg]     = useState(null);
  const [jobs, setJobs]   = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    orgsAPI.getBySlug(slug).then(r=>{
      setOrg(r.data.data);
      setLoad(false);
      return jobsAPI.getAll({'postedBy.orgId':r.data.data._id,isActive:true,limit:6});
    }).then(r=>{if(r)setJobs(r.data.data);}).catch(()=>setLoad(false));
  }, [slug]);

  if (loading) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Loading...</div></div>;
  if (!org) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Organization not found.</div></div>;

  return (
    <div className="page" style={{paddingBottom:80}}>
      <div style={{height:220,background:'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(123,47,190,0.08))',borderBottom:'1px solid var(--border-dim)'}} />
      <div className="container" style={{maxWidth:900}}>
        <div style={{position:'relative',marginTop:-70,marginBottom:32,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:16}}>
          <div style={{display:'flex',gap:20,alignItems:'flex-end'}}>
            <div style={{width:120,height:120,borderRadius:20,background:'linear-gradient(135deg,rgba(0,229,255,0.15),rgba(123,47,190,0.15))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',border:'3px solid var(--electric)',boxShadow:'var(--shadow-electric)',flexShrink:0}}>🏢</div>
            <div style={{paddingBottom:8}}>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <h2 style={{color:'var(--text-white)'}}>{org.orgName}</h2>
                {org.isVerifiedOrg && <span className="badge badge-electric">✓ Verified</span>}
              </div>
              <div style={{color:'var(--electric)',fontFamily:'var(--font-display)',fontWeight:600}}>{org.orgType}</div>
              <div style={{color:'var(--text-muted)',fontSize:'0.85rem',marginTop:4}}>📍 {org.city && org.city+', '}{org.state} {org.foundedYear && '· Est. '+org.foundedYear}</div>
            </div>
          </div>
          <button className="btn btn-electric">+ Follow</button>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:24}}>
          <div>
            {org.description && (
              <div className="card" style={{padding:24,marginBottom:20}}>
                <h3 style={{marginBottom:12}}>About</h3>
                <p style={{color:'var(--text-secondary)',lineHeight:1.7}}>{org.description}</p>
              </div>
            )}
            {org.achievements?.length > 0 && (
              <div className="card" style={{padding:24,marginBottom:20}}>
                <h3 style={{marginBottom:16}}>🏆 Achievements</h3>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {org.achievements.map(a=>(
                    <div key={a._id} style={{display:'flex',gap:12,padding:'12px 16px',background:'var(--bg-input)',borderRadius:10,border:'1px solid rgba(0,229,255,0.1)'}}>
                      <div style={{fontSize:24}}>🥇</div>
                      <div>
                        <div style={{color:'var(--text-white)',fontWeight:600}}>{a.title}</div>
                        <div style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{a.tournament} {a.year && '· '+a.year} {a.placement && '· '+a.placement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {jobs.length > 0 && (
              <div className="card" style={{padding:24}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                  <h3>Open Positions</h3>
                  <Link to="/jobs" style={{color:'var(--saffron)',fontSize:'0.875rem'}}>View All →</Link>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {jobs.map(j=>(
                    <Link key={j._id} to={"/jobs/"+j._id} style={{textDecoration:'none',display:'flex',justifyContent:'space-between',padding:'12px 16px',background:'var(--bg-input)',borderRadius:8,border:'1px solid var(--border-dim)'}}>
                      <div>
                        <div style={{color:'var(--text-primary)',fontWeight:600}}>{j.title}</div>
                        <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{j.gameName} · {j.workType}</div>
                      </div>
                      <span style={{color:'var(--saffron)',fontSize:'0.875rem'}}>Apply →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{padding:20,marginBottom:16}}>
              <h4 style={{marginBottom:12,color:'var(--text-secondary)'}}>ACTIVE GAMES</h4>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {org.activeGames?.map(g=><span key={g} className="badge badge-saffron">{g.toUpperCase()}</span>)}
              </div>
            </div>
            <div className="card" style={{padding:20}}>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[['💼 Open Jobs',org.activeJobs||0],['👥 Followers',org.followersCount||0],['👁️ Profile Views',org.profileViews||0]].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'var(--text-muted)',fontSize:'0.875rem'}}>{l}</span>
                    <span style={{color:'var(--text-primary)',fontWeight:600,fontFamily:'var(--font-display)'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}