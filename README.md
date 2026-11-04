# Vaarso AI — Working prototype

An elegant, responsive cultural heritage discovery prototype inspired by the provided Vaarso references. It includes a Home/Explore/Archive/Map/Collections/Contribute experience, searchable sample records, an OpenStreetMap-powered map, a connected-record graph, a source-conscious research assistant, OCR upload workflow, and browser speech capture.

## What works immediately

- Responsive React UI with warm-gold / obsidian visual design and light-mode toggle.
- Search and filters over the included sample collection.
- Record detail views and a demonstration knowledge graph.
- Interactive map using Leaflet + OpenStreetMap tiles (internet required).
- Document upload UI and OCR API route.
- Research assistant API route with a clearly labelled demo fallback.
- Browser speech-to-text capture in browsers that support `SpeechRecognition` (commonly Chrome; microphone permission required).
- Optional backend integration for three model functions: Gemini text reasoning, Gemini multimodal document transcription, Gemini embeddings, and OpenAI Whisper audio transcription. These are provider-backed API calls; keys are not included.

## Important prototype boundaries

- The included heritage records, completeness percentages, and some image associations are illustrative. They are not a verified catalogue; verify all historical claims and image rights before research or public release.
- Map coordinates are sample demonstration data. OpenStreetMap is a real map tile provider; the map pins are not a complete official monument dataset.
- The 3D digital twin is represented as a future capability in this MVP, not a real photogrammetry pipeline. Do not claim automatic 3D reconstruction or structural-condition detection is implemented.
- OCR output requires human review. AI answers must cite real archive records before being treated as research evidence.
- The backend currently does not persist records to a database or implement production vector retrieval. The embeddings endpoint is an integration hook; production semantic search requires storing embeddings and retrieving actual indexed source chunks.

## Requirements

- Node.js 20+ recommended
- Python 3.10+
- API keys only for the AI endpoints you want to enable

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). On Windows PowerShell, if `npm` is blocked by execution policy, use `npm.cmd install` and `npm.cmd run dev`.

## Run the backend

In another terminal:

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows; on macOS/Linux use: cp .env.example .env
uvicorn main:app --reload --port 8000
```

Edit `backend/.env` and add:

- `GEMINI_API_KEY` from Google AI Studio for text answers, image/PDF transcription and embeddings.
- `OPENAI_API_KEY` for Whisper audio-file transcription.

Do not put secret API keys in frontend environment variables or commit `.env` to Git. The browser speech-capture feature is separate from Whisper and depends on browser support and permissions.

Backend health check: `http://localhost:8000/api/health`.

## API routes

- `GET /api/health` — provider configuration status.
- `POST /api/ask` — Gemini text response using selected record context; explicitly notes lack of source evidence.
- `POST /api/ocr` — Gemini multimodal transcription for image/PDF uploads.
- `POST /api/transcribe` — OpenAI Whisper transcription for audio uploads.
- `POST /api/embeddings` — Gemini embedding generation integration hook.

## Three-model / provider plan

1. **Gemini text model** (`GEMINI_TEXT_MODEL`) — research explanations with uncertainty and source discipline.
2. **Gemini multimodal model** (`GEMINI_VISION_MODEL`) — OCR/transcription of uploaded document scans; can share the same model endpoint while using image input.
3. **OpenAI Whisper** (`OPENAI_AUDIO_MODEL`) — uploaded audio transcription. Browser speech recognition is available as a keyless fallback where supported.
4. **Gemini Embeddings** (`GEMINI_EMBED_MODEL`) — vector representation hook for a future persistent semantic retrieval index.

These integrations require valid keys, network access, quotas and compatible model availability. Provider errors are returned rather than silently represented as real results.

## Next engineering milestones

1. Add PostgreSQL tables for sites, records, sources, chunks, contributors, reviews and embeddings.
2. Implement ingestion and indexing with a persistent vector store (e.g. PostgreSQL + pgvector).
3. Retrieve real source chunks for every answer and return chunk-level citations.
4. Add authentication, file storage, permission checks, rate limits and upload validation.
5. Add an actual Three.js viewer only after sourcing a licensed 3D model; automatic photogrammetry is a separate pipeline.
6. Build a test set for OCR quality and search relevance; record evaluation results in the README.

## Build

```bash
cd frontend
npm install
npm run build
```
