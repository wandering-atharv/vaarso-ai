import React, { useState, useCallback, useRef } from 'react';
import { Volume2, Languages, AlertCircle } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && !window.location.port.includes('5173') ? '' : 'http://localhost:8000');

const LANGUAGES = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
];

/**
 * Build a narration script from the heritage record's existing fields.
 * Does not invent any information — only uses what the record provides.
 */
function buildNarration(record) {
  const parts = [];
  const title = record.title || record.name || 'Heritage Monument';
  const place = record.place || record.state || 'India';
  const desc = record.desc || record.historical_context || '';
  const era = record.era || record.century || '';

  parts.push(`${title}, located in ${place}.`);

  if (desc) parts.push(desc);

  if (era) {
    let period = `This site dates from the ${era}`;
    if (record.dynasty) period += `, and is associated with the ${record.dynasty} dynasty`;
    parts.push(period + '.');
  }

  if (record.significance) parts.push(record.significance);

  if (record.source) {
    parts.push(`Source: ${record.source}.`);
  }

  return parts.join(' ');
}

/**
 * ListenToHistory — generates and plays AI-narrated heritage audio
 * using Sarvam AI TTS via the backend.
 */
export default function ListenToHistory({ record }) {
  const [lang, setLang] = useState('en-IN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const [activeLang, setActiveLang] = useState('');

  // Session cache: recordId-langCode → blob URL
  const cacheRef = useRef({});

  const generate = useCallback(async () => {
    if (!record?.title && !record?.name) {
      setError('No heritage record selected.');
      return;
    }

    const cacheKey = `${record.id}-${lang}`;
    if (cacheRef.current[cacheKey]) {
      setAudioSrc(cacheRef.current[cacheKey]);
      setActiveLang(lang);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    setAudioSrc(null);

    const text = buildNarration(record);

    try {
      const res = await fetch(`${API}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language_code: lang }),
      });
      const data = await res.json();

      if (data.audio_base64) {
        // Decode base64 → blob URL
        const binary = atob(data.audio_base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.content_type || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        cacheRef.current[cacheKey] = url;
        setAudioSrc(url);
        setActiveLang(lang);
      } else {
        setError(data.error || 'No audio was generated. Check backend configuration.');
      }
    } catch {
      setError('Could not reach the narration service. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [record, lang]);

  const langLabel = LANGUAGES.find((l) => l.code === activeLang)?.label || activeLang;

  return (
    <div className="listen-section">
      <div className="listen-head">
        <div className="listen-icon">
          <Volume2 size={18} />
        </div>
        <div>
          <b>Listen to History</b>
          <small>AI-narrated heritage guide · powered by Sarvam AI</small>
        </div>
      </div>

      <div className="listen-controls">
        <div className="listen-lang">
          <Languages size={14} />
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-btn ${lang === l.code ? 'active' : ''}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <button className="gold-btn" onClick={generate} disabled={loading}>
          {loading ? (
            <>
              <span className="spin-icon" /> Generating narration…
            </>
          ) : audioSrc ? (
            <>🔄 Regenerate narration</>
          ) : (
            <>▶ Listen to {record?.title || 'this site'}</>
          )}
        </button>
      </div>

      {error && (
        <div className="listen-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {audioSrc && (
        <AudioPlayer
          src={audioSrc}
          title={`${record?.title || 'Heritage'} — narration`}
          subtitle={langLabel}
        />
      )}

      <small className="fineprint" style={{ padding: 0, marginTop: 10 }}>
        AI-generated narration based on prototype record data. Verify historical
        details with authoritative sources before citation.
      </small>
    </div>
  );
}
