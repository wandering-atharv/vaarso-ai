import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  Send,
  LoaderCircle,
  RotateCcw,
  Compass,
  Search,
  BookOpen,
  Info,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PREDEFINED_CATEGORIES = [
  {
    id: 'exploration',
    label: 'Heritage Exploration',
    icon: Compass,
    questions: [
      'What makes Rani ki Vav architecturally unique?',
      'Compare Rani ki Vav and Adalaj Stepwell.',
      'Explain the engineering behind ancient Indian stepwells.',
      'What makes Konark Sun Temple historically significant?',
    ],
  },
  {
    id: 'research',
    label: 'Research Assistant',
    icon: BookOpen,
    questions: [
      'Explain the architectural features of this monument.',
      'What historical information should a researcher investigate?',
      'Identify the cultural significance of this heritage site.',
      'What information is missing from this heritage record?',
    ],
  },
  {
    id: 'discovery',
    label: 'Discover',
    icon: Search,
    questions: [
      'Show important UNESCO World Heritage Sites in India.',
      'Which Indian monuments demonstrate advanced water management?',
      'Explore important examples of Chola architecture.',
    ],
  },
];

export default function AIAssistant({ monument = null }) {
  const { messages, chat, setChat, busy, askAI, clearMessages, selected, records } = useApp();
  const [activeCategory, setActiveCategory] = useState('exploration');
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef(null);

  const currentMon = monument || selected || (records && records[0]);
  const monTitle = currentMon?.title || currentMon?.name;
  const monPlace = currentMon?.place || currentMon?.state;

  // Auto-scroll messages container on new response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const handleSelectQuestion = (q) => {
    if (busy) return;
    let effectiveQuestion = q;
    const targetTitle = monTitle || 'Rani ki Vav';
    if (q.includes('this monument')) {
      effectiveQuestion = q.replace(/this monument/gi, targetTitle);
    } else if (q.includes('this heritage site')) {
      effectiveQuestion = q.replace(/this heritage site/gi, targetTitle);
    } else if (q.includes('this heritage record')) {
      effectiveQuestion = q.replace(/this heritage record/gi, `the ${targetTitle} record`);
    }
    askAI(null, effectiveQuestion);
  };

  const currentCategory = PREDEFINED_CATEGORIES.find((c) => c.id === activeCategory) || PREDEFINED_CATEGORIES[0];

  return (
    <aside className="assistant-panel" style={{ minHeight: '520px', position: 'relative' }}>
      {/* Header */}
      <div className="panel-head" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="ai-symbol">
            <Sparkles size={16} />
          </div>
          <div>
            <b>VAARSO Research AI</b>
            <small>Scholarly Archival Assistant · Gemini API</small>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearMessages}
              title="Reset conversation"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px'
              }}
            >
              <RotateCcw size={12} /> Clear
            </button>
          )}
          <span className="live-dot" title="Live Gemini API Active" />
        </div>
      </div>

      {/* Context banner */}
      <div className="chat-context" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>
          Grounding: <strong>{monTitle ? `${monTitle} (${monPlace || 'India'})` : 'All 12 Archive Monuments'}</strong>
        </span>
        <button
          type="button"
          onClick={() => setShowPrompts((p) => !p)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold, #d97706)',
            fontSize: '9px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {showPrompts ? 'Hide Prompts' : 'Show Prompts'}
        </button>
      </div>

      {/* Predefined Clickable Prompts Section */}
      {showPrompts && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', background: 'var(--gold-dim)' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', overflowX: 'auto' }}>
            {PREDEFINED_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '9.5px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: isActive ? '1px solid var(--gold)' : '1px solid var(--line)',
                    background: isActive ? 'var(--gold-dim)' : 'transparent',
                    color: isActive ? 'var(--gold)' : 'var(--muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={10} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Buttons Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {currentCategory.questions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuestion(q)}
                disabled={busy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  padding: '6px 9px',
                  fontSize: '10.5px',
                  color: 'var(--text)',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.15s, background 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.background = 'var(--gold-dim)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.background = 'var(--surface)';
                }}
              >
                <span>{q}</span>
                <ArrowUpRight size={11} style={{ flexShrink: 0, marginLeft: '6px', color: 'var(--gold)' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Thread */}
      <div className="chat-messages" style={{ flex: 1, maxHeight: '340px' }}>
        {messages.length === 0 && (
          <div className="starter" style={{ padding: '20px 10px' }}>
            <Sparkles size={20} />
            <b>Archival Research Assistant</b>
            <p>Select a suggested question above or enter a custom inquiry about Indian architectural heritage.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div className={`bubble ${m.role}`} key={i} style={{ whiteSpace: 'pre-line' }}>
            <span>{m.role === 'user' ? 'RESEARCHER' : 'VAARSO AI'}</span>
            <div style={{ marginTop: '5px', fontSize: '11px', lineHeight: '1.65' }}>
              {m.text}
            </div>
            {m.sources && m.sources.length > 0 && (
              <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--line)' }}>
                {m.sources.map((s, j) => (
                  <small className="source-chip" key={j} style={{ display: 'block', fontSize: '9px' }}>
                    ✦ Source: {s.title}
                  </small>
                ))}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="bubble assistant" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LoaderCircle className="spin" size={14} style={{ color: 'var(--gold)' }} />
            <span>Consulting Indian cultural heritage corpus & analyzing with Gemini AI…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Custom Inquiry Form */}
      <form className="chat-form" onSubmit={(e) => askAI(e)}>
        <input
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          placeholder="Ask a question about Indian heritage, dynasties, architecture…"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !chat.trim()} aria-label="Send Inquiry">
          <Send size={14} />
        </button>
      </form>

      <small className="fineprint" style={{ padding: '4px 14px 10px', fontSize: '8.5px', color: 'var(--muted)', paddingRight: '48px', lineHeight: 1.4, display: 'block' }}>
        Grounded in verified Indian architectural history and ASI/UNESCO records. Check cited primary sources for academic citation. AI-generated analyses do not constitute independently certified archaeological findings.
      </small>

      {/* Floating Transcript Export (PDF / Print) */}
      <button
        type="button"
        onClick={() => window.print()}
        title="Export Archival Research Transcript (PDF / Print)"
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '10px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'transform 0.15s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <FileText size={14} />
      </button>
    </aside>
  );
}
