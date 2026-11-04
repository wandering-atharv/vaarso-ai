import React, { useState, useMemo } from 'react';
import { 
  FolderPlus, Trash2, Edit3, ArrowLeft, Plus, X, Layers, 
  Network, Library, MapPin, Clock, ArrowRight, Eye, Check, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ThematicKnowledgeGraph from '../components/ThematicKnowledgeGraph';

export default function CollectionsPage() {
  const { 
    collections, 
    activeCollectionId, 
    setActiveCollectionId, 
    createCollection, 
    updateCollection, 
    deleteCollection, 
    addMonumentToCollection, 
    removeMonumentFromCollection,
    records, 
    setSelected, 
    setPage, 
    setSearch 
  } = useApp();

  const [activeTab, setActiveTab] = useState('collections'); // 'collections' | 'graph'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null); // null when creating
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCover, setFormCover] = useState('/images/Mondhera.jpg');
  const [formMonuments, setFormMonuments] = useState([]);
  const [addSiteDropdownOpen, setAddSiteDropdownOpen] = useState(false);

  /* Find active collection object if selected */
  const activeCollection = useMemo(() => {
    if (!activeCollectionId) return null;
    return collections.find((c) => c.id === activeCollectionId) || null;
  }, [collections, activeCollectionId]);

  /* Get list of monument objects inside the active collection */
  const activeMonuments = useMemo(() => {
    if (!activeCollection) return [];
    const ids = new Set((activeCollection.monument_ids || []).map((id) => Number(id)));
    return records.filter((r) => ids.has(Number(r.id)));
  }, [activeCollection, records]);

  /* Get monuments that are NOT yet in the active collection */
  const availableMonumentsToAdd = useMemo(() => {
    if (!activeCollection) return [];
    const ids = new Set((activeCollection.monument_ids || []).map((id) => Number(id)));
    return records.filter((r) => !ids.has(Number(r.id)));
  }, [activeCollection, records]);

  /* Open modal for creating a new collection */
  const handleOpenCreateModal = () => {
    setEditingCollection(null);
    setFormTitle('');
    setFormDesc('');
    setFormCover(records[0]?.image || '/images/Mondhera.jpg');
    setFormMonuments([]);
    setModalOpen(true);
  };

  /* Open modal for editing an existing collection */
  const handleOpenEditModal = (col, e) => {
    e?.stopPropagation();
    setEditingCollection(col);
    setFormTitle(col.title || '');
    setFormDesc(col.desc || '');
    setFormCover(col.cover || records[0]?.image || '/images/Mondhera.jpg');
    setFormMonuments((col.monument_ids || []).map(Number));
    setModalOpen(true);
  };

  /* Save creation or update */
  const handleSaveCollection = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingCollection) {
      await updateCollection(editingCollection.id, {
        title: formTitle.trim(),
        desc: formDesc.trim(),
        cover: formCover,
        monument_ids: formMonuments,
      });
    } else {
      const created = await createCollection({
        title: formTitle.trim(),
        desc: formDesc.trim(),
        cover: formCover,
        monument_ids: formMonuments,
      });
      if (created?.id) {
        setActiveCollectionId(created.id);
      }
    }
    setModalOpen(false);
  };

  /* Delete collection with prompt */
  const handleDeleteCollection = async (colId, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      await deleteCollection(colId);
    }
  };

  /* Toggle monument checkbox in modal */
  const handleToggleMonumentCheckbox = (id) => {
    const numId = Number(id);
    setFormMonuments((prev) => 
      prev.includes(numId) ? prev.filter((i) => i !== numId) : [...prev, numId]
    );
  };

  /* Navigate to monument detail in Archive */
  const handleViewMonumentDetail = (monument) => {
    setSelected(monument);
    setPage('Archive');
  };

  return (
    <section className="page-wrap collections-page">
      {/* Top Header & Tab Switcher */}
      <div className="collections-header-bar">
        <div>
          <div className="eyebrow muted">CURATED ARCHIVES & ANTHOLOGIES</div>
          <h1 className="collections-main-title">
            Heritage <em>Collections.</em>
          </h1>
          <p className="collections-subtext">
            Thematic anthologies curating India's architectural achievements, sculptural dynasties, and sacred geometry.
          </p>
        </div>

        {/* Tab Controls and Action Button */}
        <div className="collections-actions-group">
          <div className="collections-tabs-pill">
            <button
              className={`pill-tab ${activeTab === 'collections' ? 'active' : ''}`}
              onClick={() => { setActiveTab('collections'); setActiveCollectionId(null); }}
            >
              <Library size={13} />
              <span>Curated Collections ({collections.length})</span>
            </button>
            <button
              className={`pill-tab ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              <Network size={13} />
              <span>Thematic Graph</span>
            </button>
          </div>

          {activeTab === 'collections' && (
            <button className="gold-btn new-collection-btn" onClick={handleOpenCreateModal}>
              <FolderPlus size={15} />
              <span>New Collection</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================== TAB 1: CURATED COLLECTIONS ==================== */}
      {activeTab === 'collections' && (
        <>
          {/* Detail View of an Individual Collection */}
          {activeCollection ? (
            <div className="collection-detail-view">
              <button 
                className="back-to-collections-btn" 
                onClick={() => setActiveCollectionId(null)}
              >
                <ArrowLeft size={14} /> Back to all collections
              </button>

              {/* Collection Hero Banner */}
              <div className="collection-hero-card">
                <div 
                  className="collection-hero-bg" 
                  style={{ backgroundImage: `url("${activeCollection.cover || '/images/Mondhera.jpg'}")` }} 
                />
                <div className="collection-hero-overlay" />
                <div className="collection-hero-content">
                  <div className="collection-badge-row">
                    <span className="collection-count-chip">
                      <Layers size={12} /> {activeMonuments.length} {activeMonuments.length === 1 ? 'Monument' : 'Monuments'}
                    </span>
                    <span className="collection-meta-chip">Curated Anthology</span>
                  </div>
                  <h2 className="collection-hero-title">{activeCollection.title}</h2>
                  <p className="collection-hero-desc">{activeCollection.desc || 'No description provided for this collection.'}</p>

                  <div className="collection-hero-actions">
                    <button 
                      className="outline-btn hero-action-btn"
                      onClick={(e) => handleOpenEditModal(activeCollection, e)}
                    >
                      <Edit3 size={13} /> Edit Collection
                    </button>
                    <button 
                      className="outline-btn hero-action-btn danger-btn"
                      onClick={(e) => handleDeleteCollection(activeCollection.id, e)}
                    >
                      <Trash2 size={13} /> Delete Collection
                    </button>

                    {/* Add Monument Quick Dropdown */}
                    <div className="add-site-dropdown-wrapper">
                      <button 
                        className="gold-btn hero-action-btn"
                        onClick={() => setAddSiteDropdownOpen(!addSiteDropdownOpen)}
                      >
                        <Plus size={14} /> Add Monument
                      </button>

                      {addSiteDropdownOpen && (
                        <div className="add-site-dropdown-menu">
                          <div className="dropdown-menu-header">
                            <span>Select monument to add</span>
                            <button 
                              className="icon-btn-close" 
                              onClick={() => setAddSiteDropdownOpen(false)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                          {availableMonumentsToAdd.length === 0 ? (
                            <div className="dropdown-empty">
                              All available archive monuments are already in this collection.
                            </div>
                          ) : (
                            <div className="dropdown-items-scroll">
                              {availableMonumentsToAdd.map((mon) => (
                                <button
                                  key={mon.id}
                                  className="dropdown-monument-item"
                                  onClick={() => {
                                    addMonumentToCollection(activeCollection.id, mon.id);
                                    setAddSiteDropdownOpen(false);
                                  }}
                                >
                                  <img 
                                    src={mon.image || mon.img} 
                                    alt={mon.title} 
                                    onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }} 
                                  />
                                  <div className="dropdown-mon-text">
                                    <b>{mon.title}</b>
                                    <small>{mon.place} · {mon.era}</small>
                                  </div>
                                  <Plus size={14} className="add-icon" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monuments in this Collection */}
              <div className="collection-monuments-section">
                <div className="section-head-row">
                  <div>
                    <h3 className="section-title">Sites in this Collection ({activeMonuments.length})</h3>
                    <p className="section-subtext">Click any site to examine high-resolution architectural documentation in the Archive.</p>
                  </div>
                </div>

                {activeMonuments.length === 0 ? (
                  <div className="collection-empty-monuments">
                    <AlertCircle size={28} className="empty-icon" />
                    <h4>No monuments in this collection yet</h4>
                    <p>Add existing heritage sites from the archive using the button above.</p>
                    <button 
                      className="gold-btn" 
                      onClick={() => setAddSiteDropdownOpen(true)}
                    >
                      <Plus size={14} /> Add First Monument
                    </button>
                  </div>
                ) : (
                  <div className="collection-monuments-grid">
                    {activeMonuments.map((m) => (
                      <div key={m.id} className="monument-curated-card">
                        <div className="monument-card-media" onClick={() => handleViewMonumentDetail(m)}>
                          <img 
                            src={m.image || m.img} 
                            alt={m.title} 
                            loading="lazy" 
                            onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }} 
                          />
                          <div className="monument-card-badge">{m.type}</div>
                          <div className="monument-view-overlay">
                            <span><Eye size={14} /> Open Site Record</span>
                          </div>
                        </div>
                        <div className="monument-card-content">
                          <h4 onClick={() => handleViewMonumentDetail(m)}>{m.title}</h4>
                          <div className="monument-card-loc">
                            <MapPin size={11} /> {m.place}
                          </div>
                          <div className="monument-card-era">
                            <Clock size={11} /> {m.era} {m.dynasty ? `· ${m.dynasty}` : ''}
                          </div>
                          <p className="monument-card-desc">{m.desc}</p>
                          <div className="monument-card-footer">
                            <button 
                              className="view-site-link" 
                              onClick={() => handleViewMonumentDetail(m)}
                            >
                              Explore in Archive <ArrowRight size={12} />
                            </button>
                            <button 
                              className="remove-site-btn" 
                              title="Remove from this collection"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMonumentFromCollection(activeCollection.id, m.id);
                              }}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Collection Cards Overview Grid */
            <div className="collections-overview">
              {collections.length === 0 ? (
                <div className="empty-collections-state">
                  <Library size={36} className="empty-icon" />
                  <h3>No collections created yet</h3>
                  <p>Begin organizing heritage sites by architectural school, dynasty, or engineering form.</p>
                  <button className="gold-btn" onClick={handleOpenCreateModal}>
                    <FolderPlus size={15} /> Create First Collection
                  </button>
                </div>
              ) : (
                <div className="collections-editorial-grid">
                  {collections.map((col, index) => {
                    const monumentCount = (col.monument_ids || []).length;
                    const previewMonuments = records.filter((r) => 
                      (col.monument_ids || []).some((id) => Number(id) === Number(r.id))
                    ).slice(0, 3);

                    return (
                      <article 
                        key={col.id} 
                        className="collection-editorial-card"
                        onClick={() => setActiveCollectionId(col.id)}
                      >
                        {/* Image aspect ratio container */}
                        <div className="collection-card-cover">
                          <img 
                            src={col.cover || '/images/Mondhera.jpg'} 
                            alt={col.title} 
                            loading="lazy" 
                            onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }}
                          />
                          <div className="collection-card-gradient" />
                          <div className="collection-card-topbar">
                            <span className="collection-count-tag collection-card-badge">Sites: {monumentCount}</span>
                            <span className="collection-num collection-card-number">Collection: {String(index + 1).padStart(2, '0')}</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="collection-card-body">
                          <h3 className="collection-card-title">{col.title}</h3>
                          <p className="collection-card-desc">
                            {col.desc || 'Curated selection of monuments and historical architecture.'}
                          </p>

                          {/* Preview Thumbnails */}
                          {previewMonuments.length > 0 && (
                            <div className="collection-preview-thumbnails">
                              <span className="preview-label">Includes:</span>
                              <div className="thumbnail-avatars">
                                {previewMonuments.map((pm) => (
                                  <img 
                                    key={pm.id} 
                                    src={pm.image || pm.img} 
                                    alt={pm.title} 
                                    title={pm.title} 
                                    onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }}
                                  />
                                ))}
                                {monumentCount > 3 && (
                                  <span className="more-count">+{monumentCount - 3}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Footer with actions */}
                          <div className="collection-card-footer">
                            <button 
                              className="explore-collection-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCollectionId(col.id);
                              }}
                            >
                              Explore Anthology <ArrowRight size={13} />
                            </button>
                            <div className="collection-card-tools">
                              <button 
                                className="tool-icon-btn" 
                                title="Edit collection"
                                onClick={(e) => handleOpenEditModal(col, e)}
                              >
                                <Edit3 size={13} />
                              </button>
                              <button 
                                className="tool-icon-btn delete-tool" 
                                title="Delete collection"
                                onClick={(e) => handleDeleteCollection(col.id, e)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ==================== TAB 2: KNOWLEDGE GRAPH ==================== */}
      {activeTab === 'graph' && (
        <div className="graph-panel">
          <div className="graph-intro">
            <span className="eyebrow muted">LINKED CULTURAL NETWORK</span>
            <h2>Thematic Knowledge Graph & Contextual Discovery</h2>
            <p>
              Explore multi-dimensional historical, architectural, dynastic, and epigraphic networks for all 12 monuments.
              Select any site, filter by thematic category, or click any entity to open contextual research cards.
            </p>
          </div>
          <ThematicKnowledgeGraph />
        </div>
      )}

      {/* ==================== MODAL: CREATE / EDIT COLLECTION ==================== */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <FolderPlus size={18} className="modal-title-icon" />
                <h3>{editingCollection ? 'Edit Heritage Collection' : 'Create New Collection'}</h3>
              </div>
              <button className="icon-btn-close" onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="modal-form">
              <div className="form-group">
                <label className="form-label">Collection Title *</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  required
                  placeholder="e.g., Solanki Stepwell Engineering"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Curatorial Scope</label>
                <textarea 
                  className="modal-textarea" 
                  rows={3}
                  placeholder="Briefly describe the historical, artistic, or regional focus of this collection…"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Monument Image</label>
                <div className="cover-picker-row">
                  {records.map((r) => {
                    const imgUrl = r.image || r.img;
                    return (
                      <div 
                        key={r.id} 
                        className={`cover-picker-item ${formCover === imgUrl ? 'selected' : ''}`}
                        onClick={() => setFormCover(imgUrl)}
                        title={r.title}
                      >
                        <img 
                          src={imgUrl} 
                          alt={r.title} 
                          onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }} 
                        />
                        {formCover === imgUrl && <div className="picker-checkmark"><Check size={10} /></div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Include Heritage Sites ({formMonuments.length} selected)</label>
                <div className="monument-checkbox-list">
                  {records.map((r) => {
                    const isChecked = formMonuments.includes(Number(r.id));
                    const imgUrl = r.image || r.img;
                    return (
                      <label key={r.id} className={`monument-checkbox-row ${isChecked ? 'checked' : ''}`}>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleMonumentCheckbox(r.id)}
                        />
                        <img 
                          src={imgUrl} 
                          alt={r.title} 
                          onError={(e) => { e.target.src = '/images/Mondhera.jpg'; }} 
                        />
                        <div className="checkbox-info">
                          <b>{r.title}</b>
                          <small>{r.place} · {r.type}</small>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="outline-btn" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="gold-btn">
                  {editingCollection ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
