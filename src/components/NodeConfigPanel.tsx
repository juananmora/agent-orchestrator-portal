import { useState } from 'react'
import type { Node } from '@xyflow/react'
import { 
  X, 
  Folder, 
  GitBranch, 
  FileCode,
  Settings,
  Clock,
  RefreshCw,
  Shield,
  ChevronDown
} from 'lucide-react'
import { mockAgentProfiles } from '../data/mockData'
import './NodeConfigPanel.css'

interface NodeConfigPanelProps {
  node: Node
  onClose: () => void
  onUpdate: (data: Record<string, unknown>) => void
}

export default function NodeConfigPanel({ node, onClose, onUpdate }: NodeConfigPanelProps) {
  const nodeData = node.data as Record<string, unknown>
  const nodeType = nodeData.nodeType as string
  const config = (nodeData.config || {}) as Record<string, unknown>

  const [localConfig, setLocalConfig] = useState(config)
  const [selectedAgent, setSelectedAgent] = useState(config.customAgent as string || '')
  const [selectedMode, setSelectedMode] = useState(config.mode as string || 'githubCodingAgent')
  const [promptTemplate, setPromptTemplate] = useState(config.promptTemplate as string || '')
  const [selectedModel, setSelectedModel] = useState(config.model as string || 'gpt-4o')

  const handleSave = () => {
    const newConfig = {
      ...localConfig,
      customAgent: selectedAgent,
      mode: selectedMode,
      promptTemplate,
      model: selectedModel,
    }
    onUpdate({ config: newConfig })
  }

  const isCopilotTask = nodeType === 'copilot.task'
  const isHumanApproval = nodeType === 'human.approval'
  const isCondition = nodeType === 'condition'
  const isTrigger = nodeType?.startsWith('trigger')

  return (
    <div className="config-panel">
      <div className="config-panel-header">
        <div className="config-title">
          <Settings size={18} />
          <span>Agent Settings</span>
        </div>
        <div className="config-node-name">{nodeData.label as string || node.id}</div>
        <button className="config-close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="config-panel-body">
        {isCopilotTask && (
          <>
            {/* Target Repository */}
            <div className="config-section">
              <label className="config-label">
                <Folder size={16} />
                Target Repository
              </label>
              <div className="config-input-group">
                <span className="input-prefix">github.com/</span>
                <input
                  type="text"
                  value={config.repo as string || 'org/main-repo'}
                  onChange={(e) => setLocalConfig({ ...localConfig, repo: e.target.value })}
                  placeholder="org/repo"
                  className="config-input"
                />
              </div>
            </div>

            {/* Custom Agent */}
            <div className="config-section">
              <label className="config-label">
                <FileCode size={16} />
                Custom Agent
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="config-select"
              >
                <option value="">Select an agent...</option>
                {mockAgentProfiles.map(agent => (
                  <option key={agent.id} value={agent.fileName}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Execution Mode */}
            <div className="config-section">
              <label className="config-label">
                <GitBranch size={16} />
                Execution Mode
              </label>
              <div className="config-toggle-group">
                <button
                  className={`toggle-btn ${selectedMode === 'githubCodingAgent' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('githubCodingAgent')}
                >
                  GitHub Coding Agent
                </button>
                <button
                  className={`toggle-btn ${selectedMode === 'copilotSDK' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('copilotSDK')}
                >
                  Copilot SDK
                </button>
              </div>
              <p className="config-hint">
                {selectedMode === 'githubCodingAgent' 
                  ? 'Creates issues and PRs directly in GitHub'
                  : 'Runs in your backend with full control'}
              </p>
            </div>

            {/* Model Selection */}
            <div className="config-section">
              <label className="config-label">Base Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="config-select"
              >
                <option value="gpt-4o">GPT-4o (Standard)</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                <option value="copilot-custom-1.2">Copilot Custom 1.2</option>
              </select>
            </div>

            {/* Prompt Template */}
            <div className="config-section">
              <div className="config-label-row">
                <label className="config-label">System Prompt</label>
                <button className="use-template-btn">Use Template</button>
              </div>
              <textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                placeholder="Enter instructions for the agent..."
                className="config-textarea"
                rows={6}
              />
              <div className="template-vars">
                <span className="var-hint">Available variables:</span>
                <code>{'{{pr_description}}'}</code>
                <code>{'{{impacted_files}}'}</code>
                <code>{'{{issue.title}}'}</code>
              </div>
            </div>

            {/* Trigger Conditions */}
            <div className="config-section">
              <label className="config-label">Trigger Conditions</label>
              <div className="config-checkboxes">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>On File Change</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Only on Tagged PRs</span>
                </label>
              </div>
            </div>

            {/* Policies */}
            <div className="config-section">
              <label className="config-label">
                <Shield size={16} />
                Policies
              </label>
              <div className="config-grid">
                <div className="config-field">
                  <label>Timeout</label>
                  <div className="config-input-with-unit">
                    <input type="number" defaultValue={30} className="config-input small" />
                    <span>min</span>
                  </div>
                </div>
                <div className="config-field">
                  <label>Retries</label>
                  <input type="number" defaultValue={3} className="config-input small" />
                </div>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Requires Approval</span>
              </label>
            </div>
          </>
        )}

        {isHumanApproval && (
          <>
            <div className="config-section">
              <label className="config-label">Approval Message</label>
              <textarea
                defaultValue={config.message as string || ''}
                placeholder="Message to show approvers..."
                className="config-textarea"
                rows={3}
              />
            </div>
            <div className="config-section">
              <label className="config-label">
                <Clock size={16} />
                Timeout
              </label>
              <div className="config-input-with-unit">
                <input type="number" defaultValue={60} className="config-input" />
                <span>minutes</span>
              </div>
            </div>
            <div className="config-section">
              <label className="config-label">Approvers (optional)</label>
              <input
                type="text"
                placeholder="@username, @team..."
                className="config-input"
              />
            </div>
          </>
        )}

        {isCondition && (
          <>
            <div className="config-section">
              <label className="config-label">Condition Expression</label>
              <input
                type="text"
                defaultValue={config.expression as string || ''}
                placeholder="e.g., checks_passed, label == 'security'"
                className="config-input code"
              />
            </div>
            <div className="config-section">
              <label className="config-label">Branch Labels</label>
              <div className="config-grid">
                <div className="config-field">
                  <label>True Branch</label>
                  <input type="text" defaultValue="Pass" className="config-input small" />
                </div>
                <div className="config-field">
                  <label>False Branch</label>
                  <input type="text" defaultValue="Fail" className="config-input small" />
                </div>
              </div>
            </div>
          </>
        )}

        {isTrigger && (
          <>
            {nodeType === 'trigger.event' && (
              <div className="config-section">
                <label className="config-label">GitHub Event</label>
                <select className="config-select" defaultValue={config.event as string || ''}>
                  <option value="pr_opened">PR Opened</option>
                  <option value="pr_merged">PR Merged</option>
                  <option value="issue_opened">Issue Opened</option>
                  <option value="issue_labeled">Issue Labeled</option>
                  <option value="push">Push to Branch</option>
                </select>
              </div>
            )}
            {nodeType === 'trigger.schedule' && (
              <div className="config-section">
                <label className="config-label">Schedule (Cron)</label>
                <input
                  type="text"
                  defaultValue={config.schedule as string || '0 0 * * *'}
                  placeholder="0 0 * * *"
                  className="config-input code"
                />
                <p className="config-hint">Runs daily at midnight</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="config-panel-footer">
        <button className="btn btn-ghost" onClick={onClose}>
          Discard
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Save Node
        </button>
      </div>
    </div>
  )
}
