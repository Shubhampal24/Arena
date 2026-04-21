import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, ChevronRight, X, Filter } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoad] = useState(true);
  const [games, setGames] = useState([]);
  const [states, setStates] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ game: '', state: '', workType: '', locationType: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const { isOrg, isAuthenticated } = useAuth();

  useEffect(() => {
    gamesAPI.getAll().then(r => setGames(r.data.data)).catch(() => {});
    gamesAPI.getStates().then(r => setStates(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchJobs(); }, [filters, page]);

  const fetchJobs = async () => {
    setLoad(true);
    try {
      const { data } = await jobsAPI.getAll({ ...filters, page, limit: 20 });
      setJobs(data.data);
      setTotal(data.total);
    } catch { } finally { setLoad(false); }
  };

  const setF = (k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); };

  const workTypes = ['Full-Time', 'Part-Time', 'Contract', 'Trial / Tryout', 'Internship'];
  const locationTypes = ['Bootcamp (Onsite)', 'Work From Home', 'Hybrid', 'Travel Required'];

  return (
    <div className="jobs-shell">
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-header">
          <div>
            <h1>Gaming <span style={{ color: 'var(--saffron)' }}>Opportunities</span></h1>
            <p className="jobs-subtitle">{total} openings in India's esports ecosystem</p>
          </div>
          {isOrg && <Link to="/post-job" className="btn btn-primary">Post a Job</Link>}
        </div>

        {/* Search Bar */}
        <div className="jobs-search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by role, org, or keywords..."
            value={filters.search}
            onChange={e => setF('search', e.target.value)}
          />
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="filters-panel"
            >
              <select className="filter-select" value={filters.game} onChange={e => setF('game', e.target.value)}>
                <option value="">All Games</option>
                {games.map(g => <option key={g.id} value={g.id}>{g.shortName}</option>)}
              </select>
              <select className="filter-select" value={filters.state} onChange={e => setF('state', e.target.value)}>
                <option value="">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="filter-select" value={filters.workType} onChange={e => setF('workType', e.target.value)}>
                <option value="">Work Type</option>
                {workTypes.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <select className="filter-select" value={filters.locationType} onChange={e => setF('locationType', e.target.value)}>
                <option value="">Location</option>
                {locationTypes.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              {Object.values(filters).some(v => v) && (
                <button className="clear-filters-btn" onClick={() => { setFilters({ game: '', state: '', workType: '', locationType: '', search: '' }); }}>
                  Clear Filters <X size={14} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job List */}
        <div className="jobs-list">
          {loading ? (
            [...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12 }} />)
          ) : jobs.length === 0 ? (
            <div className="jobs-empty">
              <Briefcase size={40} className="empty-icon" />
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters to find what you're looking for.</p>
            </div>
          ) : (
            <AnimatePresence>
              {jobs.map((job, i) => (
                <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/jobs/${job._id}`} className="job-row">
                    <div className="job-row-left">
                      <div className="job-logo">
                        {job.postedBy?.orgLogo ? <img src={job.postedBy.orgLogo} alt={job.postedBy.orgName} /> : <Briefcase size={20} />}
                      </div>
                      <div className="job-info">
                        <div className="job-title">{job.title}</div>
                        <div className="job-org-meta">
                          <span className="job-org-name">{job.postedBy?.orgName}</span>
                          <span className="dot">·</span>
                          <span className="job-location"><MapPin size={12} /> {job.location?.state || 'India'}</span>
                          <span className="dot">·</span>
                          <span className="job-applicants">{job.applicantCount || 0} applied</span>
                        </div>
                      </div>
                    </div>
                    <div className="job-row-right">
                      <div className="job-tags">
                        {job.gameName && <span className="badge badge-saffron">{job.gameName}</span>}
                        {job.workType && <span className="job-tag job-tag--type">{job.workType}</span>}
                      </div>
                      <ChevronRight size={20} className="job-arrow" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="jobs-pagination">
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span>Page {page} of {Math.ceil(total / 20)}</span>
            <button className="btn btn-primary btn-sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
      <BottomNav />

      <style>{`
        .jobs-shell { min-height: 100vh; padding-top: 72px; padding-bottom: 80px; }
        .jobs-container { max-width: 900px; margin: 0 auto; padding: 32px 16px; }
        
        .jobs-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
        .jobs-header h1 { font-size: 2rem; margin-bottom: 4px; color: var(--text-white); }
        .jobs-subtitle { color: var(--text-muted); font-size: 1rem; }

        .jobs-search-bar { display: flex; align-items: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 6px 12px; margin-bottom: 16px; }
        .search-icon { color: var(--text-muted); margin-right: 10px; }
        .search-input { flex: 1; background: transparent; border: none; font-size: 1rem; color: var(--text-primary); outline: none; padding: 8px 0; }
        .search-input::placeholder { color: var(--text-muted); }
        
        .filter-toggle-btn { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-dim); color: var(--text-primary); border-radius: 8px; padding: 8px 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .filter-toggle-btn:hover { background: rgba(255,255,255,0.1); }
        @media (max-width: 600px) { .hidden.sm\\:inline { display: none; } .filter-toggle-btn { padding: 8px; } }

        .filters-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 24px; overflow: hidden; }
        .filter-select { appearance: none; background-color: var(--bg-input); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23606078' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; border: 1px solid var(--border-dim); border-radius: 8px; padding: 10px 32px 10px 12px; color: var(--text-primary); font-size: 0.9rem; outline: none; }
        .filter-select:focus { border-color: var(--saffron); }
        .clear-filters-btn { display: flex; align-items: center; justify-content: center; gap: 6px; background: transparent; border: 1px solid #ff4444; color: #ff4444; border-radius: 8px; padding: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .clear-filters-btn:hover { background: rgba(255,68,68,0.1); }

        .jobs-list { display: flex; flex-direction: column; gap: 12px; }
        
        .job-row { display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-decoration: none; transition: all 0.2s; }
        .job-row:hover { background: var(--bg-card-hover); border-color: var(--border-bright); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        @media (max-width: 600px) { .job-row { flex-direction: column; align-items: flex-start; gap: 16px; } .job-row-right { width: 100%; justify-content: space-between; } }
        
        .job-row-left { display: flex; align-items: center; gap: 16px; }
        .job-logo { width: 48px; height: 48px; border-radius: 12px; background: var(--bg-input); border: 1px solid var(--border-dim); display: flex; align-items: center; justify-content: center; color: var(--text-muted); overflow: hidden; flex-shrink: 0; }
        .job-logo img { width: 100%; height: 100%; object-fit: cover; }
        .job-title { font-size: 1.1rem; font-weight: 700; color: var(--text-white); margin-bottom: 6px; }
        .job-org-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 0.85rem; color: var(--text-muted); }
        .job-org-name { font-weight: 600; color: var(--text-secondary); }
        .job-location { display: flex; align-items: center; gap: 4px; }
        .job-applicants { color: var(--electric); }
        .dot { color: var(--border-dim); }

        .job-row-right { display: flex; align-items: center; gap: 20px; }
        .job-tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .job-tag { padding: 4px 10px; border-radius: 100px; font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .job-tag--type { background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid rgba(255,255,255,0.1); }
        .job-arrow { color: var(--text-muted); transition: color 0.2s, transform 0.2s; }
        .job-row:hover .job-arrow { color: var(--saffron); transform: translateX(4px); }

        .jobs-empty { text-align: center; padding: 60px 20px; color: var(--text-muted); }
        .empty-icon { color: var(--text-muted); margin-bottom: 16px; opacity: 0.5; }
        .jobs-empty h3 { color: var(--text-secondary); margin-bottom: 8px; font-size: 1.2rem; }
        .jobs-empty p { font-size: 0.95rem; }

        .jobs-pagination { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 32px; color: var(--text-muted); font-size: 0.9rem; }
      `}</style>
    </div>
  );
}