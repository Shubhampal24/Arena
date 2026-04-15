import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [data, setData]   = useState(null);
  const [load, setLoad]   = useState(true);
  const { user }          = useAuth();

  useEffect(() => {
    dashboardAPI.get().then(r => { setData(r.data.data); setLoad(false); }).catch(()=>setLoad(false));
  }, []);

  if (load) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Loading dashboard...</div></div>;

  const score = data?.profileScore || user?.profileScore || 0;

  return (
    <div className="page" style={{paddingBottom:60}}>
      <div className="container">
        <div style={{paddingTop:40,paddingBottom:32}}>
          <h1>Welcome back, <span style={{color:'var(--saffron)'}}>{user?.displayName?.split(' ')[0]}</span> 👋</h1>
          <p style={{color:'var(--text-secondary)',marginTop:8}}>Here's your gaming career dashboard.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:20,marginBottom:32}}>
          {[
            {label:'Profile Score', value:score+'%', icon:'📊', sub:'Complete profile to rank higher', color:'var(--saffron)'},
            {label:'Applications',  value:data?.applications?.length||0, icon:'📋', sub:'Jobs applied to', color:'var(--electric)'},
            {label:'Posts',         value:data?.recentPosts?.length||0, icon:'📣', sub:'Community posts', color:'var(--purple-light)'},
            {label:'Profile Views', value:user?.profileViews||0, icon:'👁️', sub:'This week', color:'var(--india-green)'},
          ].map(s=>(
            <div key={s.label} className="card" style={{padding:24}}>
              <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:700,color:s.color}}>{s.value}</div>
              <div style={{color:'var(--text-primary)',fontWeight:600,marginTop:4}}>{s.label}</div>
              <div style={{color:'var(--text-muted)',fontSize:'0.8rem',marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Profile score bar */}
        <div className="card" style={{padding:28,marginBottom:24}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
            <h3>Profile Completion</h3>
            <span style={{color:'var(--saffron)',fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.2rem'}}>{score}%</span>
          </div>
          <div className="progress-bar" style={{height:10}}>
            <div className="progress-bar-fill" style={{width:score+'%'}} />
          </div>
          <div style={{display:'flex',gap:12,marginTop:16,flexWrap:'wrap'}}>
            {score < 100 && <Link to="/profile/edit" className="btn btn-primary btn-sm">Complete Profile →</Link>}
            <Link to={"/u/"+user?.username} className="btn btn-ghost btn-sm">View Public Profile</Link>
          </div>
        </div>

        {/* Recent applications */}
        {data?.applications?.length > 0 && (
          <div className="card" style={{padding:28,marginBottom:24}}>
            <h3 style={{marginBottom:16}}>Recent Applications</h3>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {data.applications.map(app=>(
                <div key={app._id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'var(--bg-input)',borderRadius:8}}>
                  <div>
                    <div style={{color:'var(--text-primary)',fontWeight:600,fontSize:'0.95rem'}}>{app.jobId?.title}</div>
                    <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{app.jobId?.postedBy?.orgName}</div>
                  </div>
                  <span style={{
                    padding:'4px 12px',borderRadius:100,fontSize:'0.75rem',fontWeight:600,fontFamily:'var(--font-display)',
                    background: app.status==='shortlisted' ? 'rgba(19,136,8,0.15)' : app.status==='rejected' ? 'rgba(255,68,68,0.15)' : 'rgba(255,107,0,0.1)',
                    color: app.status==='shortlisted' ? 'var(--india-green)' : app.status==='rejected' ? '#FF4444' : 'var(--saffron)',
                  }}>{app.status.replace('_',' ').toUpperCase()}</span>
                </div>
              ))}
            </div>
            <Link to="/jobs" className="btn btn-ghost btn-sm" style={{marginTop:16}}>Browse More Jobs →</Link>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
          {[
            {label:'Browse Jobs',      icon:'💼', to:'/jobs'},
            {label:'Edit Profile',     icon:'✏️', to:'/profile/edit'},
            {label:'Community Feed',   icon:'📣', to:'/feed'},
            {label:'Discover Talent',  icon:'🔍', to:'/discover'},
          ].map(a=>(
            <Link key={a.label} to={a.to} className="card" style={{padding:20,textAlign:'center',textDecoration:'none'}}>
              <div style={{fontSize:32,marginBottom:8}}>{a.icon}</div>
              <div style={{color:'var(--text-primary)',fontWeight:600,fontFamily:'var(--font-display)'}}>{a.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}