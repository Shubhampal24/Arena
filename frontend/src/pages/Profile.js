import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoad]    = useState(true);
  const { user: me }          = useAuth();

  useEffect(() => {
    usersAPI.getByUsername(username)
      .then(r=>{setProfile(r.data.data);setLoad(false);})
      .catch(()=>setLoad(false));
  }, [username]);

  if (loading) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Loading profile...</div></div>;
  if (!profile) return <div className="page flex-center" style={{height:'60vh'}}><div style={{color:'var(--text-muted)'}}>Profile not found.</div></div>;

  const isOwn = me?.username === username;
  const social = profile.social || {};

  return (
    <div className="page" style={{paddingBottom:80}}>
      {/* Banner */}
      <div style={{height:200,background:'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(0,229,255,0.08), rgba(123,47,190,0.1))',borderBottom:'1px solid var(--border-dim)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,107,0,0.03) 1px, transparent 1px),linear-gradient(90deg,rgba(255,107,0,0.03) 1px, transparent 1px)',backgroundSize:'40px 40px'}} />
      </div>

      <div className="container" style={{maxWidth:900}}>
        <div style={{position:'relative',marginTop:-60,marginBottom:32,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:16}}>
          <div style={{display:'flex',gap:20,alignItems:'flex-end'}}>
            <div style={{width:120,height:120,borderRadius:'50%',background:'linear-gradient(135deg,var(--saffron-dark),var(--saffron))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem',fontWeight:700,color:'white',border:'4px solid var(--bg-void)',boxShadow:'var(--shadow-saffron)',flexShrink:0}}>
              {profile.displayName?.[0]?.toUpperCase()||'G'}
            </div>
            <div style={{paddingBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <h2 style={{color:'var(--text-white)'}}>{profile.displayName}</h2>
                {profile.openToWork && <span className="badge badge-green">Open to Work</span>}
              </div>
              <div style={{color:'var(--saffron)',fontFamily:'var(--font-display)',fontWeight:600,marginTop:2}}>{profile.primaryRole}</div>
              {profile.tagline && <div style={{color:'var(--text-secondary)',fontSize:'0.9rem',marginTop:4,fontStyle:'italic'}}>{profile.tagline}</div>}
              <div style={{color:'var(--text-muted)',fontSize:'0.85rem',marginTop:4}}>📍 {profile.city && profile.city+', '}{profile.state} · @{profile.username}</div>
            </div>
          </div>
          {isOwn ? (
            <Link to="/profile/edit" className="btn btn-secondary">✏️ Edit Profile</Link>
          ) : (
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-primary">Connect</button>
              <button className="btn btn-ghost">Message</button>
            </div>
          )}
        </div>

        {/* Profile score */}
        <div className="card" style={{padding:20,marginBottom:20,display:'flex',alignItems:'center',gap:16}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{color:'var(--text-secondary)',fontSize:'0.85rem',fontFamily:'var(--font-display)',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>Profile Score</span>
              <span style={{color:'var(--saffron)',fontFamily:'var(--font-display)',fontWeight:700}}>{profile.profileScore}%</span>
            </div>
            <div className="progress-bar"><div className="progress-bar-fill" style={{width:profile.profileScore+'%'}} /></div>
          </div>
          <div style={{display:'flex',gap:20}}>
            {[['👁️',profile.profileViews||0,'Views'],['❤️',profile.followersCount||0,'Followers']].map(([icon,v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--text-white)'}}>{icon} {v}</div>
                <div style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24,alignItems:'start'}}>
          <div>
            {profile.bio && (
              <div className="card" style={{padding:24,marginBottom:20}}>
                <h3 style={{marginBottom:12}}>About</h3>
                <p style={{color:'var(--text-secondary)',lineHeight:1.7}}>{profile.bio}</p>
              </div>
            )}

            {profile.gameProfiles?.length > 0 && (
              <div className="card" style={{padding:24,marginBottom:20}}>
                <h3 style={{marginBottom:16}}>🎮 Game Profiles</h3>
                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                  {profile.gameProfiles.map(g=>(
                    <div key={g._id} style={{background:'var(--bg-input)',borderRadius:10,padding:16,border:'1px solid var(--border-dim)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                        <span style={{color:'var(--text-white)',fontWeight:600,fontFamily:'var(--font-display)'}}>{g.gameName}</span>
                        {g.currentTier && <span style={{color:'var(--saffron)',fontFamily:'var(--font-mono)',fontSize:'0.85rem'}}>{g.currentTier}</span>}
                      </div>
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        {g.inGameRoles?.map(r=><span key={r} className="badge badge-saffron">{r}</span>)}
                        {g.device && <span className="badge badge-electric">{g.device}</span>}
                      </div>
                      {g.stats && (
                        <div style={{display:'flex',gap:20,marginTop:10}}>
                          {g.stats.kd && <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>K/D: <span style={{color:'var(--text-primary)',fontFamily:'var(--font-mono)'}}>{g.stats.kd}</span></div>}
                          {g.stats.winRate && <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Win Rate: <span style={{color:'var(--text-primary)',fontFamily:'var(--font-mono)'}}>{g.stats.winRate}%</span></div>}
                          {g.stats.matches && <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Matches: <span style={{color:'var(--text-primary)',fontFamily:'var(--font-mono)'}}>{g.stats.matches}</span></div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.achievements?.length > 0 && (
              <div className="card" style={{padding:24,marginBottom:20}}>
                <h3 style={{marginBottom:16}}>🏆 Achievements</h3>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {profile.achievements.map(a=>(
                    <div key={a._id} style={{display:'flex',gap:12,padding:'12px 16px',background:'var(--bg-input)',borderRadius:10,border:'1px solid rgba(255,107,0,0.1)'}}>
                      <div style={{fontSize:24}}>🏅</div>
                      <div>
                        <div style={{color:'var(--text-white)',fontWeight:600}}>{a.title}</div>
                        {a.description && <div style={{color:'var(--text-muted)',fontSize:'0.85rem',marginTop:2}}>{a.description}</div>}
                        {a.date && <div style={{color:'var(--text-muted)',fontSize:'0.8rem',marginTop:4}}>{new Date(a.date).getFullYear()}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.portfolio?.length > 0 && (
              <div className="card" style={{padding:24}}>
                <h3 style={{marginBottom:16}}>🎬 Portfolio</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
                  {profile.portfolio.map(p=>(
                    <a key={p._id} href={p.url} target="_blank" rel="noreferrer" style={{display:'block',background:'var(--bg-input)',borderRadius:8,overflow:'hidden',border:'1px solid var(--border-dim)',textDecoration:'none',transition:'all 0.2s'}}>
                      <div style={{height:100,background:'var(--bg-card)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>
                        {p.type==='video'?'🎬':p.type==='image'?'🖼️':'🔗'}
                      </div>
                      <div style={{padding:'8px 12px'}}>
                        <div style={{color:'var(--text-primary)',fontSize:'0.85rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.title||p.type}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{padding:20,marginBottom:16}}>
              <h4 style={{marginBottom:12,color:'var(--text-secondary)'}}>DETAILS</h4>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {[['🎮 Main Game', profile.primaryGame],['🏅 Role', profile.primaryRole],['📍 Location', [profile.city,profile.state].filter(Boolean).join(', ')],['⏰ Availability', profile.availability],['🎯 Looking for', profile.lookingFor?.join(', ')]].filter(([,v])=>v).map(([l,v])=>(
                  <div key={l}><div style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>{l}</div><div style={{color:'var(--text-primary)',fontSize:'0.9rem',marginTop:2}}>{v}</div></div>
                ))}
              </div>
            </div>

            {Object.values(social).some(v=>v) && (
              <div className="card" style={{padding:20}}>
                <h4 style={{marginBottom:12,color:'var(--text-secondary)'}}>SOCIAL</h4>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {[['🎬 YouTube',social.youtube],['📸 Instagram',social.instagram],['🐦 Twitter',social.twitter],['📺 Twitch',social.twitch],['💬 Discord',social.discord],['🌐 Website',social.website]].filter(([,v])=>v).map(([l,v])=>(
                    <a key={l} href={v.startsWith('http')?v:'https://'+v} target="_blank" rel="noreferrer" style={{color:'var(--text-secondary)',fontSize:'0.875rem',display:'flex',gap:6,alignItems:'center'}}>{l}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}