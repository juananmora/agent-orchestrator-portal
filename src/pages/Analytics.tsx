import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    TrendingUp,
    Users,
    Clock,
    Activity,
    BarChart3,
    PieChart,
    Target,
    Award,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter
} from 'lucide-react'
import './Analytics.css'

interface AgentMetrics {
    id: string
    name: string
    totalRuns: number
    successRate: number
    avgDuration: number
    totalTimeSaved: number
    trend: number
    status: 'healthy' | 'warning' | 'critical'
}

interface TimeSeriesData {
    date: string
    runs: number
    success: number
    failed: number
}

const mockAgentMetrics: AgentMetrics[] = [
    {
        id: '1',
        name: 'Code Review Agent',
        totalRuns: 1247,
        successRate: 94.5,
        avgDuration: 3.2,
        totalTimeSaved: 156,
        trend: 12.5,
        status: 'healthy'
    },
    {
        id: '2',
        name: 'Testing Agent',
        totalRuns: 892,
        successRate: 89.3,
        avgDuration: 5.7,
        totalTimeSaved: 98,
        trend: -3.2,
        status: 'warning'
    },
    {
        id: '3',
        name: 'Documentation Agent',
        totalRuns: 634,
        successRate: 97.1,
        avgDuration: 2.1,
        totalTimeSaved: 67,
        trend: 8.7,
        status: 'healthy'
    },
    {
        id: '4',
        name: 'Deployment Agent',
        totalRuns: 445,
        successRate: 82.4,
        avgDuration: 8.3,
        totalTimeSaved: 112,
        trend: -8.5,
        status: 'critical'
    },
    {
        id: '5',
        name: 'Security Scan Agent',
        totalRuns: 1089,
        successRate: 91.7,
        avgDuration: 4.5,
        totalTimeSaved: 134,
        trend: 15.3,
        status: 'healthy'
    }
]

const mockTimeSeriesData: TimeSeriesData[] = [
    { date: '2024-01-01', runs: 45, success: 42, failed: 3 },
    { date: '2024-01-02', runs: 52, success: 48, failed: 4 },
    { date: '2024-01-03', runs: 48, success: 45, failed: 3 },
    { date: '2024-01-04', runs: 61, success: 58, failed: 3 },
    { date: '2024-01-05', runs: 58, success: 53, failed: 5 },
    { date: '2024-01-06', runs: 43, success: 41, failed: 2 },
    { date: '2024-01-07', runs: 39, success: 37, failed: 2 },
    { date: '2024-01-08', runs: 67, success: 63, failed: 4 },
    { date: '2024-01-09', runs: 72, success: 68, failed: 4 },
    { date: '2024-01-10', runs: 69, success: 66, failed: 3 },
    { date: '2024-01-11', runs: 78, success: 74, failed: 4 },
    { date: '2024-01-12', runs: 81, success: 77, failed: 4 },
    { date: '2024-01-13', runs: 56, success: 53, failed: 3 },
    { date: '2024-01-14', runs: 49, success: 47, failed: 2 }
]

const statusIcons = {
    healthy: CheckCircle2,
    warning: AlertCircle,
    critical: XCircle
}

const statusColors = {
    healthy: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-error)'
}

function MetricCard({
    title,
    value,
    unit,
    change,
    icon: Icon,
    color
}: {
    title: string
    value: number | string
    unit?: string
    change?: number
    icon: React.ElementType
    color?: string
}) {
    const isPositive = change !== undefined && change >= 0

    return (
        <div className="metric-card">
            <div className="metric-icon" style={{ background: color }}>
                <Icon size={24} />
            </div>
            <div className="metric-content">
                <span className="metric-title">{title}</span>
                <div className="metric-value-row">
                    <span className="metric-value">
                        {value}{unit && <span className="metric-unit">{unit}</span>}
                    </span>
                    {change !== undefined && (
                        <span className={`metric - change ${isPositive ? 'positive' : 'negative'} `}>
                            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            {Math.abs(change)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function AgentMetricRow({ agent }: { agent: AgentMetrics }) {
    const navigate = useNavigate()
    const StatusIcon = statusIcons[agent.status]
    const statusColor = statusColors[agent.status]
    const isPositiveTrend = agent.trend >= 0

    return (
        <div
            className="agent-metric-row"
            onClick={() => navigate(`/ analytics / agent / ${agent.id} `)}
            style={{ cursor: 'pointer' }}
        >
            <div className="agent-info">
                <div className="agent-status-indicator" style={{ background: statusColor }}>
                    <StatusIcon size={16} />
                </div>
                <div className="agent-details">
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-id">ID: {agent.id}</span>
                </div>
            </div>

            <div className="agent-stats">
                <div className="stat-item">
                    <span className="stat-label">Total Runs</span>
                    <span className="stat-value">{agent.totalRuns.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Success Rate</span>
                    <div className="stat-with-bar">
                        <span className="stat-value">{agent.successRate}%</span>
                        <div className="success-bar">
                            <div
                                className="success-fill"
                                style={{
                                    width: `${agent.successRate}% `,
                                    background: agent.successRate > 90 ? 'var(--color-success)' :
                                        agent.successRate > 80 ? 'var(--color-warning)' :
                                            'var(--color-error)'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Avg Duration</span>
                    <span className="stat-value">{agent.avgDuration}min</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Time Saved</span>
                    <span className="stat-value">{agent.totalTimeSaved}h</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Trend</span>
                    <span className={`stat-value trend ${isPositiveTrend ? 'positive' : 'negative'}`}>
                        {isPositiveTrend ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(agent.trend)}%
                    </span>
                </div>
            </div>
        </div>
    )
}

function TimeSeriesChart({ data }: { data: TimeSeriesData[] }) {
    const maxRuns = Math.max(...data.map(d => d.runs));
    const maxHeight = 220;
    const padding = 40;
    const barWidth = 40;
    const gap = 30;
    const width = data.length * (barWidth + gap) + padding * 2;

    return (
        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px' }}>
            <svg width="100%" height={maxHeight + 60} viewBox={`0 0 ${width} ${maxHeight + 60}`} style={{ minWidth: '600px' }}>
                <defs>
                    <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                    const y = maxHeight - (tick * maxHeight) + 20;
                    return (
                        <g key={i}>
                            <line
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="var(--border-color)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                opacity="0.3"
                            />
                            {i > 0 && (
                                <text
                                    x={padding - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    fill="var(--text-tertiary)"
                                    fontSize="10"
                                >
                                    {Math.round(tick * maxRuns)}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const barHeight = (d.runs / maxRuns) * maxHeight;
                    const x = i * (barWidth + gap) + padding + 20;
                    const y = maxHeight - barHeight + 20;

                    return (
                        <g key={i} className="bar-group" style={{ cursor: 'pointer' }}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill="url(#bar-gradient)"
                                rx="6"
                                style={{
                                    transition: 'all 0.3s ease'
                                }}
                            />
                            {/* Value Label on Top */}
                            <text
                                x={x + barWidth / 2}
                                y={y - 8}
                                textAnchor="middle"
                                fill="var(--text-primary)"
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {d.runs}
                            </text>
                            {/* Date Label */}
                            <text
                                x={x + barWidth / 2}
                                y={maxHeight + 45}
                                textAnchor="middle"
                                fill="var(--text-secondary)"
                                fontSize="11"
                                fontWeight="500"
                            >
                                {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('7d')

    const totalRuns = mockAgentMetrics.reduce((sum, agent) => sum + agent.totalRuns, 0)
    const avgSuccessRate = mockAgentMetrics.reduce((sum, agent) => sum + agent.successRate, 0) / mockAgentMetrics.length
    const totalTimeSaved = mockAgentMetrics.reduce((sum, agent) => sum + agent.totalTimeSaved, 0)
    const activeAgents = mockAgentMetrics.filter(a => a.status === 'healthy').length

    return (
        <div className="analytics">
            {/* Header */}
            <div className="analytics-header">
                <div className="header-content">
                    <h1 className="page-title">Analytics Dashboard</h1>
                    <p className="page-subtitle">Comprehensive agent performance metrics and insights</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <Calendar size={16} />
                        {timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                    </button>
                    <button className="btn btn-secondary">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Overview Metrics */}
            <section className="overview-metrics">
                <MetricCard
                    title="Total Runs"
                    value={totalRuns.toLocaleString()}
                    change={14.2}
                    icon={Activity}
                    color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
                <MetricCard
                    title="Avg Success Rate"
                    value={avgSuccessRate.toFixed(1)}
                    unit="%"
                    change={5.8}
                    icon={Target}
                    color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
                <MetricCard
                    title="Time Saved"
                    value={totalTimeSaved}
                    unit="h"
                    change={22.4}
                    icon={Clock}
                    color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
                <MetricCard
                    title="Active Agents"
                    value={activeAgents}
                    unit={`/ ${mockAgentMetrics.length} `}
                    change={0}
                    icon={Users}
                    color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                />
            </section>

            {/* Time Series Chart */}
            <section className="analytics-section">
                <div className="section-header">
                    <div className="header-left">
                        <BarChart3 size={24} className="section-icon" />
                        <div>
                            <h2 className="section-title">Run History</h2>
                            <p className="section-subtitle">Daily execution trends over time</p>
                        </div>
                    </div>
                    <div className="time-range-selector">
                        <button
                            className={`range-btn ${timeRange === '7d' ? 'active' : ''}`}
                            onClick={() => setTimeRange('7d')}
                        >
                            7D
                        </button>
                        <button
                            className={`range-btn ${timeRange === '30d' ? 'active' : ''}`}
                            onClick={() => setTimeRange('30d')}
                        >
                            30D
                        </button>
                        <button
                            className={`range-btn ${timeRange === '90d' ? 'active' : ''}`}
                            onClick={() => setTimeRange('90d')}
                        >
                            90D
                        </button>
                    </div>
                </div>
                <TimeSeriesChart data={mockTimeSeriesData} />
            </section>

            {/* Agent Performance Table */}
            <section className="analytics-section">
                <div className="section-header">
                    <div className="header-left">
                        <PieChart size={24} className="section-icon" />
                        <div>
                            <h2 className="section-title">Agent Performance</h2>
                            <p className="section-subtitle">Detailed metrics for each agent</p>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm">
                        <TrendingUp size={16} />
                        Export Report
                    </button>
                </div>
                <div className="agent-metrics-table">
                    {mockAgentMetrics.map(agent => (
                        <AgentMetricRow key={agent.id} agent={agent} />
                    ))}
                </div>
            </section>

            {/* Performance Insights */}
            <section className="analytics-section insights-section">
                <div className="section-header">
                    <div className="header-left">
                        <Award size={24} className="section-icon" />
                        <div>
                            <h2 className="section-title">Performance Insights</h2>
                            <p className="section-subtitle">AI-powered recommendations</p>
                        </div>
                    </div>
                </div>
                <div className="insights-grid">
                    <div className="insight-card success">
                        <CheckCircle2 size={24} />
                        <div className="insight-content">
                            <h3>Top Performer</h3>
                            <p>Documentation Agent has the highest success rate at <strong>97.1%</strong></p>
                        </div>
                    </div>
                    <div className="insight-card warning">
                        <AlertCircle size={24} />
                        <div className="insight-content">
                            <h3>Needs Attention</h3>
                            <p>Deployment Agent success rate dropped <strong>8.5%</strong> this week. Consider reviewing recent logs.</p>
                        </div>
                    </div>
                    <div className="insight-card info">
                        <TrendingUp size={24} />
                        <div className="insight-content">
                            <h3>Trending Up</h3>
                            <p>Security Scan Agent showing <strong>15.3%</strong> improvement in efficiency after recent updates.</p>
                        </div>
                    </div>
                    <div className="insight-card success">
                        <Award size={24} />
                        <div className="insight-content">
                            <h3>Efficiency Gain</h3>
                            <p>Overall system efficiency increased by <strong>12%</strong> compared to last week.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
