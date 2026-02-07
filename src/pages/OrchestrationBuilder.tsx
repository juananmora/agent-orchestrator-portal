import { useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  Panel,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Play,
  Zap,
  GitBranch,
  Clock,
  User,
  Check,
  AlertTriangle,
  X,
  Save,
  Rocket,
  Plus,
  ChevronRight,
  Settings,
  Code,
  Shield,
  FileText,
  Terminal,
  Bug,
  Cpu,
  MousePointer,
  GripVertical,
  Trash2
} from 'lucide-react'
import { mockOrchestrations, mockAgentProfiles, getOrchestrationById } from '../data/mockData'
import CustomNode from '../components/nodes/CustomNode'
import NodeConfigPanel from '../components/NodeConfigPanel'
import './OrchestrationBuilder.css'

const nodeTypes = {
  custom: CustomNode,
}

const agentIcons: Record<string, React.ElementType> = {
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

const toolboxItems = [
  { type: 'trigger', label: 'Triggers', items: [
    { id: 'trigger.manual', label: 'Manual', icon: Play, color: '#3b82f6', hint: 'Start manually' },
    { id: 'trigger.event', label: 'GitHub Event', icon: GitBranch, color: '#8b5cf6', hint: 'PR, Issue, Push...' },
    { id: 'trigger.schedule', label: 'Schedule', icon: Clock, color: '#f59e0b', hint: 'Cron expression' },
  ]},
  { type: 'control', label: 'Control Flow', items: [
    { id: 'human.approval', label: 'Human Approval', icon: User, color: '#ec4899', hint: 'Wait for review' },
    { id: 'condition', label: 'Condition', icon: GitBranch, color: '#06b6d4', hint: 'Branch logic' },
    { id: 'parallel', label: 'Parallel', icon: Zap, color: '#84cc16', hint: 'Run in parallel' },
    { id: 'join', label: 'Join', icon: GitBranch, color: '#84cc16', hint: 'Wait for all' },
  ]},
]

// Calculate next node position
let nodeCount = 0
const getNextPosition = () => {
  const col = nodeCount % 4
  const row = Math.floor(nodeCount / 4)
  nodeCount++
  return { x: 100 + col * 280, y: 100 + row * 180 }
}

function OrchestrationBuilderInner() {
  const { id } = useParams()
  const navigate = useNavigate()
  const orchestration = id ? getOrchestrationById(id) : null
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  // Convert orchestration graph to React Flow format
  const initialNodes: Node[] = useMemo(() => {
    if (!orchestration) return []
    return orchestration.graph.nodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: {
        label: node.label || node.type,
        nodeType: node.type,
        config: node.config,
      },
    }))
  }, [orchestration])

  const initialEdges: Edge[] = useMemo(() => {
    if (!orchestration) return []
    return orchestration.graph.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      label: edge.label,
      animated: true,
      style: { stroke: '#13ec5b' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#13ec5b' },
    }))
  }, [orchestration])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [orchestrationName, setOrchestrationName] = useState(orchestration?.name || 'New Orchestration')
  const [isDraft, setIsDraft] = useState(orchestration?.status === 'draft' || !orchestration)

  // Add node to canvas (used by both drag-drop and double-click)
  const addNodeToCanvas = useCallback((
    nodeType: string, 
    label: string, 
    config: Record<string, unknown> = {},
    position?: { x: number; y: number }
  ) => {
    const pos = position || getNextPosition()
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: pos,
      data: { 
        label,
        nodeType,
        config,
      },
    }

    setNodes((nds) => nds.concat(newNode))
    setSelectedNode(newNode)
  }, [setNodes])

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        animated: true,
        style: { stroke: '#13ec5b' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#13ec5b' },
      }, eds))
    },
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const label = event.dataTransfer.getData('label')
      const configStr = event.dataTransfer.getData('config')
      
      if (!type) return

      // Get position relative to the canvas
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const config = configStr ? JSON.parse(configStr) : {}

      addNodeToCanvas(type, label || type, config, position)
    },
    [screenToFlowPosition, addNodeToCanvas]
  )

  const handleDragStart = (
    event: React.DragEvent, 
    nodeType: string, 
    label: string,
    config: Record<string, unknown> = {}
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('label', label)
    event.dataTransfer.setData('config', JSON.stringify(config))
    event.dataTransfer.effectAllowed = 'move'
  }

  // Double-click to add node
  const handleDoubleClick = (nodeType: string, label: string, config: Record<string, unknown> = {}) => {
    addNodeToCanvas(nodeType, label, config)
  }

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  const handleClearCanvas = () => {
    if (confirm('Are you sure you want to clear all nodes?')) {
      setNodes([])
      setEdges([])
      nodeCount = 0
    }
  }

  const handleSave = () => {
    console.log('Saving orchestration:', { nodes, edges, name: orchestrationName })
    alert('Orchestration saved!')
  }

  const handleDeploy = () => {
    setIsDraft(false)
    console.log('Deploying orchestration')
    alert('Orchestration deployed to GitHub!')
  }

  const handleValidate = () => {
    const hasStart = nodes.some(n => n.data.nodeType?.startsWith('trigger'))
    if (!hasStart) {
      alert('Orchestration must have at least one trigger node')
      return false
    }
    alert('Orchestration is valid!')
    return true
  }

  return (
    <div className="builder-container">
      {/* Toolbar */}
      <div className="builder-toolbar">
        <div className="toolbar-left">
          <select 
            className="orchestration-select"
            value={orchestration?.id || ''}
            onChange={(e) => {
              if (e.target.value) {
                navigate(`/builder/${e.target.value}`)
              } else {
                navigate('/builder')
              }
            }}
          >
            <option value="">New Orchestration</option>
            {mockOrchestrations.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <ChevronRight size={16} className="breadcrumb-sep" />
          <input
            type="text"
            value={orchestrationName}
            onChange={(e) => setOrchestrationName(e.target.value)}
            className="orchestration-name-input"
          />
          {isDraft && <span className="draft-badge">Draft</span>}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-ghost" onClick={handleValidate}>
            <Check size={18} />
            Validate
          </button>
          <button className="btn btn-secondary" onClick={handleSave}>
            <Save size={18} />
            Save
          </button>
          <button className="btn btn-primary" onClick={handleDeploy}>
            <Rocket size={18} />
            Deploy to GitHub
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Toolbox */}
        <div className="builder-toolbox">
          <div className="toolbox-header">
            <h3>Agent Toolbox</h3>
            <span className="toolbox-hint">
              <GripVertical size={12} /> Drag or <MousePointer size={12} /> Double-click to add
            </span>
          </div>

          {toolboxItems.map(section => (
            <div key={section.type} className="toolbox-section">
              <span className="toolbox-section-title">{section.label}</span>
              <div className="toolbox-items">
                {section.items.map(item => (
                  <div
                    key={item.id}
                    className="toolbox-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id, item.label)}
                    onDoubleClick={() => handleDoubleClick(item.id, item.label)}
                    title={`${item.hint} - Drag or double-click to add`}
                  >
                    <div className="toolbox-item-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      <item.icon size={20} />
                    </div>
                    <div className="toolbox-item-content">
                      <span className="toolbox-item-label">{item.label}</span>
                      <span className="toolbox-item-hint">{item.hint}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="toolbox-section">
            <span className="toolbox-section-title">Agent Tasks (Copilot)</span>
            <div className="toolbox-items agents">
              {mockAgentProfiles.map(agent => {
                const IconComponent = agentIcons[agent.icon || 'code'] || Code
                const agentConfig = {
                  mode: 'githubCodingAgent',
                  customAgent: agent.fileName,
                  repo: 'org/main-repo',
                  promptTemplate: agent.description,
                }
                return (
                  <div
                    key={agent.id}
                    className="toolbox-item agent-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'copilot.task', agent.name, agentConfig)}
                    onDoubleClick={() => handleDoubleClick('copilot.task', agent.name, agentConfig)}
                    title={`${agent.description} - Drag or double-click to add`}
                  >
                    <div 
                      className="toolbox-item-icon" 
                      style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div className="agent-item-info">
                      <span className="agent-item-name">{agent.name}</span>
                      <span className="agent-item-desc">{agent.description.substring(0, 40)}...</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button className="add-agent-btn">
            <Plus size={18} />
            Add Custom Agent
          </button>
        </div>

        {/* Canvas */}
        <div className="builder-canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode={['Backspace', 'Delete']}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#13ec5b' },
            }}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1} 
              color="#2a2a2a"
            />
            <Controls 
              showZoom
              showFitView
              showInteractive={false}
              position="bottom-left"
            />
            <MiniMap 
              nodeColor={(node) => {
                const nodeType = node.data?.nodeType as string
                if (nodeType?.startsWith('trigger')) return '#3b82f6'
                if (nodeType === 'copilot.task') return '#13ec5b'
                if (nodeType === 'human.approval') return '#ec4899'
                if (nodeType === 'condition') return '#06b6d4'
                return '#6b6b6b'
              }}
              maskColor="rgba(0, 0, 0, 0.8)"
              style={{ backgroundColor: '#111' }}
            />
            <Panel position="top-right" className="canvas-panel">
              <button className="btn btn-secondary btn-icon" title="Live Simulation">
                <Play size={18} />
              </button>
              {selectedNode && (
                <button 
                  className="btn btn-ghost btn-icon" 
                  title="Delete selected node"
                  onClick={handleDeleteNode}
                >
                  <Trash2 size={18} />
                </button>
              )}
              {nodes.length > 0 && (
                <button 
                  className="btn btn-ghost btn-icon" 
                  title="Clear canvas"
                  onClick={handleClearCanvas}
                >
                  <X size={18} />
                </button>
              )}
            </Panel>
          </ReactFlow>

          {nodes.length === 0 && (
            <div className="canvas-empty">
              <GitBranch size={48} />
              <h3>Start Building Your Orchestration</h3>
              <p>Drag agents from the toolbox or double-click to add them</p>
              <div className="canvas-empty-tips">
                <div className="tip">
                  <span className="tip-number">1</span>
                  <span>Add a <strong>Trigger</strong> to start your workflow</span>
                </div>
                <div className="tip">
                  <span className="tip-number">2</span>
                  <span>Add <strong>Agent Tasks</strong> for each SDLC step</span>
                </div>
                <div className="tip">
                  <span className="tip-number">3</span>
                  <span><strong>Connect nodes</strong> by dragging from handles</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Config Panel */}
        {selectedNode && (
          <NodeConfigPanel 
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={(data) => {
              setNodes((nds) =>
                nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, ...data } } : n))
              )
            }}
          />
        )}
      </div>
    </div>
  )
}

// Wrap with ReactFlowProvider for useReactFlow hook
export default function OrchestrationBuilder() {
  return (
    <ReactFlowProvider>
      <OrchestrationBuilderInner />
    </ReactFlowProvider>
  )
}
