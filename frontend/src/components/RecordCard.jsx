import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

export default function RecordCard({ record, onClick }) {
  return (
    <button className="record-card" onClick={onClick}>
      <div className="record-image">
        <img 
          src={record.img || record.image} 
          alt={record.title} 
          loading="lazy" 
          onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }}
        />
        <span className="record-type-badge">{record.type}</span>
        <span className="card-open" aria-hidden="true">
          <ArrowUpRight size={14} />
        </span>
      </div>
      <div className="record-content">
        <h3>{record.title}</h3>
        <p className="record-place">
          <MapPin size={12} />
          {record.place}
        </p>
        <div className="record-meta">
          <span>{record.era}</span>
          <span className="quality">{record.score}% completeness*</span>
        </div>
        <div className="record-tags">
          {record.tags.slice(0, 2).map((t) => (
            <small key={t}>{t}</small>
          ))}
        </div>
      </div>
    </button>
  );
}
