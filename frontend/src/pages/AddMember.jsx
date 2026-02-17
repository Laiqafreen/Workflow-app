import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import connectionService from "../services/connectionService"
import userService from "../services/userService"

function AddMember() {
  const navigate = useNavigate()
  const [availableUsers, setAvailableUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    // Fetch all users to allow sending requests
    userService.getAllUsers()
      .then(res => setAvailableUsers(res.data || []))
      .catch(err => console.error(err))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    if (!selectedUser) {
      setMessage({ type: "error", text: "Please select a user" })
      return
    }

    try {
      setLoading(true)
      await connectionService.sendRequest(selectedUser)
      setMessage({ type: "success", text: "Friend request sent successfully!" })
      setTimeout(() => navigate("/team"), 1500)
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send request"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="add-member-page">
        <div className="add-member-header">
          <h1 className="add-member-title">Send Friend Request</h1>
          <p className="add-member-subtitle">Connect with other users to add them to your team.</p>
        </div>

        <div className="add-member-card">
          {message.text && (
            <div className={`add-member-error ${message.type === 'success' ? 'success' : ''}`} style={{ marginBottom: "1rem", color: message.type === 'success' ? 'green' : 'red' }}>
              {message.text}
            </div>
          )}

          <form className="add-member-form" onSubmit={handleSubmit}>
            <div className="add-member-field">
              <label className="add-member-label">
                Select User <span className="required">*</span>
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="add-member-select"
              >
                <option value="">Select a user...</option>
                {availableUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="add-member-actions">
              <button
                type="button"
                className="add-member-button add-member-button-secondary"
                onClick={() => navigate("/team")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-member-button add-member-button-primary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default AddMember
