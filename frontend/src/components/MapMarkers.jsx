import React, { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';

/* Category-specific SVG and color configurations */
function createCategoryIcon(type, isSelected) {
  const typeKey = (type || '').toLowerCase();
  let categoryClass = 'cat-temple';
  let glyphSvg = '';

  if (typeKey.includes('stepwell')) {
    categoryClass = 'cat-stepwell';
    glyphSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 6c3 0 3 3 6 3s3-3 6-3 3 3 6 3"/><path d="M2 12c3 0 3 3 6 3s3-3 6-3 3 3 6 3"/><path d="M2 18c3 0 3 3 6 3s3-3 6-3 3 3 6 3"/></svg>';
  } else if (typeKey.includes('fort')) {
    categoryClass = 'cat-fort';
    glyphSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 21V9l4-4 4 4v12"/><path d="M12 21V9l4-4 4 4v12"/><path d="M4 21h16"/></svg>';
  } else if (typeKey.includes('living')) {
    categoryClass = 'cat-living';
    glyphSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
  } else {
    // Temple / Sacred architecture
    categoryClass = 'cat-temple';
    glyphSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 22 22 22"/><circle cx="12" cy="14" r="3"/></svg>';
  }

  const selectedClass = isSelected ? 'selected-pin' : '';
  const html = `
    <div class="heritage-gis-marker ${categoryClass} ${selectedClass}">
      <div class="marker-pulse"></div>
      <div class="marker-pin">
        <span class="marker-icon">${glyphSvg}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'heritage-gis-icon-wrapper',
    html,
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    popupAnchor: [0, -36],
  });
}

export default function MapMarkers({ records, selected, onSelect, onNavigateArchive }) {
  const map = useMap();
  const markerRefs = useRef({});

  // Ensure map size is accurately calculated
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map]);

  // When selected record changes, open its popup if marker exists
  useEffect(() => {
    if (selected && markerRefs.current[selected.id]) {
      markerRefs.current[selected.id].openPopup();
    }
  }, [selected]);

  return records.map((r) => {
    if (!r.lat || !r.lng) return null;
    const isSelected = selected && selected.id === r.id;

    return (
      <Marker
        key={r.id}
        ref={(el) => {
          if (el) markerRefs.current[r.id] = el;
          else delete markerRefs.current[r.id];
        }}
        position={[r.lat, r.lng]}
        icon={createCategoryIcon(r.type, isSelected)}
        eventHandlers={{
          click: () => {
            onSelect(r);
          },
        }}
      >
        <Popup className="heritage-map-popup" maxWidth={280}>
          <div className="popup-card">
            <div className="popup-image-wrap">
              <img 
                src={r.image || r.img} 
                alt={r.title} 
                onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }} 
              />
              <span className={`popup-category-badge cat-${(r.type || '').toLowerCase().replace(/\s+/g, '-')}`}>
                {r.type}
              </span>
            </div>
            <div className="popup-body">
              <h4 className="popup-title">{r.title}</h4>
              <div className="popup-meta-item">
                <MapPin size={11} />
                <span>{r.place}</span>
              </div>
              <div className="popup-meta-item">
                <Clock size={11} />
                <span>{r.era} {r.dynasty ? `· ${r.dynasty}` : ''}</span>
              </div>
              <p className="popup-desc">{r.desc}</p>
              <button
                type="button"
                className="popup-archive-btn"
                onClick={() => {
                  onSelect(r);
                  if (onNavigateArchive) onNavigateArchive(r);
                }}
              >
                <span>Examine in Archive</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}
