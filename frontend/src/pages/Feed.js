import React, { useState, useEffect, useRef } from 'react';
import { postsAPI, uploadAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart, MessageCircle, Share2, MoreHorizontal,
  Image as ImageIcon, Video, Send, X, ChevronDown,
  Bookmark, CheckCircle, Repeat2
} from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Feed() {
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [content, setContent]   = useState('');
  const [posting, setPosting]   = useState(false);
  const [expanded, setExpanded] = useState({});
  const [commenting, setCommenting] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { isAuthenticated, user, org, accountType } = useAuth();

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
      toast.success('Posted!');
    } catch { toast.error('Failed to post'); }
    finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) return toast.error('Login to like');
    const prev = [...posts];
    setPosts(posts.map(p => {
      if (p._id !== postId) return p;
      const liked = p.likes?.includes(me?._id);
      return { ...p, likesCount: liked ? (p.likesCount||1)-1 : (p.likesCount||0)+1, likes: liked ? p.likes.filter(id=>id!==me?._id) : [...(p.likes||[]),me?._id] };
    }));
    try { await postsAPI.like(postId); }
    catch { setPosts(prev); }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await postsAPI.comment(postId, { content: commentText });
      const { data } = await postsAPI.getAll({});
      setPosts(data.data || []);
      setCommentText(''); setCommenting(null);
      toast.success('Comment added');
    } catch { toast.error('Failed to comment'); }
  };

  const toggleExpand = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  if (loading) return (
    <div className="feed-shell">
      <div className="feed-layout">
        <div className="feed-main">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="post-card">
              <div className="skeleton" style={{ height: 56, width: 56, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );

  return (
    <div className="feed-shell">
      <div className="feed-layout">

        {/* ─── Left Sidebar (desktop) ─────────────────────────────────── */}
        <aside className="feed-sidebar-left">
          {isAuthenticated && me && (
            <div className="sidebar-profile-card">
              <div className="sidebar-banner" />
              <div className="sidebar-avatar">
                {myAvatar
                  ? <img src={myAvatar} alt={myName} className="sidebar-avatar-img" />
                  : <span>{myInitial}</span>}
              </div>
              <div className="sidebar-name">{myName}</div>
              <div className="sidebar-role">{user?.primaryRole || org?.orgType}</div>
              <div className="sidebar-divider" />
              <div className="sidebar-stats">
                <div className="sidebar-stat"><span>{me.followersCount||0}</span><small>Followers</small></div>
                <div className="sidebar-stat"><span>{me.profileViews||0}</span><small>Views</small></div>
              </div>
            </div>
          )}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Trending</div>
            {['#BGMI', '#ValorantIndia', '#Esports2026', '#FreeFirePro'].map(tag => (
              <div key={tag} className="sidebar-tag">{tag}</div>
            ))}
          </div>
        </aside>

        {/* ─── Main Feed ─────────────────────────────────────────────── */}
        <main className="feed-main">

          {/* Compose Box */}
          {isAuthenticated && (
            <div className="compose-card">
              <div className="compose-top">
                <div className="compose-avatar">
                  {myAvatar ? <img src={myAvatar} alt="" /> : <span>{myInitial}</span>}
                </div>
                <textarea
                  className="compose-input"
                  placeholder="Share your highlights, clips, achievements…"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={content.split('\n').length > 2 ? content.split('\n').length : 2}
                />
              </div>
              <div className="compose-actions">
                <div className="compose-media-btns">
                  <button className="compose-media-btn"><ImageIcon size={18}/><span>Photo</span></button>
                  <button className="compose-media-btn"><Video size={18}/><span>Video</span></button>
                </div>
                <button className="compose-post-btn" onClick={handlePost} disabled={posting||!content.trim()}>
                  {posting ? 'Posting…' : <><Send size={16}/>Post</>}
                </button>
              </div>
            </div>
          )}

          {/* Posts */}
          <AnimatePresence>
            {posts.length === 0 ? (
              <div className="feed-empty">
                <div className="feed-empty-icon">🎮</div>
                <h3>No posts yet</h3>
                <p>Be the first to share something in the Arena!</p>
              </div>
            ) : posts.map((post, i) => {
              const liked = isAuthenticated && post.likes?.includes(me?._id);
              const longContent = post.content?.length > 300;
              const isOpen = expanded[post._id];
              const isCommenting = commenting === post._id;

              return (
                <motion.article
                  key={post._id}
                  className="post-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i < 5 ? i * 0.06 : 0 }}
                >
                  {/* Header */}
                  <div className="post-header">
                    <div className="post-author-row">
                      <div className="post-avatar">
                        {post.author?.avatar
                          ? <img src={post.author.avatar} alt="" />
                          : <span>{post.author?.displayName?.[0]?.toUpperCase()||'?'}</span>}
                      </div>
                      <div className="post-author-info">
                        <div className="post-author-name">
                          {post.author?.displayName}
                          {post.author?.isVerified && <CheckCircle size={13} className="verified-icon"/>}
                        </div>
                        <div className="post-author-meta">
                          {post.author?.primaryRole && <span>{post.author.primaryRole}</span>}
                          {post.author?.primaryRole && <span className="dot">·</span>}
                          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <button className="post-more-btn"><MoreHorizontal size={18}/></button>
                  </div>

                  {/* Content */}
                  <div className="post-content">
                    <p className={`post-text ${!isOpen && longContent ? 'post-text--clamp' : ''}`}>
                      {post.content}
                    </p>
                    {longContent && (
                      <button className="post-read-more" onClick={() => toggleExpand(post._id)}>
                        {isOpen ? 'Show less' : 'See more'} <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}/>
                      </button>
                    )}
                  </div>

                  {/* Media */}
                  {post.media?.length > 0 && (
                    <div className="post-media">
                      {post.media[0].type === 'image'
                        ? <img src={post.media[0].url} alt="Post" className="post-media-img"/>
                        : <video src={post.media[0].url} controls className="post-media-vid"/>}
                    </div>
                  )}

                  {/* Tags */}
                  {post.gameTag && (
                    <div className="post-tags">
                      <span className="post-tag"># {post.gameTag}</span>
                    </div>
                  )}

                  {/* Stats row */}
                  {(post.likesCount > 0 || post.commentsCount > 0) && (
                    <div className="post-stats">
                      {post.likesCount > 0 && <span><Heart size={12}/> {post.likesCount}</span>}
                      {post.commentsCount > 0 && <span>{post.commentsCount} comments</span>}
                    </div>
                  )}

                  <div className="post-divider"/>

                  {/* Actions */}
                  <div className="post-actions">
                    <button
                      className={`post-action-btn ${liked ? 'post-action-btn--liked' : ''}`}
                      onClick={() => handleLike(post._id)}
                    >
                      <Heart size={18} className={liked ? 'filled' : ''}/>
                      <span>Like</span>
                    </button>
                    <button
                      className={`post-action-btn ${isCommenting ? 'post-action-btn--active' : ''}`}
                      onClick={() => setCommenting(isCommenting ? null : post._id)}
                    >
                      <MessageCircle size={18}/>
                      <span>Comment</span>
                    </button>
                    <button className="post-action-btn">
                      <Repeat2 size={18}/>
                      <span>Repost</span>
                    </button>
                    <button className="post-action-btn post-action-btn--share">
                      <Share2 size={18}/>
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comment box */}
                  <AnimatePresence>
                    {isCommenting && (
                      <motion.div
                        className="comment-box"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="comment-input-row">
                          <div className="comment-avatar">
                            {myAvatar ? <img src={myAvatar} alt=""/> : <span>{myInitial}</span>}
                          </div>
                          <input
                            className="comment-input"
                            placeholder="Write a comment…"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleComment(post._id)}
                          />
                          <button className="comment-send-btn" onClick={() => handleComment(post._id)}>
                            <Send size={16}/>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Comments */}
                  {post.comments?.slice(0, 2).map((c, idx) => (
                    <div key={idx} className="comment-item">
                      <div className="comment-avatar-sm">
                        {c.avatar ? <img src={c.avatar} alt=""/> : <span>{c.displayName?.[0]||'?'}</span>}
                      </div>
                      <div className="comment-bubble">
                        <div className="comment-author">{c.displayName}</div>
                        <div className="comment-text">{c.content}</div>
                      </div>
                    </div>
                  ))}
                </motion.article>
              );
            })}
          </AnimatePresence>
        </main>

        {/* ─── Right Sidebar (desktop) ────────────────────────────────── */}
        <aside className="feed-sidebar-right">
          <div className="sidebar-section">
            <div className="sidebar-section-title">People to Follow</div>
            {[
              { name: 'Mortal', role: 'Pro Player · BGMI' },
              { name: 'ScoutOP', role: 'Pro Player · BGMI' },
              { name: 'TechnoGamerz', role: 'Content Creator' },
            ].map(p => (
              <div key={p.name} className="suggestion-row">
                <div className="suggestion-avatar">{p.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div className="suggestion-name">{p.name}</div>
                  <div className="suggestion-role">{p.role}</div>
                </div>
                <button className="suggestion-follow-btn">Follow</button>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">ArenaX © 2026 · India's Esports Hub</div>
        </aside>
      </div>

      <BottomNav />

      <style>{`
        .feed-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .feed-layout { display: grid; grid-template-columns: 240px 1fr 240px; gap: 24px; max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
        @media (max-width: 1024px) { .feed-layout { grid-template-columns: 1fr; } .feed-sidebar-left, .feed-sidebar-right { display: none; } }

        /* Sidebar */
        .feed-sidebar-left, .feed-sidebar-right { display: flex; flex-direction: column; gap: 16px; }
        .sidebar-profile-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .sidebar-banner { height: 60px; background: linear-gradient(135deg, rgba(255,107,0,0.3), rgba(0,229,255,0.15)); }
        .sidebar-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); margin: -28px auto 0; border: 3px solid var(--bg-card); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; color: white; overflow: hidden; }
        .sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .sidebar-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .sidebar-name { text-align: center; font-family: var(--font-display); font-weight: 700; color: var(--text-white); margin-top: 10px; font-size: 1rem; }
        .sidebar-role { text-align: center; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px; }
        .sidebar-divider { height: 1px; background: var(--border-dim); margin: 0 16px; }
        .sidebar-stats { display: flex; justify-content: space-around; padding: 12px 16px; }
        .sidebar-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .sidebar-stat span { font-family: var(--font-display); font-weight: 700; color: var(--text-white); font-size: 1rem; }
        .sidebar-stat small { font-size: 0.72rem; color: var(--text-muted); }
        .sidebar-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .sidebar-section-title { font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px; }
        .sidebar-tag { color: var(--electric); font-size: 0.88rem; font-weight: 600; cursor: pointer; }
        .sidebar-tag:hover { text-decoration: underline; }
        .sidebar-footer { color: var(--text-muted); font-size: 0.72rem; padding: 0 4px; }

        /* Suggestions */
        .suggestion-row { display: flex; align-items: center; gap: 10px; }
        .suggestion-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 0.9rem; flex-shrink: 0; }
        .suggestion-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .suggestion-role { font-size: 0.75rem; color: var(--text-muted); }
        .suggestion-follow-btn { padding: 4px 12px; border: 1.5px solid var(--electric); border-radius: 20px; background: transparent; color: var(--electric); font-family: var(--font-display); font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .suggestion-follow-btn:hover { background: var(--electric); color: var(--bg-void); }

        /* Compose */
        .compose-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .compose-top { display: flex; gap: 12px; margin-bottom: 14px; }
        .compose-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1rem; flex-shrink: 0; overflow: hidden; }
        .compose-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .compose-input { flex: 1; background: var(--bg-input); border: 1.5px solid var(--border-dim); border-radius: 24px; padding: 10px 18px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.95rem; resize: none; outline: none; transition: border-color 0.2s; line-height: 1.5; }
        .compose-input:focus { border-color: var(--saffron); }
        .compose-input::placeholder { color: var(--text-muted); }
        .compose-actions { display: flex; align-items: center; justify-content: space-between; padding-left: 56px; }
        .compose-media-btns { display: flex; gap: 4px; }
        .compose-media-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: transparent; border: none; color: var(--text-muted); font-family: var(--font-display); font-size: 0.85rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .compose-media-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .compose-post-btn { display: flex; align-items: center; gap: 6px; padding: 8px 20px; background: var(--saffron); border: none; border-radius: 20px; color: white; font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .compose-post-btn:hover:not(:disabled) { background: var(--saffron-light); transform: translateY(-1px); }
        .compose-post-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Post Card */
        .feed-main { display: flex; flex-direction: column; gap: 0; }
        .post-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 12px; }
        .post-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .post-author-row { display: flex; align-items: center; gap: 12px; }
        .post-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1rem; flex-shrink: 0; overflow: hidden; border: 2px solid var(--border); }
        .post-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .post-author-name { font-family: var(--font-display); font-weight: 700; color: var(--text-white); font-size: 0.95rem; display: flex; align-items: center; gap: 5px; }
        .post-author-meta { font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        .dot { color: var(--text-muted); }
        .verified-icon { color: var(--electric); flex-shrink: 0; }
        .post-more-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; transition: all 0.2s; }
        .post-more-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

        /* Content */
        .post-content { margin-bottom: 12px; }
        .post-text { color: var(--text-primary); font-size: 0.95rem; line-height: 1.65; white-space: pre-wrap; }
        .post-text--clamp { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .post-read-more { background: none; border: none; color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 4px; padding: 0; }
        .post-read-more:hover { color: var(--saffron); }

        /* Media */
        .post-media { border-radius: 12px; overflow: hidden; margin-bottom: 12px; background: black; max-height: 520px; display: flex; align-items: center; justify-content: center; }
        .post-media-img { width: 100%; max-height: 520px; object-fit: contain; }
        .post-media-vid { width: 100%; max-height: 520px; }

        /* Tags */
        .post-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
        .post-tag { color: var(--electric); font-size: 0.82rem; font-weight: 600; cursor: pointer; }

        /* Stats */
        .post-stats { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.8rem; color: var(--text-muted); }
        .post-stats span { display: flex; align-items: center; gap: 4px; }
        .post-divider { height: 1px; background: var(--border-dim); margin: 2px 0; }

        /* Actions */
        .post-actions { display: flex; align-items: center; padding: 4px 0; }
        .post-action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 4px; background: transparent; border: none; color: var(--text-secondary); font-family: var(--font-display); font-size: 0.88rem; font-weight: 600; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
        .post-action-btn:hover { background: rgba(255,255,255,0.04); color: var(--text-primary); }
        .post-action-btn--liked { color: #ef4444; }
        .post-action-btn--liked svg { fill: #ef4444; }
        .post-action-btn--liked:hover { background: rgba(239,68,68,0.06); }
        .post-action-btn--active { color: var(--electric); }
        .post-action-btn--share { }

        /* Comments */
        .comment-box { padding-top: 14px; overflow: hidden; }
        .comment-input-row { display: flex; align-items: center; gap: 10px; }
        .comment-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 0.8rem; flex-shrink: 0; overflow: hidden; }
        .comment-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .comment-input { flex: 1; padding: 8px 14px; background: var(--bg-input); border: 1.5px solid var(--border-dim); border-radius: 20px; color: var(--text-primary); font-size: 0.88rem; outline: none; font-family: var(--font-body); transition: border-color 0.2s; }
        .comment-input:focus { border-color: var(--electric); }
        .comment-input::placeholder { color: var(--text-muted); }
        .comment-send-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--electric); border: none; display: flex; align-items: center; justify-content: center; color: var(--bg-void); cursor: pointer; flex-shrink: 0; transition: transform 0.2s; }
        .comment-send-btn:hover { transform: scale(1.1); }
        .comment-item { display: flex; gap: 8px; align-items: flex-start; padding-top: 10px; }
        .comment-avatar-sm { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron-dark), var(--saffron)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 0.72rem; flex-shrink: 0; overflow: hidden; }
        .comment-avatar-sm img { width: 100%; height: 100%; object-fit: cover; }
        .comment-bubble { background: var(--bg-input); border-radius: 12px; padding: 8px 12px; }
        .comment-author { font-family: var(--font-display); font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 2px; }
        .comment-text { font-size: 0.875rem; color: var(--text-primary); line-height: 1.5; }

        /* Empty */
        .feed-empty { text-align: center; padding: 60px 20px; color: var(--text-muted); }
        .feed-empty-icon { font-size: 3rem; margin-bottom: 16px; }
        .feed-empty h3 { color: var(--text-secondary); margin-bottom: 8px; }
      `}</style>
    </div>
  );
}