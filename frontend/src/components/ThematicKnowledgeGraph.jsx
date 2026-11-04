import React, { useState, useMemo, useRef } from 'react';
import {
  Search, ZoomIn, ZoomOut, RotateCcw, Maximize2, Layers, Compass, Clock,
  Crown, Droplets, Sparkles, Feather, FileText, MapPin, HeartHandshake,
  BookOpen, ExternalLink, ArrowRight, X, Info, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMATIC_CATEGORIES, KNOWLEDGE_GRAPHS, getMonumentGraph } from '../data/knowledgeGraphData';

const ICON_MAP = {
  Layers, Compass, Clock, Crown, Droplets, Sparkles, Feather, FileText, MapPin, HeartHandshake, BookOpen
};

// Node kind visual themes
const KIND_STYLES = {
  monument: { fill: '#C6A15B', border: '#E2C37A', textColor: '#141416', badge: 'Heritage Site' },
  dynasty: { fill: '#2A1F18', border: '#A98542', textColor: '#F5F0E6', badge: 'Dynasty' },
  architecture: { fill: '#1B262C', border: '#4E89AE', textColor: '#F5F0E6', badge: 'Architecture' },
  periods: { fill: '#222831', border: '#D65A31', textColor: '#F5F0E6', badge: 'Historical Period' },
  water_systems: { fill: '#102A38', border: '#00ADB5', textColor: '#F5F0E6', badge: 'Water Architecture' },
  religions: { fill: '#2B1B38', border: '#9D65C9', textColor: '#F5F0E6', badge: 'Religious Tradition' },
  sculpture: { fill: '#2C2A1E', border: '#E7B10A', textColor: '#F5F0E6', badge: 'Sculptural Art' },
  inscriptions: { fill: '#1E2B25', border: '#5B8C5A', textColor: '#F5F0E6', badge: 'Inscriptions & Epigraphy' },
  geography: { fill: '#1B2421', border: '#438A5E', textColor: '#F5F0E6', badge: 'Geography & Basin' },
  cultural_practices: { fill: '#2E1C22', border: '#C74B66', textColor: '#F5F0E6', badge: 'Cultural Practice' },
  archaeological: { fill: '#262228', border: '#8A799E', textColor: '#F5F0E6', badge: 'Archaeological Record' },
};

export default function ThematicKnowledgeGraph() {
  const { records, setSelected, setPage } = useApp();

  const [selectedMonumentId, setSelectedMonumentId] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContextNode, setActiveContextNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Load the graph for the currently selected monument
  const activeGraph = useMemo(() => {
    return getMonumentGraph(selectedMonumentId);
  }, [selectedMonumentId]);

  // All nodes in active graph: primary central node + connected thematic nodes
  const allNodes = useMemo(() => {
    if (!activeGraph) return [];
    return [activeGraph.primaryNode, ...activeGraph.nodes];
  }, [activeGraph]);

  // Node lookup map
  const nodeMap = useMemo(() => {
    const map = new Map();
    allNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [allNodes]);

  // Filtered nodes based on active thematic category & in-graph search
  const isNodeHighlighted = (node) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || node.label.toLowerCase().includes(query) || (node.context?.summary || '').toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (node.kind === 'monument') return true; // Central monument always visible
    return node.category === activeCategory;
  };

  // Switch to a new monument and reset pan/zoom
  const handleSelectMonument = (monId) => {
    const numId = Number(monId);
    setSelectedMonumentId(numId);
    setActiveContextNode(null);
    setSearchQuery('');
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.0, z + 0.15));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.6, z - 0.15));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveCategory('all');
    setSearchQuery('');
  };

  // View monument in archive
  const handleNavigateToArchive = (monumentId) => {
    const rec = records.find((r) => Number(r.id) === Number(monumentId));
    if (rec) {
      setSelected(rec);
      setPage('Archive');
    }
  };

  return (
    <div className="knowledge-graph-container">
      {/* Top Controls Bar */}
      <div className="kg-header-controls">
        <div className="kg-monument-selector-wrap">
          <label className="kg-control-label">Central Heritage Site:</label>
          <div className="kg-select-custom">
            <select
              value={selectedMonumentId}
              onChange={(e) => handleSelectMonument(e.target.value)}
              className="kg-monument-select"
            >
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}. {r.title} ({r.place})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="kg-select-arrow" />
          </div>
        </div>

        <div className="kg-search-box-wrap">
          <Search size={14} className="kg-search-icon" />
          <input
            type="text"
            placeholder="Search entities within network (e.g. Solanki, sundial, granite)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kg-search-input"
          />
          {searchQuery && (
            <button className="kg-search-clear" onClick={() => setSearchQuery('')}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="kg-zoom-controls">
          <button className="kg-tool-btn" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={14} />
          </button>
          <button className="kg-tool-btn" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={14} />
          </button>
          <button className="kg-tool-btn" onClick={handleResetZoom} title="Reset View">
            <RotateCcw size={14} />
          </button>
          <span className="kg-zoom-percent">{Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      {/* Thematic Category Filter Pills */}
      <div className="kg-categories-strip">
        <div className="kg-category-label">
          <span>THEMATIC FILTERS:</span>
        </div>
        <div className="kg-categories-scroll">
          {THEMATIC_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Layers;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`kg-category-pill ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon size={12} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Graph Viewport */}
      <div className="kg-canvas-viewport">
        <svg
          viewBox="0 0 860 520"
          className="kg-svg-canvas"
          role="img"
          aria-label={`Knowledge graph for ${activeGraph?.monumentTitle}`}
        >
          <defs>
            {/* Soft background grid pattern */}
            <pattern id="kg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--line)" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            {/* Gold glow filter for central monument */}
            <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Monument thumbnail clip path */}
            <clipPath id="monument-thumb-clip">
              <circle cx="430" cy="260" r="46" />
            </clipPath>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#kg-grid)" />

          {/* Zoom/Pan Transform Group */}
          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`} style={{ transformOrigin: '430px 260px', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            
            {/* Edges / Relationship Lines */}
            <g className="kg-edges-group">
              {activeGraph.edges.map((edge, idx) => {
                const sNode = nodeMap.get(edge.source);
                const tNode = nodeMap.get(edge.target);
                if (!sNode || !tNode) return null;

                const sVisible = isNodeHighlighted(sNode);
                const tVisible = isNodeHighlighted(tNode);
                const isEdgeActive = sVisible && tVisible;

                // Midpoint for relation text tag
                const midX = (sNode.x + tNode.x) / 2;
                const midY = (sNode.y + tNode.y) / 2;

                return (
                  <g key={`${edge.source}-${edge.target}-${idx}`} className={`kg-edge ${isEdgeActive ? 'active' : 'dimmed'}`}>
                    <line
                      x1={sNode.x}
                      y1={sNode.y}
                      x2={tNode.x}
                      y2={tNode.y}
                      stroke={isEdgeActive ? 'var(--gold)' : 'var(--line)'}
                      strokeWidth={isEdgeActive ? 1.8 : 0.8}
                      strokeOpacity={isEdgeActive ? 0.7 : 0.25}
                      strokeDasharray={edge.category === 'inscriptions' ? '4 3' : 'none'}
                    />
                    {/* Small relationship badge pill on line */}
                    {isEdgeActive && (
                      <g className="kg-edge-label-group" transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-45"
                          y="-9"
                          width="90"
                          height="18"
                          rx="3"
                          fill="var(--panel)"
                          stroke="var(--line)"
                          strokeWidth="0.8"
                          opacity="0.9"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fontSize="8.5"
                          fontFamily="var(--font-sans)"
                          fill="var(--gold2)"
                        >
                          {edge.relation}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Thematic Outer Nodes */}
            <g className="kg-thematic-nodes-group">
              {activeGraph.nodes.map((node) => {
                const isHighlight = isNodeHighlighted(node);
                const isSelected = activeContextNode?.id === node.id;
                const styleConfig = KIND_STYLES[node.kind] || KIND_STYLES.architecture;

                return (
                  <g
                    key={node.id}
                    className={`kg-node kg-thematic-node ${isHighlight ? 'active' : 'dimmed'} ${isSelected ? 'selected' : ''}`}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setActiveContextNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer soft glow when selected */}
                    {isSelected && (
                      <circle r="44" fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="3 2" opacity="0.8" />
                    )}

                    {/* Node Body Pill / Hex */}
                    <rect
                      x="-82"
                      y="-26"
                      width="164"
                      height="52"
                      rx="6"
                      fill={isHighlight ? 'var(--panel)' : 'rgba(20, 20, 22, 0.4)'}
                      stroke={isSelected ? 'var(--gold)' : (isHighlight ? styleConfig.border : 'var(--line)')}
                      strokeWidth={isSelected ? 2 : (isHighlight ? 1.4 : 0.8)}
                      filter={isHighlight ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' : 'none'}
                    />

                    {/* Category color indicator strip */}
                    <rect
                      x="-82"
                      y="-26"
                      width="5"
                      height="52"
                      rx="2"
                      fill={styleConfig.border}
                    />

                    {/* Node Kind Badge */}
                    <text
                      x="-70"
                      y="-12"
                      fontSize="7.5"
                      fontFamily="var(--font-sans)"
                      letterSpacing="0.6px"
                      fill={styleConfig.border}
                      fontWeight="600"
                    >
                      {styleConfig.badge.toUpperCase()}
                    </text>

                    {/* Node Title */}
                    <text
                      x="-70"
                      y="6"
                      fontSize="10.5"
                      fontFamily="var(--font-serif)"
                      fontWeight="600"
                      fill="var(--text)"
                    >
                      {node.label.length > 20 ? `${node.label.slice(0, 19)}…` : node.label}
                    </text>

                    {/* Subtitle / Period */}
                    <text
                      x="-70"
                      y="18"
                      fontSize="8"
                      fontFamily="var(--font-sans)"
                      fill="var(--text-secondary)"
                    >
                      {node.context?.period ? (node.context.period.length > 22 ? `${node.context.period.slice(0, 21)}…` : node.context.period) : 'Click for context'}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Central Primary Monument Node */}
            <g
              className="kg-node kg-primary-monument-node"
              transform="translate(430, 260)"
              onClick={() => setActiveContextNode(activeGraph.primaryNode)}
              style={{ cursor: 'pointer' }}
            >
              {/* Gold outer radiant rings */}
              <circle r="64" fill="none" stroke="var(--gold)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 3" />
              <circle r="56" fill="rgba(198, 161, 91, 0.12)" stroke="var(--gold2)" strokeWidth="1.5" />

              {/* Monument Photo Thumbnail */}
              {activeGraph.primaryNode.img ? (
                <g>
                  <circle cx="0" cy="0" r="48" fill="#141416" stroke="var(--gold)" strokeWidth="2.5" />
                  <image
                    href={activeGraph.primaryNode.img}
                    x="-48"
                    y="-48"
                    width="96"
                    height="96"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#monument-thumb-clip)"
                  />
                  {/* Subtle dark gradient overlay on image for label readability */}
                  <circle cx="0" cy="0" r="48" fill="rgba(0, 0, 0, 0.45)" />
                </g>
              ) : (
                <circle cx="0" cy="0" r="48" fill="var(--panel)" stroke="var(--gold)" strokeWidth="2" />
              )}

              {/* Central Title Overlay */}
              <rect x="-65" y="16" width="130" height="24" rx="4" fill="rgba(14, 18, 16, 0.88)" stroke="var(--gold)" strokeWidth="1" />
              <text
                x="0"
                y="32"
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-serif)"
                fontWeight="600"
                fill="#F5F0E6"
              >
                {activeGraph.primaryNode.label}
              </text>

              {/* Central Indicator Badge */}
              <rect x="-35" y="-58" width="70" height="15" rx="3" fill="#C6A15B" />
              <text x="0" y="-47" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#141416" letterSpacing="0.8px">
                PRIMARY SITE
              </text>
            </g>

          </g>
        </svg>

        {/* Floating Contextual Discovery Drawer */}
        {activeContextNode && (
          <div className="kg-context-drawer">
            <div className="kg-drawer-header">
              <div className="kg-drawer-badge-row">
                <span className="kg-node-badge" style={{ borderColor: KIND_STYLES[activeContextNode.kind]?.border, color: KIND_STYLES[activeContextNode.kind]?.border }}>
                  {KIND_STYLES[activeContextNode.kind]?.badge || 'Entity'}
                </span>
                {activeContextNode.context?.period && (
                  <span className="kg-period-chip">
                    <Clock size={11} /> {activeContextNode.context.period}
                  </span>
                )}
              </div>
              <button className="kg-drawer-close" onClick={() => setActiveContextNode(null)} title="Close context card">
                <X size={15} />
              </button>
            </div>

            <div className="kg-drawer-body">
              <h3 className="kg-drawer-title">{activeContextNode.context?.title || activeContextNode.label}</h3>

              <p className="kg-drawer-summary">
                {activeContextNode.context?.summary || 'Historical and architectural relation documented in platform archives.'}
              </p>

              {/* Key Features Bullet List */}
              {activeContextNode.context?.features && activeContextNode.context.features.length > 0 && (
                <div className="kg-drawer-features">
                  <h4>Key Architectural & Historical Characteristics</h4>
                  <ul>
                    {activeContextNode.context.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Monuments Links */}
              {activeContextNode.context?.related_monuments && activeContextNode.context.related_monuments.length > 0 && (
                <div className="kg-drawer-related">
                  <h4>Associated Heritage Sites</h4>
                  <div className="kg-related-tags">
                    {activeContextNode.context.related_monuments.map((mTitle) => {
                      const matchRec = records.find((r) => r.title.toLowerCase().includes(mTitle.toLowerCase()));
                      return (
                        <button
                          key={mTitle}
                          className="kg-related-btn"
                          onClick={() => {
                            if (matchRec) {
                              handleSelectMonument(matchRec.id);
                            }
                          }}
                        >
                          <Compass size={11} />
                          <span>{mTitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Primary Citations & Archival Sources */}
              {activeContextNode.context?.citations && (
                <div className="kg-drawer-citation">
                  <BookOpen size={13} className="kg-citation-icon" />
                  <div>
                    <b>Authoritative Source Reference:</b>
                    <p>{activeContextNode.context.citations}</p>
                  </div>
                </div>
              )}

              {/* Navigation Action */}
              <div className="kg-drawer-actions">
                {activeContextNode.kind === 'monument' ? (
                  <button
                    className="gold-btn full"
                    onClick={() => handleNavigateToArchive(selectedMonumentId)}
                  >
                    Examine Monument in Archive <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    className="outline-btn full"
                    onClick={() => setActiveContextNode(activeGraph.primaryNode)}
                  >
                    Return to {activeGraph.monumentTitle} <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Instructions Footer */}
      <div className="kg-footer-bar">
        <div className="kg-legend-items">
          <span className="kg-legend-item"><span className="legend-dot gold" /> Primary Monument</span>
          <span className="kg-legend-item"><span className="legend-dot brown" /> Dynasty</span>
          <span className="kg-legend-item"><span className="legend-dot cyan" /> Water Architecture</span>
          <span className="kg-legend-item"><span className="legend-dot green" /> Epigraphy & Inscription</span>
          <span className="kg-legend-item"><span className="legend-dot purple" /> Religious Traditions</span>
          <span className="kg-legend-item"><span className="legend-dot red" /> Cultural Practice</span>
        </div>
        <div className="kg-footer-hint">
          <Info size={12} />
          <span>Click any node to open contextual research cards without leaving the network.</span>
        </div>
      </div>
    </div>
  );
}
