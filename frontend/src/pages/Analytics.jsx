import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import API from "../services/api"

function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics")
      setAnalytics(res.data)
    } catch (err) {
      console.error("Failed to load analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="analytics-page">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Loading analytics...</div>
        </div>
      </Layout>
    )
  }

  // Safety fallback if analytics is null
  const stats = analytics || {
    projects: { total: 0, active: 0, completed: 0 },
    tasks: { total: 0, completed: 0, pending: 0, inProgress: 0 },
    completionRate: 0,
    tasksByStatus: { todo: 0, inProgress: 0, completed: 0 },
    tasksByPriority: { high: 0, medium: 0, low: 0 },
    weeklyProgress: []
  }

  return (
    <Layout>
      <div className="analytics-page">
        <div className="analytics-header">
          <h1 className="analytics-title">Analytics</h1>
          <p className="analytics-subtitle">Track your productivity and performance</p>
        </div>

        <div className="analytics-grid">
          {/* Project Stats */}
          <div className="analytics-card">
            <h3 className="analytics-card-title">Projects Overview</h3>
            <div className="analytics-stat-value">
              Total: {stats.projects?.total || 0}
            </div>
            <div className="analytics-stats-row" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
              <span>Active: {stats.projects?.active || 0}</span>
              <span>Completed: {stats.projects?.completed || 0}</span>
            </div>
          </div>

          <div className="analytics-card analytics-card-large">
            <h3 className="analytics-card-title">Task Completion Rate</h3>
            <div className="analytics-completion-text">
              <span className="analytics-completion-value">
                {stats.completionRate || 0}%
              </span>
              <span className="analytics-completion-label">Complete</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="analytics-card-title">Tasks by Status</h3>
            <div className="analytics-stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Todo</span>
              <strong>{stats.tasksByStatus?.todo || 0}</strong>
            </div>
            <div className="analytics-stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>In Progress</span>
              <strong>{stats.tasksByStatus?.inProgress || 0}</strong>
            </div>
            <div className="analytics-stat-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Completed</span>
              <strong>{stats.tasksByStatus?.completed || 0}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="analytics-card-title">Tasks by Priority</h3>
            <div className="analytics-stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ef4444' }}>High</span>
              <strong>{stats.tasksByPriority?.high || 0}</strong>
            </div>
            <div className="analytics-stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#f59e0b' }}>Medium</span>
              <strong>{stats.tasksByPriority?.medium || 0}</strong>
            </div>
            <div className="analytics-stat-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#22c55e' }}>Low</span>
              <strong>{stats.tasksByPriority?.low || 0}</strong>
            </div>
          </div>

          <div className="analytics-card analytics-card-large">
            <h3 className="analytics-card-title">Weekly Progress</h3>
            <div className="analytics-chart">
              {stats.weeklyProgress && stats.weeklyProgress.map((day, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '30px',
                      height: `${Math.min(day.completed * 20, 100)}%`, // Scale logic
                      background: '#3b82f6',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{day.day}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{day.completed}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Analytics
