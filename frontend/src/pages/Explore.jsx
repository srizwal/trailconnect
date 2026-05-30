import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Mountain, Grid, List } from 'lucide-react';
import { trekAPI } from '../api';
import TrekCard from '../components/trek/TrekCard';
import './Explore.css';

const DIFFICULTIES = ['easy', 'moderate', 'hard', 'extreme'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'date', label: 'Upcoming Soon' },
  { value: 'costPerPerson', label: 'Price: Low to High' },
  { value: '-costPerPerson', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Popular' },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    difficulty: '',
    sort: '-createdAt',
  });

  const fetchTreks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      if (!params.search) delete params.search;
      if (!params.difficulty) delete params.difficulty;
      const res = await trekAPI.getAll(params);
      setTreks(res.data.treks);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchTreks(); }, [fetchTreks]);

  const updateFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', difficulty: '', sort: '-createdAt' });
    setPage(1);
  };

  const activeFiltersCount = [filters.difficulty].filter(Boolean).length;

  return (
    <div className="explore-page page-enter">
      {/* Header */}
      <div className="explore-header">
        <div className="container">
          <h1>Explore Treks</h1>
          <p>{total.toLocaleString()} adventures waiting for you</p>
          <div className="explore-search-row">
            <div className="explore-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search destination, title…"
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
              />
              {filters.search && <button onClick={() => updateFilter('search', '')}><X size={15} /></button>}
            </div>
            <button className="btn btn-outline filter-toggle" onClick={() => setFiltersOpen(o => !o)}>
              <SlidersHorizontal size={16} /> Filters
              {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
            </button>
            <select className="sort-select" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Filter chips */}
          {filtersOpen && (
            <div className="filter-chips-row">
              <div className="filter-group">
                <span className="filter-label">Difficulty</span>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    className={`filter-chip ${filters.difficulty === d ? 'active' : ''}`}
                    onClick={() => updateFilter('difficulty', filters.difficulty === d ? '' : d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {activeFiltersCount > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                  <X size={13} /> Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container explore-body">
        {loading ? (
          <div className="treks-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 340, borderRadius: 16 }} />
            ))}
          </div>
        ) : treks.length === 0 ? (
          <div className="no-results">
            <Mountain size={48} />
            <h3>No treks found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="treks-grid">
              {treks.map(trek => <TrekCard key={trek._id} trek={trek} />)}
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
    </div>
  );
}
