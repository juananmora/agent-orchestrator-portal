// Node Types for the Orchestration Builder
export type NodeType = 
  | 'trigger.manual'
  | 'trigger.event'
  | 'trigger.schedule'
  | 'copilot.task'
  | 'human.approval'
  | 'condition'
  | 'parallel'
  | 'join'

export type ExecutionMode = 'githubCodingAgent' | 'copilotSDK'

export type RunStatus = 
  | 'queued' 
  | 'running' 
  | 'waiting' 
  | 'completed' 
  | 'failed' 
  | 'cancelled'

// Agent Profile
export interface AgentProfile {
  id: string
  name: string
  fileName: string
  description: string
  tools: string[]
  infer: boolean
  scope: 'repo' | 'org' | 'enterprise'
  sourceRepo: string
  icon?: string
  color?: string
}

// Node Configuration
export interface TriggerConfig {
  type: 'manual' | 'event' | 'schedule'
  event?: string // e.g., 'issue_opened', 'pr_merged', 'label_added'
  schedule?: string // cron expression
}

export interface CopilotTaskConfig {
  mode: ExecutionMode
  repo: string
  customAgent: string
  promptTemplate: string
  model?: string
  tools?: string[]
  timeout?: number
  retries?: number
  requiresApproval?: boolean
}

export interface ConditionConfig {
  expression: string
  trueLabel?: string
  falseLabel?: string
}

export interface HumanApprovalConfig {
  approvers?: string[]
  timeout?: number
  message?: string
}

export type NodeConfig = TriggerConfig | CopilotTaskConfig | ConditionConfig | HumanApprovalConfig

// Graph Structure
export interface GraphNode {
  id: string
  type: NodeType
  config: NodeConfig
  position: { x: number; y: number }
  label?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  label?: string
}

export interface OrchestrationGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// Orchestration
export interface Orchestration {
  id: string
  name: string
  description: string
  owner: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  version: number
  graph: OrchestrationGraph
  tags?: string[]
}

// Run and Step Execution
export interface StepRun {
  id: string
  runId: string
  nodeId: string
  status: RunStatus
  startedAt?: string
  finishedAt?: string
  inputRef?: string
  outputRef?: string
  error?: string
  githubIssueNumber?: number
  githubPrNumber?: number
  sessionId?: string
  repo?: string
  logs?: LogEntry[]
}

export interface LogEntry {
  timestamp: string
  type: 'thought' | 'action' | 'code' | 'test' | 'error'
  content: string
  metadata?: Record<string, unknown>
}

export interface Run {
  id: string
  orchestrationId: string
  orchestrationName: string
  orchestrationVersionId: string
  triggerType: 'manual' | 'event' | 'schedule'
  status: RunStatus
  startedAt: string
  finishedAt?: string
  initiatedBy: string
  steps: StepRun[]
  currentStepId?: string
}

// Collection
export interface Collection {
  id: string
  name: string
  description: string
  orchestrations: string[]
  owner: string
  createdAt: string
  updatedAt: string
  isDefault?: boolean
}

// Event Log
export interface EventLog {
  id: string
  timestamp: string
  action: string
  actor: string
  resourceType: 'orchestration' | 'run' | 'agent' | 'collection'
  resourceId: string
  details?: string
}

// Dashboard Stats
export interface DashboardStats {
  timeSaved: { value: number; unit: string; change: number }
  agentEfficiency: { value: number; change: number }
  activeRuns: { value: number; change: number }
  prsAutomated: { value: number; change: number }
}
