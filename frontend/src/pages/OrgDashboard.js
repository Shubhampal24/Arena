import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function OrgDashboard() {
  const [data, setData] = useState(null);
  const [load, setLoad] = useState(true);
  const { org }         = useAuth();

  useEffect(() => {
    dashboardAPI.get().then(r=>{setData(r.data.data);setLoad(false);}).catch(()=>setLoad(false));
  }, []);

  if (load) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Loading...</div></div>;

  return (
    <div className="page" style={{paddingBottom:60}}>
      <div className="container">
        <div style={{paddingTop:40,paddingBottom:32,display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{marginBottom:8}}>Org Dashboard — <span style={{color:'var(--electric)'}}>{org?.orgName}</span></h1>
            <p style={{color:'var(--text-secondary)'}}>Manage your roster, jobs, and applications.</p>
          </div>
          <Link to="/post-job" className="btn btn-primary">+ Post New Job</Link>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:20,marginBottom:32}}>
          {[
            {label:'Active Jobs',         value:org?.activeJobs||0,   icon:'💼', color:'var(--saffron)'},
            {label:'Total Jobs Posted',   value:org?.totalJobs||0,    icon:'📋', color:'var(--electric)'},
            {label:'Pending Reviews',     value:data?.pendingApplications?.length||0, icon:'👥', color:'var(--purple-light)'},
            {label:'Profile Views',       value:org?.profileViews||0, icon:'👁️', color:'var(--india-green)'},
          ].map(s=>(
            <div key={s.label} className="card" style={{padding:24}}>
              <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:700,color:s.color}}>{s.value}</div>
              <div style={{color:'var(--text-primary)',fontWeight:600,marginTop:4,fontSize:'0.9rem'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {data?.pendingApplications?.length > 0 && (
          <div className="card" style={{padding:28,marginBottom:24}}>
            <h3 style={{marginBottom:16}}>🔔 New Applications</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {data.pendingApplications.map(app=>(
                <div key={app._id} style={{display:'flex',gap:12,alignItems:'center',padding:'12px 16px',background:'var(--bg-input)',borderRadius:8}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'var(--saffron-glow)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:700,color:'var(--saffron)',border:'1px solid rgba(255,107,0,0.3)'}}>
                    {app.userId?.displayName?.[0]||'?'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{color:'var(--text-primary)',fontWeight:600}}>{app.userId?.displayName}</div>
                    <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{app.userId?.primaryRole} · For: {app.jobId?.title}</div>
                  </div>
                  <span className="badge badge-saffron">New</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.recentJobs?.length > 0 && (
          <div className="card" style={{padding:28}}>
            <h3 style={{marginBottom:16}}>Recent Job Posts</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {data.recentJobs.map(job=>(
                <div key={job._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'var(--bg-input)',borderRadius:8}}>
                  <div>
                    <div style={{color:'var(--text-primary)',fontWeight:600}}>{job.title}</div>
                    <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>👤 {job.applicantCount||0} applicants · 👁️ {job.views||0} views</div>
                  </div>
                  <span style={{color:job.isActive?'var(--india-green)':'var(--text-muted)',fontSize:'0.8rem',fontWeight:600}}>
                    {job.isActive ? '● ACTIVE' : '○ CLOSED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}