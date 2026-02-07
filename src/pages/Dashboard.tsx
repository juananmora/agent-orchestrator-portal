import { useNavigate } from 'react-router-dom'
import {
  Timer,
  Zap,
  Activity,
  GitPullRequest,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Plus,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  BarChart3
} from 'lucide-react'
import { mockDashboardStats, mockRuns, mockOrchestrations } from '../data/mockData'
import type { Run } from '../types'
import './Dashboard.css'

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  running: { icon: Activity, color: 'var(--color-running)', label: 'Running' },
  completed: { icon: CheckCircle, color: 'var(--color-success)', label: 'Completed' },
  failed: { icon: XCircle, color: 'var(--color-error)', label: 'Failed' },
  waiting: { icon: Pause, color: 'var(--color-warning)', label: 'Waiting' },
  queued: { icon: Clock, color: 'var(--color-queued)', label: 'Queued' }
}

function StatCard({
  title,
  value,
  unit,
  change,
  icon: Icon
}: {
  title: string
  value: number
  unit?: string
  change: number
  icon: React.ElementType
}) {
  const isPositive = change >= 0

  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <div className="stat-value-row">
          <span className="stat-value">
            {value}{unit && <span className="stat-unit">{unit}</span>}
          </span>
          <span className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(change)}%
          </span>
        </div>
      </div>
    </div>
  )
}

function RunCard({ run }: { run: Run }) {
  const navigate = useNavigate()
  const config = statusConfig[run.status]
  const StatusIcon = config.icon
  const timeAgo = getTimeAgo(run.startedAt)

  return (
    <div
      className="run-card"
      onClick={() => navigate(`/runs/${run.id}`)}
    >
      <div className="run-card-header">
        <div className="run-status-icon" style={{ color: config.color }}>
          <StatusIcon size={20} />
        </div>
        <div className="run-info">
          <span className="run-name">{run.orchestrationName}</span>
          <span className="run-id">#{run.id.split('-')[1]}</span>
        </div>
        <button className="run-menu-btn" onClick={(e) => e.stopPropagation()}>
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="run-card-body">
        <span className="run-status" style={{ color: config.color }}>
          {config.label}
        </span>
        <span className="run-time">{timeAgo}</span>
      </div>
      {run.steps && run.steps.length > 0 && (
        <div className="run-progress">
          {run.steps.map((step, i) => (
            <div
              key={i}
              className={`progress-dot ${step.status}`}
              title={step.status}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function Dashboard() {
  const navigate = useNavigate()
  const activeRuns = mockRuns.filter(r => r.status === 'running' || r.status === 'waiting')

  return (
    <div className="dashboard">
      {/* Stats Section */}
      <section className="stats-section">
        <StatCard
          title="Time Saved"
          value={mockDashboardStats.timeSaved.value}
          unit={mockDashboardStats.timeSaved.unit}
          change={mockDashboardStats.timeSaved.change}
          icon={Timer}
        />
        <StatCard
          title="Agent Efficiency"
          value={mockDashboardStats.agentEfficiency.value}
          unit="%"
          change={mockDashboardStats.agentEfficiency.change}
          icon={Zap}
        />
        <StatCard
          title="Active Runs"
          value={mockDashboardStats.activeRuns.value}
          change={mockDashboardStats.activeRuns.change}
          icon={Activity}
        />
        <StatCard
          title="PRs Automated"
          value={mockDashboardStats.prsAutomated.value}
          change={mockDashboardStats.prsAutomated.change}
          icon={GitPullRequest}
        />
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section quick-actions-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <button
            className="quick-action"
            onClick={() => navigate('/analytics')}
          >
            <div className="action-icon">
              <BarChart3 size={24} />
            </div>
            <span>View Analytics</span>
          </button>
          <button
            className="quick-action"
            onClick={() => navigate('/agents')}
          >
            <div className="action-icon">
              <Activity size={24} />
            </div>
            <span>Manage Agents</span>
          </button>
          <button
            className="quick-action"
            onClick={() => navigate('/builder')}
          >
            <div className="action-icon">
              <Plus size={24} />
            </div>
            <span>Create Workflow</span>
          </button>
        </div>
      </section>

      <div className="dashboard-grid">
        {/* Active Runs Section */}
        <section className="dashboard-section active-runs-section">
          <div className="section-header">
            <h2 className="section-title">Active Runs</h2>
            <span className="section-subtitle">Real-time SDLC monitoring</span>
          </div>
          <div className="runs-list">
            {activeRuns.length === 0 ? (
              <div className="empty-state">
                <Activity size={32} />
                <p>No active runs</p>
              </div>
            ) : (
              activeRuns.map(run => <RunCard key={run.id} run={run} />)
            )}
          </div>
          <button
            className="section-link"
            onClick={() => navigate('/runs')}
          >
            View History
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Live Trace Section */}
        {activeRuns.length > 0 && activeRuns[0].steps && (
          <section className="dashboard-section live-trace-section">
            <div className="section-header">
              <div className="trace-header">
                <Activity size={20} className="trace-icon" />
                <h2 className="section-title">Live Trace: {activeRuns[0].orchestrationName.split(' ')[0]}</h2>
              </div>
              <span className="trace-file">Processing src/components/auth/LoginManager.tsx</span>
            </div>

            <div className="trace-actions">
              <button className="btn btn-icon btn-ghost" title="Pause">
                <Pause size={18} />
              </button>
              <button className="btn btn-icon btn-ghost" title="View on GitHub">
                <ExternalLink size={18} />
              </button>
              <button className="btn btn-secondary">
                <Play size={16} />
                Force Re-run
              </button>
            </div>

            <div className="trace-logs">
              {activeRuns[0].steps
                .filter(s => s.logs)
                .flatMap(s => s.logs!)
                .map((log, i) => (
                  <div key={i} className={`trace-log ${log.type}`}>
                    <div className="log-header">
                      <span className="log-type">{log.type === 'thought' ? 'Thought Process' : log.type === 'code' ? 'Code Patch' : 'Test'}</span>
                      <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <pre className="log-content">{log.content}</pre>
                  </div>
                ))
              }
            </div>

            <div className="trace-input">
              <input
                type="text"
                placeholder="Send steering command..."
                className="steering-input"
              />
              <kbd className="input-shortcut">CMD + K</kbd>
            </div>
          </section>
        )}

        {/* Recent Orchestrations */}
        <section className="dashboard-section orchestrations-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orchestrations</h2>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/builder')}
            >
              <Plus size={16} />
              New
            </button>
          </div>
          <div className="orchestrations-list">
            {mockOrchestrations.slice(0, 4).map(orch => (
              <div
                key={orch.id}
                className="orchestration-item"
                onClick={() => navigate(`/builder/${orch.id}`)}
              >
                <div className="orch-info">
                  <span className="orch-name">{orch.name}</span>
                  <span className="orch-meta">
                    v{orch.version} • {orch.graph.nodes.length} nodes
                  </span>
                </div>
                <div className="orch-status">
                  <span className={`status-badge ${orch.status}`}>
                    {orch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="section-link"
            onClick={() => navigate('/collections')}
          >
            View All Collections
            <ChevronRight size={16} />
          </button>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section quick-actions-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button
              className="quick-action"
              onClick={() => navigate('/builder')}
            >
              <div className="action-icon">
                <Plus size={24} />
              </div>
              <span>New Orchestration</span>
            </button>
            <button
              className="quick-action"
              onClick={() => navigate('/runs')}
            >
              <div className="action-icon">
                <Play size={24} />
              </div>
              <span>Run Existing</span>
            </button>
            <button
              className="quick-action"
              onClick={() => navigate('/analytics')}
            >
              <div className="action-icon">
                <BarChart3 size={24} />
              </div>
              <span>View Analytics</span>
            </button>
            <button
              className="quick-action"
              onClick={() => navigate('/agents')}
            >
              <div className="action-icon">
                <Zap size={24} />
              </div>
              <span>Manage Agents</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
