import React from 'react';
import { Sun, Moon, UserRound, Menu, Search as SearchIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Topbar() {
  const { page, theme, setTheme, mobile, setMobile } = useApp();

  return (
    <header className="topbar">
      <button className="hamburger" onClick={() => setMobile(!mobile)} aria-label="Toggle menu">
        <Menu size={18} />
      </button>

      <div className="crumb">
        <button
          onClick={() => setPage('Home')}
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
          title="Return to Home"
        >
          <span className="crumb-brand">VAARSO</span>
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-page">{page}</span>
      </div>

      <div className="topstats">
        <span><b>80k+</b> Photos</span>
        <i className="stat-sep" />
        <span><b>1,200+</b> Sites</span>
        <i className="stat-sep" />
        <span><b>25k+</b> Documents</span>
      </div>

      <button
        className="iconbtn"
        title="Search heritage collection"
        aria-label="Search heritage collection"
        onClick={() => setPage('Explore')}
      >
        <SearchIcon size={16} />
      </button>

      <button
        className="iconbtn theme-toggle-btn"
        title={theme === 'dark' ? 'Switch to Ivory Light Mode' : 'Switch to Obsidian Dark Mode'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={theme === 'dark' ? 'Switch to Ivory Light Mode' : 'Switch to Obsidian Dark Mode'}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <button className="avatar" aria-label="User profile">
        <UserRound size={16} />
      </button>
    </header>
  );
}
