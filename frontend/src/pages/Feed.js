import React, { useState, useEffect } from 'react';
import { postsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Feed() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [games, setGames]   = useState([]);
  const { user, isUser }    = useAuth();

  useEffect(() => {
    fetchPosts();
    gamesAPI.getAll().then(r=>setGames(r.data.data));
  }, []);

  const fetchPosts = async () => {
    setLoad(true);
    try { const { data } = await postsAPI.getAll({ limit: 30 }); setPosts(data.data); }
    catch {} finally { setLoad(false); }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await postsAPI.create({ content, postType: 'text' });
      setPosts(prev => [data.data, ...prev]);
      setContent('');
      toast.success('Posted! 🎮');
    } catch { toast.error('Failed to post.'); }
    finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.like(postId);
      setPosts(prev => prev.map(p => p._id === postId ? {...p, likesCount: p.likesCount + (p.liked ? -1 : 1), liked: !p.liked} : p));
    } catch {}
  };

  return (
    <div className="page" style={{paddingBottom:60}}>
      <div className="container" style={{maxWidth:720}}>
        <div style={{paddingTop:32,paddingBottom:24}}>
          <h2>Community <span style={{color:'var(--saffron)'}}>Feed</span></h2>
          <p style={{color:'var(--text-secondary)',marginTop:4}}>Share achievements, clips, and connect with India's gaming community.</p>
        </div>

        {/* Compose */}
        {isUser && (
          <div className="card" style={{padding:24,marginBottom:24,border:'1px solid var(--border)'}}>
            <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--saffron-dark),var(--saffron))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'white',flexShrink:0}}>
                {user?.displayName?.[0]?.toUpperCase()||'G'}
              </div>
              <div style={{flex:1}}>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Share an achievement, clip, or update with the community... 🎮"
                  value={content}
                  onChange={e=>setContent(e.target.value)}
                  style={{resize:'none',marginBottom:12}}
                />
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-ghost btn-sm">🖼️ Image</button>
                    <button className="btn btn-ghost btn-sm">🎬 Clip</button>
                    <button className="btn btn-ghost btn-sm">🏆 Achievement</button>
                  </div>
                  <button className="btn btn-primary btn-sm" disabled={posting||!content.trim()} onClick={handlePost}>
                    {posting ? 'Posting...' : 'Post →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[...Array(4)].map((_,i)=><div key={i} className="skeleton" style={{height:160,borderRadius:12}} />)}
          </div>
        ) : posts.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 0'}}>
            <div style={{fontSize:48,marginBottom:16}}>🎮</div>
            <h3 style={{color:'var(--text-secondary)'}}>No posts yet</h3>
            <p style={{color:'var(--text-muted)'}}>Be the first to post in the arena!</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {posts.map(post=><PostCard key={post._id} post={post} onLike={handleLike} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, onLike }) {
  return (
    <div className="card" style={{padding:24}}>
      <div style={{display:'flex',gap:12,marginBottom:16}}>
        <div style={{width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,var(--saffron-dark),var(--saffron))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'white',flexShrink:0,fontSize:'1.1rem'}}>
          {post.author?.displayName?.[0]?.toUpperCase()||'?'}
        </div>
        <div>
          <div style={{color:'var(--text-primary)',fontWeight:600,fontSize:'0.95rem'}}>{post.author?.displayName}</div>
          <div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>
            {post.author?.primaryRole && <span style={{color:'var(--saffron)'}}>{post.author.primaryRole} · </span>}
            {new Date(post.createdAt).toLocaleDateString('en-IN')}
          </div>
        </div>
      </div>

      <p style={{color:'var(--text-secondary)',lineHeight:1.7,marginBottom:16,whiteSpace:'pre-wrap'}}>{post.content}</p>

      {post.media?.length > 0 && (
        <div style={{borderRadius:8,overflow:'hidden',marginBottom:16}}>
          {post.media[0].type === 'image' && <img src={post.media[0].url} alt="" style={{width:'100%',maxHeight:400,objectFit:'cover'}} />}
        </div>
      )}

      {post.tags?.length > 0 && (
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
          {post.tags.map(t=><span key={t} style={{color:'var(--electric)',fontSize:'0.8rem'}}>#{t}</span>)}
        </div>
      )}

      <div style={{display:'flex',gap:16,paddingTop:12,borderTop:'1px solid var(--border-dim)'}}>
        <button onClick={()=>onLike(post._id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.875rem',display:'flex',alignItems:'center',gap:4}}>
          ❤️ {post.likesCount || 0}
        </button>
        <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.875rem',display:'flex',alignItems:'center',gap:4}}>
          💬 {post.commentsCount || 0}
        </button>
        <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.875rem',display:'flex',alignItems:'center',gap:4}}>
          🔗 Share
        </button>
      </div>
    </div>
  );
}