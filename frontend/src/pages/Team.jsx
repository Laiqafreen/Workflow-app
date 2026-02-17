import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import connectionService from "../services/connectionService"
import { useAuth } from "../contexts/AuthContext"

function Team() {
  const [connections, setConnections] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const res = await connectionService.getRequests()
      if (res.success) {
        const allConnections = res.data
        const accepted = allConnections.filter(c => c.status === 'accepted')
        const pending = allConnections.filter(c => c.status === 'pending' && c.recipient._id === user._id)

        const teamMembers = accepted.map(c => {
          return c.requester._id === user._id ? c.recipient : c.requester
        })

        setConnections(teamMembers)
        setPendingRequests(pending)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id) => {
    try {
      await connectionService.acceptRequest(id)
      fetchConnections()
    } catch (err) {
      alert("Failed to accept request")
    }
  }

  const handleReject = async (id) => {
    try {
      await connectionService.rejectRequest(id)
      fetchConnections()
    } catch (err) {
      alert("Failed to reject request")
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member from your team?")) return

    try {
      const res = await connectionService.getRequests()
      const conn = res.data.find(c =>
        (c.requester._id === userId && c.recipient._id === user._id) ||
        (c.recipient._id === userId && c.requester._id === user._id)
      )

      if (conn) {
        await connectionService.rejectRequest(conn._id)
        fetchConnections()
      }
    } catch (err) {
      console.error("Error removing member", err)
    }
  }

  return (
    <Layout>
      <div className="team-page">
        <div className="team-header">
          <div>
            <h1 className="team-title">My Team</h1>
            <p className="team-subtitle">Manage your connections and team members</p>
          </div>
          <button className="team-add-button" onClick={() => navigate("/add-member")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Send Friend Request
          </button>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="pending-requests-section" style={{ marginBottom: "2.5rem", background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#334155", fontWeight: '600' }}>Pending Requests ({pendingRequests.length})</h2>
            <div className="team-members-grid">
              {pendingRequests.map(req => (
                <div key={req._id} className="team-member-card" style={{ borderLeft: "4px solid #3b82f6" }}>
                  <div className="team-member-avatar">
                    {req.requester.avatar || (req.requester.name ? req.requester.name.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div className="team-member-content">
                    <div className="team-member-name">{req.requester.name}</div>
                    <div className="team-member-role" style={{ fontSize: '0.85rem' }}>Requesting to connect</div>
                    <div className="team-member-email">{req.requester.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto', paddingTop: '1rem' }}>
                    <button onClick={() => handleAccept(req._id)} style={{ flex: 1, padding: '0.5rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Accept</button>
                    <button onClick={() => handleReject(req._id)} style={{ flex: 1, padding: '0.5rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#334155", fontWeight: '600' }}>Team Members ({connections.length})</h2>
        {loading ? (
          <div className="loading-state">Loading team...</div>
        ) : (
          <div className="team-members-grid">
            {connections.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <p style={{ marginBottom: '1rem' }}>No connections yet.</p>
                <button onClick={() => navigate("/add-member")} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Click here to find people</button>
              </div>
            ) : (
              connections.map((member) => (
                <div key={member._id} className="team-member-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                    <div className="team-member-avatar" style={{ width: 48, height: 48, fontSize: '1.25rem' }}>
                      {member.avatar || (member.name ? member.name.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <button
                      title="Remove Member"
                      onClick={() => handleRemoveMember(member._id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="team-member-content" style={{ alignItems: 'flex-start', textAlign: 'left', width: '100%' }}>
                    <div className="team-member-name" style={{ fontSize: '1.1rem', fontWeight: '600' }}>{member.name}</div>
                    <div className="team-member-role" style={{ color: '#64748b', marginBottom: '0.25rem' }}>{member.role || "Member"}</div>
                    <div className="team-member-email" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{member.email}</div>
                  </div>

                  <div style={{ marginTop: 'auto', width: '100%', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                    <button style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', background: 'white', color: '#475569', fontSize: '0.875rem', cursor: 'pointer' }}>
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Team
