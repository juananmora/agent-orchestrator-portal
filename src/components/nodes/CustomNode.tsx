import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Play,
  GitBranch,
  Clock,
  User,
  Zap,
  MoreVertical,
  Code,
  Check,
  Shield,
  FileText,
  Terminal,
  Bug,
  Cpu,
  AlertTriangle
} from 'lucide-react'
import './CustomNode.css'

const nodeIcons: Record<string, React.ElementType> = {
  'trigger.manual': Play,
  'trigger.event': GitBranch,
  'trigger.schedule': Clock,
  'copilot.task': Cpu,
  'human.approval': User,
  'condition': GitBranch,
  'parallel': Zap,
  'join': GitBranch,
}

const nodeColors: Record<string, string> = {
  'trigger.manual': '#3b82f6',
  'trigger.event': '#8b5cf6',
  'trigger.schedule': '#f59e0b',
  'copilot.task': '#13ec5b',
  'human.approval': '#ec4899',
  'condition': '#06b6d4',
  'parallel': '#84cc16',
  'join': '#84cc16',
}

interface CustomNodeData {
  label: string
  nodeType: string
  config?: Record<string, unknown>
  status?: 'idle' | 'running' | 'completed' | 'failed' | 'waiting'
}

function CustomNode({ data, selected }: NodeProps) {
  const nodeData = data as CustomNodeData
  const nodeType = nodeData.nodeType || 'copilot.task'
  const Icon = nodeIcons[nodeType] || Cpu
  const color = nodeColors[nodeType] || '#13ec5b'
  const status = nodeData.status || 'idle'

  const isStartNode = nodeType.startsWith('trigger')
  const isEndNode = nodeType === 'join'
  const isCondition = nodeType === 'condition'

  return (
    <div className={`custom-node ${selected ? 'selected' : ''} ${status}`}>
      {!isStartNode && (
        <Handle
          type="target"
          position={Position.Left}
          className="node-handle"
        />
      )}

      <div className="node-header" style={{ borderColor: color }}>
        <div className="node-icon" style={{ backgroundColor: `${color}20`, color }}>
          <Icon size={18} />
        </div>
        <span className="node-label">{nodeData.label}</span>
        <button className="node-menu-btn">
          <MoreVertical size={14} />
        </button>
      </div>

      {nodeData.config && Object.keys(nodeData.config).length > 0 && (
        <div className="node-body">
          {nodeType === 'copilot.task' && (
            <>
              {nodeData.config.mode && (
                <div className="node-config-item">
                  <span className="config-label">Mode:</span>
                  <span className="config-value">
                    {nodeData.config.mode === 'githubCodingAgent' ? 'GitHub Agent' : 'Copilot SDK'}
                  </span>
                </div>
              )}
              {nodeData.config.customAgent && (
                <div className="node-config-item">
                  <span className="config-label">Agent:</span>
                  <span className="config-value">{String(nodeData.config.customAgent)}</span>
                </div>
              )}
            </>
          )}
          {nodeType === 'condition' && nodeData.config.expression && (
            <div className="node-config-item">
              <code className="config-code">{String(nodeData.config.expression)}</code>
            </div>
          )}
          {nodeType.startsWith('trigger') && nodeData.config.event && (
            <div className="node-config-item">
              <span className="config-label">Event:</span>
              <span className="config-value">{String(nodeData.config.event)}</span>
            </div>
          )}
        </div>
      )}

      {status !== 'idle' && (
        <div className={`node-status-indicator ${status}`}>
          {status === 'running' && <span className="status-pulse" />}
          {status === 'completed' && <Check size={12} />}
          {status === 'failed' && <AlertTriangle size={12} />}
          {status === 'waiting' && <Clock size={12} />}
        </div>
      )}

      {!isEndNode && !isCondition && (
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle"
        />
      )}

      {isCondition && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="node-handle condition-true"
            style={{ top: '30%' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="node-handle condition-false"
            style={{ top: '70%' }}
          />
          <span className="condition-label true">Pass</span>
          <span className="condition-label false">Fail</span>
        </>
      )}
    </div>
  )
}

export default memo(CustomNode)
