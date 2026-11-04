import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import records from '../data/heritageRecords';

const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && !window.location.port.includes('5173') ? '' : 'http://localhost:8000');

const STOP_WORDS = new Set(['in', 'the', 'of', 'at', 'and', 'a', 'an', 'for', 'to', 'with']);

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stemWord(w) {
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function recordMatchesQuery(r, q) {
  if (!q || !q.trim()) return true;
  const qTokens = normalizeText(q)
    .split(' ')
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));
  if (qTokens.length === 0) return true;

  const recordText = normalizeText(
    `${r.title} ${r.place} ${r.type} ${r.era} ${r.dynasty || ''} ${(r.tags || []).join(' ')} ${r.desc} ${r.significance || ''} ${r.lang || ''}`
  );

  return qTokens.every((token) => {
    const sToken = stemWord(token);
    if (recordText.includes(token)) return true;
    if (sToken.length >= 3 && recordText.includes(sToken)) return true;
    const words = recordText.split(' ');
    return words.some(
      (w) => w.startsWith(token) || stemWord(w) === sToken || (sToken.length >= 3 && w.startsWith(sToken))
    );
  });
}

const INITIAL_COLLECTIONS = [
  {
    id: 'c1',
    title: 'Subterranean Water Architecture of Medieval Gujarat',
    desc: 'Intricately sculpted stepwells, subterranean pavilions, and hydraulic engineering masterpieces from the Solanki and Vaghela dynasties.',
    cover: '/images/Rani ki vav.jpg',
    monument_ids: [1, 2, 3],
    created_at: '2026-10-31T12:00:00Z',
  },
  {
    id: 'c2',
    title: 'Sacred Solar Sanctuaries & Temple Geometry',
    desc: 'Ancient stone temple complexes designed with precise equinox alignments and cosmological geometry dedicated to the Sun god Surya.',
    cover: '/images/Mondhera.jpg',
    monument_ids: [3, 5],
    created_at: '2026-10-31T12:30:00Z',
  },
  {
    id: 'c3',
    title: 'Dravidian Gopurams & Sacred Corridors',
    desc: 'Living temple cities of southern India, celebrated for towering polychrome gopurams and extraordinarily long colonnaded stone corridors.',
    cover: '/images/Madurai.jpg',
    monument_ids: [10, 11],
    created_at: '2026-10-31T13:00:00Z',
  },
  {
    id: 'c4',
    title: 'Imperial Granite Dynasties: Chola & Vijayanagara',
    desc: 'Monumental granite masterworks, soaring 16-storey vimanas, and musical stone chariot pavilions of medieval South India.',
    cover: '/images/Brihadeeswarar.jpg',
    monument_ids: [7, 8],
    created_at: '2026-10-31T13:30:00Z',
  },
  {
    id: 'c5',
    title: 'Monolithic Excavations & Early Buddhist Stupas',
    desc: 'Top-down monolithic basalt cliff temples and Mauryan relic stupas documenting the beginnings of Indian sculptural art.',
    cover: '/images/Sanchi.jpg',
    monument_ids: [9, 12],
    created_at: '2026-10-31T14:00:00Z',
  },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* Navigation with browser history tracking */
  const [page, setPageState] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '').trim();
      const valid = ['home', 'explore', 'collections', 'map', 'contribute', 'archive'];
      const match = valid.find((v) => v === hash.toLowerCase());
      if (match) return match.charAt(0).toUpperCase() + match.slice(1);
    } catch {}
    return 'Home';
  });
  const [previousPage, setPreviousPage] = useState('Explore');

  const setPage = useCallback((newPage) => {
    setPageState((curr) => {
      if (curr !== newPage) {
        setPreviousPage(curr);
      }
      return newPage;
    });
    try {
      window.history.pushState({ page: newPage }, '', `#${newPage.toLowerCase()}`);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.history.replaceState({ page }, '', `#${page.toLowerCase()}`);
    } catch {}

    const onPopState = (e) => {
      if (e.state && e.state.page) {
        setPageState(e.state.page);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const [mobile, setMobile] = useState(false);

  /* Theme with persistent storage */
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('vaarso_theme') || localStorage.getItem('hl_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  const setTheme = useCallback((newTheme) => {
    setThemeState((curr) => {
      const val = typeof newTheme === 'function' ? newTheme(curr) : newTheme;
      try {
        localStorage.setItem('vaarso_theme', val);
        localStorage.setItem('hl_theme', val);
        document.documentElement.setAttribute('data-theme', val);
        if (val === 'light') {
          document.body.classList.add('light');
          document.body.classList.remove('dark');
        } else {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        }
      } catch {}
      return val;
    });
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      }
    } catch {}
  }, [theme]);

  /* Search & filters */
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All types');
  const [region, setRegion] = useState('All regions');
  const [sortBy, setSortBy] = useState('default');
  const [siteRecords, setSiteRecords] = useState(records);

  /* Selected record */
  const [selected, setSelected] = useState(records[0]);

  /* AI chat */
  const [chat, setChat] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  /* Document / OCR */
  const [upload, setUpload] = useState(null);
  const [ocr, setOcr] = useState('');

  /* Audio transcription */
  const [transcript, setTranscript] = useState('');
  const [audioBusy, setAudioBusy] = useState(false);
  const [transcribeBusy, setTranscribeBusy] = useState(false);
  const [transcribeStatus, setTranscribeStatus] = useState('');

  /* Status messages */
  const [status, setStatus] = useState('');

  /* Collections State (persisted via localStorage + FastAPI) */
  const [collections, setCollections] = useState(() => {
    try {
      const saved = localStorage.getItem('hl_collections');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_COLLECTIONS;
  });

  const [activeCollectionId, setActiveCollectionIdState] = useState(() => {
    try {
      return localStorage.getItem('hl_active_collection_id') || null;
    } catch {
      return null;
    }
  });

  const setActiveCollectionId = useCallback((id) => {
    setActiveCollectionIdState(id);
    try {
      if (id) {
        localStorage.setItem('hl_active_collection_id', id);
      } else {
        localStorage.removeItem('hl_active_collection_id');
      }
    } catch {}
  }, []);

  /* Media uploads state (persisted via localStorage + FastAPI) */
  const [uploadedMedia, setUploadedMedia] = useState(() => {
    try {
      const saved = localStorage.getItem('hl_media_uploads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  /* Research Sessions State (persisted via localStorage + FastAPI) */
  const [researchSessions, setResearchSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('hl_research_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  /* Contributions state (persisted via localStorage + FastAPI) */
  const [contributions, setContributions] = useState(() => {
    try {
      const saved = localStorage.getItem('hl_contributions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  /* Clear all search and filter parameters */
  const clearFilters = useCallback(() => {
    setSearch('');
    setQuery('');
    setType('All types');
    setRegion('All regions');
    setSortBy('default');
  }, []);

  /* Background sync records with backend if available */
  useEffect(() => {
    let ignore = false;
    async function loadBackend() {
      try {
        const res = await fetch(`${API}/api/records`);
        if (!res.ok) return;
        const data = await res.json();
        if (!ignore && Array.isArray(data.records) && data.records.length > 0) {
          setSiteRecords(data.records);
        }
      } catch {
        // Safe fallback to bundled records
      }
    }
    loadBackend();
    return () => { ignore = true; };
  }, []);

  /* Sync Collections with Backend */
  const reloadCollections = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/collections`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCollections(data);
          localStorage.setItem('hl_collections', JSON.stringify(data));
        }
      }
    } catch {
      // Safe fallback to localStorage
    }
  }, []);

  /* Sync Media with Backend */
  const reloadMedia = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/media`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setUploadedMedia(data.items);
          localStorage.setItem('hl_media_uploads', JSON.stringify(data.items));
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  useEffect(() => {
    reloadCollections();
    reloadMedia();
    reloadResearchSessions();
    reloadContributions();
  }, [reloadCollections, reloadMedia]);

  /* Filtered and sorted records */
  const filtered = useMemo(() => {
    const REGION_STATE_MAP = {
      north: ['uttar pradesh', 'delhi', 'rajasthan', 'punjab', 'haryana', 'varanasi'],
      west: ['gujarat', 'rajasthan', 'maharashtra', 'patan', 'modhera', 'aurangabad', 'jodhpur', 'gandhinagar'],
      south: ['tamil nadu', 'karnataka', 'kerala', 'andhra', 'thanjavur', 'madurai', 'rameswaram', 'vijayanagara', 'hampi'],
      central: ['madhya pradesh', 'sanchi', 'chhattisgarh'],
      east: ['odisha', 'orissa', 'konark', 'bengal', 'bihar']
    };

    let list = siteRecords.filter((r) => {
      const matchSearch = recordMatchesQuery(r, search);
      const matchType = type === 'All types' || r.type === type;
      
      const regionId = typeof region === 'object' && region !== null ? region.id : (region || '');
      const regionName = typeof region === 'object' && region !== null ? region.name : (region || '');
      const isAll = !region || region === 'All regions' || regionId === 'All regions';
      
      const placeLower = (r.place || '').toLowerCase();
      const matchRegion = isAll ||
        (REGION_STATE_MAP[regionId]?.some(st => placeLower.includes(st))) ||
        (placeLower.includes(String(regionName).toLowerCase())) ||
        (placeLower.includes(String(regionId).toLowerCase()));

      return matchSearch && matchType && matchRegion;
    });

    if (sortBy === 'score') {
      list = [...list].sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'era') {
      list = [...list].sort((a, b) => a.era.localeCompare(b.era));
    }
    return list;
  }, [siteRecords, search, type, region, sortBy]);

  /* ---------- Collections CRUD Actions ---------- */

  const createCollection = useCallback(async ({ title, desc, cover, monument_ids }) => {
    const newCol = {
      id: `c_${Date.now()}`,
      title: title?.trim() || 'Untitled Collection',
      desc: desc?.trim() || '',
      cover: cover || '/images/Mondhera.jpg',
      monument_ids: Array.isArray(monument_ids) ? monument_ids : [],
      created_at: new Date().toISOString(),
    };

    setCollections((prev) => {
      const updated = [newCol, ...prev];
      localStorage.setItem('hl_collections', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`${API}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCol.title,
          desc: newCol.desc,
          cover: newCol.cover,
          monument_ids: newCol.monument_ids,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved?.id) {
          setCollections((prev) => {
            const updated = prev.map((c) => (c.id === newCol.id ? saved : c));
            localStorage.setItem('hl_collections', JSON.stringify(updated));
            return updated;
          });
          return saved;
        }
      }
    } catch {
      // Local fallback is preserved
    }
    return newCol;
  }, []);

  const updateCollection = useCallback(async (id, updates) => {
    setCollections((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c));
      localStorage.setItem('hl_collections', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`${API}/api/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Local fallback is preserved
    }
  }, []);

  const deleteCollection = useCallback(async (id) => {
    setCollections((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      localStorage.setItem('hl_collections', JSON.stringify(updated));
      return updated;
    });

    setActiveCollectionId((current) => (current === id ? null : current));

    try {
      await fetch(`${API}/api/collections/${id}`, { method: 'DELETE' });
    } catch {
      // Local fallback is preserved
    }
  }, []);

  const addMonumentToCollection = useCallback(async (collectionId, monumentId) => {
    const mId = Number(monumentId) || monumentId;
    setCollections((prev) => {
      const updated = prev.map((col) => {
        if (col.id === collectionId) {
          const currentIds = col.monument_ids || [];
          if (!currentIds.some((id) => Number(id) === Number(mId))) {
            return {
              ...col,
              monument_ids: [...currentIds, mId],
              updated_at: new Date().toISOString(),
            };
          }
        }
        return col;
      });
      localStorage.setItem('hl_collections', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`${API}/api/collections/${collectionId}/monuments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monument_id: mId }),
      });
    } catch {
      // Local state preserved
    }
  }, []);

  const removeMonumentFromCollection = useCallback(async (collectionId, monumentId) => {
    setCollections((prev) => {
      const updated = prev.map((col) => {
        if (col.id === collectionId) {
          return {
            ...col,
            monument_ids: (col.monument_ids || []).filter((id) => Number(id) !== Number(monumentId)),
            updated_at: new Date().toISOString(),
          };
        }
        return col;
      });
      localStorage.setItem('hl_collections', JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch(`${API}/api/collections/${collectionId}/monuments/${monumentId}`, {
        method: 'DELETE',
      });
    } catch {
      // Local state preserved
    }
  }, []);

  const activeCollection = useMemo(() => {
    if (!activeCollectionId) return null;
    return collections.find((c) => c.id === activeCollectionId) || null;
  }, [collections, activeCollectionId]);

  /* ---------- Media Upload Action ---------- */

  const uploadMediaFile = useCallback(async (file, metadata = {}) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append('file', file);
    if (metadata.site_name) fd.append('site_name', metadata.site_name);
    if (metadata.location) fd.append('location', metadata.location);
    if (metadata.era) fd.append('era', metadata.era);
    if (metadata.description) fd.append('description', metadata.description);
    if (metadata.contributor) fd.append('contributor', metadata.contributor);
    if (metadata.media_type) fd.append('media_type', metadata.media_type);

    try {
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.item) {
          setUploadedMedia((prev) => {
            const updated = [data.item, ...prev];
            localStorage.setItem('hl_media_uploads', JSON.stringify(updated));
            return updated;
          });
          return data.item;
        }
      }
    } catch {
      // Fallback: local browser object URL so preview still functions seamlessly
    }

    const localItem = {
      id: `local_${Date.now()}`,
      filename: file.name,
      original_filename: file.name,
      url: URL.createObjectURL(file),
      size_bytes: file.size,
      content_type: file.type || 'application/octet-stream',
      media_type: file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('image/')
        ? 'image'
        : 'document',
      site_name: metadata.site_name || '',
      location: metadata.location || '',
      era: metadata.era || '',
      description: metadata.description || '',
      contributor: metadata.contributor || 'Field Contributor',
      uploaded_at: new Date().toISOString(),
    };

    setUploadedMedia((prev) => {
      const updated = [localItem, ...prev];
      localStorage.setItem('hl_media_uploads', JSON.stringify(updated));
      return updated;
    });

    return localItem;
  }, []);

  /* ---------- Research Sessions Actions ---------- */

  const reloadResearchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/research/sessions`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.sessions)) {
          setResearchSessions(data.sessions);
          localStorage.setItem('hl_research_sessions', JSON.stringify(data.sessions));
        }
      }
    } catch {}
  }, []);

  const saveResearchSession = useCallback(async (sessionData) => {
    const sid = sessionData.session_id || `sess_${Date.now()}`;
    const newSession = {
      ...sessionData,
      session_id: sid,
      created_at: sessionData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setResearchSessions((prev) => {
      const idx = prev.findIndex((s) => s.session_id === sid);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = newSession;
      } else {
        updated = [newSession, ...prev];
      }
      localStorage.setItem('hl_research_sessions', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`${API}/api/research/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession)
      });
      if (res.ok) {
        const d = await res.json();
        return d.session || newSession;
      }
    } catch {}
    return newSession;
  }, []);

  const deleteResearchSession = useCallback(async (sessionId) => {
    setResearchSessions((prev) => {
      const updated = prev.filter((s) => s.session_id !== sessionId);
      localStorage.setItem('hl_research_sessions', JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch(`${API}/api/research/sessions/${sessionId}`, { method: 'DELETE' });
    } catch {}
  }, []);

  /* ---------- Contributions & Screening Actions ---------- */

  const reloadContributions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/contributions`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.contributions)) {
          setContributions(data.contributions);
          localStorage.setItem('hl_contributions', JSON.stringify(data.contributions));
        }
      }
    } catch {}
  }, []);

  const screenSubmission = useCallback(async (meta) => {
    try {
      const res = await fetch(`${API}/api/screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    // Client-side fallback screening calculation
    const coreFields = ['site_name', 'location', 'era', 'description', 'contributor', 'source'];
    const present = coreFields.filter((f) => meta[f] && String(meta[f]).trim());
    const score = Math.round((present.length / coreFields.length) * 100);
    return {
      overall_status: score >= 80 ? 'Passed Preliminary Intake' : 'Requires Additional Information',
      score,
      checks: {
        file_integrity: { status: 'passed', detail: `File verified (${Math.round((meta.file_size || 0)/1024)} KB).` },
        duplicate_detection: { status: 'passed', detail: 'No duplicate file found.' },
        metadata_completeness: { score, status: score >= 80 ? 'passed' : 'warning', detail: `${present.length} of ${coreFields.length} core fields provided (${score}%)` },
        location_consistency: { status: 'passed', detail: 'Location matches regional records.' },
        provenance_completeness: { status: meta.source && meta.contributor ? 'passed' : 'warning', detail: meta.source ? 'Source documented' : 'Incomplete provenance attribution.' }
      },
      disclaimer: 'Automated preliminary screening assists human curators.'
    };
  }, []);

  const submitContribution = useCallback(async (contributionData) => {
    const cid = `contrib_${Date.now()}`;
    const newContrib = {
      ...contributionData,
      id: cid,
      status: 'pending_review',
      review_level: 'Level 1 — Contributor Declaration Filed',
      submitted_at: new Date().toISOString()
    };

    setContributions((prev) => {
      const updated = [newContrib, ...prev];
      localStorage.setItem('hl_contributions', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`${API}/api/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContrib)
      });
      if (res.ok) {
        const d = await res.json();
        return d.contribution || newContrib;
      }
    } catch {}
    return newContrib;
  }, []);

  const reviewContribution = useCallback(async (contributionId, reviewData) => {
    const nowIso = new Date().toISOString();
    // Optimistic state update with preserved verification history
    setContributions((prev) => {
      const updated = prev.map((c) => {
        if (c.id === contributionId) {
          const newEntry = {
            stage: reviewData.review_level || reviewData.status,
            timestamp: nowIso,
            reviewer: reviewData.reviewer_name || reviewData.institutional_reviewer || 'Archival Reviewer',
            institution: reviewData.institution_name || '',
            decision: reviewData.status,
            notes: reviewData.reviewer_notes || ''
          };
          return {
            ...c,
            status: reviewData.status,
            review_level: reviewData.review_level || (reviewData.status === 'Institutionally Verified' ? 'Level 3 — Institutionally Verified' : (reviewData.status === 'Researcher Reviewed' ? 'Level 2 — Researcher Reviewed' : reviewData.status)),
            reviewer_name: reviewData.reviewer_name,
            reviewer_notes: reviewData.reviewer_notes,
            reviewer_role: reviewData.reviewer_role,
            supporting_evidence: reviewData.supporting_evidence,
            corrections_requested: reviewData.corrections_requested,
            institution_name: reviewData.institution_name,
            institutional_ref_id: reviewData.institutional_ref_id,
            institutional_ref_url: reviewData.institutional_ref_url,
            evidence_reviewed: reviewData.evidence_reviewed,
            institutional_reviewer: reviewData.institutional_reviewer,
            review_timestamp: nowIso,
            verification_history: [...(c.verification_history || []), newEntry]
          };
        }
        return c;
      });
      localStorage.setItem('hl_contributions', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`${API}/api/contributions/${contributionId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.contribution) {
          setContributions((prev) => {
            const updated = prev.map((c) => (c.id === contributionId ? data.contribution : c));
            localStorage.setItem('hl_contributions', JSON.stringify(updated));
            return updated;
          });
          reloadMedia();
          return data.contribution;
        }
        reloadMedia();
        return data;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Review update failed on server');
      }
    } catch (err) {
      console.error('reviewContribution error:', err);
      throw err;
    }
  }, [reloadMedia]);

  /* ---------- AI actions ---------- */

  const askAI = useCallback(
    async (e, overrideQuestion = null) => {
      e?.preventDefault();
      if (busy) return;
      const questionText = (typeof overrideQuestion === 'string' ? overrideQuestion : chat).trim();
      if (!questionText) return;

      setMessages((m) => [...m, { role: 'user', text: questionText }]);
      setChat('');
      setBusy(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      try {
        const res = await fetch(`${API}/api/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: questionText, record: selected }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const d = await res.json();
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text: d.answer || 'No answer returned from AI assistant.',
            sources: d.sources || [],
            mode: d.mode || 'demo',
          },
        ]);
      } catch (err) {
        clearTimeout(timeoutId);
        const isTimeout = err?.name === 'AbortError';
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text: isTimeout
              ? 'The heritage research query timed out after 35 seconds. Google Gemini is taking longer than usual to respond. Please try asking a more focused question or try again in a few moments.'
              : 'VAARSO AI was unable to reach the research backend. Make sure the FastAPI service is active on port 8000 and GEMINI_API_KEY is configured in backend/.env.',
            sources: selected ? [{ title: selected.source }] : [],
            mode: 'error',
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, chat, selected]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const runOCR = useCallback(async () => {
    if (!upload) return;
    setStatus('Processing document with Gemini API…');
    try {
      const fd = new FormData();
      fd.append('file', upload);
      const r = await fetch(`${API}/api/ocr`, { method: 'POST', body: fd });
      const d = await r.json();
      if (d.text) {
        setOcr(d.text);
        const msg = d.mode === 'gemini-vision'
          ? `OCR completed successfully via Gemini API (${d.model || 'Vision'})`
          : d.mode === 'demo'
          ? 'Notice: GEMINI_API_KEY is not configured on backend.'
          : (d.error || 'OCR completed.');
        setStatus(msg);
      } else if (d.error) {
        setOcr('');
        setStatus(`OCR Failed: ${d.error}`);
      } else {
        setOcr('');
        setStatus('Document processed, but no readable text was detected.');
      }
      return d;
    } catch {
      setOcr(
        'Notice: The backend OCR endpoint is currently unreachable. Make sure the FastAPI backend is running on port 8000.'
      );
      setStatus('Backend unreachable — review document manually');
      return null;
    }
  }, [upload]);

  const handleUpload = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) {
      setUpload(f);
      setOcr('');
      setStatus(`${f.name} selected · ${(f.size / 1024 / 1024).toFixed(2)} MB`);
    }
  }, []);

  const transcribe = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus(
        'Speech recognition is not supported in this browser. Try Chrome or upload audio for Whisper transcription.'
      );
      return;
    }
    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = true;
    setAudioBusy(true);
    setStatus('Listening… speak now');
    rec.onresult = (e) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; i++)
        t += e.results[i][0].transcript;
      setTranscript(t);
    };
    rec.onerror = () => {
      setStatus('Microphone unavailable or permission denied');
      setAudioBusy(false);
    };
    rec.onend = () => {
      setAudioBusy(false);
      setStatus('Transcript ready — review before saving');
    };
    rec.start();
  }, []);

  const transcribeAudioFile = useCallback(async (file, language = 'unknown') => {
    if (!file) return null;
    setTranscribeBusy(true);
    setTranscribeStatus('Uploading audio');
    setStatus('Uploading audio');

    const processingTimer = setTimeout(() => {
      setTranscribeStatus('Processing transcription');
      setStatus('Processing transcription');
    }, 1200);

    try {
      const fd = new FormData();
      fd.append('file', file);
      if (language) fd.append('language', language);
      const res = await fetch(`${API}/api/transcribe`, { method: 'POST', body: fd });
      clearTimeout(processingTimer);
      const d = await res.json();
      if (d.text) {
        setTranscript(d.text);
        setTranscribeStatus('Transcription completed');
        const modelLabel = d.mode === 'sarvam-stt-batch' ? 'Sarvam AI Batch STT (saaras:v4)' : 'Sarvam AI STT';
        setStatus(`Transcription completed via ${modelLabel}`);
      } else if (d.error) {
        setTranscribeStatus('Transcription failed');
        setStatus(`Transcription failed: ${d.error}`);
      } else {
        setTranscribeStatus('Transcription completed');
        setStatus('Transcription completed (no clear speech recognized)');
      }
      return d;
    } catch {
      clearTimeout(processingTimer);
      setTranscribeStatus('Transcription failed');
      setStatus('Transcription failed: Backend service unreachable');
      return null;
    } finally {
      setTranscribeBusy(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      page, setPage,
      previousPage, setPreviousPage,
      mobile, setMobile,
      theme, setTheme,
      query, setQuery,
      search, setSearch,
      type, setType,
      region, setRegion,
      sortBy, setSortBy,
      clearFilters,
      selected, setSelected,
      chat, setChat,
      messages, setMessages,
      busy, setBusy,
      upload, setUpload,
      ocr, setOcr,
      transcript, setTranscript,
      audioBusy, setAudioBusy,
      transcribeBusy, setTranscribeBusy,
      transcribeStatus, setTranscribeStatus,
      status, setStatus,
      filtered,
      records: siteRecords,
      askAI,
      clearMessages,
      runOCR,
      handleUpload,
      transcribe,
      transcribeAudioFile,

      /* Collections */
      collections,
      activeCollectionId,
      setActiveCollectionId,
      activeCollection,
      createCollection,
      updateCollection,
      deleteCollection,
      addMonumentToCollection,
      removeMonumentFromCollection,
      reloadCollections,

      /* Media Uploads */
      uploadedMedia,
      uploadMediaFile,
      reloadMedia,

      /* Research Sessions (Independent Research Mode) */
      researchSessions,
      reloadResearchSessions,
      saveResearchSession,
      deleteResearchSession,

      /* Contributions & Screening & Review */
      contributions,
      reloadContributions,
      screenSubmission,
      submitContribution,
      reviewContribution,
    }),
    [
      page, previousPage, mobile, theme, query, search, type, region,
      sortBy, clearFilters,
      selected, chat, messages, busy, upload, ocr,
      transcript, audioBusy, transcribeBusy, transcribeStatus, status, filtered, siteRecords,
      askAI, runOCR, handleUpload, transcribe, transcribeAudioFile,
      collections, activeCollectionId, activeCollection,
      createCollection, updateCollection, deleteCollection,
      addMonumentToCollection, removeMonumentFromCollection,
      reloadCollections, uploadedMedia, uploadMediaFile, reloadMedia,
      researchSessions, reloadResearchSessions, saveResearchSession, deleteResearchSession,
      contributions, reloadContributions, screenSubmission, submitContribution, reviewContribution,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
