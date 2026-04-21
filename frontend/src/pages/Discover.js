import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Building2, Briefcase, Filter, MapPin } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Discover() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const [type, setType]   = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoad] = useState(false);

  useEffect(() => { if (q) { setQuery(q); fetchSearch(q, type); } else { fetchSearch('', type); } }, [q, type]);

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
    { id: 'all', label: 'All', icon: <Search size={16}/> },
    { id: 'users', label: 'Gamers', icon: <User size={16}/> },
    { id: 'orgs', label: 'Orgs', icon: <Building2 size={16}/> },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase size={16}/> },
  ];

  return (
    <div className="discover-shell">
      <div className="discover-container">
        
        {/* Header & Search */}
        <div className="discover-header-section">
          <h1>Discover <span className="text-electric">ArenaX</span></h1>
          <p className="discover-subtitle">Find gamers, organizations, and open roles in esports.</p>
          
          <form onSubmit={handleSearch} className="discover-search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, game, role, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="discover-search-btn">Search</button>
          </form>

          <div className="discover-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`discover-tab ${type === t.id ? 'active' : ''}`}
                onClick={() => setType(t.id)}
              >
                {t.icon} <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="discover-results">
          {loading ? (
            <div className="discover-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />)}
            </div>
          ) : !results || (results.users?.length===0 && results.orgs?.length===0 && results.jobs?.length===0) ? (
            <div className="discover-empty">
              <Search size={48} />
              <h3>No results found</h3>
              <p>Try searching for a different keyword or category.</p>
            </div>
          ) : (
            <AnimatePresence>
              
              {/* Orgs */}
              {(type === 'all' || type === 'orgs') && results.orgs?.length > 0 && (
                <div className="result-section">
                  <h2>Organizations</h2>
                  <div className="discover-grid">
                    {results.orgs.map((org, i) => (
                      <motion.div key={org._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link to={`/org/${org.slug}`} className="discover-card hover-glow">
                          <div className="card-top-bg org-bg" />
                          <div className="card-avatar-wrap">
                            {org.logo ? <img src={org.logo} alt=""/> : <Building2 size={24}/>}
                          </div>
                          <div className="card-content">
                            <h3 className="card-title truncate">{org.orgName}</h3>
                            <p className="card-subtitle truncate">{org.orgType}</p>
                            <div className="card-meta">
                              {org.state && <span><MapPin size={12}/> {org.state}</span>}
                              {org.verified && <span className="badge-verified">Verified</span>}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {(type === 'all' || type === 'users') && results.users?.length > 0 && (
                <div className="result-section">
                  <h2>Gamers</h2>
                  <div className="discover-grid">
                    {results.users.map((u, i) => (
                      <motion.div key={u._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link to={`/u/${u.username}`} className="discover-card hover-glow">
                          <div className="card-top-bg user-bg" />
                          <div className="card-avatar-wrap">
                            {u.avatar ? <img src={u.avatar} alt=""/> : <User size={24}/>}
                          </div>
                          <div className="card-content">
                            <h3 className="card-title truncate">{u.displayName}</h3>
                            <p className="card-subtitle truncate">@{u.username}</p>
                            <div className="card-meta" style={{ marginTop: 8 }}>
                              {u.primaryRole && <span className="badge badge-saffron" style={{ fontSize: '0.65rem' }}>{u.primaryRole}</span>}
                              {u.primaryGame && <span className="badge badge-electric" style={{ fontSize: '0.65rem' }}>{u.primaryGame}</span>}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {(type === 'all' || type === 'jobs') && results.jobs?.length > 0 && (
                <div className="result-section">
                  <h2>Jobs</h2>
                  <div className="discover-list">
                    {results.jobs.map((job, i) => (
                      <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link to={`/jobs/${job._id}`} className="job-list-card">
                          <div className="job-list-logo">
                            {job.postedBy?.orgLogo ? <img src={job.postedBy.orgLogo} alt=""/> : <Briefcase size={20}/>}
                          </div>
                          <div className="job-list-info">
                            <h3 className="job-list-title">{job.title}</h3>
                            <p className="job-list-org">{job.postedBy?.orgName}</p>
                          </div>
                          <div className="job-list-meta">
                            {job.workType && <span className="badge badge-glass">{job.workType}</span>}
                            {job.locationType && <span className="badge badge-glass hidden sm:inline-flex">{job.locationType}</span>}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>
      <BottomNav />

      <style>{`
        .discover-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .discover-container { max-width: 1100px; margin: 0 auto; padding: 32px 16px; }

        .discover-header-section { margin-bottom: 40px; text-align: center; }
        .discover-header-section h1 { font-size: 2.5rem; margin-bottom: 8px; }
        .discover-subtitle { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 24px; }

        .discover-search-bar { display: flex; align-items: center; background: var(--bg-card); border: 1.5px solid var(--border); border-radius: 20px; padding: 6px 6px 6px 20px; max-width: 600px; margin: 0 auto 24px; box-shadow: var(--shadow-card); transition: all 0.2s; }
        .discover-search-bar:focus-within { border-color: var(--electric); box-shadow: 0 0 0 4px rgba(0,229,255,0.1); }
        .search-icon { color: var(--text-muted); margin-right: 12px; }
        .search-input { flex: 1; background: transparent; border: none; font-size: 1.05rem; color: var(--text-primary); outline: none; padding: 10px 0; font-family: var(--font-body); }
        .search-input::placeholder { color: var(--text-muted); }
        .discover-search-btn { background: var(--electric); color: var(--bg-void); border: none; border-radius: 14px; padding: 10px 24px; font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .discover-search-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .discover-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .discover-tab { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-dim); border-radius: 100px; color: var(--text-secondary); font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .discover-tab:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
        .discover-tab.active { background: var(--electric); border-color: var(--electric); color: var(--bg-void); }

        .discover-results { display: flex; flex-direction: column; gap: 40px; }
        .result-section h2 { font-size: 1.5rem; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--border-dim); }

        .discover-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        
        .discover-card { display: block; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; text-decoration: none; position: relative; transition: all 0.2s; }
        .hover-glow:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.5); border-color: var(--border-bright); }
        
        .card-top-bg { height: 60px; background: var(--border-dim); }
        .org-bg { background: linear-gradient(135deg, rgba(123,47,190,0.4), rgba(168,85,247,0.2)); }
        .user-bg { background: linear-gradient(135deg, rgba(255,107,0,0.4), rgba(255,140,56,0.2)); }
        
        .card-avatar-wrap { width: 72px; height: 72px; border-radius: 50%; background: var(--bg-input); border: 4px solid var(--bg-card); display: flex; align-items: center; justify-content: center; position: absolute; top: 24px; left: 50%; transform: translateX(-50%); overflow: hidden; color: var(--text-muted); }
        .card-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-content { padding: 44px 16px 20px; text-align: center; }
        .card-title { font-size: 1.1rem; color: var(--text-white); margin-bottom: 2px; }
        .card-subtitle { font-size: 0.85rem; color: var(--text-muted); }
        .card-meta { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.75rem; color: var(--text-secondary); margin-top: 12px; }
        .badge-verified { background: rgba(0,229,255,0.1); color: var(--electric); padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; }

        .discover-list { display: flex; flex-direction: column; gap: 12px; }
        .job-list-card { display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-decoration: none; transition: all 0.2s; }
        .job-list-card:hover { background: var(--bg-card-hover); border-color: var(--border-bright); }
        .job-list-logo { width: 44px; height: 44px; border-radius: 10px; background: var(--bg-input); display: flex; align-items: center; justify-content: center; color: var(--text-muted); margin-right: 16px; overflow: hidden; }
        .job-list-logo img { width: 100%; height: 100%; object-fit: cover; }
        .job-list-info { flex: 1; min-width: 0; }
        .job-list-title { font-size: 1.05rem; font-weight: 600; color: var(--text-white); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .job-list-org { font-size: 0.85rem; color: var(--text-muted); }
        .job-list-meta { display: flex; gap: 8px; margin-left: 16px; }

        .discover-empty { text-align: center; padding: 60px 20px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .discover-empty h3 { color: var(--text-secondary); font-size: 1.25rem; margin: 0; }
        @media (max-width: 600px) { .hidden.sm\\:inline { display: none; } }
      `}</style>
    </div>
  );
}