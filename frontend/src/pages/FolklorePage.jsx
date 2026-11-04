import React from 'react';
import { AudioLines, MapPin } from 'lucide-react';

export default function FolklorePage() {
  return (
    <section className="page-wrap">
      <div className="page-title">
        <div>
          <div className="eyebrow muted">ECHOES OF THE PAST</div>
          <h1>Folklore & <em>oral history.</em></h1>
          <p>Regional folklore, oral interviews, local legends, folk songs, traditional storytelling, historical anecdotes and regional dialect recordings.</p>
        </div>
      </div>
      <div className="graph-panel" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <AudioLines size={40} style={{ color: 'var(--gold)', opacity: 0.5, marginBottom: 16 }} />
        <h2 style={{ font: '400 24px var(--font-serif)', margin: '0 0 12px' }}>Coming in the next phase</h2>
        <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
          This section will include curated folklore entries with audio players, waveform visualisation,
          video embeds, transcripts, translations, and connections to heritage sites across India.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 28, color: 'var(--muted)', fontSize: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><AudioLines size={13} /> Audio & video players</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={13} /> Site connections</span>
        </div>
      </div>
    </section>
  );
}
