import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Search, 
  Bell, 
  HelpCircle, 
  User,
  ChevronDown,
  Moon,
  LogOut
} from 'lucide-react'
import './Header.css'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/builder': 'Orchestration Builder',
  '/runs': 'Run Monitor',
  '/collections': 'Collections',
  '/agents': 'Agent Profiles',
}

export default function Header() {
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState(3)

  const currentPath = '/' + location.pathname.split('/')[1]
  const pageTitle = pageTitles[currentPath] || 'Copilot Orchestrator'

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{pageTitle}</h1>
      </div>

      <div className="header-center">
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search orchestrations, runs, agents..."
            className="search-input"
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" title="Help">
          <HelpCircle size={20} />
        </button>
        
        <button className="header-btn notification-btn" title="Notifications">
          <Bell size={20} />
          {notifications > 0 && (
            <span className="notification-badge">{notifications}</span>
          )}
        </button>

        <div className="user-menu-container">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span className="user-name">Juan Mora</span>
            <ChevronDown size={16} />
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-avatar large">
                  <User size={24} />
                </div>
                <div className="user-info">
                  <span className="user-full-name">Juan Mora</span>
                  <span className="user-email">juan.mora@accenture.com</span>
                </div>
              </div>
              <div className="user-menu-divider" />
              <button className="user-menu-item">
                <Moon size={18} />
                <span>Dark Mode</span>
                <span className="menu-item-status">On</span>
              </button>
              <button className="user-menu-item">
                <User size={18} />
                <span>Profile Settings</span>
              </button>
              <div className="user-menu-divider" />
              <button className="user-menu-item danger">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
