import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, gamesAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, ChevronRight, X, Filter, Sparkles, Building2, Clock, Globe, Zap } from 'lucide-center';
import { LucideIcon } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';

// Re-mapping icons for consistency
import { 
  Search as SearchIcon, 
  MapPin as MapPinIcon, 
  Briefcase as BriefcaseIcon, 
  ChevronRight as ChevronIcon, 
  X as XIcon, 
  Filter as FilterIcon, 
  Sparkles as SparklesIcon, 
  Building2 as BuildingIcon, 
  Clock as ClockIcon, 
  Globe as GlobeIcon, 
  Zap as ZapIcon 
} from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoad] = useState(true);
  const [games, setGames] = useState([]);
  const [states, setStates] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ game: '', state: '', workType: '', locationType: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const { isOrg } = useAuth();

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
    <div className="page-shell">
      <div className="container" style={{ maxWidth: 1000 }}>
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex-between wrap gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full inline-flex items-center gap-2 mb-4"
              >
                <SparklesIcon size={12} className="text-primary" />
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">Global Board</span>
              </motion.div>
              <h1 className="h1 mb-2">Find your <span className="text-gradient">Next Career Move</span></h1>
              <p className="text-secondary font-medium">Discover elite professional openings in India's premier gaming ecosystem.</p>
            </div>
            {isOrg && (
              <Link to="/post-job" className="btn btn-primary px-8 py-4 rounded-xl shadow-primary gap-2">
                <BriefcaseIcon size={18} /> Post an Opening
              </Link>
            )}
          </div>
        </header>

        {/* Global Search & Filter Module */}
        <section className="glass-surface p-2 rounded-[28px] mb-12 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-6 bg-void/50 rounded-2xl border border-white/5 focus-within:border-primary/30 transition-all">
              <SearchIcon size={20} className="text-muted" />
              <input
                type="text"
                placeholder="Search roles, companies, or keywords..."
                className="w-full bg-transparent border-none outline-none py-4 text-white font-medium"
                value={filters.search}
                onChange={e => setF('search', e.target.value)}
              />
            </div>
            <button 
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${showFilters ? 'bg-primary text-white' : 'bg-void/80 text-secondary hover:text-white'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon size={18} /> Filters
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/5 mt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Discipline</label>
                    <select className="input rounded-xl bg-void border-white/5 text-sm" value={filters.game} onChange={e => setF('game', e.target.value)}>
                      <option value="">All Games</option>
                      {games.map(g => <option key={g.id} value={g.id}>{g.shortName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Location</label>
                    <select className="input rounded-xl bg-void border-white/5 text-sm" value={filters.state} onChange={e => setF('state', e.target.value)}>
                      <option value="">All States</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Engagement</label>
                    <select className="input rounded-xl bg-void border-white/5 text-sm" value={filters.workType} onChange={e => setF('workType', e.target.value)}>
                      <option value="">Any Type</option>
                      {workTypes.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Environment</label>
                    <select className="input rounded-xl bg-void border-white/5 text-sm" value={filters.locationType} onChange={e => setF('locationType', e.target.value)}>
                      <option value="">Any Mode</option>
                      {locationTypes.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                {Object.values(filters).some(v => v) && (
                  <div className="px-6 pb-6 flex justify-end">
                    <button className="text-xs font-bold text-danger hover:underline flex items-center gap-1" onClick={() => setFilters({ game: '', state: '', workType: '', locationType: '', search: '' })}>
                      <XIcon size={14} /> Clear Selection
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Board Meta */}
        <div className="flex-between mb-6 px-4">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">
            Total active positions: <span className="text-primary">{total}</span>
          </p>
          <div className="flex gap-4">
             {/* Optional sort control could go here */}
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-shimmer h-24 rounded-[28px]"></div>
            ))
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 glass-surface rounded-[32px] border-dashed">
              <div className="w-16 h-16 bg-void rounded-full border flex-center text-muted mx-auto mb-4 opacity-50">
                <BriefcaseIcon size={32} />
              </div>
              <h3 className="h3">No Matches Found</h3>
              <p className="text-secondary mt-2">Adjust your filters to explore more opportunities.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <motion.div 
                  key={job._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/jobs/${job._id}`} className="block glass-surface p-5 rounded-[28px] hover:border-primary/40 transition-all group relative overflow-hidden">
                    <div className="flex-between items-center relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-void border border-white/5 flex-center overflow-hidden shrink-0 group-hover:border-primary/20 transition-colors">
                          {job.postedBy?.orgLogo ? (
                            <img src={job.postedBy.orgLogo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <BuildingIcon size={24} className="text-muted" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                              <BuildingIcon size={12} className="text-primary" /> {job.postedBy?.orgName}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                              <MapPinIcon size={12} /> {job.location?.state || 'Remote'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="hidden md-flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                             {job.gameName && <span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-tighter">{job.gameName}</span>}
                             {job.workType && <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black text-secondary uppercase tracking-tighter">{job.workType}</span>}
                          </div>
                          <p className="text-[10px] text-muted font-bold flex items-center gap-1.5">
                            <ClockIcon size={10} /> {job.applicantCount || 0} Professional Applicants
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-void border flex-center text-muted group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                          <ChevronIcon size={20} />
                        </div>
                      </div>
                    </div>
                    <div className="auth-bg-glow" style={{ top: '-50%', right: '-10%', width: '30%', height: '200%', opacity: 0.03 }} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Board Pagination */}
        {total > 20 && (
          <div className="flex-center gap-6 mt-12 mb-12">
            <button 
              className="btn btn-secondary px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-30" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span className="text-xs font-black text-white uppercase tracking-widest">
              Block <span className="text-primary">{page}</span> / {Math.ceil(total / 20)}
            </span>
            <button 
              className="btn btn-secondary px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-30" 
              disabled={page >= Math.ceil(total / 20)} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}