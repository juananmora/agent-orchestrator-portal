import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  Play,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  GitPullRequest,
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  MoreVertical,
  Link,
  FileCode,
  Terminal
} from 'lucide-react'
import { mockRuns, mockOrchestrations } from '../data/mockData'
import type { Run, StepRun, RunStatus } from '../types'
import './RunMonitor.css'

const statusConfig: Record<RunStatus, { icon: React.ElementType; color: string; label: string }> = {
  queued: { icon: Clock, color: 'var(--color-queued)', label: 'Queued' },
  running: { icon: Activity, color: 'var(--color-running)', label: 'Running' },
  waiting: { icon: Pause, color: 'var(--color-warning)', label: 'Waiting for Approval' },
  completed: { icon: CheckCircle, color: 'var(--color-success)', label: 'Completed' },
  failed: { icon: XCircle, color: 'var(--color-error)', label: 'Failed' },
  cancelled: { icon: XCircle, color: 'var(--text-tertiary)', label: 'Cancelled' },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(start: string, end?: string): string {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  const diff = endDate.getTime() - startDate.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  return `${minutes}m`
}

function RunRow({ run, isSelected, onClick }: { run: Run; isSelected: boolean; onClick: () => void }) {
  const config = statusConfig[run.status]
  const StatusIcon = config.icon

  return (
    <div 
      className={`run-row ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="run-row-status">
        <StatusIcon size={20} style={{ color: config.color }} />
      </div>
      <div className="run-row-info">
        <span className="run-row-name">{run.orchestrationName}</span>
        <span className="run-row-id">#{run.id.split('-')[1]}</span>
      </div>
      <div className="run-row-trigger">
        <span className={`trigger-badge ${run.triggerType}`}>
          {run.triggerType}
        </span>
      </div>
      <div className="run-row-time">
        <span>{formatDate(run.startedAt)}</span>
        <span className="run-duration">{formatDuration(run.startedAt, run.finishedAt)}</span>
      </div>
      <div className="run-row-steps">
        {run.steps.map((step, i) => (
          <div 
            key={i} 
            className={`step-indicator ${step.status}`}
            title={`Step ${i + 1}: ${step.status}`}
          />
        ))}
      </div>
      <button className="run-row-menu" onClick={(e) => e.stopPropagation()}>
        <MoreVertical size={16} />
      </button>
    </div>
  )
}

function StepDetail({ step, index }: { step: StepRun; index: number }) {
  const config = statusConfig[step.status]
  const StatusIcon = config.icon

  return (
    <div className={`step-detail ${step.status}`}>
      <div className="step-detail-header">
        <div className="step-number">Step {index + 1}</div>
        <div className="step-status" style={{ color: config.color }}>
          <StatusIcon size={16} />
          <span>{config.label}</span>
        </div>
      </div>
      
      <div className="step-detail-body">
        <div className="step-node-id">{step.nodeId}</div>
        
        {step.startedAt && (
          <div className="step-timing">
            <Clock size={14} />
            <span>Started: {formatDate(step.startedAt)}</span>
            {step.finishedAt && (
              <span className="step-duration">
                Duration: {formatDuration(step.startedAt, step.finishedAt)}
              </span>
            )}
          </div>
        )}

        {(step.githubIssueNumber || step.githubPrNumber) && (
          <div className="step-links">
            {step.githubIssueNumber && (
              <a href="#" className="step-link">
                <AlertCircle size={14} />
                Issue #{step.githubIssueNumber}
              </a>
            )}
            {step.githubPrNumber && (
              <a href="#" className="step-link">
                <GitPullRequest size={14} />
                PR #{step.githubPrNumber}
              </a>
            )}
            {step.repo && (
              <a href="#" className="step-link">
                <Link size={14} />
                {step.repo}
              </a>
            )}
          </div>
        )}

        {step.error && (
          <div className="step-error">
            <AlertCircle size={14} />
            <span>{step.error}</span>
          </div>
        )}

        {step.logs && step.logs.length > 0 && (
          <div className="step-logs">
            <div className="logs-header">
              <Terminal size={14} />
              <span>Live Logs</span>
            </div>
            <div className="logs-content">
              {step.logs.map((log, i) => (
                <div key={i} className={`log-entry ${log.type}`}>
                  <span className="log-time">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="log-type-badge">{log.type}</span>
                  <pre className="log-message">{log.content}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {step.status === 'running' && (
        <div className="step-actions">
          <button className="btn btn-ghost btn-sm">
            <Pause size={14} />
            Pause
          </button>
          <button className="btn btn-ghost btn-sm">
            <MessageSquare size={14} />
            Send Command
          </button>
        </div>
      )}

      {step.status === 'waiting' && (
        <div className="step-actions">
          <button className="btn btn-primary btn-sm">
            <CheckCircle size={14} />
            Approve
          </button>
          <button className="btn btn-ghost btn-sm">
            <XCircle size={14} />
            Reject
          </button>
        </div>
      )}
    </div>
  )
}

export default function RunMonitor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedRun, setSelectedRun] = useState<Run | null>(
    id ? mockRuns.find(r => r.id === id) || null : mockRuns[0]
  )
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRuns = mockRuns.filter(run => {
    if (statusFilter !== 'all' && run.status !== statusFilter) return false
    if (searchQuery && !run.orchestrationName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="run-monitor">
      {/* Runs List */}
      <div className="runs-list-panel">
        <div className="runs-list-header">
          <h2>Run History</h2>
          <span className="runs-count">{filteredRuns.length} runs</span>
        </div>

        <div className="runs-filters">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search runs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="runs-search"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="waiting">Waiting</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="runs-list">
          {filteredRuns.map(run => (
            <RunRow
              key={run.id}
              run={run}
              isSelected={selectedRun?.id === run.id}
              onClick={() => {
                setSelectedRun(run)
                navigate(`/runs/${run.id}`)
              }}
            />
          ))}

          {filteredRuns.length === 0 && (
            <div className="empty-state">
              <Activity size={32} />
              <p>No runs match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Run Details */}
      <div className="run-details-panel">
        {selectedRun ? (
          <>
            <div className="run-details-header">
              <div className="run-details-title">
                <h2>{selectedRun.orchestrationName}</h2>
                <span className="run-details-id">Run #{selectedRun.id.split('-')[1]}</span>
              </div>
              <div className="run-details-status">
                {(() => {
                  const config = statusConfig[selectedRun.status]
                  const StatusIcon = config.icon
                  return (
                    <span className="status-badge-large" style={{ color: config.color }}>
                      <StatusIcon size={20} />
                      {config.label}
                    </span>
                  )
                })()}
              </div>
            </div>

            <div className="run-meta">
              <div className="meta-item">
                <span className="meta-label">Triggered by</span>
                <span className="meta-value">{selectedRun.initiatedBy}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Started</span>
                <span className="meta-value">{formatDate(selectedRun.startedAt)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration</span>
                <span className="meta-value">
                  {formatDuration(selectedRun.startedAt, selectedRun.finishedAt)}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Trigger Type</span>
                <span className={`trigger-badge ${selectedRun.triggerType}`}>
                  {selectedRun.triggerType}
                </span>
              </div>
            </div>

            <div className="run-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/builder/${selectedRun.orchestrationId}`)}
              >
                <FileCode size={16} />
                View Orchestration
              </button>
              {selectedRun.status === 'running' && (
                <>
                  <button className="btn btn-ghost">
                    <Pause size={16} />
                    Pause
                  </button>
                  <button className="btn btn-ghost">
                    <XCircle size={16} />
                    Cancel
                  </button>
                </>
              )}
              {selectedRun.status === 'failed' && (
                <button className="btn btn-primary">
                  <RefreshCw size={16} />
                  Retry
                </button>
              )}
            </div>

            <div className="run-steps-section">
              <h3>Execution Steps</h3>
              <div className="steps-timeline">
                {selectedRun.steps.map((step, index) => (
                  <StepDetail key={step.id} step={step} index={index} />
                ))}
              </div>
            </div>

            {/* Steering Panel for running runs */}
            {selectedRun.status === 'running' && (
              <div className="steering-panel">
                <h3>Steering Commands</h3>
                <p className="steering-hint">
                  Send comments to redirect the agent's behavior
                </p>
                <div className="steering-input-wrapper">
                  <textarea
                    placeholder="Type a command to steer the agent..."
                    className="steering-textarea"
                    rows={3}
                  />
                  <button className="btn btn-primary">
                    <MessageSquare size={16} />
                    Send
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-run-selected">
            <Activity size={48} />
            <h3>Select a run to view details</h3>
            <p>Choose a run from the list to see its execution details</p>
          </div>
        )}
      </div>
    </div>
  )
}
