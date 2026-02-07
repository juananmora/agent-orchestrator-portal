import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import OrchestrationBuilder from './pages/OrchestrationBuilder'
import RunMonitor from './pages/RunMonitor'
import Collections from './pages/Collections'
import AgentProfiles from './pages/AgentProfiles'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import AgentUsage from './pages/AgentUsage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="analytics/agent/:id" element={<AgentUsage />} />
        <Route path="builder" element={<OrchestrationBuilder />} />
        <Route path="builder/:id" element={<OrchestrationBuilder />} />
        <Route path="runs" element={<RunMonitor />} />
        <Route path="runs/:id" element={<RunMonitor />} />
        <Route path="collections" element={<Collections />} />
        <Route path="agents" element={<AgentProfiles />} />
      </Route>
    </Routes>
  )
}

export default App
