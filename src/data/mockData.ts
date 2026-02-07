import type { 
  Orchestration, 
  Run, 
  AgentProfile, 
  Collection,
  DashboardStats,
  StepRun
} from '../types'

// Mock Agent Profiles
export const mockAgentProfiles: AgentProfile[] = [
  {
    id: 'agent-1',
    name: 'Implementation Planner',
    fileName: 'impl-planner.agent.md',
    description: 'Produces implementation plan, checklist, risks, and acceptance criteria without touching code',
    tools: ['read', 'search'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'architecture',
    color: '#8b5cf6'
  },
  {
    id: 'agent-2',
    name: 'Backend Developer',
    fileName: 'backend-dev.agent.md',
    description: 'Implements backend changes and opens PRs. Expert in Node.js, Python, and Go',
    tools: ['read', 'edit', 'search', 'execute'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'code',
    color: '#3b82f6'
  },
  {
    id: 'agent-3',
    name: 'Frontend Developer',
    fileName: 'frontend-dev.agent.md',
    description: 'Implements frontend changes with React, Vue, or Angular. Creates responsive UIs',
    tools: ['read', 'edit', 'search', 'execute'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'web',
    color: '#06b6d4'
  },
  {
    id: 'agent-4',
    name: 'Test Writer',
    fileName: 'test-writer.agent.md',
    description: 'Adds unit tests and E2E tests, reinforces code coverage to >90%',
    tools: ['read', 'edit', 'search', 'execute'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'verified_user',
    color: '#13ec5b'
  },
  {
    id: 'agent-5',
    name: 'Security Reviewer',
    fileName: 'security-reviewer.agent.md',
    description: 'Reviews code for vulnerabilities, checks dependencies, and suggests security improvements',
    tools: ['read', 'search'],
    infer: false,
    scope: 'enterprise',
    sourceRepo: 'accenture/.github-private',
    icon: 'security',
    color: '#ef4444'
  },
  {
    id: 'agent-6',
    name: 'Code Reviewer',
    fileName: 'code-reviewer.agent.md',
    description: 'Auto-reviews PRs for quality, style, and best practices. Suggests improvements',
    tools: ['read', 'search'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'rate_review',
    color: '#f59e0b'
  },
  {
    id: 'agent-7',
    name: 'Documentation Writer',
    fileName: 'docs-writer.agent.md',
    description: 'Generates README, ADRs, API docs, and inline documentation',
    tools: ['read', 'edit', 'search'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'description',
    color: '#ec4899'
  },
  {
    id: 'agent-8',
    name: 'DevOps Engineer',
    fileName: 'devops.agent.md',
    description: 'Handles CI/CD pipelines, Docker configs, Kubernetes deployments',
    tools: ['read', 'edit', 'search', 'execute'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'terminal',
    color: '#84cc16'
  },
  {
    id: 'agent-9',
    name: 'Bug Fixer',
    fileName: 'bugfixer.agent.md',
    description: 'Analyzes error logs and test failures, proposes and implements fixes',
    tools: ['read', 'edit', 'search', 'execute'],
    infer: true,
    scope: 'org',
    sourceRepo: 'accenture/copilot-agents',
    icon: 'bug_report',
    color: '#f97316'
  }
]

// Mock Orchestrations
export const mockOrchestrations: Orchestration[] = [
  {
    id: 'orch-1',
    name: 'PR Automation Flow',
    description: 'Complete PR automation from planning to deployment with code review and testing',
    owner: 'juan.mora@accenture.com',
    status: 'published',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-02T14:30:00Z',
    version: 3,
    tags: ['sdlc', 'automation', 'pr'],
    graph: {
      nodes: [
        { id: 't1', type: 'trigger.event', config: { type: 'event', event: 'pr_opened' }, position: { x: 100, y: 200 }, label: 'PR Created' },
        { id: 'a1', type: 'copilot.task', config: { mode: 'copilotSDK', repo: 'org/main-repo', customAgent: 'impl-planner', promptTemplate: 'Analyze PR and create implementation plan' }, position: { x: 350, y: 200 }, label: 'Architect' },
        { id: 'h1', type: 'human.approval', config: { message: 'Review implementation plan', timeout: 3600 }, position: { x: 600, y: 200 }, label: 'Plan Approval' },
        { id: 'a2', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'backend-dev', promptTemplate: 'Implement changes according to plan' }, position: { x: 850, y: 100 }, label: 'Backend Dev' },
        { id: 'a3', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'test-writer', promptTemplate: 'Write tests for new implementation' }, position: { x: 850, y: 300 }, label: 'Test Writer' },
        { id: 'j1', type: 'join', config: {}, position: { x: 1100, y: 200 }, label: 'Join' },
        { id: 'a4', type: 'copilot.task', config: { mode: 'copilotSDK', repo: 'org/main-repo', customAgent: 'code-reviewer', promptTemplate: 'Review all changes' }, position: { x: 1350, y: 200 }, label: 'Code Review' },
        { id: 'c1', type: 'condition', config: { expression: 'checks_passed', trueLabel: 'Pass', falseLabel: 'Fail' }, position: { x: 1600, y: 200 }, label: 'CI Check' },
        { id: 'a5', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'bugfixer', promptTemplate: 'Fix failing tests' }, position: { x: 1850, y: 350 }, label: 'Bug Fixer' }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'a1' },
        { id: 'e2', source: 'a1', target: 'h1' },
        { id: 'e3', source: 'h1', target: 'a2' },
        { id: 'e4', source: 'h1', target: 'a3' },
        { id: 'e5', source: 'a2', target: 'j1' },
        { id: 'e6', source: 'a3', target: 'j1' },
        { id: 'e7', source: 'j1', target: 'a4' },
        { id: 'e8', source: 'a4', target: 'c1' },
        { id: 'e9', source: 'c1', target: 'a5', sourceHandle: 'false', label: 'Fail' }
      ]
    }
  },
  {
    id: 'orch-2',
    name: 'Security Patch Pipeline',
    description: 'Automated security vulnerability detection and patching workflow',
    owner: 'security-team@accenture.com',
    status: 'published',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z',
    version: 2,
    tags: ['security', 'patching', 'automated'],
    graph: {
      nodes: [
        { id: 't1', type: 'trigger.schedule', config: { type: 'schedule', schedule: '0 0 * * *' }, position: { x: 100, y: 200 }, label: 'Daily Scan' },
        { id: 'a1', type: 'copilot.task', config: { mode: 'copilotSDK', repo: 'org/main-repo', customAgent: 'security-reviewer', promptTemplate: 'Scan for vulnerabilities' }, position: { x: 350, y: 200 }, label: 'Security Scan' },
        { id: 'c1', type: 'condition', config: { expression: 'vulnerabilities_found' }, position: { x: 600, y: 200 }, label: 'Issues Found?' },
        { id: 'a2', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'bugfixer', promptTemplate: 'Apply security patches' }, position: { x: 850, y: 100 }, label: 'Apply Patches' },
        { id: 'h1', type: 'human.approval', config: { message: 'Review security patches' }, position: { x: 1100, y: 100 }, label: 'Security Review' }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'a1' },
        { id: 'e2', source: 'a1', target: 'c1' },
        { id: 'e3', source: 'c1', target: 'a2', sourceHandle: 'true' },
        { id: 'e4', source: 'a2', target: 'h1' }
      ]
    }
  },
  {
    id: 'orch-3',
    name: 'Documentation Generator',
    description: 'Auto-generates and updates documentation for code changes',
    owner: 'juan.mora@accenture.com',
    status: 'draft',
    createdAt: '2026-02-01T15:00:00Z',
    updatedAt: '2026-02-02T09:00:00Z',
    version: 1,
    tags: ['documentation', 'automation'],
    graph: {
      nodes: [
        { id: 't1', type: 'trigger.event', config: { type: 'event', event: 'pr_merged' }, position: { x: 100, y: 200 }, label: 'PR Merged' },
        { id: 'a1', type: 'copilot.task', config: { mode: 'copilotSDK', repo: 'org/main-repo', customAgent: 'docs-writer', promptTemplate: 'Update documentation for merged changes' }, position: { x: 350, y: 200 }, label: 'Doc Generator' }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'a1' }
      ]
    }
  },
  {
    id: 'orch-4',
    name: 'Feature Development Pipeline',
    description: 'End-to-end feature development from issue to deployment',
    owner: 'tech-lead@accenture.com',
    status: 'published',
    createdAt: '2026-01-25T12:00:00Z',
    updatedAt: '2026-02-02T16:00:00Z',
    version: 5,
    tags: ['feature', 'sdlc', 'full-pipeline'],
    graph: {
      nodes: [
        { id: 't1', type: 'trigger.event', config: { type: 'event', event: 'issue_labeled_feature' }, position: { x: 100, y: 250 }, label: 'Feature Issue' },
        { id: 'a1', type: 'copilot.task', config: { mode: 'copilotSDK', repo: 'org/main-repo', customAgent: 'impl-planner', promptTemplate: 'Create feature implementation plan' }, position: { x: 350, y: 250 }, label: 'Planning' },
        { id: 'h1', type: 'human.approval', config: { message: 'Approve feature plan' }, position: { x: 600, y: 250 }, label: 'Plan Review' },
        { id: 'p1', type: 'parallel', config: {}, position: { x: 850, y: 250 }, label: 'Parallel Dev' },
        { id: 'a2', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'backend-dev', promptTemplate: 'Implement backend' }, position: { x: 1100, y: 100 }, label: 'Backend' },
        { id: 'a3', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'frontend-dev', promptTemplate: 'Implement frontend' }, position: { x: 1100, y: 250 }, label: 'Frontend' },
        { id: 'a4', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'test-writer', promptTemplate: 'Write tests' }, position: { x: 1100, y: 400 }, label: 'Tests' },
        { id: 'j1', type: 'join', config: {}, position: { x: 1350, y: 250 }, label: 'Join' },
        { id: 'a5', type: 'copilot.task', config: { mode: 'copilotSDK', repo: 'org/main-repo', customAgent: 'code-reviewer', promptTemplate: 'Full code review' }, position: { x: 1600, y: 250 }, label: 'Review' },
        { id: 'a6', type: 'copilot.task', config: { mode: 'githubCodingAgent', repo: 'org/main-repo', customAgent: 'docs-writer', promptTemplate: 'Update docs' }, position: { x: 1850, y: 250 }, label: 'Docs' }
      ],
      edges: [
        { id: 'e1', source: 't1', target: 'a1' },
        { id: 'e2', source: 'a1', target: 'h1' },
        { id: 'e3', source: 'h1', target: 'p1' },
        { id: 'e4', source: 'p1', target: 'a2' },
        { id: 'e5', source: 'p1', target: 'a3' },
        { id: 'e6', source: 'p1', target: 'a4' },
        { id: 'e7', source: 'a2', target: 'j1' },
        { id: 'e8', source: 'a3', target: 'j1' },
        { id: 'e9', source: 'a4', target: 'j1' },
        { id: 'e10', source: 'j1', target: 'a5' },
        { id: 'e11', source: 'a5', target: 'a6' }
      ]
    }
  }
]

// Mock Step Runs for active runs
const mockStepRuns: Record<string, StepRun[]> = {
  'run-1': [
    { id: 'sr-1', runId: 'run-1', nodeId: 't1', status: 'completed', startedAt: '2026-02-03T14:00:00Z', finishedAt: '2026-02-03T14:00:01Z' },
    { id: 'sr-2', runId: 'run-1', nodeId: 'a1', status: 'completed', startedAt: '2026-02-03T14:00:02Z', finishedAt: '2026-02-03T14:05:00Z', githubIssueNumber: 395 },
    { id: 'sr-3', runId: 'run-1', nodeId: 'h1', status: 'completed', startedAt: '2026-02-03T14:05:01Z', finishedAt: '2026-02-03T14:10:00Z' },
    { id: 'sr-4', runId: 'run-1', nodeId: 'a2', status: 'running', startedAt: '2026-02-03T14:10:01Z', githubIssueNumber: 396, githubPrNumber: 412, repo: 'accenture/main-app', 
      logs: [
        { timestamp: '2026-02-03T14:22:05Z', type: 'thought', content: 'I\'ve identified that `LoginManager.tsx` uses a deprecated lifecycle method. I will refactor the `componentWillReceiveProps` into a `useEffect` hook to comply with React 18 standards.' },
        { timestamp: '2026-02-03T14:22:12Z', type: 'code', content: '- componentWillReceiveProps(nextProps: Props) {\n-   if (nextProps.id !== this.props.id) { this.fetchData(nextProps.id); }\n+ useEffect(() => {\n+   fetchData(id);\n+ }, [id]);' },
        { timestamp: '2026-02-03T14:22:30Z', type: 'test', content: 'Running regression tests...' }
      ]
    },
    { id: 'sr-5', runId: 'run-1', nodeId: 'a3', status: 'queued' }
  ],
  'run-2': [
    { id: 'sr-6', runId: 'run-2', nodeId: 't1', status: 'completed', startedAt: '2026-02-03T13:30:00Z', finishedAt: '2026-02-03T13:30:01Z' },
    { id: 'sr-7', runId: 'run-2', nodeId: 'a1', status: 'completed', startedAt: '2026-02-03T13:30:02Z', finishedAt: '2026-02-03T13:45:00Z', githubIssueNumber: 402, githubPrNumber: 415 }
  ],
  'run-3': [
    { id: 'sr-8', runId: 'run-3', nodeId: 't1', status: 'completed', startedAt: '2026-02-03T12:00:00Z', finishedAt: '2026-02-03T12:00:01Z' },
    { id: 'sr-9', runId: 'run-3', nodeId: 'a1', status: 'waiting', startedAt: '2026-02-03T12:00:02Z', githubIssueNumber: 398 }
  ]
}

// Mock Runs
export const mockRuns: Run[] = [
  {
    id: 'run-1',
    orchestrationId: 'orch-1',
    orchestrationName: 'PR Automation Flow',
    orchestrationVersionId: 'orch-1-v3',
    triggerType: 'event',
    status: 'running',
    startedAt: '2026-02-03T14:00:00Z',
    initiatedBy: 'github-webhook',
    steps: mockStepRuns['run-1'],
    currentStepId: 'a2'
  },
  {
    id: 'run-2',
    orchestrationId: 'orch-2',
    orchestrationName: 'Security Patch Pipeline',
    orchestrationVersionId: 'orch-2-v2',
    triggerType: 'schedule',
    status: 'completed',
    startedAt: '2026-02-03T13:30:00Z',
    finishedAt: '2026-02-03T13:48:00Z',
    initiatedBy: 'scheduler',
    steps: mockStepRuns['run-2']
  },
  {
    id: 'run-3',
    orchestrationId: 'orch-3',
    orchestrationName: 'Documentation Generator',
    orchestrationVersionId: 'orch-3-v1',
    triggerType: 'event',
    status: 'waiting',
    startedAt: '2026-02-03T12:00:00Z',
    initiatedBy: 'github-webhook',
    steps: mockStepRuns['run-3'],
    currentStepId: 'a1'
  },
  {
    id: 'run-4',
    orchestrationId: 'orch-1',
    orchestrationName: 'PR Automation Flow',
    orchestrationVersionId: 'orch-1-v3',
    triggerType: 'manual',
    status: 'failed',
    startedAt: '2026-02-03T10:00:00Z',
    finishedAt: '2026-02-03T10:45:00Z',
    initiatedBy: 'juan.mora@accenture.com',
    steps: [
      { id: 'sr-10', runId: 'run-4', nodeId: 't1', status: 'completed', startedAt: '2026-02-03T10:00:00Z', finishedAt: '2026-02-03T10:00:01Z' },
      { id: 'sr-11', runId: 'run-4', nodeId: 'a1', status: 'completed', startedAt: '2026-02-03T10:00:02Z', finishedAt: '2026-02-03T10:15:00Z' },
      { id: 'sr-12', runId: 'run-4', nodeId: 'h1', status: 'completed', startedAt: '2026-02-03T10:15:01Z', finishedAt: '2026-02-03T10:20:00Z' },
      { id: 'sr-13', runId: 'run-4', nodeId: 'a2', status: 'failed', startedAt: '2026-02-03T10:20:01Z', finishedAt: '2026-02-03T10:45:00Z', error: 'Build Error: TypeScript compilation failed' }
    ]
  },
  {
    id: 'run-5',
    orchestrationId: 'orch-4',
    orchestrationName: 'Feature Development Pipeline',
    orchestrationVersionId: 'orch-4-v5',
    triggerType: 'event',
    status: 'completed',
    startedAt: '2026-02-03T08:00:00Z',
    finishedAt: '2026-02-03T11:30:00Z',
    initiatedBy: 'github-webhook',
    steps: [
      { id: 'sr-14', runId: 'run-5', nodeId: 't1', status: 'completed', startedAt: '2026-02-03T08:00:00Z', finishedAt: '2026-02-03T08:00:01Z' },
      { id: 'sr-15', runId: 'run-5', nodeId: 'a1', status: 'completed', startedAt: '2026-02-03T08:00:02Z', finishedAt: '2026-02-03T08:30:00Z', githubIssueNumber: 388, githubPrNumber: 405 }
    ]
  }
]

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'SDLC Automation',
    description: 'Complete software development lifecycle automation workflows',
    orchestrations: ['orch-1', 'orch-4'],
    owner: 'juan.mora@accenture.com',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-02T14:00:00Z',
    isDefault: true
  },
  {
    id: 'col-2',
    name: 'Security & Compliance',
    description: 'Security scanning and compliance automation',
    orchestrations: ['orch-2'],
    owner: 'security-team@accenture.com',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'col-3',
    name: 'Documentation',
    description: 'Automated documentation generation workflows',
    orchestrations: ['orch-3'],
    owner: 'juan.mora@accenture.com',
    createdAt: '2026-02-01T15:00:00Z',
    updatedAt: '2026-02-02T09:00:00Z'
  }
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  timeSaved: { value: 142, unit: 'h', change: 12 },
  agentEfficiency: { value: 94, change: 2 },
  activeRuns: { value: 12, change: -5 },
  prsAutomated: { value: 86, change: 8 }
}

// Helper to get orchestration by ID
export function getOrchestrationById(id: string): Orchestration | undefined {
  return mockOrchestrations.find(o => o.id === id)
}

// Helper to get runs by orchestration ID
export function getRunsByOrchestrationId(orchestrationId: string): Run[] {
  return mockRuns.filter(r => r.orchestrationId === orchestrationId)
}

// Helper to get agent by ID
export function getAgentById(id: string): AgentProfile | undefined {
  return mockAgentProfiles.find(a => a.id === id)
}

// Helper to get collection by ID  
export function getCollectionById(id: string): Collection | undefined {
  return mockCollections.find(c => c.id === id)
}
