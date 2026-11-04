import React from 'react';
import {
  House, Search, Map as MapIcon, BookOpen, Layers, Plus, X, Sun, Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const nav = [
  ['Home', House],
  ['Explore', Search],
  ['Map', MapIcon],
  ['Archive', BookOpen],
  ['Collections', Layers],
  ['Contribute', Plus],
];

/** Ornate compass-rose brandmark SVG */
function BrandIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16.5" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
      <g fill="currentColor" opacity="0.9">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path
            key={angle}
            d="M0,-15 L1.8,-5 L0,-1.5 L-1.8,-5Z"
            transform={`translate(18,18) rotate(${angle})`}
          />
        ))}
      </g>
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
      <circle cx="18" cy="18" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export default function Sidebar() {
  const { page, setPage, mobile, setMobile, theme, setTheme } = useApp();

  return (
    <aside className={`sidebar ${mobile ? 'open' : ''}`}>
      <div className="brand">
        <div className="brandmark">
          <BrandIcon />
        </div>
        <div>
          <div className="brandname">VAARSO</div>
          <div className="brandtag">AI FOR INDIA'S LIVING HERITAGE</div>
        </div>
        <button className="mobile-close" onClick={() => setMobile(false)} aria-label="Close menu">
          <X size={16} />
        </button>
      </div>

      <div className="navlabel">DISCOVER</div>

      {nav.map(([name, Icon]) => (
        <button
          key={name}
          className={`navitem ${page === name ? 'active' : ''}`}
          onClick={() => { setPage(name); setMobile(false); }}
        >
          <Icon size={17} />
          <span>{name}</span>
          {name === 'Contribute' && <span className="navplus">+</span>}
        </button>
      ))}

      <div className="side-theme-toggle">
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="theme-switch-btn"
          title={theme === 'dark' ? 'Switch to Ivory Light Mode' : 'Switch to Obsidian Dark Mode'}
          aria-label="Toggle visual theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={13} />
              <span>Ivory Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={13} />
              <span>Obsidian Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="side-bottom">
        <div className="side-ornament">⌘</div>
        <p>Our past is not just history.<br />It is a living guide.</p>
        <span className="side-line" />
      </div>
    </aside>
  );
}
