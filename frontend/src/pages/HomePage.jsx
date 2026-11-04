import React from 'react';
import {
  Search, ArrowUpRight, ChevronRight, Sparkles, ScanText,
  Image as ImageIcon, Network, MapPin, Box,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { query, setQuery, setSearch, setPage, setSelected, records } = useApp();

  function handleSearch(e) {
    e.preventDefault();
    setSearch(query.trim());
    setPage('Explore');
  }

  const features = [
    [Sparkles, 'AI Research', 'Ask questions across records', 'Archive'],
    [ScanText, 'OCR & Language', 'Make scans searchable', 'Contribute'],
    [ImageIcon, 'Visual Discovery', 'Find related photographs', 'Explore'],
    [Network, 'Knowledge Graph', 'Follow connected stories', 'Collections'],
    [MapPin, 'Heritage Map', 'Explore by place', 'Map'],
    [Box, '3D Exploration', 'Inspect digital models', 'Archive'],
  ];

  const quickTags = ['Stepwells in Gujarat', 'Temple architecture', 'Oral histories', 'Ancient inscriptions'];

  return (
    <>
      <section className="hero">
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            EXPLORE · RESEARCH · PRESERVE
          </div>
          <h1>Discover India's<br /><em>timeless heritage.</em></h1>
          <p>
            Bring scattered archives, documents, photographs and oral histories
            together — and discover the stories that connect India's cultural legacy.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search monuments, documents, or ask a question…"
            />
            <button type="submit" aria-label="Search"><ArrowUpRight size={18} /></button>
          </form>
          <div className="quicktags" style={{ marginTop: 14 }}>
            {quickTags.map((t) => (
              <button key={t} onClick={() => { setQuery(t); setSearch(t); setPage('Explore'); }}>{t}</button>
            ))}
          </div>
        </div>
        <div className="hero-caption">
          <span>01 / LIVING ARCHIVE</span>
          <p>Every stone holds<br />a story worth finding.</p>
        </div>
        <div className="hero-credit">Illustrative heritage imagery · verify records before research use</div>
      </section>

      <section className="feature-strip">
        {features.map(([Icon, title, subtitle, target]) => (
          <button key={title} className="feature" onClick={() => setPage(target)}>
            <Icon />
            <div>
              <b>{title}</b>
              <small>{subtitle}</small>
            </div>
            <ChevronRight size={13} className="feature-arrow" />
          </button>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted">CURATED PATHS</div>
            <h2>Begin with a story.</h2>
          </div>
          <button className="textlink" onClick={() => setPage('Explore')}>
            Explore archive <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="collection-grid">
          {records.slice(0, 4).map((r, i) => (
            <button className="collection-card" key={r.id} onClick={() => { setSelected(r); setPage('Archive'); }}>
              <img 
                src={r.img || r.image} 
                alt={r.title} 
                loading="lazy" 
                onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }}
              />
              <span className="collection-num">0{i + 1}</span>
              <div className="collection-info">
                <small>{r.type.toUpperCase()} · {r.place.split(',').pop()?.trim().toUpperCase()}</small>
                <h3>{r.title}</h3>
                <span>Explore record <ArrowUpRight size={12} /></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="home-lower">
        <div className="archive-callout">
          <div>
            <div className="eyebrow muted">THE ARCHIVE</div>
            <h2>More than a repository.<br /><em>A connected memory.</em></h2>
            <p>Search records, inspect source material, and follow relationships between places, people, architecture and living traditions.</p>
            <button className="gold-btn" onClick={() => setPage('Archive')} style={{ marginTop: 16 }}>
              Enter the archive <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="callout-stats">
            <button className="stat-card-btn" onClick={() => setPage('Explore')}>
              <b>01</b><span>Source-linked<br />discovery</span>
            </button>
            <button className="stat-card-btn" onClick={() => setPage('Contribute')}>
              <b>02</b><span>Multilingual<br />records</span>
            </button>
            <button className="stat-card-btn" onClick={() => setPage('Map')}>
              <b>03</b><span>Place-based<br />exploration</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
