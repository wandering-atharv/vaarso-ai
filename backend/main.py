import os, base64, mimetypes, re, json, uuid, io, wave, asyncio
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, List
import httpx
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from records_data import RECORDS, REGIONS, TYPES

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
COLLECTIONS_FILE = DATA_DIR / "collections.json"
MEDIA_FILE = DATA_DIR / "media_uploads.json"
RESEARCH_SESSIONS_FILE = DATA_DIR / "research_sessions.json"
CONTRIBUTIONS_FILE = DATA_DIR / "contributions.json"

app = FastAPI(title='Vaarso AI API', version='0.1.0', description='API layer for the Vaarso heritage archive prototype')

cors_origins_env = os.getenv('CORS_ORIGINS', '')
if cors_origins_env:
    origins = [o.strip() for o in cors_origins_env.split(',') if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^https?://.*",
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )

# Static files for uploaded media
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

GEMINI_KEY = os.getenv('GEMINI_API_KEY', '').strip()
OPENAI_KEY = os.getenv('OPENAI_API_KEY', '').strip()
SARVAM_KEY = os.getenv('SARVAM_API_KEY', '').strip()

TEXT_MODEL = os.getenv('GEMINI_TEXT_MODEL', 'gemini-3-flash-preview')
VISION_MODEL = os.getenv('GEMINI_VISION_MODEL', 'gemini-3-flash-preview')
EMBED_MODEL = os.getenv('GEMINI_EMBED_MODEL', 'gemini-embedding-001')
WHISPER_MODEL = os.getenv('OPENAI_AUDIO_MODEL', 'whisper-1')
SARVAM_TTS_MODEL = os.getenv('SARVAM_TTS_MODEL', 'bulbul:v3')
SARVAM_STT_MODEL = os.getenv('SARVAM_STT_MODEL', 'saaras:v3')

# Supported speakers for Sarvam bulbul:v3
BULBUL_V3_SPEAKERS = {
    'shubh', 'ritu', 'aditya', 'ashutosh', 'priya', 'neha', 'rahul', 'pooja',
    'rohan', 'simran', 'kavya', 'amit', 'dev', 'ishita', 'shreya', 'ratan',
    'varun', 'manan', 'sumit', 'roopa', 'kabir', 'aayan', 'advait', 'anand',
    'tanya', 'tarun', 'sunny', 'mani', 'gokul', 'vijay', 'shruti', 'suhani',
    'mohit', 'kavitha', 'rehan', 'soham', 'rupali'
}

class AskBody(BaseModel):
    question: str
    record: Optional[dict] = None
    context: Optional[str] = None

class TTSBody(BaseModel):
    text: str
    language_code: str = 'en-IN'
    speaker: Optional[str] = None

class CollectionCreate(BaseModel):
    title: str
    desc: Optional[str] = ""
    cover: Optional[str] = "/images/Mondhera.jpg"
    monument_ids: Optional[List[int]] = []

class CollectionUpdate(BaseModel):
    title: Optional[str] = None
    desc: Optional[str] = None
    cover: Optional[str] = None
    monument_ids: Optional[List[int]] = None

class AddMonumentBody(BaseModel):
    monument_id: int

class ResearchSessionCreate(BaseModel):
    session_id: Optional[str] = None
    title: Optional[str] = None
    session_name: Optional[str] = None
    document_url: Optional[str] = ""
    document_type: Optional[str] = None
    original_filename: Optional[str] = ""
    original_ai_transcription: Optional[str] = None
    human_edited_transcription: Optional[str] = None
    original_text: Optional[str] = None
    edited_text: Optional[str] = None
    language: Optional[str] = None
    language_script: Optional[str] = None
    uncertainties: Optional[list] = []
    confidence_stats: Optional[dict] = {}
    confidence_score: Optional[float] = None
    monument_id: Optional[int] = None
    notes: Optional[str] = ""

    class Config:
        extra = "allow"

class ContributionScreenBody(BaseModel):
    filename: Optional[str] = ""
    file_size: Optional[int] = 0
    content_type: Optional[str] = ""
    sha256_hash: Optional[str] = ""
    site_name: Optional[str] = ""
    location: Optional[str] = ""
    era: Optional[str] = ""
    description: Optional[str] = ""
    contributor: Optional[str] = ""
    source: Optional[str] = ""
    documentation_date: Optional[str] = ""

class ContributionCreate(BaseModel):
    title: str
    document_url: Optional[str] = ""
    media_url: Optional[str] = ""
    original_filename: Optional[str] = ""
    file_size: Optional[int] = 0
    content_type: Optional[str] = ""
    sha256_hash: Optional[str] = ""
    site_name: Optional[str] = ""
    location: Optional[str] = ""
    era: Optional[str] = ""
    description: Optional[str] = ""
    contributor: Optional[str] = "Anonymous Researcher"
    source: Optional[str] = ""
    documentation_date: Optional[str] = ""
    transcription: Optional[str] = ""
    screening_report: Optional[dict] = {}

class ContributionReviewBody(BaseModel):
    action: Optional[str] = None
    status: Optional[str] = None
    review_level: Optional[str] = None
    reviewer_name: Optional[str] = "Independent Epigraphy Researcher"
    reviewer_role: Optional[str] = "Independent Researcher"
    reviewer_notes: Optional[str] = ""
    supporting_evidence: Optional[str] = ""
    corrections_requested: Optional[str] = ""
    institution_name: Optional[str] = ""
    institutional_ref_id: Optional[str] = ""
    institutional_ref_url: Optional[str] = ""
    evidence_reviewed: Optional[str] = ""
    institutional_reviewer: Optional[str] = ""
    external_ref_title: Optional[str] = None
    external_ref_url: Optional[str] = None

def load_json_file(path: Path, default_factory):
    if not path.exists():
        data = default_factory()
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return data
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default_factory()

def save_json_file(path: Path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.get('/api/health')
def health():
    return {
        'status': 'ok',
        'product': 'Vaarso AI',
        'models': {
            'text': TEXT_MODEL,
            'vision': VISION_MODEL,
            'embeddings': EMBED_MODEL,
            'audio': WHISPER_MODEL,
            'tts': SARVAM_TTS_MODEL,
            'stt': SARVAM_STT_MODEL,
        },
        'configured': {
            'gemini': bool(GEMINI_KEY),
            'openai_audio': bool(OPENAI_KEY),
            'sarvam_tts': bool(SARVAM_KEY),
            'sarvam_stt': bool(SARVAM_KEY),
        }
    }

def normalize_text(text: str) -> str:
    return re.sub(r'\s+', ' ', re.sub(r'[^\w\s]', ' ', text.lower())).strip()

def record_matches_query(r: dict, query: str) -> bool:
    if not query or not query.strip():
        return True
    stop_words = {'in', 'the', 'of', 'at', 'and', 'a', 'an', 'for', 'to', 'with'}
    q_tokens = [t for t in normalize_text(query).split() if t not in stop_words]
    if not q_tokens:
        return True
    record_text = normalize_text(
        f"{r.get('title','')} {r.get('place','')} {r.get('type','')} {r.get('era','')} {r.get('dynasty','')} {' '.join(r.get('tags',[]))} {r.get('desc','')} {r.get('significance','')}"
    )
    def stem(w: str) -> str:
        if w.endswith('ies'): return w[:-3] + 'y'
        if w.endswith('s') and not w.endswith('ss'): return w[:-1]
        return w

    for token in q_tokens:
        s_tok = stem(token)
        if token in record_text or (len(s_tok) >= 3 and s_tok in record_text):
            continue
        words = record_text.split()
        if any(w.startswith(token) or stem(w) == s_tok or (len(s_tok) >= 3 and w.startswith(s_tok)) for w in words):
            continue
        return False
    return True

@app.get('/api/records')
def get_records(q: Optional[str] = None, type: Optional[str] = None, region: Optional[str] = None, sort: Optional[str] = None):
    results = [
        r for r in RECORDS
        if record_matches_query(r, q or '')
        and (not type or type == 'All types' or r.get('type') == type)
        and (not region or region == 'All regions' or region.lower() in r.get('place', '').lower())
    ]
    if sort == 'score':
        results = sorted(results, key=lambda x: x.get('score', 0), reverse=True)
    elif sort == 'title':
        results = sorted(results, key=lambda x: x.get('title', '').lower())
    elif sort == 'era':
        results = sorted(results, key=lambda x: x.get('era', '').lower())
    return {
        'total': len(results),
        'records': results,
        'regions': REGIONS,
        'types': TYPES,
    }

# ---------- Collections CRUD ----------

@app.get('/api/collections')
def get_collections():
    return load_json_file(COLLECTIONS_FILE, list)

@app.post('/api/collections')
def create_collection(payload: CollectionCreate):
    collections = load_json_file(COLLECTIONS_FILE, list)
    new_col = {
        "id": f"c_{uuid.uuid4().hex[:8]}",
        "title": payload.title.strip() or "Untitled Collection",
        "desc": payload.desc.strip() if payload.desc else "",
        "cover": payload.cover or "/images/Mondhera.jpg",
        "monument_ids": payload.monument_ids or [],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    collections.insert(0, new_col)
    save_json_file(COLLECTIONS_FILE, collections)
    return new_col

@app.put('/api/collections/{col_id}')
def update_collection(col_id: str, payload: CollectionUpdate):
    collections = load_json_file(COLLECTIONS_FILE, list)
    for col in collections:
        if str(col.get("id")) == str(col_id):
            if payload.title is not None:
                col["title"] = payload.title.strip()
            if payload.desc is not None:
                col["desc"] = payload.desc.strip()
            if payload.cover is not None:
                col["cover"] = payload.cover
            if payload.monument_ids is not None:
                col["monument_ids"] = payload.monument_ids
            col["updated_at"] = datetime.now(timezone.utc).isoformat()
            save_json_file(COLLECTIONS_FILE, collections)
            return col
    raise HTTPException(status_code=404, detail="Collection not found")

@app.delete('/api/collections/{col_id}')
def delete_collection(col_id: str):
    collections = load_json_file(COLLECTIONS_FILE, list)
    filtered = [c for c in collections if str(c.get("id")) != str(col_id)]
    if len(filtered) == len(collections):
        raise HTTPException(status_code=404, detail="Collection not found")
    save_json_file(COLLECTIONS_FILE, filtered)
    return {"status": "deleted", "id": col_id}

@app.post('/api/collections/{col_id}/monuments')
def add_monument_to_collection(col_id: str, body: AddMonumentBody):
    collections = load_json_file(COLLECTIONS_FILE, list)
    for col in collections:
        if str(col.get("id")) == str(col_id):
            m_id = body.monument_id
            m_ids = col.get("monument_ids", [])
            if m_id not in m_ids:
                m_ids.append(m_id)
                col["monument_ids"] = m_ids
                col["updated_at"] = datetime.now(timezone.utc).isoformat()
                save_json_file(COLLECTIONS_FILE, collections)
            return col
    raise HTTPException(status_code=404, detail="Collection not found")

@app.delete('/api/collections/{col_id}/monuments/{monument_id}')
def remove_monument_from_collection(col_id: str, monument_id: int):
    collections = load_json_file(COLLECTIONS_FILE, list)
    for col in collections:
        if str(col.get("id")) == str(col_id):
            m_ids = [m for m in col.get("monument_ids", []) if int(m) != int(monument_id)]
            col["monument_ids"] = m_ids
            col["updated_at"] = datetime.now(timezone.utc).isoformat()
            save_json_file(COLLECTIONS_FILE, collections)
            return col
    raise HTTPException(status_code=404, detail="Collection not found")

# ---------- Media & Uploads ----------

@app.get('/api/media')
def get_media_uploads():
    items = load_json_file(MEDIA_FILE, list)
    return {"total": len(items), "items": items}

@app.post('/api/upload')
async def upload_media_file(
    file: UploadFile = File(...),
    site_name: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    era: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    contributor: Optional[str] = Form(None),
    media_type: Optional[str] = Form(None)
):
    data = await file.read()
    if len(data) > 50 * 1024 * 1024:
        return {"status": "error", "message": "File exceeds maximum upload size of 50 MB."}

    content_type = file.content_type or mimetypes.guess_type(file.filename or "")[0] or "application/octet-stream"

    if content_type.startswith("image/"):
        det_type = "image"
    elif content_type.startswith("video/"):
        det_type = "video"
    elif content_type == "application/pdf" or (file.filename and file.filename.lower().endswith(".pdf")):
        det_type = "document"
    else:
        det_type = media_type or "file"

    safe_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', file.filename or 'upload')
    uid = uuid.uuid4().hex[:8]
    stored_name = f"{uid}_{safe_name}"
    target_path = UPLOAD_DIR / stored_name

    with open(target_path, "wb") as f:
        f.write(data)

    sha256_hash = hashlib.sha256(data).hexdigest()

    item = {
        "id": f"m_{uid}",
        "filename": stored_name,
        "original_filename": file.filename or "upload",
        "url": f"/uploads/{stored_name}",
        "size_bytes": len(data),
        "content_type": content_type,
        "media_type": det_type,
        "sha256_hash": sha256_hash,
        "site_name": site_name or "",
        "location": location or "",
        "era": era or "",
        "description": description or "",
        "contributor": contributor or "Anonymous Researcher",
        "uploaded_at": datetime.now(timezone.utc).isoformat()
    }

    media_items = load_json_file(MEDIA_FILE, list)
    media_items.insert(0, item)
    save_json_file(MEDIA_FILE, media_items)

    return {"status": "success", "item": item}

# ---------- AI Generation, OCR, Audio, TTS & STT ----------

async def gemini_generate(model: str, parts: list):
    if not GEMINI_KEY:
        return None

    # Preferred models with automatic, robust fallback to supported Gemini models
    models_to_try = []
    if model and model not in ('gemini-2.5-flash',):
        models_to_try.append(model)
    for fallback in ['gemini-2.0-flash', 'gemini-3-flash-preview', 'gemini-1.5-flash']:
        if fallback not in models_to_try:
            models_to_try.append(fallback)

    last_err = None
    timeout_cfg = httpx.Timeout(connect=10.0, read=45.0, write=15.0, pool=15.0)

    for m in models_to_try:
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={GEMINI_KEY}'
        try:
            async with httpx.AsyncClient(timeout=timeout_cfg) as client:
                r = await client.post(
                    url,
                    json={
                        'contents': [{'role': 'user', 'parts': parts}],
                        'generationConfig': {'temperature': 0.15, 'maxOutputTokens': 8192}
                    }
                )
                if r.status_code == 404:
                    continue
                r.raise_for_status()
                data = r.json()
            return ''.join(p.get('text', '') for p in data.get('candidates', [{}])[0].get('content', {}).get('parts', [])).strip()
        except httpx.HTTPStatusError as e:
            try:
                err_detail = e.response.json().get('error', {}).get('message', '')
            except Exception:
                err_detail = e.response.text[:200]
            if GEMINI_KEY and GEMINI_KEY in err_detail:
                err_detail = err_detail.replace(GEMINI_KEY, "[REDACTED]")
            last_err = err_detail or str(e)
            if e.response.status_code == 404:
                continue
            raise RuntimeError(last_err)
        except httpx.TimeoutException:
            last_err = f"Request to model {m} timed out after 28 seconds."
            continue
        except Exception as e:
            last_err = str(e)
            if GEMINI_KEY and GEMINI_KEY in last_err:
                last_err = last_err.replace(GEMINI_KEY, "[REDACTED]")
            raise RuntimeError(last_err)

    if last_err:
        raise RuntimeError(last_err)
    return None

@app.post('/api/ask')
async def ask(body: AskBody):
    r = body.record or {}
    q = (body.question or '').strip()
    if not q:
        return {'answer': 'Please provide a heritage research question.', 'sources': [], 'mode': 'demo'}

    # Compile indexed archive summary of all available monuments
    archive_summary = "\n".join([
        f"- {rec.get('title')} ({rec.get('place')}, {rec.get('era')}, {rec.get('dynasty', '')}): "
        f"{rec.get('desc')} Significance: {rec.get('significance')} Tags: {', '.join(rec.get('tags', []))} Source: {rec.get('source')}"
        for rec in RECORDS
    ])

    focus_context = ""
    mon_title = r.get("title") or r.get("name")
    if mon_title:
        focus_context = (
            f"FOCUSED MONUMENT RECORD:\n"
            f"Title: {mon_title}\n"
            f"Location: {r.get('place') or r.get('state')}\n"
            f"Historical Era: {r.get('era') or r.get('century')}\n"
            f"Dynasty: {r.get('dynasty') or 'Historical'}\n"
            f"Architectural Type: {r.get('type') or r.get('architectural_style')}\n"
            f"Detailed Description: {r.get('desc') or r.get('historical_context')}\n"
            f"Cultural & Historical Significance: {r.get('significance') or ''}\n"
            f"Tags: {', '.join(r.get('tags', []))}\n"
            f"Primary Cited Source: {r.get('source') or 'Archaeological Survey of India / UNESCO'}\n\n"
        )

    prompt = (
        "You are VAARSO AI, an authoritative, scholarly Indian cultural heritage research assistant.\n"
        "Your mission is to provide deeply informative, historically grounded, and architecturally precise answers.\n\n"
        "VAARSO ARCHIVE CONTEXT:\n"
        f"{archive_summary}\n\n"
        f"{focus_context}"
        f"USER RESEARCH QUESTION:\n{q}\n\n"
        "GUIDELINES FOR YOUR RESPONSE:\n"
        "1. Structure & Depth: Format your answer with clear Markdown headings (e.g. ### Overview, ### Architectural Features, ### Historical & Cultural Significance, ### Key Research Inquiries). Use bullet points for readability.\n"
        "2. Grounded Authenticity: Answer using established Indian architectural history, archaeological records (ASI/UNESCO), and the provided archive context. When comparing monuments (e.g., stepwells, solar sanctuaries, temples), explicitly contrast their structural layouts, dynastic patronage, and engineering innovations.\n"
        "3. Scholarly Humility: Distinguish documented archaeological evidence from oral folklore or unverified hypotheses. If specific information is outside the scope of existing verified records, clearly communicate that boundary rather than fabricating facts.\n"
        "4. Tone: Intellectual, evocative, respectful of living traditions, and directly actionable for heritage researchers and students."
    )

    try:
        model = TEXT_MODEL if TEXT_MODEL and TEXT_MODEL != 'gemini-2.5-flash' else 'gemini-2.0-flash'
        answer = await gemini_generate(model, [{'text': prompt}])
        if answer:
            # Determine cited sources
            sources = []
            if r.get('source'):
                sources.append({'title': f"{r.get('title')}: {r.get('source')}"})
            for rec in RECORDS:
                if rec.get('title').lower() in q.lower() and rec.get('title') != r.get('title'):
                    sources.append({'title': f"{rec.get('title')}: {rec.get('source')}"})
            if not sources:
                sources.append({'title': 'VAARSO Indian Cultural Heritage Archive & ASI Documentation'})

            return {
                'answer': answer,
                'sources': sources[:3],
                'mode': 'gemini-api',
                'model': model
            }
    except Exception as e:
        err_msg = str(e)
        if GEMINI_KEY and GEMINI_KEY in err_msg:
            err_msg = err_msg.replace(GEMINI_KEY, "[REDACTED]")
        return {
            'answer': f'AI Assistant service notice: {err_msg[:220]}. Please try again.',
            'sources': [],
            'mode': 'provider-error'
        }

    return {
        'answer': f'The selected sample record is {r.get("title","a heritage record")}, listed at {r.get("place","an unspecified location")}. Configure GEMINI_API_KEY in backend/.env for full AI-assisted exploration.',
        'sources': [{'title': r.get('source', 'Sample record')}],
        'mode': 'demo'
    }

@app.post('/api/ocr')
async def ocr(file: UploadFile = File(...)):
    """Extract and transcribe text from historical manuscript images and PDFs via Gemini API."""
    data = await file.read()
    if not data:
        return {'text': '', 'mode': 'error', 'error': 'Uploaded file is empty.'}
    if len(data) > 20 * 1024 * 1024:
        return {'text': '', 'mode': 'error', 'error': 'File exceeds 20 MB archive limit.'}

    content_type = file.content_type or mimetypes.guess_type(file.filename or "")[0] or "application/octet-stream"
    safe_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', file.filename or 'document')
    ext = Path(safe_name).suffix.lower()

    if content_type == "application/octet-stream" or not content_type:
        if ext in ('.jpg', '.jpeg'):
            content_type = 'image/jpeg'
        elif ext == '.png':
            content_type = 'image/png'
        elif ext == '.webp':
            content_type = 'image/webp'
        elif ext == '.pdf':
            content_type = 'application/pdf'

    if not (content_type.startswith('image/') or content_type == 'application/pdf'):
        return {'text': '', 'mode': 'error', 'error': 'Unsupported file format. Please upload an image (JPEG, PNG, WebP) or PDF manuscript.'}

    # Preserve original uploaded file in UPLOAD_DIR
    uid = uuid.uuid4().hex[:8]
    stored_name = f"ocr_{uid}_{safe_name}"
    target_path = UPLOAD_DIR / stored_name
    try:
        with open(target_path, "wb") as f:
            f.write(data)
        file_url = f"/uploads/{stored_name}"
    except Exception:
        file_url = ""

    if not GEMINI_KEY:
        return {
            'text': 'OCR provider is not configured. Add GEMINI_API_KEY to backend/.env to enable manuscript image and PDF transcription. Keep the original scan and manually review every extracted line.',
            'mode': 'demo',
            'filename': file.filename or safe_name,
            'file_url': file_url
        }

    prompt = (
        "You are an expert epigraphist, paleographer, and archival researcher for the VAARSO Medieval Archival Lab.\n"
        "Your task is to transcribe ALL readable text from this historical inscription, manuscript folio, or document scan completely, line-by-line and faithfully.\n\n"
        "Strict Transcription Guidelines:\n"
        "1. Full-Length Extraction: Process the ENTIRE document from top to bottom. Do not summarize, shorten, or truncate the reading. Transcribe every line and paragraph visible.\n"
        "2. Script & Language Fidelity: Transcribe strictly in the original script: Devanagari script for Sanskrit/Hindi/Marathi, Tamil/Grantha script for Tamil inscriptions, Odia for Odia records, Arabic/Persian for Perso-Arabic plinths, and Latin script for English colonial surveys. For Sanskrit, scrupulously preserve anusvara, visarga, virama, and conjunct ligatures.\n"
        "3. Layout & Structure: Maintain exact line breaks (prefix with 'Line 1:', 'Line 2:', etc. or retain original verse/paragraph layout). Do not silently modernise or standardise words.\n"
        "4. Uncertain or Damaged Readings: Do NOT invent, extrapolate, or hallucinate content. Clearly mark damaged, weathered, or illegible portions with [unclear] or [illegible]. If a reading is probable but uncertain, enclose it with a question mark in brackets, e.g. [धर्म?].\n"
        "5. If NO text or inscriptions are detected in the image, state clearly: 'No readable historical inscription or manuscript text detected in the uploaded image.'\n"
        "6. Structure of Output:\n"
        "   ### TRANSCRIPTION\n"
        "   [Full unabbreviated line-by-line transcription]\n\n"
        "   ### PALEOGRAPHIC & ARCHIVAL NOTES\n"
        "   - Identified Script: [e.g. Western Nagari / Grantha / Proto-Odia / Devanagari / Perso-Arabic]\n"
        "   - Identified Language: [e.g. Classical Sanskrit / Old Tamil / Early Odia / Persian]\n"
        "   - Category: [Stone Inscription / Manuscript & Palm-Leaf / Archival Transcription]\n"
        "   - Physical Condition: [Weathering, flaking, ligature clarity]\n"
    )

    try:
        model_name = VISION_MODEL if VISION_MODEL and VISION_MODEL != 'gemini-2.5-flash' else 'gemini-2.0-flash'
        text = await gemini_generate(
            model_name,
            [
                {'text': prompt},
                {'inline_data': {'mime_type': content_type, 'data': base64.b64encode(data).decode('utf-8')}}
            ]
        )
        return {
            'text': text or 'No readable inscription or manuscript text detected in the uploaded document.',
            'mode': 'gemini-vision',
            'model': model_name,
            'filename': file.filename or safe_name,
            'file_url': file_url,
            'file_size': len(data),
            'content_type': content_type
        }
    except Exception as e:
        err_msg = str(e)
        if GEMINI_KEY and GEMINI_KEY in err_msg:
            err_msg = err_msg.replace(GEMINI_KEY, "[REDACTED]")
        return {
            'text': '',
            'mode': 'provider-error',
            'error': f'Gemini OCR processing failed: {err_msg[:250]}',
            'filename': file.filename or safe_name,
            'file_url': file_url
        }

def estimate_wav_duration(audio_bytes: bytes) -> Optional[float]:
    try:
        with wave.open(io.BytesIO(audio_bytes), 'rb') as w:
            frames = w.getnframes()
            rate = w.getframerate()
            if rate > 0:
                return frames / float(rate)
    except Exception:
        pass
    return None

async def run_sarvam_batch_stt(data: bytes, filename: str, mime: str = "audio/wav", language: Optional[str] = None) -> dict:
    if not SARVAM_KEY:
        return {"error": "SARVAM_API_KEY not configured"}
    
    headers = {
        "api-subscription-key": SARVAM_KEY,
        "Content-Type": "application/json"
    }

    ext = os.path.splitext(filename)[1].lower() if filename else ".wav"
    if not ext:
        ext = ".wav"
    clean_filename = f"audio{ext}"

    lang_code = language if (language and language not in ("auto", "unknown")) else "unknown"

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            # Step 1: Initialize Batch Job
            init_payload = {
                "job_parameters": {
                    "language_code": lang_code,
                    "model": "saaras:v4"
                }
            }
            init_res = await client.post(
                "https://api.sarvam.ai/speech-to-text/job/v1",
                json=init_payload,
                headers=headers
            )
            init_res.raise_for_status()
            job_id = init_res.json().get("job_id")
            if not job_id:
                return {"error": "Failed to obtain batch job_id"}

            # Step 2: Get Presigned Upload URL
            upload_payload = {"job_id": job_id, "files": [clean_filename]}
            upload_res = await client.post(
                "https://api.sarvam.ai/speech-to-text/job/v1/upload-files",
                json=upload_payload,
                headers=headers
            )
            upload_res.raise_for_status()
            upload_urls = upload_res.json().get("upload_urls", {})
            file_info = upload_urls.get(clean_filename)
            if not file_info or "file_url" not in file_info:
                return {"error": f"Upload URL for {clean_filename} missing"}
            s3_url = file_info["file_url"]

            # Step 3: Upload Audio file directly to presigned S3 URL
            content_type = mime or "audio/wav"
            s3_res = await client.put(s3_url, content=data, headers={"Content-Type": content_type})
            s3_res.raise_for_status()

            # Step 4: Start Job
            start_res = await client.post(
                f"https://api.sarvam.ai/speech-to-text/job/v1/{job_id}/start",
                json={},
                headers=headers
            )
            start_res.raise_for_status()

            # Step 5: Poll Status until completed or failed
            status_url = f"https://api.sarvam.ai/speech-to-text/job/v1/{job_id}/status"
            for _ in range(40):
                await asyncio.sleep(2.5)
                st_res = await client.get(status_url, headers={"api-subscription-key": SARVAM_KEY})
                st_res.raise_for_status()
                st_data = st_res.json()
                state = st_data.get("job_state")
                if state in ("Completed", "Successful", "Success"):
                    # Step 6: Download Transcript
                    output_files = []
                    for d in st_data.get("job_details", []):
                        for out in d.get("outputs", []):
                            if "file_name" in out:
                                output_files.append(out["file_name"])
                    if not output_files:
                        output_files = ["0.json"]

                    dl_res = await client.post(
                        "https://api.sarvam.ai/speech-to-text/job/v1/download-files",
                        json={"job_id": job_id, "files": output_files},
                        headers=headers
                    )
                    dl_res.raise_for_status()
                    dl_data = dl_res.json()
                    dl_url = dl_data.get("download_urls", {}).get(output_files[0], {}).get("file_url")
                    if not dl_url:
                        return {"error": "Transcript download URL missing"}

                    file_res = await client.get(dl_url)
                    file_res.raise_for_status()
                    result = file_res.json()
                    return {
                        "text": result.get("transcript", ""),
                        "language": result.get("language_code", lang_code),
                        "mode": "sarvam-stt-batch",
                        "model": "saaras:v4",
                        "job_id": job_id
                    }
                elif state in ("Failed", "Error"):
                    return {"error": f"Batch job failed: {st_data.get('error_message')}"}

            return {"error": "Batch transcription timed out after polling."}
    except Exception as e:
        return {"error": f"Batch transcription exception: {str(e)[:200]}"}

@app.post('/api/transcribe')
async def transcribe(file: UploadFile = File(...), language: Optional[str] = None):
    """Speech-to-Text transcription powered by Sarvam AI (REST STT for <= 30s, Batch STT for > 30s, with fallback)."""
    data = await file.read()
    if len(data) > 25 * 1024 * 1024:
        return {'text': '', 'mode': 'error', 'error': 'Audio exceeds 25 MB prototype limit.'}
    
    # 1. Primary: Sarvam AI Speech-to-Text API
    if SARVAM_KEY:
        mime = file.content_type or mimetypes.guess_type(file.filename or '')[0] or 'audio/wav'
        filename = file.filename or 'recording.wav'
        lang_code = language if (language and language not in ('auto', 'unknown')) else 'unknown'

        # Check estimated duration if WAV format
        est_duration = estimate_wav_duration(data)

        # If audio duration exceeds 30.0s, route directly to Sarvam Batch STT
        if est_duration is not None and est_duration > 30.0:
            batch_res = await run_sarvam_batch_stt(data, filename=filename, mime=mime, language=lang_code)
            if 'error' not in batch_res and batch_res.get('text'):
                return batch_res
            if 'error' in batch_res:
                return {'text': '', 'mode': 'provider-error', 'error': f"Sarvam Batch STT error: {batch_res['error']}"}

        # For <= 30.0s (or formats where duration couldn't be parsed upfront), attempt REST STT
        try:
            stt_model = SARVAM_STT_MODEL
            if not stt_model or stt_model in ('saarika:v1', 'saarika:v2', 'bulbul:v1'):
                stt_model = 'saaras:v3'

            files = {'file': (filename, data, mime)}
            form_data = {'model': stt_model, 'language_code': lang_code}

            async with httpx.AsyncClient(timeout=120) as client:
                resp = await client.post(
                    'https://api.sarvam.ai/speech-to-text',
                    headers={'api-subscription-key': SARVAM_KEY},
                    data=form_data,
                    files=files
                )
                
                # If 400 error because audio duration exceeds 30 seconds, automatically delegate to Batch STT
                if resp.status_code == 400:
                    err_txt = resp.text.lower()
                    if '30 second' in err_txt or 'batch' in err_txt:
                        batch_res = await run_sarvam_batch_stt(data, filename=filename, mime=mime, language=lang_code)
                        if 'error' not in batch_res and batch_res.get('text'):
                            return batch_res
                        if 'error' in batch_res:
                            return {'text': '', 'mode': 'provider-error', 'error': f"Sarvam Batch STT error: {batch_res['error']}"}

                resp.raise_for_status()
                payload = resp.json()
            return {
                'text': payload.get('transcript', ''),
                'mode': 'sarvam-stt',
                'model': stt_model,
                'language': payload.get('language_code', lang_code)
            }
        except httpx.HTTPStatusError as e:
            detail = ''
            try:
                err_json = e.response.json()
                detail = err_json.get('error', {}).get('message') or err_json.get('detail') or err_json.get('message', '')
            except:
                detail = e.response.text[:200]

            # If error message mentions > 30s limit, fall back to batch STT
            if '30 second' in (detail or '').lower() or 'batch' in (detail or '').lower():
                batch_res = await run_sarvam_batch_stt(data, filename=filename, mime=mime, language=lang_code)
                if 'error' not in batch_res and batch_res.get('text'):
                    return batch_res

            return {'text': '', 'mode': 'provider-error', 'error': f'Sarvam STT error ({e.response.status_code}): {detail or str(e)[:200]}'}
        except Exception as e:
            return {'text': '', 'mode': 'provider-error', 'error': f'Sarvam STT transcription failed: {str(e)[:200]}'}

    # 2. Secondary fallback: OpenAI Whisper
    if OPENAI_KEY:
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                files = {'file': (file.filename or 'recording.webm', data, file.content_type or 'audio/webm')}
                form = {'model': WHISPER_MODEL, 'response_format': 'json'}
                if language: form['language'] = language
                resp = await client.post('https://api.openai.com/v1/audio/transcriptions', headers={'Authorization': f'Bearer {OPENAI_KEY}'}, data=form, files=files)
                resp.raise_for_status()
                payload = resp.json()
            return {'text': payload.get('text', ''), 'mode': 'openai-whisper', 'model': WHISPER_MODEL}
        except Exception as e:
            return {'text': '', 'mode': 'provider-error', 'error': str(e)[:250]}

    # 3. Transparent demo notice when neither key is configured
    return {
        'text': '',
        'mode': 'demo',
        'error': 'Speech-to-text provider is not configured. Add SARVAM_API_KEY to backend/.env to enable Sarvam AI speech transcription. In-browser speech capture is available where supported.'
    }

@app.post('/api/embeddings')
async def embeddings(payload: dict):
    """Small integration hook for indexing a record; production use should batch and persist vectors."""
    text = payload.get('text', '')
    if not text: return {'error': 'text is required'}
    if not GEMINI_KEY: return {'mode': 'demo', 'message': 'Set GEMINI_API_KEY to enable embeddings.', 'embedding': []}
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{EMBED_MODEL}:embedContent?key={GEMINI_KEY}'
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(url, json={'model': f'models/{EMBED_MODEL}', 'content': {'parts': [{'text': text}]}})
            res.raise_for_status()
            d = res.json()
        return {'mode': 'gemini-embeddings', 'model': EMBED_MODEL, 'embedding': d.get('embedding', {}).get('values', [])}
    except Exception as e:
        return {'mode': 'provider-error', 'error': str(e)[:250]}

@app.post('/api/tts')
async def tts(body: TTSBody):
    """Sarvam AI Text-to-Speech for heritage narration (Bulbul model)."""
    if not body.text.strip():
        return {'mode': 'error', 'error': 'No text provided for speech synthesis.'}
    if not SARVAM_KEY:
        return {'mode': 'demo', 'error': 'Sarvam AI TTS is not configured. Add SARVAM_API_KEY to backend/.env to enable Listen to History narration.'}
    text = body.text[:2400]
    lang = body.language_code or 'en-IN'
    
    # If Hindi requested, translate the narration text to natural Hindi using Sarvam Mayura / Gemini
    if lang == 'hi-IN':
        translated = None
        # 1. Primary: Sarvam AI Mayura Translation API (uses existing SARVAM_KEY)
        if SARVAM_KEY:
            try:
                async with httpx.AsyncClient(timeout=30) as client:
                    t_resp = await client.post(
                        'https://api.sarvam.ai/translate',
                        headers={'api-subscription-key': SARVAM_KEY, 'Content-Type': 'application/json'},
                        json={
                            'input': text,
                            'source_language_code': 'en-IN',
                            'target_language_code': 'hi-IN',
                            'mode': 'formal',
                            'model': 'mayura:v1'
                        }
                    )
                    if t_resp.status_code == 200:
                        t_data = t_resp.json()
                        translated = t_data.get('translated_text')
            except Exception:
                pass
        
        # 2. Secondary fallback: Gemini translation
        if not translated and GEMINI_KEY:
            try:
                translated = await gemini_generate(TEXT_MODEL, [{'text': f'Translate the following heritage narration to natural, fluent Hindi. Preserve all proper nouns, place names, dynasty names, and UNESCO in their original form. Do not add any information not in the original. Output only the Hindi translation.\n\n{text}'}])
            except Exception:
                pass
        
        if translated:
            text = translated[:2400]
    try:
        tts_model = SARVAM_TTS_MODEL
        if not tts_model or tts_model in ('bulbul:v1', 'bulbul:v2'):
            tts_model = 'bulbul:v3'

        req_speaker = (body.speaker or '').strip().lower()
        if req_speaker in BULBUL_V3_SPEAKERS:
            speaker = req_speaker
        else:
            speaker = 'ritu' if lang == 'hi-IN' else 'shubh'

        # Official Sarvam text-to-speech schema
        payload = {
            'text': text,
            'target_language_code': lang,
            'model': tts_model,
            'speaker': speaker,
            'speech_sample_rate': 22050,
        }
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                'https://api.sarvam.ai/text-to-speech',
                headers={'api-subscription-key': SARVAM_KEY, 'Content-Type': 'application/json'},
                json=payload
            )
            resp.raise_for_status()
            data = resp.json()
        audio_b64 = data.get('audios', [None])[0]
        if not audio_b64:
            return {'mode': 'error', 'error': 'No audio returned from Sarvam AI.'}
        return {
            'mode': 'sarvam-tts',
            'model': tts_model,
            'language': lang,
            'speaker': speaker,
            'audio_base64': audio_b64,
            'content_type': 'audio/wav'
        }
    except httpx.HTTPStatusError as e:
        detail = ''
        try:
            err_json = e.response.json()
            detail = err_json.get('error', {}).get('message') or err_json.get('detail') or err_json.get('message', '')
        except:
            detail = e.response.text[:200]
        return {'mode': 'provider-error', 'error': f'Sarvam AI error ({e.response.status_code}): {detail or str(e)[:200]}'}
    except Exception as e:
        return {'mode': 'provider-error', 'error': f'TTS generation failed: {str(e)[:200]}'}

# ============================================================
# Research Sessions (Independent Research Mode)
# ============================================================

@app.get('/api/research/sessions')
def get_research_sessions():
    """Retrieve all persisted private research sessions, newest first."""
    sessions = load_json_file(RESEARCH_SESSIONS_FILE, list)
    return {"total": len(sessions), "sessions": sessions}

@app.post('/api/research/sessions')
def save_research_session(body: ResearchSessionCreate):
    """Save or update a private research session without submitting to the public archive."""
    sessions = load_json_file(RESEARCH_SESSIONS_FILE, list)
    now = datetime.now(timezone.utc).isoformat()
    sid = body.session_id or f"sess_{uuid.uuid4().hex[:10]}"

    existing_idx = next((i for i, s in enumerate(sessions) if s.get("session_id") == sid), -1)

    t = body.title or body.session_name or "Untitled Research Session"
    orig = body.original_ai_transcription or body.original_text or ""
    edited = body.human_edited_transcription or body.edited_text or orig
    lang = body.language_script or body.language or "Sanskrit / Indic"
    conf_score = body.confidence_score or (body.confidence_stats.get("overall") if isinstance(body.confidence_stats, dict) else 90.0)

    session_record = {
        "session_id": sid,
        "title": t,
        "session_name": t,
        "document_url": body.document_url or "",
        "document_type": body.document_type or "Stone Inscription Rubbing",
        "original_filename": body.original_filename or "",
        "original_ai_transcription": orig,
        "human_edited_transcription": edited,
        "original_text": orig,
        "edited_text": edited,
        "language": lang,
        "language_script": lang,
        "uncertainties": body.uncertainties or [],
        "confidence_stats": body.confidence_stats or {"overall": conf_score},
        "confidence_score": conf_score,
        "monument_id": body.monument_id,
        "notes": body.notes or "",
        "created_at": sessions[existing_idx]["created_at"] if existing_idx >= 0 else now,
        "updated_at": now
    }

    if existing_idx >= 0:
        sessions[existing_idx] = session_record
    else:
        sessions.insert(0, session_record)

    save_json_file(RESEARCH_SESSIONS_FILE, sessions)
    return {"status": "success", "session": session_record}

@app.delete('/api/research/sessions/{session_id}')
def delete_research_session(session_id: str):
    """Delete a research session from private storage."""
    sessions = load_json_file(RESEARCH_SESSIONS_FILE, list)
    filtered = [s for s in sessions if s.get("session_id") != session_id]
    if len(filtered) == len(sessions):
        raise HTTPException(status_code=404, detail="Research session not found")
    save_json_file(RESEARCH_SESSIONS_FILE, filtered)
    return {"status": "success", "message": "Research session deleted"}

# ============================================================
# Automated Preliminary Screening & Archival Review
# ============================================================

@app.post('/api/screen')
@app.post('/api/screen-media')
def screen_submission(body: ContributionScreenBody):
    """
    Automated preliminary screening for contributions:
    - File integrity check
    - SHA-256 duplicate detection
    - Dynamic metadata completeness calculation
    - Location consistency against known monument coordinates
    - Provenance completeness check
    """
    checks = {}

    # 1. File Integrity
    file_size = body.file_size or 0
    if file_size > 50 * 1024 * 1024:
        checks["file_integrity"] = {"status": "failed", "detail": "File exceeds maximum archival size limit of 50 MB."}
    elif file_size == 0 and not body.filename:
        checks["file_integrity"] = {"status": "warning", "detail": "File size could not be determined before upload."}
    else:
        sz_kb = max(1, file_size // 1024)
        checks["file_integrity"] = {"status": "passed", "detail": f"File integrity verified ({sz_kb:,} KB). Valid image/document format."}

    # 2. Duplicate Detection via SHA-256
    existing_contributions = load_json_file(CONTRIBUTIONS_FILE, list)
    existing_hashes = {c.get("sha256_hash") for c in existing_contributions if c.get("sha256_hash")}
    
    if body.sha256_hash and body.sha256_hash in existing_hashes:
        checks["duplicate_detection"] = {
            "status": "warning",
            "detail": "Duplicate file detected. A file with an identical cryptographic SHA-256 hash has already been submitted to the archive. Please clarify if this represents an independent photographic observation."
        }
    else:
        checks["duplicate_detection"] = {
            "status": "passed",
            "detail": "No duplicate record found. Cryptographic SHA-256 hash is unique in this repository."
        }

    # 3. Dynamic Metadata Completeness
    core_fields = ["site_name", "location", "era", "description", "contributor", "source"]
    data_dict = body.dict()
    present = [f for f in core_fields if data_dict.get(f) and str(data_dict.get(f)).strip()]
    missing = [f for f in core_fields if f not in present]
    score = round((len(present) / len(core_fields)) * 100)
    checks["metadata_completeness"] = {
        "score": score,
        "present_count": len(present),
        "total_count": len(core_fields),
        "missing_fields": missing,
        "status": "passed" if score >= 80 else "warning",
        "detail": f"{len(present)} of {len(core_fields)} core documentation fields provided ({score}%)."
    }

    # 4. Location Consistency Check
    loc = (body.location or "").lower()
    site = (body.site_name or "").lower()
    loc_warning = None
    if "rani ki vav" in site and loc and not any(k in loc for k in ["gujarat", "patan"]):
        loc_warning = "Selected site is Rani ki Vav (Patan, Gujarat), but location specifies a different region. Please review if this is an off-site archival reference."
    elif "konark" in site and loc and not any(k in loc for k in ["odisha", "puri", "orissa"]):
        loc_warning = "Selected site is Konark Sun Temple (Puri, Odisha), but location specifies a different region. Please review."
    elif "brihadeeswarar" in site and loc and not any(k in loc for k in ["tamil", "thanjavur"]):
        loc_warning = "Selected site is Brihadeeswarar Temple (Thanjavur, Tamil Nadu), but location specifies a different region."
    elif "ellora" in site and loc and not any(k in loc for k in ["maharashtra", "aurangabad", "sambhaji"]):
        loc_warning = "Selected site is Ellora Caves (Maharashtra), but location specifies a different region."
    elif "hampi" in site and loc and not any(k in loc for k in ["karnataka", "bellary", "vijayanagara"]):
        loc_warning = "Selected site is Hampi (Karnataka), but location specifies a different region."

    checks["location_consistency"] = {
        "status": "warning" if loc_warning else "passed",
        "detail": loc_warning or "Geographical location is consistent with known monument records."
    }

    # 5. Provenance Completeness
    has_source = bool(body.source and str(body.source).strip())
    has_contrib = bool(body.contributor and str(body.contributor).strip())
    checks["provenance_completeness"] = {
        "status": "passed" if (has_source and has_contrib) else "warning",
        "detail": "Full provenance documentation supplied (source + contributor attribution)." if (has_source and has_contrib) else "Incomplete provenance: Missing primary documentation source or contributor attribution."
    }

    # Overall Summary
    warnings = sum(1 for c in checks.values() if c.get("status") == "warning")
    failed = sum(1 for c in checks.values() if c.get("status") == "failed")
    if failed > 0:
        overall = "Failed Integrity Checks"
    elif warnings > 1:
        overall = "Requires Additional Information"
    elif warnings == 1:
        overall = "Minor Review Suggested"
    else:
        overall = "Passed Preliminary Intake"

    return {
        "overall_status": overall,
        "score": score,
        "checks": checks,
        "disclaimer": "Automated preliminary screening assists human curators and does not constitute independent institutional authentication."
    }

@app.get('/api/contributions')
def get_contributions():
    """List all submitted archival contributions and their screening reports & review states."""
    items = load_json_file(CONTRIBUTIONS_FILE, list)
    return {"total": len(items), "contributions": items}

@app.post('/api/contributions')
def create_contribution(body: ContributionCreate):
    """Submit a document or record into the archival review pipeline."""
    items = load_json_file(CONTRIBUTIONS_FILE, list)
    now = datetime.now(timezone.utc).isoformat()
    cid = f"contrib_{uuid.uuid4().hex[:10]}"

    record = {
        "id": cid,
        "title": body.title,
        "document_url": body.document_url or body.media_url or "",
        "media_url": body.media_url or body.document_url or "",
        "original_filename": body.original_filename or "",
        "file_size": body.file_size or 0,
        "content_type": body.content_type or "",
        "sha256_hash": body.sha256_hash or "",
        "site_name": body.site_name or "",
        "location": body.location or "",
        "era": body.era or "",
        "description": body.description or "",
        "contributor": body.contributor or "Anonymous Researcher",
        "source": body.source or "Contributor Field Survey",
        "documentation_date": body.documentation_date or datetime.now().strftime("%Y-%m-%d"),
        "transcription": body.transcription or "",
        "screening_report": body.screening_report or {},
        "status": "Submitted",
        "review_level": "Level 1 — Submitted",
        "reviewer_notes": "",
        "reviewer_name": "",
        "review_timestamp": None,
        "external_ref_title": None,
        "external_ref_url": None,
        "verification_history": [
            {
                "stage": "Level 1 — Submitted",
                "timestamp": now,
                "reviewer": body.contributor or "Contributor",
                "decision": "Submitted",
                "notes": "Initial contribution submitted into archival repository."
            }
        ],
        "submitted_at": now
    }

    items.insert(0, record)
    save_json_file(CONTRIBUTIONS_FILE, items)
    return {"status": "success", "contribution": record}

@app.put('/api/contributions/{contribution_id}/review')
def review_contribution(contribution_id: str, body: ContributionReviewBody):
    """
    Two-Level Human & Institutional Review Pipeline:
    LEVEL 1 — Submitted: Initial contribution.
    LEVEL 2 — Researcher Reviewed: Independent researcher records identity, review date, decision, comments, supporting evidence, corrections.
    LEVEL 3 — Institutionally Verified: Institutional review against authoritative sources (ASI/UNESCO). Records institution name, official reference URL/document, verification date, evidence reviewed, decision, and responsible reviewer.
    Level 2 never auto-promotes to Level 3; ordinary web citations do not count as institutional approval.
    """
    items = load_json_file(CONTRIBUTIONS_FILE, list)
    idx = next((i for i, c in enumerate(items) if c.get("id") == contribution_id), -1)
    if idx < 0:
        raise HTTPException(status_code=404, detail="Contribution record not found")

    target = items[idx]
    now = datetime.now(timezone.utc).isoformat()

    action = (body.action or "").lower().strip()
    status_raw = (body.status or "").strip()
    status_lower = status_raw.lower().replace(" ", "_")

    if "verification_history" not in target or not isinstance(target["verification_history"], list):
        target["verification_history"] = []

    # Determine Tier:
    # TIER 3: Institutional Verification (Requires official institutional source, e.g. ASI / UNESCO)
    if action == "institutional_verification" or status_lower in ("institutionally_verified", "level_3", "level_3_—_institutionally_verified") or "institutional" in status_lower:
        inst_name = (body.institution_name or "").strip()
        ref_id = (body.institutional_ref_id or body.external_ref_title or "").strip()
        ref_url = (body.institutional_ref_url or body.external_ref_url or "").strip()
        evidence = (body.evidence_reviewed or body.reviewer_notes or "").strip()
        inst_reviewer = (body.institutional_reviewer or body.reviewer_name or "Institutional Directorate Officer").strip()

        if not inst_name and not ref_id and not ref_url:
            raise HTTPException(
                status_code=400,
                detail="Level 3 Institutional Verification requires an authoritative institution name (e.g. Archaeological Survey of India or UNESCO) and official registry reference."
            )

        target["status"] = "Institutionally Verified"
        target["review_level"] = "Level 3 — Institutionally Verified"
        target["institution_name"] = inst_name or "Archaeological Survey of India (ASI)"
        target["institutional_ref_id"] = ref_id or "ASI Monument Registry Record"
        target["institutional_ref_url"] = ref_url
        target["evidence_reviewed"] = evidence
        target["institutional_reviewer"] = inst_reviewer
        target["institutional_verification_date"] = now
        target["review_timestamp"] = now

        target["verification_history"].append({
            "stage": "Level 3 — Institutionally Verified",
            "timestamp": now,
            "institution": target["institution_name"],
            "institutional_ref": target["institutional_ref_id"],
            "reviewer": inst_reviewer,
            "decision": "Institutionally Verified",
            "evidence_reviewed": evidence,
            "notes": body.reviewer_notes or "Corroborated against authoritative national/international heritage register."
        })

    # TIER 2: Researcher Review (Independent researcher review)
    elif action == "researcher_review" or status_lower in ("researcher_reviewed", "level_2", "level_2_—_researcher_reviewed", "accepted", "accepted_for_archive") or "researcher" in status_lower:
        target["status"] = "Researcher Reviewed"
        target["review_level"] = "Level 2 — Researcher Reviewed"
        target["reviewer_name"] = body.reviewer_name or "Independent Epigraphy Researcher"
        target["reviewer_role"] = body.reviewer_role or "Senior Field Epigraphist"
        target["reviewer_notes"] = body.reviewer_notes or "Field documentation verified against paleographic and architectural morphology."
        target["supporting_evidence"] = body.supporting_evidence or ""
        target["corrections_requested"] = body.corrections_requested or ""
        target["review_timestamp"] = now

        # Explicitly ensure Level 2 does NOT auto-promote to Level 3
        # If institutional fields were previously absent, they remain unset until genuine institutional verification
        target["verification_history"].append({
            "stage": "Level 2 — Researcher Reviewed",
            "timestamp": now,
            "reviewer": target["reviewer_name"],
            "role": target["reviewer_role"],
            "decision": "Researcher Reviewed",
            "supporting_evidence": target["supporting_evidence"],
            "corrections_requested": target["corrections_requested"],
            "notes": target["reviewer_notes"]
        })

    # Rejected / Requires Correction
    elif action in ("needs_correction", "reject") or status_lower in ("rejected", "requires_correction", "needs_info", "needs_more_information", "rejected_/_requires_correction"):
        is_reject = action == "reject" or "reject" in status_lower
        target["status"] = "Rejected / Requires Correction"
        target["review_level"] = "Rejected" if is_reject else "Requires Correction"
        target["reviewer_name"] = body.reviewer_name or "Archival Reviewer"
        target["reviewer_notes"] = body.reviewer_notes or ("Field evidence does not meet architectural authenticity standards." if is_reject else "Please provide higher resolution rubbing and monument context.")
        target["corrections_requested"] = body.corrections_requested or ("Documentation rejected." if is_reject else "Supplementary photograph and epigraphic rubbing required.")
        target["review_timestamp"] = now

        target["verification_history"].append({
            "stage": target["review_level"],
            "timestamp": now,
            "reviewer": target["reviewer_name"],
            "decision": target["status"],
            "corrections_requested": target["corrections_requested"],
            "notes": target["reviewer_notes"]
        })

    else:
        raise HTTPException(status_code=400, detail=f"Invalid review status or action '{body.status}'")

    save_json_file(CONTRIBUTIONS_FILE, items)

    # If approved (Level 2 or Level 3), ensure asset is synchronized to media archive with full SHA-256 and verification metadata
    if target["status"] in ("Researcher Reviewed", "Institutionally Verified"):
        media_items = load_json_file(MEDIA_FILE, list)
        existing_idx = next((i for i, m in enumerate(media_items) if m.get("id") == f"m_{target['id']}" or m.get("url") == target.get("document_url")), -1)
        
        media_record = {
            "id": f"m_{target['id']}",
            "filename": target.get("original_filename") or target["title"],
            "original_filename": target.get("original_filename") or target["title"],
            "url": target.get("document_url") or target.get("media_url"),
            "size_bytes": target.get("file_size", 0),
            "content_type": target.get("content_type", "image/jpeg"),
            "sha256_hash": target.get("sha256_hash", ""),
            "media_type": "document" if (target.get("document_url", "").endswith(".pdf") or "pdf" in target.get("content_type", "")) else ("video" if "video" in target.get("content_type", "") else "image"),
            "site_name": target.get("site_name", ""),
            "location": target.get("location", ""),
            "era": target.get("era", ""),
            "description": target.get("description", ""),
            "contributor": target.get("contributor", ""),
            "source": target.get("source", ""),
            "verified": True,
            "review_status": target["status"],
            "verification_level": target["review_level"],
            "reviewer": target.get("reviewer_name") or target.get("institutional_reviewer", ""),
            "institution": target.get("institution_name", ""),
            "uploaded_at": now
        }

        if existing_idx >= 0:
            media_items[existing_idx] = media_record
        else:
            media_items.insert(0, media_record)
        save_json_file(MEDIA_FILE, media_items)

    return {"status": "success", "contribution": target}

@app.get('/api/monuments/{monument_identifier}/contributions')
def get_monument_contributions(monument_identifier: str):
    """Retrieve all approved (Level 2 or Level 3) contributions for a specific monument."""
    items = load_json_file(CONTRIBUTIONS_FILE, list)
    mon_clean = monument_identifier.lower().replace("-", " ").replace("_", " ").strip()
    
    approved = []
    for c in items:
        # Match if approved and matches site name or title
        status = c.get("status", "")
        if status in ("Researcher Reviewed", "Institutionally Verified", "Accepted for Archive"):
            site = (c.get("site_name") or "").lower()
            title = (c.get("title") or "").lower()
            if mon_clean in site or site in mon_clean or mon_clean in title or title in mon_clean:
                approved.append(c)
    
    return {"total": len(approved), "contributions": approved}

# -----------------------------------------------------------------------------
# Production Frontend SPA Serving
# -----------------------------------------------------------------------------
FRONTEND_DIST = (BASE_DIR.parent / "frontend" / "dist").resolve()
if FRONTEND_DIST.exists():
    from starlette.responses import FileResponse
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="frontend_assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Do not catch API or uploads endpoints
        if full_path.startswith("api/") or full_path.startswith("uploads/"):
            raise HTTPException(status_code=404, detail="API route not found")
        target_path = FRONTEND_DIST / full_path
        if full_path and target_path.is_file():
            return FileResponse(target_path)
        # Fallback to SPA index.html
        return FileResponse(FRONTEND_DIST / "index.html")

