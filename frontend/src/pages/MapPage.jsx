import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe2, ChevronRight, ArrowUpRight, Search, X, 
  RotateCcw, MapPin, Layers, Compass, Check, AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import MapMarkers from '../components/MapMarkers';

/* Available Map Tile Providers (all free, high-reliability, no API key required, zero watermarks) */
const TILE_PROVIDERS = {
  'osm': {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc',
    maxZoom: 19,
  },
  'esri-street': {
    name: 'Topographic Street',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, TomTom',
    maxZoom: 18,
  },
  'esri-satellite': {
    name: 'Satellite Heritage',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, and GIS User Community',
    maxZoom: 18,
  },
  'opentopo': {
    name: 'Terrain & Contours',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    subdomains: 'abc',
    maxZoom: 17,
  },
};

/* Subcomponent to imperatively control Leaflet Map view */
function MapController({ selectedRecord, boundsRecords, autoFitTrigger, resetTrigger }) {
  const map = useMap();

  // Fly to selected record when clicked in list or search
  useEffect(() => {
    if (selectedRecord && selectedRecord.lat && selectedRecord.lng) {
      map.flyTo([selectedRecord.lat, selectedRecord.lng], 10, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [selectedRecord, map]);

  // Recenter to all-India bounds
  useEffect(() => {
    if (resetTrigger) {
      map.flyTo([22.5, 79.2], 5, { duration: 1.2 });
    }
  }, [resetTrigger, map]);

  // Fit bounds to visible filtered records
  useEffect(() => {
    if (autoFitTrigger && boundsRecords && boundsRecords.length > 0) {
      if (boundsRecords.length === 1) {
        map.flyTo([boundsRecords[0].lat, boundsRecords[0].lng], 10, { duration: 1.2 });
      } else {
        const bounds = L.latLngBounds(boundsRecords.map((r) => [r.lat, r.lng]));
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 9, duration: 1.2 });
      }
    }
  }, [autoFitTrigger, boundsRecords, map]);

  return null;
}

export default function MapPage() {
  const { records, selected, setSelected, setPage, theme } = useApp();

  /* Map Tile Layer State */
  const [activeTileId, setActiveTileId] = useState('osm');
  const [tileError, setTileError] = useState(false);

  /* Search & Filter States */
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [autoFitTrigger, setAutoFitTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  /* Distinct Categories from Records */
  const categories = useMemo(() => {
    const set = new Set(records.map((r) => r.type).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [records]);

  /* Distinct Regions (States) from Records */
  const regions = useMemo(() => {
    const uniqueRegions = ['All', 'Gujarat', 'Rajasthan', 'Odisha', 'Uttar Pradesh', 'Tamil Nadu'];
    return uniqueRegions;
  }, []);

  /* Filtered Records */
  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((r) => {
      // Coordinate check
      if (!r.lat || !r.lng) return false;

      // Category check
      if (categoryFilter !== 'All' && r.type !== categoryFilter) {
        return false;
      }

      // Region check
      if (regionFilter !== 'All' && !r.place.toLowerCase().includes(regionFilter.toLowerCase())) {
        return false;
      }

      // Search query check
      if (q) {
        const fullText = `${r.title} ${r.place} ${r.type} ${r.era} ${r.dynasty || ''} ${(r.tags || []).join(' ')} ${r.desc || ''}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      return true;
    });
  }, [records, searchQuery, categoryFilter, regionFilter]);

  /* Reset all filters to default */
  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setRegionFilter('All');
    setResetTrigger((prev) => prev + 1);
  };

  /* Fit map to currently filtered records */
  const handleFitToVisible = () => {
    setAutoFitTrigger((prev) => prev + 1);
  };

  /* Navigate to Archive detail page */
  const handleNavigateArchive = (record) => {
    if (record) setSelected(record);
    setPage('Archive');
  };

  const activeTile = TILE_PROVIDERS[activeTileId] || TILE_PROVIDERS['carto-dark'];

  return (
    <section className="page-wrap map-page-section">
      {/* Page Header */}
      <div className="map-page-header">
        <div>
          <div className="eyebrow muted">SPATIAL DISCOVERY · CULTURAL GIS</div>
          <h1 className="map-page-title">
            India, <em>connected.</em>
          </h1>
          <p className="map-page-subtext">
            Explore sacred geometry, subterranean stepwells, and ancient fortifications across their geographic locations.
          </p>
        </div>

        {/* Status Pill and Fit View Action */}
        <div className="map-header-actions">
          <span className="count-pill">
            <Globe2 size={13} /> Showing {filteredRecords.length} of {records.length} heritage sites
          </span>
          <button className="outline-btn fit-view-btn" onClick={handleFitToVisible} title="Fit map view to visible sites">
            <Compass size={13} /> Fit View
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="map-layout">
        {/* Left: Map Shell */}
        <div className="map-shell">
          {/* Top Layer & Provider Switcher */}
          <div className="map-layer-selector">
            <span className="layer-label"><Layers size={11} /> Base Map:</span>
            {Object.entries(TILE_PROVIDERS).map(([key, provider]) => (
              <button
                key={key}
                type="button"
                className={`tile-btn ${activeTileId === key ? 'active' : ''}`}
                onClick={() => {
                  setActiveTileId(key);
                  setTileError(false);
                }}
              >
                {provider.name}
              </button>
            ))}
          </div>

          {/* Interactive Leaflet Map Container */}
          <MapContainer
            center={[22.5, 79.2]}
            zoom={5}
            scrollWheelZoom
            className="leaflet-heritage-canvas"
            style={{ 
              height: '100%', 
              minHeight: '620px', 
              background: activeTileId === 'carto-light' ? '#f0ebe2' : '#0c1210' 
            }}
          >
            <TileLayer
              attribution={activeTile.attribution}
              url={activeTile.url}
              subdomains={activeTile.subdomains}
              maxZoom={activeTile.maxZoom}
              eventHandlers={{
                tileerror: () => setTileError(true),
              }}
            />

            {/* Imperative Map Controller for smooth flyTo and recenter */}
            <MapController
              selectedRecord={selected}
              boundsRecords={filteredRecords}
              autoFitTrigger={autoFitTrigger}
              resetTrigger={resetTrigger}
            />

            {/* Category-Specific Visual Markers with Rich Popups */}
            <MapMarkers
              records={filteredRecords}
              selected={selected}
              onSelect={setSelected}
              onNavigateArchive={handleNavigateArchive}
            />
          </MapContainer>

          {/* Map Overlay Badge */}
          <div className="map-overlay">
            <span className="live-dot" style={{ background: 'var(--gold)' }} />
            <span>HERITAGE SITES GIS · INDIA</span>
          </div>

          {/* Network / Tile Error Notification */}
          {tileError && (
            <div className="map-tile-error-banner">
              <AlertCircle size={14} />
              <span>Map tile service encountering network limits. Switch to OpenStreetMap base layer above if tiles fail to load.</span>
            </div>
          )}

          {/* Interactive Bottom Category Legend */}
          <div className="map-legend-bar">
            <span className="legend-title">Categories:</span>
            <button 
              type="button" 
              className={`legend-chip ${categoryFilter === 'All' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('All')}
            >
              All
            </button>
            <button 
              type="button" 
              className={`legend-chip stepwell ${categoryFilter === 'Stepwell' ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === 'Stepwell' ? 'All' : 'Stepwell')}
            >
              <i className="legend-dot dot-stepwell" /> Stepwells
            </button>
            <button 
              type="button" 
              className={`legend-chip temple ${categoryFilter === 'Temple' ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === 'Temple' ? 'All' : 'Temple')}
            >
              <i className="legend-dot dot-temple" /> Temples
            </button>
            <button 
              type="button" 
              className={`legend-chip fort ${categoryFilter === 'Fort' ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === 'Fort' ? 'All' : 'Fort')}
            >
              <i className="legend-dot dot-fort" /> Forts
            </button>
            <button 
              type="button" 
              className={`legend-chip living ${categoryFilter === 'Living heritage' ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === 'Living heritage' ? 'All' : 'Living heritage')}
            >
              <i className="legend-dot dot-living" /> Living Heritage
            </button>
          </div>
        </div>

        {/* Right: GIS Sidebar with Search, Filters, and Location List */}
        <aside className="map-list gis-sidebar">
          <div className="sidebar-header">
            <div className="eyebrow muted">GEOGRAPHIC ARCHIVE</div>
            <h3>Heritage Monuments</h3>
            <p className="sidebar-subtext">Filter and locate monuments on the map.</p>
          </div>

          {/* Search Box */}
          <div className="map-search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="map-search-input"
              placeholder="Search site, era, place…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filters Row: Category and Region */}
          <div className="map-filters-row">
            <div className="filter-select-group">
              <label>Category</label>
              <select
                className="map-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <label>Region</label>
              <select
                className="map-select"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Badges & Reset Option */}
          {(searchQuery || categoryFilter !== 'All' || regionFilter !== 'All') && (
            <div className="filter-status-row">
              <span className="filter-status-text">
                Filters active ({filteredRecords.length} found)
              </span>
              <button 
                type="button" 
                className="reset-filters-btn" 
                onClick={handleResetFilters}
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          )}

          {/* Monument List */}
          <div className="map-monuments-scroll">
            {filteredRecords.length === 0 ? (
              <div className="empty-map-results">
                <AlertCircle size={22} className="empty-icon" />
                <b>No heritage sites found</b>
                <p>Try clearing your search query or selecting a different region/category.</p>
                <button type="button" className="outline-btn" onClick={handleResetFilters}>
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredRecords.map((r) => {
                const isChosen = selected && selected.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`map-item ${isChosen ? 'chosen' : ''}`}
                    onClick={() => setSelected(r)}
                  >
                    <img 
                      src={r.image || r.img} 
                      alt={r.title} 
                      loading="lazy" 
                      onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }}
                    />
                    <div>
                      <b>{r.title}</b>
                      <small><MapPin size={9} /> {r.place}</small>
                      <span className={`map-item-type cat-${(r.type || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {r.type} · {r.era}
                      </span>
                    </div>
                    <ChevronRight size={14} className="map-item-arrow" />
                  </button>
                );
              })
            )}
          </div>

          {/* Action to open Selected Record in Archive */}
          <div className="sidebar-footer">
            <button
              type="button"
              className="gold-btn full open-archive-btn"
              onClick={() => handleNavigateArchive(selected)}
            >
              <span>Examine {selected ? selected.title : 'Record'} in Archive</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </aside>
      </div>

      {/* Footnote */}
      <p className="fineprint" style={{ marginTop: 14 }}>
        Heritage coordinates are mapped to verified archaeological survey points. OpenStreetMap & Esri GIS tile layers operate freely without API keys or subscription.
      </p>
    </section>
  );
}
