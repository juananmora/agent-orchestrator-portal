import { useState } from 'react'
import {
  Bot,
  Plus,
  Search,
  MoreVertical,
  Code,
  Shield,
  FileText,
  Terminal,
  Bug,
  Cpu,
  Check,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Github,
  Settings,
  Wrench,
  Zap
} from 'lucide-react'
import { mockAgentProfiles } from '../data/mockData'
import type { AgentProfile } from '../types'
import './AgentProfiles.css'

const iconMap: Record<string, React.ElementType> = {
  'architecture': Cpu,
  'code': Code,
  'verified_user': Check,
  'security': Shield,
  'rate_review': AlertTriangle,
  'description': FileText,
  'terminal': Terminal,
  'bug_report': Bug,
  'web': Code,
}

const scopeLabels: Record<string, { label: string; color: string }> = {
  'repo': { label: 'Repository', color: 'var(--color-info)' },
  'org': { label: 'Organization', color: 'var(--color-primary)' },
  'enterprise': { label: 'Enterprise', color: 'var(--color-running)' },
}

function AgentCard({ agent, onEdit, onView }: { 
  agent: AgentProfile
  onEdit: () => void
  onView: () => void 
}) {
  const Icon = iconMap[agent.icon || 'code'] || Bot
  const scope = scopeLabels[agent.scope]

  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <div 
          className="agent-icon" 
          style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
        >
          <Icon size={24} />
        </div>
        <div className="agent-info">
          <h3>{agent.name}</h3>
          <code className="agent-filename">{agent.fileName}</code>
        </div>
        <button className="agent-menu-btn">
          <MoreVertical size={18} />
        </button>
      </div>

      <p className="agent-description">{agent.description}</p>

      <div className="agent-meta">
        <div className="meta-row">
          <span className="meta-label">Scope</span>
          <span 
            className="scope-badge"
            style={{ backgroundColor: `${scope.color}15`, color: scope.color }}
          >
            {scope.label}
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Auto-eligible</span>
          <span className={`infer-badge ${agent.infer ? 'yes' : 'no'}`}>
            {agent.infer ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">Source</span>
          <a href="#" className="source-link">
            <Github size={14} />
            {agent.sourceRepo}
          </a>
        </div>
      </div>

      <div className="agent-tools">
        <span className="tools-label">
          <Wrench size={14} />
          Tools
        </span>
        <div className="tools-list">
          {agent.tools.map(tool => (
            <span key={tool} className="tool-badge">{tool}</span>
          ))}
        </div>
      </div>

      <div className="agent-card-footer">
        <button className="btn btn-ghost btn-sm" onClick={onView}>
          <Eye size={14} />
          View
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onEdit}>
          <Edit size={14} />
          Edit
        </button>
        <button className="btn btn-primary btn-sm">
          <Zap size={14} />
          Use in Builder
        </button>
      </div>
    </div>
  )
}

function AgentDetailModal({ agent, onClose }: { agent: AgentProfile; onClose: () => void }) {
  const Icon = iconMap[agent.icon || 'code'] || Bot
  const scope = scopeLabels[agent.scope]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div 
              className="agent-icon large" 
              style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
            >
              <Icon size={32} />
            </div>
            <div>
              <h2>{agent.name}</h2>
              <code className="agent-filename">{agent.fileName}</code>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3>Description</h3>
            <p>{agent.description}</p>
          </section>

          <section className="modal-section">
            <h3>Configuration</h3>
            <div className="config-grid">
              <div className="config-item">
                <span className="config-label">Scope</span>
                <span 
                  className="scope-badge large"
                  style={{ backgroundColor: `${scope.color}15`, color: scope.color }}
                >
                  {scope.label}
                </span>
              </div>
              <div className="config-item">
                <span className="config-label">Auto-eligible (infer)</span>
                <span className={`infer-badge ${agent.infer ? 'yes' : 'no'}`}>
                  {agent.infer ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="config-item">
                <span className="config-label">Source Repository</span>
                <a href="#" className="source-link large">
                  <Github size={16} />
                  {agent.sourceRepo}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>

          <section className="modal-section">
            <h3>Available Tools</h3>
            <div className="tools-grid">
              {agent.tools.map(tool => (
                <div key={tool} className="tool-item">
                  <div className="tool-icon">
                    {tool === 'read' && <Eye size={18} />}
                    {tool === 'edit' && <Edit size={18} />}
                    {tool === 'search' && <Search size={18} />}
                    {tool === 'execute' && <Terminal size={18} />}
                  </div>
                  <div className="tool-info">
                    <span className="tool-name">{tool}</span>
                    <span className="tool-desc">
                      {tool === 'read' && 'Read files and directories'}
                      {tool === 'edit' && 'Modify and create files'}
                      {tool === 'search' && 'Search codebase'}
                      {tool === 'execute' && 'Run commands'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h3>Agent Definition Preview</h3>
            <pre className="code-preview">
{`---
description: ${agent.description}
tools:
${agent.tools.map(t => `  - ${t}`).join('\n')}
infer: ${agent.infer}
---

You are ${agent.name}, a specialized AI assistant 
focused on ${agent.description.toLowerCase()}.

## Capabilities
${agent.tools.map(t => `- ${t.charAt(0).toUpperCase() + t.slice(1)} operations`).join('\n')}

## Guidelines
- Follow best practices and coding standards
- Provide clear explanations for changes
- Ask for clarification when requirements are ambiguous`}
            </pre>
          </section>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-secondary">
            <Copy size={16} />
            Duplicate
          </button>
          <button className="btn btn-primary">
            <Edit size={16} />
            Edit Agent
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AgentProfiles() {
  const [searchQuery, setSearchQuery] = useState('')
  const [scopeFilter, setScopeFilter] = useState<string>('all')
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null)

  const filteredAgents = mockAgentProfiles.filter(agent => {
    if (scopeFilter !== 'all' && agent.scope !== scopeFilter) return false
    if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !agent.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="agents-page">
      {/* Header */}
      <div className="agents-header">
        <div className="header-left">
          <h1>Agent Profiles</h1>
          <p>Manage your custom GitHub Copilot agents for SDLC automation</p>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary">
            <Github size={18} />
            Sync from GitHub
          </button>
          <button className="btn btn-primary">
            <Plus size={18} />
            Create Agent
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="agents-filters">
        <div className="search-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <span className="filter-label">Scope:</span>
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="scope-filter"
          >
            <option value="all">All Scopes</option>
            <option value="repo">Repository</option>
            <option value="org">Organization</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="agents-stats">
        <div className="stat-item">
          <Bot size={20} />
          <div className="stat-content">
            <span className="stat-value">{mockAgentProfiles.length}</span>
            <span className="stat-label">Total Agents</span>
          </div>
        </div>
        <div className="stat-item">
          <Zap size={20} />
          <div className="stat-content">
            <span className="stat-value">{mockAgentProfiles.filter(a => a.infer).length}</span>
            <span className="stat-label">Auto-eligible</span>
          </div>
        </div>
        <div className="stat-item">
          <Shield size={20} />
          <div className="stat-content">
            <span className="stat-value">{mockAgentProfiles.filter(a => a.scope === 'enterprise').length}</span>
            <span className="stat-label">Enterprise</span>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {filteredAgents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onView={() => setSelectedAgent(agent)}
            onEdit={() => {}}
          />
        ))}

        <div className="new-agent-card">
          <Plus size={32} />
          <span>Create New Agent</span>
          <p>Define a custom Copilot agent for your SDLC</p>
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
        />
      )}
    </div>
  )
}
