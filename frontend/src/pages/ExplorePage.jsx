import React from 'react';
import { Search, Filter, ArrowUpDown, X, RotateCcw, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { regions, types } from '../data/heritageRecords';
import RecordCard from '../components/RecordCard';

export default function ExplorePage() {
  const {
    search,
    setSearch,
    type,
    setType,
    region,
    setRegion,
    sortBy,
    setSortBy,
    clearFilters,
    filtered,
    records,
    setSelected,
    setPage,
  } = useApp();

  const isRegionActive = Boolean(
    region && (typeof region === 'object' ? region.id !== 'All regions' : region !== 'All regions')
  );

  const hasActiveFilters = Boolean(
    search || type !== 'All types' || isRegionActive || (sortBy && sortBy !== 'default')
  );

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  const selectedRegionId = typeof region === 'object' && region !== null ? region.id : (region || 'All regions');
  const selectedRegionLabel = typeof region === 'object' && region !== null ? region.name : region;

  return (
    <section className="page-wrap">
      <div className="page-title">
        <div>
          <div className="eyebrow muted">DISCOVER THE COLLECTION</div>
          <h1>Explore <em>heritage.</em></h1>
          <p>Search by monument name, historical era, dynasty, architectural feature or region.</p>
        </div>
        <span className="count-pill">
          {filtered.length} {filtered.length === 1 ? 'heritage site' : 'heritage sites'} found
        </span>
      </div>

      <form className="search-row" onSubmit={handleSearchSubmit}>
        <Search size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by monument, location, period or dynasty (e.g. 'Stepwells in Gujarat', '11th century', 'Solanki')..."
        />
        {search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearch('')}
            aria-label="Clear search text"
            title="Clear search"
          >
            <X size={15} />
          </button>
        )}
        <button type="submit" className="gold-btn">Search</button>
      </form>

      <div className="filter-row">
        <div className="filter-group-inline">
          <Filter size={14} />
          <span>Region:</span>
        </div>
        <select
          value={selectedRegionId}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'All regions') {
              setRegion('All regions');
            } else {
              const selectedObj = regions.find((r) => (typeof r === 'object' ? r.id === val : r === val));
              setRegion(selectedObj || val);
            }
          }}
          aria-label="Filter by region"
        >
          <option value="All regions">All regions</option>
          {regions.map((r) => {
            const rId = typeof r === 'object' && r !== null ? r.id : r;
            const rName = typeof r === 'object' && r !== null ? r.name : r;
            return (
              <option key={rId} value={rId}>
                {rName}
              </option>
            );
          })}
        </select>

        <div className="filter-group-inline" style={{ marginLeft: 6 }}>
          <span>Category:</span>
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by category">
          <option value="All types">All categories</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <div className="filter-group-inline" style={{ marginLeft: 6 }}>
          <ArrowUpDown size={14} />
          <span>Sort:</span>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort heritage sites">
          <option value="default">Default order</option>
          <option value="score">Completeness (High to Low)</option>
          <option value="title">Name (A – Z)</option>
          <option value="era">Chronology (Era)</option>
        </select>

        {hasActiveFilters && (
          <button type="button" className="clear-filters-link" onClick={clearFilters}>
            <RotateCcw size={12} /> Reset filters
          </button>
        )}

        <span className="demo-note">
          Showing {filtered.length} of {records.length} curated sites
        </span>
      </div>

      <div className="record-grid">
        {filtered.map((r) => (
          <RecordCard
            key={r.id}
            record={r}
            onClick={() => {
              setSelected(r);
              setPage('Archive');
            }}
          />
        ))}
        {!filtered.length && (
          <div className="explore-empty-state">
            <Compass size={40} className="empty-icon" />
            <h3>No heritage sites match your criteria</h3>
            <p>
              We couldn't find any sites
              {search ? ` matching "${search}"` : ''}
              {type !== 'All types' ? ` in category "${type}"` : ''}
              {isRegionActive ? ` in region "${selectedRegionLabel}"` : ''}.
              Try adjusting your query or resetting all filters.
            </p>
            <button type="button" className="gold-btn" onClick={clearFilters}>
              <RotateCcw size={14} /> Reset all filters & search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
