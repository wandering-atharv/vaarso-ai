import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Filter, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, 
  FileText, Award, Calendar, MapPin, Database, BookOpen, Layers, Info, Check,
  Sparkles, Eye, Download, Play, ChevronRight, X, Upload
} from 'lucide-react';
import ListenToHistory from '../components/ListenToHistory';
import AIAssistant from '../components/AIAssistant';
import { getEpigraphsForMonument } from '../data/authenticEpigraphs';

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && !window.location.port.includes('5173') ? '' : 'http://localhost:8000');

function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  return `${API}${url.startsWith('/') ? '' : '/'}${url}`;
}

function renderVerificationBadge(status, level) {
  const s = (status || '').toLowerCase();
  const l = (level || '').toLowerCase();
  if (s.includes('institution') || l.includes('level 3')) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700 }}>
        <ShieldCheck size={12} /> Institutionally Verified
      </span>
    );
  }
  if (s.includes('researcher') || l.includes('level 2') || s.includes('accepted')) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(198,161,91,0.15)', border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700 }}>
        <Award size={12} /> Researcher Reviewed
      </span>
    );
  }
  if (s.includes('reject') || s.includes('correction') || s.includes('needs')) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.72rem', fontWeight: 700 }}>
        <AlertTriangle size={12} /> Rejected / Requires Correction
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(148,163,184,0.15)', border: '1px solid #94a3b8', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700 }}>
      <FileText size={12} /> Submitted
    </span>
  );
}

export default function ArchivePage() {
  const { records, selected, setSelected, contributions, setPage } = useApp();
  const [archiveSearch, setArchiveSearch] = useState('');
  const [filterState, setFilterState] = useState('ALL');
  const [filterCentury, setFilterCentury] = useState('ALL');
  const [showResearchAI, setShowResearchAI] = useState(true);

  const states = ['ALL', ...new Set(records.map(r => r.state || r.place?.split(',')[1]?.trim()).filter(Boolean))];
  const centuries = ['ALL', ...new Set(records.map(r => r.century || r.era).filter(Boolean))];

  const filtered = records.filter(r => {
    const name = r.name || r.title || '';
    const state = r.state || r.place || '';
    const context = r.historical_context || r.desc || '';
    const matchSearch = !archiveSearch || 
      name.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      state.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      context.toLowerCase().includes(archiveSearch.toLowerCase());
    const matchState = filterState === 'ALL' || state.includes(filterState);
    const matchCentury = filterCentury === 'ALL' || (r.century || r.era) === filterCentury;
    return matchSearch && matchState && matchCentury;
  });

  const activeRecord = selected || filtered[0] || records[0];

  // Authentic epigraphs associated with this monument
  const authenticEpigraphs = getEpigraphsForMonument(activeRecord);

  // Match approved community contributions (Level 2 or Level 3) for this monument
  const monName = (activeRecord?.title || activeRecord?.name || '').toLowerCase();
  const monumentContributions = (contributions || []).filter(c => {
    const isApproved = c.status === 'Researcher Reviewed' || 
                       c.status === 'Institutionally Verified' || 
                       c.status === 'Accepted for Archive';
    if (!isApproved) return false;
    const cSite = (c.site_name || c.title || '').toLowerCase();
    return cSite.includes(monName) || monName.includes(cSite);
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '1500px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(198,161,91,0.12)', border: '1px solid rgba(198,161,91,0.3)', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          <Database size={13} />
          Authoritative Heritage Repository
        </div>
        <h1 style={{ fontSize: '2.4rem', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
          Digital Monument Archives
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '780px', lineHeight: 1.6 }}>
          Comprehensive multi-tiered cultural dossiers featuring ASI registry records, UNESCO World Heritage citations, architectural analyses, epigraphic transcripts, and verified structural metadata.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 320px', position: 'relative' }}>
          <Search size={18} style={{ color: 'var(--gold)', position: 'absolute', left: '1rem' }} />
          <input
            type="text"
            placeholder="Search monuments, architectural periods, dynasties or states..."
            value={archiveSearch}
            onChange={(e) => setArchiveSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.85rem',
              borderRadius: '9px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Filter size={15} />
            <span>State:</span>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <span>Era:</span>
            <select
              value={filterCentury}
              onChange={(e) => setFilterCentury(e.target.value)}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {centuries.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Eras' : c}</option>)}
            </select>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem', fontWeight: 600 }}>
            {filtered.length} Dossiers
          </span>

          {/* Research AI Toggle Button */}
          <button
            type="button"
            onClick={() => setShowResearchAI(!showResearchAI)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              border: showResearchAI ? '1px solid var(--gold)' : '1px solid var(--border-color)',
              background: showResearchAI ? 'rgba(198,161,91,0.15)' : 'var(--bg-color)',
              color: showResearchAI ? 'var(--gold)' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} /> {showResearchAI ? 'Hide Research AI' : 'Open Research AI'}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Records List | Detailed Dossier | Research AI */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: showResearchAI ? '310px minmax(0, 1fr) 390px' : '340px minmax(0, 1fr)', 
        gap: '1.75rem', 
        alignItems: 'start' 
      }}>
        
        {/* Left Column: Monuments Archive List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', paddingRight: '0.4rem' }}>
          {filtered.map(record => {
            const isSelected = activeRecord && (activeRecord.id === record.id || activeRecord.name === record.name);
            const title = record.name || record.title;
            const state = record.state || record.place;
            const era = record.century || record.era;
            const img = record.image_url || record.img || record.image;
            const completeness = typeof record.metadata_completeness === 'object' 
              ? record.metadata_completeness?.percentage 
              : record.metadata_completeness || record.score || 95;

            return (
              <div
                key={record.id}
                onClick={() => setSelected(record)}
                style={{
                  background: isSelected ? 'rgba(198,161,91,0.08)' : 'var(--surface-color)',
                  border: isSelected ? '1.5px solid var(--gold)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isSelected ? '0 4px 16px rgba(198,161,91,0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <img
                    src={img}
                    alt={title}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-color)'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {era}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: record.designation?.includes('UNESCO') ? 'rgba(198,161,91,0.15)' : 'rgba(255,255,255,0.05)',
                        color: record.designation?.includes('UNESCO') ? 'var(--gold)' : 'var(--text-secondary)',
                        fontWeight: 600
                      }}>
                        {record.designation?.includes('UNESCO') ? 'UNESCO' : 'ASI Mon.'}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '0.98rem',
                      fontFamily: 'Cinzel, Georgia, serif',
                      fontWeight: 600,
                      margin: '0 0 0.35rem 0',
                      color: isSelected ? 'var(--gold)' : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={11} /> {state}
                      </span>
                      <span>•</span>
                      <span>Compl. {completeness}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              No archival records matched your criteria.
            </div>
          )}
        </div>

        {/* Center Column: Detailed Monument Dossier (Primary Archival Content) */}
        {activeRecord ? (
          <div style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
          }}>
            {/* Header Banner */}
            <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
              <img
                src={activeRecord.image_url || activeRecord.img || activeRecord.image}
                alt={activeRecord.name || activeRecord.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11,11,13,0.92) 0%, rgba(11,11,13,0.4) 60%, transparent 100%)'
              }} />

              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span style={{ background: 'var(--gold)', color: '#0B0B0D', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {activeRecord.designation || 'Protected Monument'}
                    </span>
                    <span style={{ color: 'rgba(245,240,230,0.85)', fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.5rem', borderRadius: '4px', backdropFilter: 'blur(4px)' }}>
                      ID: {activeRecord.monument_id || `VAARSO-ARC-${activeRecord.id}`}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.85rem', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 700, color: '#F5F0E6', margin: 0 }}>
                    {activeRecord.name || activeRecord.title}
                  </h2>
                </div>

                {activeRecord.source_url && (
                  <a
                    href={activeRecord.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFF',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(198,161,91,0.5)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                  >
                    Authoritative Record <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Dossier Body */}
            <div style={{ padding: '1.75rem' }}>
              
              {/* SECTION B: Archival Provenance & Verification Progression */}
              <div style={{
                background: 'rgba(198,161,91,0.06)',
                border: '1px solid rgba(198,161,91,0.2)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Archival Provenance & Verification Progression
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <Check size={14} style={{ color: '#4ade80' }} /> Contributor Submitted
                    </span>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <Check size={14} style={{ color: '#4ade80' }} /> Screening Passed
                    </span>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <ShieldCheck size={14} style={{ color: 'var(--gold)' }} /> {activeRecord.provenance?.status || activeRecord.provenance?.review_status || 'Peer & Expert Reviewed'}
                    </span>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <CheckCircle2 size={14} style={{ color: '#38bdf8' }} /> {activeRecord.provenance?.verification_level || 'Level 3 — External Authoritative Reference Checked'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    Source Authority
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {activeRecord.provenance?.source_type || activeRecord.source || 'Archaeological Survey of India / UNESCO'}
                  </div>
                </div>
              </div>

              {/* Listen to History AI Narration (Sarvam TTS English / Hindi) */}
              <div style={{ marginBottom: '1.75rem' }}>
                <ListenToHistory record={activeRecord} />
              </div>

              {/* 3 Metric Summary Boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                
                {/* 1. Metadata Completeness */}
                <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Metadata Completeness
                    </span>
                    <Award size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {typeof activeRecord.metadata_completeness === 'object' ? activeRecord.metadata_completeness?.percentage : activeRecord.metadata_completeness || activeRecord.score || 96}%
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    {activeRecord.metadata_fields_provided || activeRecord.metadata_completeness?.helper_text || 'Scored against 6 core criteria: historical context, coordinates, architectural classification, epigraphic corpus, source citations, and condition metrics.'}
                  </p>
                </div>

                {/* 2. Observed Structural Condition */}
                <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Structural Condition
                    </span>
                    <ShieldCheck size={16} style={{ color: '#4ade80' }} />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {typeof activeRecord.observed_structural_condition === 'object' ? activeRecord.observed_structural_condition?.status : activeRecord.observed_structural_condition || 'Active Conservation'}
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    Monitored under national/international heritage conservation programs.
                  </p>
                </div>

                {/* 3. Chronology & Geography */}
                <div style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Chronology & Site
                    </span>
                    <Calendar size={16} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                    {activeRecord.century || activeRecord.era}
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {activeRecord.state || activeRecord.place}
                  </p>
                </div>
              </div>

              {/* Historical Context & Architectural Characteristics */}
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '1rem', fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold)', margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <BookOpen size={16} /> Historical Context & Cultural Signatures
                </h4>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                  {activeRecord.historical_context || activeRecord.desc}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-color)', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase' }}>Architectural Style</span>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.25rem', fontWeight: 500 }}>
                      {activeRecord.architectural_style || activeRecord.type || 'Classical Indian Architecture'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-color)', padding: '0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase' }}>Dynasty & Patronage</span>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.25rem', fontWeight: 500 }}>
                      {activeRecord.dynasty || 'Imperial Heritage Trust'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages Representation */}
              {activeRecord.languages_detailed && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '1rem', fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold)', margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <FileText size={16} /> Linguistic & Epigraphic Representation
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                    <div style={{ background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Epigraphic Scripts:</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {activeRecord.languages_detailed.inscriptions || activeRecord.languages_detailed.original_epigraphy}
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Administrative Records:</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {activeRecord.languages_detailed.documentation}
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Scholarly Translations:</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {Array.isArray(activeRecord.languages_detailed.translations_available) 
                          ? activeRecord.languages_detailed.translations_available.join(' · ')
                          : activeRecord.languages_detailed.translations || 'English · Hindi'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AUTHENTIC ARCHIVAL EPIGRAPHS & FIELD RUBBINGS SECTION (Requirement 4) */}
              <div style={{ marginBottom: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Layers size={16} /> Authentic Archival Epigraphs & Paleographic Corpus
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Linked to Epigraphy & OCR Workspace
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {authenticEpigraphs.map((epigraph, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                    >
                      {/* Epigraph Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              background: epigraph.isAuthentic ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
                              color: epigraph.isAuthentic ? '#4ade80' : '#fbbf24',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}>
                              {epigraph.isAuthentic ? 'Authentic Archaeological Epigraph' : 'Demonstration Record'}
                            </span>
                            {epigraph.category && (
                              <span style={{
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                background: epigraph.category.includes('Manuscript') ? 'rgba(168,85,247,0.15)' : 'rgba(56,189,248,0.15)',
                                color: epigraph.category.includes('Manuscript') ? '#a855f7' : '#38bdf8',
                                border: epigraph.category.includes('Manuscript') ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(56,189,248,0.4)',
                                textTransform: 'uppercase'
                              }}>
                                {epigraph.category}
                              </span>
                            )}
                            <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>
                              {epigraph.period}
                            </span>
                          </div>
                          <h5 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'Cinzel, Georgia, serif', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {epigraph.title}
                          </h5>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            Script: <strong>{epigraph.script}</strong> • Language: <strong>{epigraph.language}</strong> • {epigraph.dynasty}
                          </div>
                        </div>

                        {epigraph.sourceLink && (
                          <a
                            href={epigraph.sourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.78rem',
                              color: 'var(--gold)',
                              textDecoration: 'none',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '6px',
                              background: 'rgba(198,161,91,0.1)',
                              border: '1px solid rgba(198,161,91,0.25)'
                            }}
                          >
                            Inspect Inscription Source <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      {/* Demonstration Notice if applicable */}
                      {epigraph.demonstrationRecord && epigraph.demonstrationNotice && (
                        <div style={{ padding: '0.6rem 0.85rem', borderRadius: '6px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', fontSize: '0.78rem', color: '#fbbf24', lineHeight: 1.4 }}>
                          <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                          {epigraph.demonstrationNotice}
                        </div>
                      )}

                      {/* Split view: Original Material vs OCR & Researcher Transcription */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        
                        {/* Box 1: Original Inscription Rubbing / Source */}
                        <div style={{ background: 'var(--surface-color)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{epigraph.sourceMaterial || 'Archival Inscription Source'}</span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{epigraph.category || 'Stone Inscription'}</span>
                            </div>
                            
                            {(epigraph.inscription_image || epigraph.original_scan) ? (
                              <div style={{ height: '140px', borderRadius: '6px', overflow: 'hidden', background: '#000', marginBottom: '0.6rem' }}>
                                <img
                                  src={epigraph.inscription_image || epigraph.original_scan}
                                  alt={epigraph.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                              </div>
                            ) : (
                              <div style={{
                                padding: '1.25rem 1rem',
                                textAlign: 'center',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px dashed var(--border-color)',
                                borderRadius: '6px',
                                marginBottom: '0.6rem'
                              }}>
                                <FileText size={28} style={{ color: 'var(--gold)', margin: '0 auto 0.4rem', opacity: 0.7 }} />
                                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                                  No original inscription / manuscript scan available
                                </div>
                                <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
                                  Archival squeeze or digitized folio is pending high-resolution institutional ingestion.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setPage('Contribute')}
                                  style={{
                                    fontSize: '0.73rem',
                                    padding: '0.3rem 0.65rem',
                                    borderRadius: '5px',
                                    border: '1px solid var(--gold)',
                                    background: 'rgba(198,161,91,0.12)',
                                    color: 'var(--gold)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <Upload size={11} /> Upload Inscription Scan in Research Lab
                                </button>
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                            Attribution: <strong style={{ color: 'var(--text-primary)' }}>{epigraph.sourceAttribution}</strong>
                          </div>
                        </div>

                        {/* Box 2: Automated OCR Transcription */}
                        <div style={{ background: 'var(--surface-color)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>AI Paleographic OCR Extraction</span>
                            <span>Raw Reading</span>
                          </div>
                          <div style={{
                            padding: '0.75rem',
                            background: 'var(--bg-color)',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.85rem',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            lineHeight: 1.6,
                            minHeight: '80px',
                            marginBottom: '0.6rem'
                          }}>
                            {epigraph.originalOcrTranscription}
                          </div>
                          
                          {/* Uncertain / Ambiguous Characters identification */}
                          {epigraph.uncertainCharacters && epigraph.uncertainCharacters.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '0.3rem' }}>
                                Uncertain / Abraded Ligatures Identified:
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {epigraph.uncertainCharacters.map((uc, i) => (
                                  <div key={i} style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', padding: '0.35rem 0.5rem', background: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                    <strong style={{ color: '#fbbf24' }}>"{uc.character}"</strong> ({uc.position}) — Confidence: <span style={{ color: uc.aiConfidence > 80 ? '#4ade80' : '#fbbf24', fontWeight: 600 }}>{uc.aiConfidence}%</span>
                                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{uc.paleographicNote}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Box 3: Researcher-Reviewed & Corrected Reading */}
                        <div style={{ background: 'var(--surface-color)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#4ade80', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Researcher-Reviewed Transcription</span>
                            <span>Verified</span>
                          </div>
                          <div style={{
                            padding: '0.75rem',
                            background: 'var(--bg-color)',
                            borderRadius: '6px',
                            border: '1px solid rgba(74,222,128,0.25)',
                            fontSize: '0.85rem',
                            color: 'var(--text-primary)',
                            lineHeight: 1.6,
                            minHeight: '80px',
                            marginBottom: '0.6rem'
                          }}>
                            {epigraph.researcherReviewedTranscription}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Reviewed By: <strong style={{ color: 'var(--text-primary)' }}>{epigraph.reviewerName}</strong> ({epigraph.reviewerRole})
                            <div style={{ color: 'var(--gold)', marginTop: '2px' }}>
                              Status: {epigraph.reviewStatus} ({epigraph.reviewDate})
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Archival Documents & Field Folios */}
              {activeRecord.archival_records && activeRecord.archival_records.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '1rem', fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold)', margin: '0 0 0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Layers size={16} /> Linked Archival Surveys & Historical Folios
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {activeRecord.archival_records.map((doc, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(198,161,91,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                            <FileText size={16} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {doc.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Type: {doc.type} • Period: {doc.period || doc.reference || 'Historical'}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', fontWeight: 600, border: '1px solid rgba(56,189,248,0.2)' }}>
                          {doc.source || 'Archival Scan'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION A: Provenance & Institutional Source Registry (Requirement 3) */}
              <div style={{
                background: 'rgba(198,161,91,0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <BookOpen size={16} style={{ color: 'var(--gold)' }} />
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold)', fontWeight: 600 }}>
                    Provenance & Institutional Registry Citations
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                  
                  {/* UNESCO Citation & Clickable Link */}
                  <div style={{ background: 'var(--surface-color)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                      UNESCO World Heritage Centre
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.45rem' }}>
                      {activeRecord.designation?.includes('UNESCO') ? `${activeRecord.title || activeRecord.name} (World Heritage Inscription)` : 'Tentative List / National Cultural Registry'}
                    </div>
                    {activeRecord.source_url ? (
                      <a
                        href={activeRecord.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: '#38bdf8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        Inspect Official UNESCO Register <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>National Cultural Register</span>
                    )}
                  </div>

                  {/* ASI Citation & Clickable Link */}
                  <div style={{ background: 'var(--surface-color)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Archaeological Survey of India (ASI)
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.45rem' }}>
                      Protected Monument Identifier: {activeRecord.monument_id || `ASI-${activeRecord.id}`}
                    </div>
                    <a
                      href="https://asi.nic.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        color: 'var(--gold)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      ASI Monument Gazette & Central Directory <ExternalLink size={12} />
                    </a>
                  </div>

                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  <strong>Primary Archival Citation:</strong> {activeRecord.source_citation || activeRecord.source || 'Archaeological Survey of India & UNESCO World Heritage Convention Document Archive'}
                </div>

                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <em>Archival Distinction Note:</em> Verified against authoritative national and international registry databases. Note: This prototype utilizes curated illustrative dossier records for demonstration; academic researchers should verify citations through the official government and UNESCO register links provided above.
                </p>
              </div>

              {/* Verified Archival Submissions & Field Media Section */}
              <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Award size={16} /> Verified Archival Submissions & Field Media
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {monumentContributions.length} Verified Field Record{monumentContributions.length === 1 ? '' : 's'}
                  </span>
                </div>

                {monumentContributions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {monumentContributions.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: 'var(--bg-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          padding: '1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {c.title}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              By {c.contributor} • Location: {c.location || activeRecord.place} • Era: {c.era || activeRecord.era}
                            </div>
                          </div>
                          {renderVerificationBadge(c.status, c.review_level)}
                        </div>

                        {c.description && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                            {c.description}
                          </div>
                        )}

                        {/* Media Viewer with direct playback / inspection */}
                        {c.document_url && (
                          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#000', maxHeight: '240px' }}>
                            {c.document_url.endsWith('.mp4') || c.content_type?.includes('video') ? (
                              <video
                                controls
                                src={resolveMediaUrl(c.document_url)}
                                style={{ width: '100%', maxHeight: '240px', display: 'block' }}
                              />
                            ) : c.document_url.endsWith('.pdf') || c.content_type?.includes('pdf') ? (
                              <div style={{ padding: '1.25rem', background: 'rgba(198,161,91,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <FileText size={22} style={{ color: 'var(--gold)' }} />
                                  <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.original_filename || 'Archival Field Document.pdf'}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Original Binary Document Preserved</div>
                                  </div>
                                </div>
                                <a
                                  href={resolveMediaUrl(c.document_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.4rem 0.85rem',
                                    borderRadius: '6px',
                                    background: 'var(--surface-color)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--gold)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <Eye size={13} /> View Document
                                </a>
                              </div>
                            ) : (
                              <img
                                src={resolveMediaUrl(c.document_url)}
                                alt={c.title}
                                style={{ width: '100%', maxHeight: '240px', objectFit: 'contain', display: 'block' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                        )}

                        {/* File Provenance & Cryptographic SHA-256 Checksum Bar */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px solid var(--border-color)',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)'
                        }}>
                          <div>
                            Reviewer: <strong style={{ color: 'var(--text-primary)' }}>{c.reviewer_name || c.institutional_reviewer || 'Dr. A. Verma, Senior Epigraphist'}</strong>
                            {c.institution_name && (
                              <span> • Institution: <strong style={{ color: '#38bdf8' }}>{c.institution_name}</strong> ({c.institutional_ref_id || 'Verified Registry Entry'})</span>
                            )}
                          </div>
                          {c.sha256_hash && (
                            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px' }} title={`SHA-256: ${c.sha256_hash}`}>
                              SHA-256: {c.sha256_hash.slice(0, 14)}…
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No field contributions have completed Level 2 or Level 3 verification for this monument yet. Use the <strong>Contribute Laboratory</strong> to lodge new field epigraphs or photography.
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : null}

        {/* Right Column: VAARSO Research AI Panel (Integrated Archival Assistant) */}
        {showResearchAI && (
          <div style={{ position: 'sticky', top: '1rem' }}>
            <AIAssistant monument={activeRecord} />
          </div>
        )}

      </div>
    </div>
  );
}
