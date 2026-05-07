import React, { useState, useEffect } from 'react';
import { postsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart, MessageCircle, Share2, MoreHorizontal,
  Image as ImageIcon, Video, CheckCircle,
  TrendingUp, UserPlus, Sparkles, ChevronRight, Zap
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const { isAuthenticated, user, org } = useAuth();

  const me = user || org;
  const myName = user ? user.displayName : org?.orgName;
  const myAvatar = user ? user.avatar : org?.logo;
  const myInitial = myName?.[0]?.toUpperCase() || '?';

  const fetchPosts = async () => {
    try {
      const { data } = await postsAPI.getAll({});
      setPosts(data.data || []);
    } catch { toast.error('Failed to load feed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await postsAPI.create({ content, postType: 'update' });
      setPosts(prev => [data.data, ...prev]);
      setContent('');
      toast.success('Update shared!');
    } catch { toast.error('Failed to share update'); }
    finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) return toast.error('Sign in to interact');
    const prev = [...posts];
    setPosts(posts.map(p => {
      if (p._id !== postId) return p;
      const liked = p.likes?.includes(me?._id);
      return { 
        ...p, 
        likesCount: liked ? (p.likesCount||1)-1 : (p.likesCount||0)+1, 
        likes: liked ? p.likes.filter(id=>id!==me?._id) : [...(p.likes||[]), me?._id] 
      };
    }));
    try { await postsAPI.like(postId); }
    catch { setPosts(prev); }
  };

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Professional Composer */}
            {isAuthenticated && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-surface p-8 rounded-[32px] border-white/5 shadow-xl relative overflow-hidden"
              >
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-void border border-primary/20 flex-center overflow-hidden shrink-0 shadow-lg p-1">
                    {myAvatar ? <img src={myAvatar} alt="" className="w-full h-full object-cover rounded-xl" /> : <span className="font-black text-primary text-xl">{myInitial}</span>}
                  </div>
                  <textarea 
                    className="flex-1 bg-transparent border-none outline-none text-white font-semibold text-lg placeholder:text-muted resize-none min-h-[100px] py-2 leading-relaxed"
                    placeholder="Broadcast your latest professional victory..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </div>
                
                <div className="flex-between mt-8 pt-8 border-t border-white/5">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black text-secondary uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
                      <ImageIcon size={16} className="text-primary" /> Media
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black text-secondary uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
                      <Video size={16} className="text-primary" /> Video
                    </button>
                  </div>
                  <button 
                    className="btn btn-primary px-8 py-3 rounded-2xl shadow-primary font-black uppercase tracking-widest text-xs" 
                    onClick={handlePost} 
                    disabled={posting || !content.trim()}
                  >
                    {posting ? 'Broadcasting...' : 'Share Update'}
                  </button>
                </div>
                <div className="auth-bg-glow" style={{ bottom: '-50%', right: '-10%', width: '60%', height: '100%', opacity: 0.05 }} />
              </motion.div>
            )}

            {/* Posts Stream */}
            <div className="space-y-8">
              {loading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton-shimmer h-[300px] rounded-[36px]" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="glass-surface p-24 text-center rounded-[40px] border-dashed border-white/10">
                  <div className="w-20 h-20 bg-void rounded-full border border-white/5 flex-center text-muted mx-auto mb-6 opacity-30">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="h3">Strategic Silence</h3>
                  <p className="text-secondary mt-2 max-w-sm mx-auto">The ecosystem feed is currently quiet. Connect with more entities to broaden your intelligence stream.</p>
                </div>
              ) : (
                posts.map((post, i) => (
                  <motion.article 
                    key={post._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-surface p-8 rounded-[36px] group hover:border-primary/40 transition-all shadow-xl relative overflow-hidden"
                  >
                    <div className="flex-between mb-8 relative z-10">
                      <div className="flex gap-5 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-void border border-white/5 flex-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-all p-1">
                          {post.author?.avatar ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover rounded-xl" /> : <span className="font-black text-primary text-lg">{post.author?.displayName?.[0]}</span>}
                        </div>
                        <div>
                          <p className="font-black text-white text-base flex items-center gap-2 group-hover:text-primary transition-colors">
                            {post.author?.displayName}
                            {post.author?.isVerified && <CheckCircle size={16} className="text-primary" />}
                          </p>
                          <p className="text-[9px] text-muted font-black uppercase tracking-[0.2em]">
                            {post.author?.primaryRole || 'Strategic Actor'} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-muted hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
                    </div>

                    <div className="mb-8 relative z-10">
                      <p className="text-white/90 font-medium leading-relaxed text-lg whitespace-pre-wrap">
                        {post.content}
                      </p>
                      {post.media?.length > 0 && (
                        <div className="mt-6 rounded-[28px] overflow-hidden border border-white/5 shadow-2xl">
                          <img src={post.media[0].url} alt="" className="w-full block hover:scale-105 transition-transform duration-700" />
                        </div>
                      )}
                    </div>

                    <div className="flex-between pt-6 border-t border-white/5 relative z-10">
                      <div className="flex gap-8">
                        <button 
                          className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${post.likes?.includes(me?._id) ? 'text-primary' : 'text-muted hover:text-secondary'}`}
                          onClick={() => handleLike(post._id)}
                        >
                          <Heart size={20} fill={post.likes?.includes(me?._id) ? 'currentColor' : 'none'} className="transition-transform active:scale-125" />
                          <span>{post.likesCount || 0}</span>
                        </button>
                        <button className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-muted hover:text-secondary transition-all">
                          <MessageCircle size={20} />
                          <span>{post.commentsCount || 0}</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-muted hover:text-secondary transition-all">
                        <Share2 size={20} />
                      </button>
                    </div>
                    <div className="auth-bg-glow" style={{ top: '-40%', left: '-20%', width: '100%', height: '100%', opacity: 0.03 }} />
                  </motion.article>
                ))
              )}
            </div>
          </div>

          {/* Strategic Sidebar Column */}
          <aside className="space-y-8 hidden lg-block sticky" style={{ top: '100px' }}>
            
            {/* Global Intelligence Pulse */}
            <section className="glass-surface p-8 rounded-[36px] border-white/5 shadow-xl relative overflow-hidden">
              <h3 className="text-[10px] font-black text-muted tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
                <TrendingUp size={18} className="text-primary" /> Intelligence Pulse
              </h3>
              <div className="space-y-6">
                {[
                  { tag: 'StrategicHire', count: '1.2k', trend: 'up' },
                  { tag: 'ArenaExpansion', count: '850', trend: 'up' },
                  { tag: 'EnterpriseNode', count: '2.4k', trend: 'down' }
                ].map((item) => (
                  <div key={item.tag} className="flex-between group cursor-pointer relative z-10">
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-primary transition-colors tracking-tight">#{item.tag}</p>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">{item.count} Broadcasts</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-void border border-white/5 flex-center text-muted group-hover:border-primary/20 group-hover:text-primary transition-all">
                       <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="auth-bg-glow" style={{ top: '-10%', right: '-10%', width: '100%', height: '100%', opacity: 0.05 }} />
            </section>

            {/* Strategic Discovery */}
            <section className="glass-surface p-8 rounded-[36px] border-white/5 shadow-xl">
              <h3 className="text-[10px] font-black text-muted tracking-[0.2em] uppercase mb-8">Asset Discovery</h3>
              <div className="space-y-8">
                {[
                  { name: 'Marcus Voltz', role: 'Strategic Architect' },
                  { name: 'Elena Rossi', role: 'Node Operator' }
                ].map((item) => (
                  <div key={item.name} className="flex-between items-center group">
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-void border border-white/5 flex-center text-primary font-black text-base shadow-inner group-hover:border-primary/20 transition-all p-1">
                         <div className="w-full h-full rounded-lg bg-primary/5 flex-center">{item.name[0]}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate tracking-tight">{item.name}</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tighter truncate">{item.role}</p>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex-center hover:bg-primary hover:text-white transition-all shadow-lg shrink-0">
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <Link to="/discover" className="btn btn-secondary btn-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-10 border-white/5 hover:border-primary/20 transition-all">
                Access All Nodes
              </Link>
            </section>

            {/* Ecosystem Authority */}
            <section className="p-8 bg-void/40 rounded-[40px] border border-dashed border-white/10 text-center">
               <Zap size={32} className="text-primary/30 mx-auto mb-4" />
               <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Ecosystem Health</h4>
               <p className="text-[10px] text-muted font-medium leading-relaxed">Global network latency at <span className="text-green-400">12ms</span>. All professional nodes operational.</p>
            </section>

          </aside>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}