import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  Activity,
  FolderOpen,
  Bot,
  Settings,
  Github,
  Sparkles,
  BarChart3
} from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/builder', icon: GitBranch, label: 'Orchestration Builder' },
  { path: '/runs', icon: Activity, label: 'Run Monitor' },
  { path: '/collections', icon: FolderOpen, label: 'Collections' },
  { path: '/agents', icon: Bot, label: 'Agent Profiles' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Github size={24} />
            <Sparkles size={12} className="logo-sparkle" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Copilot</span>
            <span className="logo-subtitle">Orchestrator</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main</span>
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <div className="sidebar-version">
          <span>v1.0.0-beta</span>
        </div>
      </div>
    </aside>
  )
}
