import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Building2, Briefcase, Filter, MapPin, Sparkles, ChevronRight, Verified, Globe, Target, ArrowRight } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Discover() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const [type, setType]   = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoad] = useState(false);

  useEffect(() => { 
    if (q) { setQuery(q); fetchSearch(q, type); } else { fetchSearch('', type); } 
  }, [q, type]);

  const fetchSearch = async (searchQ, searchType) => {
    setLoad(true);
    try {
      const { data } = await searchAPI.search(searchQ, searchType);
      setResults(data.data);
    } catch { } finally { setLoad(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSearch(query, type);
  };

  const tabs = [
    { id: 'all', label: 'All Discovery', icon: <Sparkles size={16}/> },
    { id: 'users', label: 'Professionals', icon: <User size={16}/> },
    { id: 'orgs', label: 'Organizations', icon: <Building2 size={16}/> },
    { id: 'jobs', label: 'Opportunities', icon: <Briefcase size={16}/> },
  ];

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1100 }}>
        
        {/* Modern Search Hero */}
        <section className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full inline-flex items-center gap-2 mb-6"
          >
            <Zap size={12} className="text-primary" />
            <span className="text-[10px] font-black text-primary tracking-widest uppercase">Ecosystem Search</span>
          </motion.div>
          <h1 className="h1 mb-4 leading-tight">Explore the <span className="text-gradient">Frontiers of Success</span></h1>
          <p className="text-secondary font-medium max-w-2xl mx-auto mb-12">Connect with elite talent, discover top-tier organizations, and find your next career milestone on the global stage.</p>
          
          <div className="max-w-2xl mx-auto space-y-8">
            <form onSubmit={handleSearch} className="flex p-1.5 bg-void/50 border border-white/5 rounded-3xl focus-within:border-primary/30 transition-all shadow-2xl">
              <div className="pl-6 text-muted shrink-0 flex items-center">
                <Search size={22} />
              </div>
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none px-4 py-5 text-white font-semibold text-lg placeholder:text-muted"
                placeholder="Search professionals, entities, or roles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-8 rounded-2xl shadow-primary font-black uppercase tracking-widest text-xs">
                Explore
              </button>
            </form>

            <div className="flex flex-center gap-3 wrap">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all border ${type === t.id ? 'bg-primary text-white border-primary shadow-primary' : 'bg-void/50 text-secondary border-white/5 hover:border-white/10 hover:text-white'}`}
                  onClick={() => setType(t.id)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Stream */}
        <div className="space-y-16 pb-24">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-shimmer h-[280px] rounded-[32px]" />)}
            </div>
          ) : !results || (results.users?.length===0 && results.orgs?.length===0 && results.jobs?.length===0) ? (
            <div className="text-center py-24 glass-surface rounded-[40px] border-dashed border-white/5">
              <div className="w-20 h-20 bg-void rounded-full border border-white/5 flex-center text-muted mx-auto mb-6 opacity-30">
                <Target size={40} />
              </div>
              <h3 className="h3">Ecosystem Mismatch</h3>
              <p className="text-secondary mt-2 max-w-sm mx-auto">We couldn't find any data matching your criteria. Try refining your keywords or parameters.</p>
            </div>
          ) : (
            <AnimatePresence mode='wait'>
              
              {/* Entity Results */}
              {(type === 'all' || type === 'orgs') && results.orgs?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex-between px-2">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                      <Building2 size={24} className="text-primary" /> Verified Entities
                    </h2>
                    <Link to="/orgs" className="text-xs font-bold text-primary hover:underline">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.orgs.map((org, i) => (
                      <motion.div key={org._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link to={`/org/${org.slug}`} className="glass-surface p-8 rounded-[32px] block group hover:border-primary/40 transition-all relative overflow-hidden h-full">
                          <div className="flex flex-col h-full">
                            <div className="flex items-center gap-5 mb-8">
                              <div className="w-16 h-16 rounded-[20px] bg-void border border-white/5 flex-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-all">
                                {org.logo ? <img src={org.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={28} className="text-muted" />}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors truncate mb-1">{org.orgName}</h3>
                                <p className="text-[10px] text-muted font-black uppercase tracking-widest">{org.orgType}</p>
                              </div>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/5 flex-between items-center">
                              <div className="flex items-center gap-2 text-muted text-xs font-bold">
                                <MapPin size={14} className="text-primary" /> {org.state || 'Global Identity'}
                              </div>
                              {org.isVerifiedOrg && <Verified size={16} className="text-primary shadow-sm" />}
                            </div>
                          </div>
                          <div className="auth-bg-glow" style={{ bottom: '-50%', right: '-10%', width: '100%', height: '100%', opacity: 0.03 }} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Talent Results */}
              {(type === 'all' || type === 'users') && results.users?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <div className="flex-between px-2">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                      <User size={24} className="text-primary" /> Elite Talent
                    </h2>
                    <Link to="/talents" className="text-xs font-bold text-primary hover:underline">View All</Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.users.map((u, i) => (
                      <motion.div key={u._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link to={`/u/${u.username}`} className="glass-surface p-6 rounded-[32px] block text-center group hover:border-primary/40 transition-all relative overflow-hidden">
                          <div className="w-20 h-20 rounded-[28px] bg-void border border-white/5 mx-auto mb-6 overflow-hidden p-1.5 group-hover:border-primary/20 transition-all">
                            {u.avatar ? (
                              <img src={u.avatar} alt="" className="w-full h-full object-cover rounded-[20px]" />
                            ) : (
                              <div className="w-full h-full rounded-[20px] bg-primary/10 flex-center text-primary font-black text-2xl uppercase tracking-tighter">{u.displayName?.[0]}</div>
                            )}
                          </div>
                          <h3 className="font-bold text-white text-base group-hover:text-primary transition-colors truncate mb-1">{u.displayName}</h3>
                          <p className="text-[10px] text-muted font-bold tracking-widest uppercase mb-6">@{u.username}</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {u.primaryRole && <span className="px-3 py-1 bg-void/50 rounded-lg text-[9px] font-black text-secondary border border-white/5 uppercase tracking-tighter">{u.primaryRole}</span>}
                            {u.primaryGame && <span className="px-3 py-1 bg-primary/5 rounded-lg text-[9px] font-black text-primary border border-primary/20 uppercase tracking-tighter">{u.primaryGame}</span>}
                          </div>
                          <div className="auth-bg-glow" style={{ top: '-80%', left: '-20%', width: '100%', height: '100%', opacity: 0.05 }} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Opportunities Results */}
              {(type === 'all' || type === 'jobs') && results.jobs?.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex-between px-2">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                      <Briefcase size={24} className="text-primary" /> Active Opportunities
                    </h2>
                    <Link to="/jobs" className="text-xs font-bold text-primary hover:underline">View Board</Link>
                  </div>
                  <div className="space-y-4">
                    {results.jobs.map((job, i) => (
                      <motion.div key={job._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link to={`/jobs/${job._id}`} className="glass-surface p-6 rounded-[28px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary/40 transition-all group relative overflow-hidden">
                          <div className="flex gap-5 items-center min-w-0 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-all">
                              {job.postedBy?.orgLogo ? <img src={job.postedBy.orgLogo} alt="" className="w-full h-full object-cover" /> : <Briefcase size={24} className="text-muted" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors truncate mb-1">{job.title}</h4>
                              <p className="text-xs text-muted font-bold tracking-wider uppercase">{job.postedBy?.orgName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 shrink-0 relative z-10">
                            <div className="hidden lg-flex gap-2">
                              {job.workType && <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-secondary border border-white/5 uppercase tracking-tighter">{job.workType}</span>}
                              {job.gameName && <span className="px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary border border-primary/20 uppercase tracking-tighter">{job.gameName}</span>}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-void border border-white/5 flex-center text-muted group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                              <ChevronRight size={20} />
                            </div>
                          </div>
                          <div className="auth-bg-glow" style={{ top: '-100%', right: '-10%', width: '40%', height: '300%', opacity: 0.03 }} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

const ZapIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M4 14.899 13 3l-3.3 9h8.3L9 21l3.3-9H4Z"/>
  </svg>
);