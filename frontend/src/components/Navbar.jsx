import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { mockNotifications } from "../data/mockData"

function Navbar() {
  const [searchValue, setSearchValue] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const unreadCount = mockNotifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-search">
          <svg className="navbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="navbar-search-input"
          />
        </div>
        <button className="navbar-button" onClick={() => navigate("/add-member")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Member
        </button>
        <button className="navbar-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          Filter
        </button>
        <button className="navbar-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Today
        </button>
      </div>

      <div className="navbar-right">
        <div className="navbar-notifications">
          <button
            className="navbar-icon-button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}
          </button>
          {notificationsOpen && (
            <div className="navbar-notifications-dropdown">
              <div className="navbar-notifications-header">
                <h3>Notifications</h3>
                <Link to="/notifications" onClick={() => setNotificationsOpen(false)}>View all</Link>
              </div>
              <div className="navbar-notifications-list">
                {mockNotifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className={`navbar-notification-item ${!notif.read ? "unread" : ""}`}>
                    <div className="navbar-notification-content">
                      <div className="navbar-notification-title">{notif.title}</div>
                      <div className="navbar-notification-message">{notif.message}</div>
                      <div className="navbar-notification-time">{notif.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile moved to sidebar as requested */}
      </div>
    </nav>
  )
}

export default Navbar
