import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import Layout from "../components/Layout"
// Removed mockUser import

function Profile() {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab") || "profile"

  const [user, setUser] = useState({
    avatar: "",
    name: "",
    email: "",
    role: ""
  })

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [passwordErrors, setPasswordErrors] = useState({})

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/user/profile", {
          method: "GET",
          credentials: "include" // if using cookies/session
        })
        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setUser({
          avatar: data.avatar,
          name: data.name,
          email: data.email,
          role: data.role
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchUserProfile()
  }, [])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!passwordData.current) errors.current = "Current password is required"
    if (!passwordData.new) errors.new = "New password is required"
    if (passwordData.new.length < 8) errors.new = "Password must be at least 8 characters"
    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = "Passwords do not match"
    }
    setPasswordErrors(errors)

    if (Object.keys(errors).length === 0) {
      try {
        const res = await fetch("http://localhost:5001/api/user/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwordData.current,
            newPassword: passwordData.new
          })
        })
        const result = await res.json()
        if (!res.ok) {
          setPasswordErrors({ current: result.message || "Error changing password" })
        } else {
          alert("Password updated successfully")
          setPasswordData({ current: "", new: "", confirm: "" })
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/user/logout", {
        method: "POST",
        credentials: "include"
      })
      // Redirect or refresh page after logout
      window.location.href = "/login"
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1 className="profile-title">User Profile</h1>
          <p className="profile-subtitle">Manage your account settings</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">{user.avatar}</div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
              <p className="profile-role">{user.role}</p>
            </div>
          </div>

          {tab === "password" && (
            <div className="profile-card">
              <h3 className="profile-card-title">Change Password</h3>
              <form className="profile-form" onSubmit={handlePasswordSubmit}>
                <div className="profile-field">
                  <label htmlFor="current-password" className="profile-label">
                    Current Password
                  </label>
                  <input
                    id="current-password"
                    name="current"
                    type="password"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    className={`profile-input ${passwordErrors.current ? "error" : ""}`}
                  />
                  {passwordErrors.current && (
                    <div className="profile-error">{passwordErrors.current}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label htmlFor="new-password" className="profile-label">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="new"
                    type="password"
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                    className={`profile-input ${passwordErrors.new ? "error" : ""}`}
                  />
                  {passwordErrors.new && (
                    <div className="profile-error">{passwordErrors.new}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label htmlFor="confirm-password" className="profile-label">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm"
                    type="password"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    className={`profile-input ${passwordErrors.confirm ? "error" : ""}`}
                  />
                  {passwordErrors.confirm && (
                    <div className="profile-error">{passwordErrors.confirm}</div>
                  )}
                </div>

                <button type="submit" className="profile-button profile-button-primary">
                  Update Password
                </button>
              </form>
            </div>
          )}

          <div className="profile-card">
            <div className="profile-actions">
              <button className="profile-button profile-button-danger" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
