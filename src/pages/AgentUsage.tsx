import { useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
    Calendar,
    Activity,
    Zap,
    AlertTriangle,
    Download,
    Share2,
    MoreVertical
} from 'lucide-react'
import './AgentUsage.css'

interface UsageData {
    date: string
    runs: number
    success: number
    failed: number
    avgDuration: number
}

interface ErrorPattern {
    type: string
    count: number
    lastOccurrence: string
    severity: 'high' | 'medium' | 'low'
}

const mockAgentData = {
    '1': {
        name: 'Code Review Agent',
        description: 'Automated code review and quality analysis',
        status: 'healthy',
        totalRuns: 1247,
        successRate: 94.5,
        avgDuration: 3.2,
        peakUsageTime: '14:00 - 16:00',
        lastRun: '2024-01-14T15:30:00',
        usageData: [
            { date: '2024-01-08', runs: 89, success: 84, failed: 5, avgDuration: 3.1 },
            { date: '2024-01-09', runs: 92, success: 87, failed: 5, avgDuration: 3.3 },
            { date: '2024-01-10', runs: 88, success: 83, failed: 5, avgDuration: 3.0 },
            { date: '2024-01-11', runs: 95, success: 90, failed: 5, avgDuration: 3.4 },
            { date: '2024-01-12', runs: 98, success: 93, failed: 5, avgDuration: 3.2 },
            { date: '2024-01-13', runs: 87, success: 82, failed: 5, avgDuration: 3.1 },
            { date: '2024-01-14', runs: 91, success: 86, failed: 5, avgDuration: 3.3 }
        ],
        errorPatterns: [
            { type: 'Timeout Error', count: 12, lastOccurrence: '2024-01-14T10:23:00', severity: 'medium' as const },
            { type: 'API Rate Limit', count: 8, lastOccurrence: '2024-01-13T16:45:00', severity: 'low' as const },
            { type: 'Parse Error', count: 5, lastOccurrence: '2024-01-12T09:12:00', severity: 'high' as const }
        ]
    },
    '2': {
        name: 'Testing Agent',
        description: 'Automated test generation and execution',
        status: 'warning',
        totalRuns: 892,
        successRate: 89.3,
        avgDuration: 5.7,
        peakUsageTime: '10:00 - 12:00',
        lastRun: '2024-01-14T14:15:00',
        usageData: [
            { date: '2024-01-08', runs: 67, success: 60, failed: 7, avgDuration: 5.5 },
            { date: '2024-01-09', runs: 72, success: 64, failed: 8, avgDuration: 5.8 },
            { date: '2024-01-10', runs: 69, success: 62, failed: 7, avgDuration: 5.6 },
            { date: '2024-01-11', runs: 78, success: 70, failed: 8, avgDuration: 5.9 },
            { date: '2024-01-12', runs: 81, success: 72, failed: 9, avgDuration: 5.7 },
            { date: '2024-01-13', runs: 56, success: 50, failed: 6, avgDuration: 5.4 },
            { date: '2024-01-14', runs: 63, success: 56, failed: 7, avgDuration: 5.8 }
        ],
        errorPatterns: [
            { type: 'Test Timeout', count: 24, lastOccurrence: '2024-01-14T12:30:00', severity: 'high' as const },
            { type: 'Environment Setup Failed', count: 15, lastOccurrence: '2024-01-14T11:20:00', severity: 'medium' as const },
            { type: 'Assertion Failed', count: 9, lastOccurrence: '2024-01-13T15:10:00', severity: 'low' as const }
        ]
    }
}

const statusColors = {
    healthy: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-error)'
}

const severityColors = {
    high: 'var(--color-error)',
    medium: 'var(--color-warning)',
    low: 'var(--color-info)'
}

function UsageChart({ data }: { data: UsageData[] }) {
    const maxRuns = Math.max(...data.map(d => d.runs))
    const chartHeight = 180
    const barWidth = 100 / data.length

    return (
        <div className="usage-chart">
            <svg width="100%" height={chartHeight} className="chart-svg">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={chartHeight * ratio}
                        x2="100%"
                        y2={chartHeight * ratio}
                        stroke="var(--border-color)"
                        strokeOpacity="0.2"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Bars */}
                {data.map((d, i) => {
                    const successHeight = (d.success / maxRuns) * chartHeight
                    const failedHeight = (d.failed / maxRuns) * chartHeight
                    const x = i * barWidth

                    return (
                        <g key={i}>
                            {/* Success bar */}
                            <rect
                                x={`${x + barWidth * 0.15}%`}
                                y={chartHeight - successHeight}
                                width={`${barWidth * 0.7}%`}
                                height={successHeight}
                                fill="var(--color-success)"
                                opacity="0.8"
                                rx="2"
                                className="chart-bar"
                            />
                            {/* Failed bar */}
                            <rect
                                x={`${x + barWidth * 0.15}%`}
                                y={chartHeight - successHeight - failedHeight}
                                width={`${barWidth * 0.7}%`}
                                height={failedHeight}
                                fill="var(--color-error)"
                                opacity="0.8"
                                rx="2"
                                className="chart-bar"
                            />
                        </g>
                    )
                })}
            </svg>

            <div className="chart-labels">
                {data.map((d, i) => (
                    <span key={i} className="chart-label">
                        {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default function AgentUsage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const agentData = id ? mockAgentData[id as keyof typeof mockAgentData] : null

    if (!agentData) {
        return (
            <div className="agent-usage">
                <div className="error-state">
                    <AlertTriangle size={48} />
                    <h2>Agent Not Found</h2>
                    <p>The requested agent could not be found.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/analytics')}>
                        Back to Analytics
                    </button>
                </div>
            </div>
        )
    }

    const totalRuns = agentData.usageData.reduce((sum, d) => sum + d.runs, 0)
    const totalSuccess = agentData.usageData.reduce((sum, d) => sum + d.success, 0)
    const totalFailed = agentData.usageData.reduce((sum, d) => sum + d.failed, 0)
    const avgDurationTrend = agentData.usageData[agentData.usageData.length - 1].avgDuration -
        agentData.usageData[0].avgDuration
    const runsTrend = ((agentData.usageData[agentData.usageData.length - 1].runs -
        agentData.usageData[0].runs) / agentData.usageData[0].runs) * 100

    return (
        <div className="agent-usage">
            {/* Header */}
            <div className="usage-header">
                <button className="back-btn" onClick={() => navigate('/analytics')}>
                    <ArrowLeft size={20} />
                    Back to Analytics
                </button>

                <div className="header-content">
                    <div className="header-main">
                        <div className="agent-status-badge" style={{ background: statusColors[agentData.status as keyof typeof statusColors] }}>
                            {agentData.status}
                        </div>
                        <h1 className="page-title">{agentData.name}</h1>
                    </div>
                    <p className="page-subtitle">{agentData.description}</p>
                </div>

                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <Share2 size={16} />
                        Share
                    </button>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export
                    </button>
                    <button className="btn btn-icon">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="key-metrics">
                <div className="metric-box">
                    <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Activity size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Total Runs (7d)</span>
                        <span className="metric-value">{totalRuns}</span>
                        <span className={`metric-trend ${runsTrend >= 0 ? 'positive' : 'negative'}`}>
                            {runsTrend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(runsTrend).toFixed(1)}% vs previous period
                        </span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Success Rate</span>
                        <span className="metric-value">{agentData.successRate}%</span>
                        <span className="metric-detail">{totalSuccess} successful / {totalFailed} failed</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <Clock size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Avg Duration</span>
                        <span className="metric-value">{agentData.avgDuration}min</span>
                        <span className={`metric-trend ${avgDurationTrend <= 0 ? 'positive' : 'negative'}`}>
                            {avgDurationTrend <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                            {Math.abs(avgDurationTrend).toFixed(1)}min change
                        </span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <Zap size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-label">Peak Usage</span>
                        <span className="metric-value">{agentData.peakUsageTime}</span>
                        <span className="metric-detail">Last run: {new Date(agentData.lastRun).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Usage Chart */}
            <section className="usage-section">
                <div className="section-header">
                    <div className="header-left">
                        <Calendar size={24} className="section-icon" />
                        <div>
                            <h2 className="section-title">7-Day Usage Trend</h2>
                            <p className="section-subtitle">Daily execution patterns and success rates</p>
                        </div>
                    </div>
                </div>
                <UsageChart data={agentData.usageData} />
            </section>

            {/* Error Patterns */}
            <section className="usage-section">
                <div className="section-header">
                    <div className="header-left">
                        <AlertTriangle size={24} className="section-icon" />
                        <div>
                            <h2 className="section-title">Common Error Patterns</h2>
                            <p className="section-subtitle">Frequently occurring issues and their severity</p>
                        </div>
                    </div>
                </div>

                <div className="error-patterns">
                    {agentData.errorPatterns.map((error, i) => (
                        <div key={i} className="error-pattern-card">
                            <div className="error-header">
                                <div className="error-severity" style={{ background: severityColors[error.severity] }}>
                                    <AlertTriangle size={16} />
                                </div>
                                <div className="error-info">
                                    <span className="error-type">{error.type}</span>
                                    <span className="error-meta">
                                        {error.count} occurrences • Last seen {new Date(error.lastOccurrence).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="error-severity-badge" style={{
                                background: severityColors[error.severity],
                                opacity: 0.2
                            }}>
                                <span style={{ color: severityColors[error.severity] }}>
                                    {error.severity.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Performance Insights */}
            <section className="usage-section">
                <div className="section-header">
                    <div className="header-left">
                        <TrendingUp size={24} className="section-icon" />
                        <div>
                            <h2 className="section-title">Performance Insights</h2>
                            <p className="section-subtitle">AI-powered recommendations for optimization</p>
                        </div>
                    </div>
                </div>

                <div className="insights-list">
                    <div className="insight-item success">
                        <CheckCircle2 size={20} />
                        <div className="insight-content">
                            <h4>Consistent Performance</h4>
                            <p>Success rate has remained stable above 90% for the past 7 days</p>
                        </div>
                    </div>

                    {avgDurationTrend > 0 && (
                        <div className="insight-item warning">
                            <AlertTriangle size={20} />
                            <div className="insight-content">
                                <h4>Increasing Duration</h4>
                                <p>Average execution time has increased by {avgDurationTrend.toFixed(1)} minutes. Consider optimizing the agent workflow.</p>
                            </div>
                        </div>
                    )}

                    <div className="insight-item info">
                        <Activity size={20} />
                        <div className="insight-content">
                            <h4>Usage Pattern</h4>
                            <p>Peak usage occurs during {agentData.peakUsageTime}. Consider resource allocation during these hours.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
