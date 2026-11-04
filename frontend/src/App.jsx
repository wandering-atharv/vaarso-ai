import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MapPage from './pages/MapPage';
import ArchivePage from './pages/ArchivePage';
import CollectionsPage from './pages/CollectionsPage';
import ContributePage from './pages/ContributePage';
import FolklorePage from './pages/FolklorePage';

function AppShell() {
  const { page, theme } = useApp();

  const renderPage = () => {
    switch (page) {
      case 'Home': return <HomePage />;
      case 'Explore': return <ExplorePage />;
      case 'Map': return <MapPage />;
      case 'Archive': return <ArchivePage />;
      case 'Collections': return <CollectionsPage />;
      case 'Contribute': return <ContributePage />;
      case 'Folklore': return <FolklorePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Sidebar />
      <main className="main">
        <Topbar />
        {renderPage()}
        <footer className="footer">
          <div className="footer-brand">✳ <span>VAARSO</span></div>
          <p>AI for India's living heritage.</p>
          <span>Prototype · illustrative sample records · verify sources before research use</span>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
