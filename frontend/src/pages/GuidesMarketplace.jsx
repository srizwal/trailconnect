import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, Star, Shield } from 'lucide-react';
import { guideAPI } from '../api';
import GuideCard from '../components/guide/GuideCard';
import './GuidesMarketplace.css';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Nepali', 'Hindi', 'Chinese', 'Japanese'];
const DIFFICULTIES = ['easy', 'moderate', 'hard', 'extreme'];

export default function GuidesMarketplace() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ location: '', language: '', difficulty: '', minRating: '', minPrice: '', maxPrice: '' });
  const [search, setSearch] = useState('');

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const res = await guideAPI.getAll(params);
      setGuides(res.data.guides);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchGuides(); }, [fetchGuides]);

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };
  const clearFilters = () => { setFilters({ location: '', language: '', difficulty: '', minRating: '', minPrice: '', maxPrice: '' }); setPage(1); };
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="guides-page page-enter">
      {/* Hero */}
      <div className="guides-hero">
        <div className="container">
          <div className="guides-hero-badge"><Shield size={14} /> 1,200+ Certified Guides</div>
          <h1>Find Your Perfect Guide</h1>
          <p>Expert mountain guides verified for safety, skills, and experience</p>
          <div className="guides-search-row">
            <div className="guides-search">
              <Search size={18} />
              <input
                placeholder="Search by location, name…"
                value={filters.location}
                onChange={e => setFilter('location', e.target.value)}
              />
              {filters.location && <button onClick={() => setFilter('location', '')}><X size={15} /></button>}
            </div>
            <button className="btn btn-outline filter-toggle-white" onClick={() => setFiltersOpen(o => !o)}>
              <SlidersHorizontal size={16} /> Filters {activeCount > 0 && <span className="filter-badge-white">{activeCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="guides-filter-panel">
          <div className="container">
            <div className="filter-panel-grid">
              <div className="filter-panel-group">
                <label>Language</label>
                <select className="input" value={filters.language} onChange={e => setFilter('language', e.target.value)}>
                  <option value="">Any language</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="filter-panel-group">
                <label>Trek Difficulty</label>
                <select className="input" value={filters.difficulty} onChange={e => setFilter('difficulty', e.target.value)}>
                  <option value="">Any difficulty</option>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div className="filter-panel-group">
                <label>Min Rating</label>
                <select className="input" value={filters.minRating} onChange={e => setFilter('minRating', e.target.value)}>
                  <option value="">Any rating</option>
                  {[4.5, 4, 3.5, 3].map(r => <option key={r} value={r}>⭐ {r}+</option>)}
                </select>
              </div>
              <div className="filter-panel-group">
                <label>Min Price/Day ($)</label>
                <input className="input" type="number" placeholder="e.g. 50" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
              </div>
              <div className="filter-panel-group">
                <label>Max Price/Day ($)</label>
                <input className="input" type="number" placeholder="e.g. 500" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
              </div>
              <div className="filter-panel-group filter-clear">
                {activeCount > 0 && <button className="btn btn-outline btn-sm" onClick={clearFilters}><X size={13} /> Clear all</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container guides-body">
        <div className="guides-results-header">
          <span>{total.toLocaleString()} guides found</span>
        </div>

        {loading ? (
          <div className="guides-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }} />
            ))}
          </div>
        ) : guides.length === 0 ? (
          <div className="no-results">
            <Shield size={48} />
            <h3>No guides found</h3>
            <p>Try adjusting your filters</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="guides-grid">
              {guides.map(guide => <GuideCard key={guide._id} guide={guide} />)}
            </div>
            {pages > 1 && (
              <div className="pagination">
                <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                <span>Page {page} of {pages}</span>
                <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Become a guide CTA */}
      <div className="become-guide-banner">
        <div className="container">
          <div className="become-guide-content">
            <div>
              <h2>Are You a Mountain Guide?</h2>
              <p>Join TrailConnect's guide marketplace and connect with adventure seekers worldwide.</p>
            </div>
            <div className="become-guide-perks">
              {['Set your own rates', 'Manage your schedule', 'Build your reputation', 'Get verified badge'].map(p => (
                <span key={p} className="perk-tag">✓ {p}</span>
              ))}
            </div>
            <a href="/register" className="btn btn-peak btn-lg">Apply as Guide</a>
          </div>
        </div>
      </div>
    </div>
  );
}
