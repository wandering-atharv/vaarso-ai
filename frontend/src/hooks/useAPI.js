/**
 * API base URL, sourced from environment or defaulting to localhost:8000.
 */
const API = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (typeof window !== 'undefined' && !window.location.port.includes('5173') ? '' : 'http://localhost:8000');

/**
 * Check backend health and model configuration status.
 */
export async function checkHealth() {
  const res = await fetch(`${API}/api/health`);
  return res.json();
}

/**
 * Fetch heritage records from backend with search, filtering and sorting.
 */
export async function fetchRecords({ q, type, region, sort } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (type && type !== 'All types') params.set('type', type);
  if (region && region !== 'All regions') params.set('region', region);
  if (sort && sort !== 'default') params.set('sort', sort);
  const qs = params.toString();
  const url = `${API}/api/records${qs ? `?${qs}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Upload an audio file for Whisper transcription.
 */
export async function transcribeAudio(file, language) {
  const fd = new FormData();
  fd.append('file', file);
  if (language) fd.append('language', language);
  const res = await fetch(`${API}/api/transcribe`, { method: 'POST', body: fd });
  return res.json();
}

/**
 * Generate embeddings for a text string (integration hook).
 */
export async function generateEmbeddings(text) {
  const res = await fetch(`${API}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export { API };
