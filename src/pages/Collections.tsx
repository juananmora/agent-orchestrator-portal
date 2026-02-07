import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderOpen,
  Plus,
  Search,
  MoreVertical,
  Star,
  GitBranch,
  Clock,
  User,
  Edit,
  Trash2,
  Copy,
  Play,
  ChevronRight,
  Grid,
  List
} from 'lucide-react'
import { mockCollections, mockOrchestrations, getOrchestrationById } from '../data/mockData'
import type { Collection, Orchestration } from '../types'
import './Collections.css'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CollectionCard({ collection, onSelect }: { collection: Collection; onSelect: () => void }) {
  const navigate = useNavigate()
  const orchestrations = collection.orchestrations
    .map(id => getOrchestrationById(id))
    .filter(Boolean) as Orchestration[]

  const totalNodes = orchestrations.reduce((sum, o) => sum + o.graph.nodes.length, 0)

  return (
    <div className="collection-card" onClick={onSelect}>
      <div className="collection-card-header">
        <div className="collection-icon">
          <FolderOpen size={24} />
        </div>
        <div className="collection-info">
          <div className="collection-name-row">
            <h3>{collection.name}</h3>
            {collection.isDefault && (
              <Star size={16} className="default-star" />
            )}
          </div>
          <p className="collection-description">{collection.description}</p>
        </div>
        <button 
          className="collection-menu-btn"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="collection-stats">
        <div className="stat">
          <GitBranch size={14} />
          <span>{orchestrations.length} orchestrations</span>
        </div>
        <div className="stat">
          <Grid size={14} />
          <span>{totalNodes} nodes</span>
        </div>
        <div className="stat">
          <Clock size={14} />
          <span>Updated {formatDate(collection.updatedAt)}</span>
        </div>
      </div>

      <div className="collection-orchestrations">
        {orchestrations.slice(0, 3).map(orch => (
          <div 
            key={orch.id} 
            className="mini-orchestration"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/builder/${orch.id}`)
            }}
          >
            <span className={`status-dot ${orch.status}`} />
            <span className="mini-orch-name">{orch.name}</span>
            <ChevronRight size={14} />
          </div>
        ))}
        {orchestrations.length > 3 && (
          <span className="more-orchestrations">
            +{orchestrations.length - 3} more
          </span>
        )}
      </div>

      <div className="collection-footer">
        <div className="owner">
          <User size={14} />
          <span>{collection.owner.split('@')[0]}</span>
        </div>
        <div className="collection-actions">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/builder?collection=${collection.id}`)
            }}
          >
            <Plus size={14} />
            Add
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              // Run all orchestrations
            }}
          >
            <Play size={14} />
            Run All
          </button>
        </div>
      </div>
    </div>
  )
}

function OrchestrationRow({ orchestration }: { orchestration: Orchestration }) {
  const navigate = useNavigate()

  return (
    <div 
      className="orchestration-row"
      onClick={() => navigate(`/builder/${orchestration.id}`)}
    >
      <div className="orch-row-status">
        <span className={`status-dot large ${orchestration.status}`} />
      </div>
      <div className="orch-row-info">
        <span className="orch-row-name">{orchestration.name}</span>
        <span className="orch-row-description">{orchestration.description}</span>
      </div>
      <div className="orch-row-meta">
        <span className="orch-version">v{orchestration.version}</span>
        <span className="orch-nodes">{orchestration.graph.nodes.length} nodes</span>
      </div>
      <div className="orch-row-tags">
        {orchestration.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <div className="orch-row-updated">
        {formatDate(orchestration.updatedAt)}
      </div>
      <div className="orch-row-actions">
        <button className="btn btn-icon btn-ghost" title="Run">
          <Play size={16} />
        </button>
        <button className="btn btn-icon btn-ghost" title="Duplicate">
          <Copy size={16} />
        </button>
        <button className="btn btn-icon btn-ghost" title="More">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  )
}

export default function Collections() {
  const navigate = useNavigate()
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCollections = mockCollections.filter(col =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    col.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedOrchestrations = selectedCollection
    ? selectedCollection.orchestrations
        .map(id => getOrchestrationById(id))
        .filter(Boolean) as Orchestration[]
    : mockOrchestrations

  return (
    <div className="collections-page">
      {/* Header */}
      <div className="collections-header">
        <div className="header-left">
          <h1>Collections</h1>
          <p>Organize and manage your orchestration workflows</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary">
            <Plus size={18} />
            New Collection
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <section className="collections-section">
        <div className="section-header">
          <h2>Your Collections</h2>
          <div className="search-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="collections-grid">
          {filteredCollections.map(collection => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onSelect={() => setSelectedCollection(
                selectedCollection?.id === collection.id ? null : collection
              )}
            />
          ))}

          <div className="new-collection-card">
            <Plus size={32} />
            <span>Create New Collection</span>
          </div>
        </div>
      </section>

      {/* Orchestrations List */}
      <section className="orchestrations-section">
        <div className="section-header">
          <div className="section-title-row">
            <h2>
              {selectedCollection 
                ? `${selectedCollection.name} Orchestrations` 
                : 'All Orchestrations'}
            </h2>
            {selectedCollection && (
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => setSelectedCollection(null)}
              >
                Show All
              </button>
            )}
          </div>
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="orchestrations-list">
            <div className="list-header">
              <span className="col-status">Status</span>
              <span className="col-name">Name</span>
              <span className="col-meta">Details</span>
              <span className="col-tags">Tags</span>
              <span className="col-updated">Updated</span>
              <span className="col-actions">Actions</span>
            </div>
            {selectedOrchestrations.map(orch => (
              <OrchestrationRow key={orch.id} orchestration={orch} />
            ))}
          </div>
        ) : (
          <div className="orchestrations-grid">
            {selectedOrchestrations.map(orch => (
              <div 
                key={orch.id} 
                className="orchestration-card"
                onClick={() => navigate(`/builder/${orch.id}`)}
              >
                <div className="orch-card-header">
                  <span className={`status-badge ${orch.status}`}>{orch.status}</span>
                  <button className="btn btn-icon btn-ghost">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h3>{orch.name}</h3>
                <p>{orch.description}</p>
                <div className="orch-card-meta">
                  <span>v{orch.version}</span>
                  <span>{orch.graph.nodes.length} nodes</span>
                </div>
                <div className="orch-card-tags">
                  {orch.tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="orch-card-footer">
                  <span className="orch-updated">{formatDate(orch.updatedAt)}</span>
                  <div className="orch-card-actions">
                    <button className="btn btn-ghost btn-sm">
                      <Edit size={14} />
                      Edit
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <Play size={14} />
                      Run
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
