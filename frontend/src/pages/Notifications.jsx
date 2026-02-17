import { useState, useEffect } from "react"
import Layout from "../components/Layout"
// Removed mockNotifications import

function Notifications() {
  const [notifications, setNotifications] = useState([])

  // Fetch notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/notifications", {
          method: "GET",
          credentials: "include"
        })
        if (!res.ok) throw new Error("Failed to fetch notifications")
        const data = await res.json()
        setNotifications(data.notifications || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include"
      })
      if (!res.ok) throw new Error("Failed to mark notification as read")
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error(err)
      alert("Error marking notification as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/notifications/read-all", {
        method: "PUT",
        credentials: "include"
      })
      if (!res.ok) throw new Error("Failed to mark all notifications as read")
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error(err)
      alert("Error marking all notifications as read")
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeIcon = (type) => {
    switch (type) {
      case "assignment":
        return "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      case "completion":
        return "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"
      case "reminder":
        return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      default:
        return "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
    }
  }

  return (
    <Layout>
      <div className="notifications-page">
        <div className="notifications-header">
          <div>
            <h1 className="notifications-title">Notifications</h1>
            <p className="notifications-subtitle">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="notifications-mark-all" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notifications-item ${!notification.read ? "notifications-item-unread" : ""}`}
            >
              <div className="notifications-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={getTypeIcon(notification.type)} />
                </svg>
              </div>
              <div className="notifications-content">
                <div className="notifications-item-header">
                  <h3 className="notifications-item-title">{notification.title}</h3>
                  {!notification.read && <div className="notifications-dot" />}
                </div>
                <p className="notifications-item-message">{notification.message}</p>
                <div className="notifications-item-footer">
                  <span className="notifications-timestamp">{notification.timestamp}</span>
                  {!notification.read && (
                    <button
                      className="notifications-mark-read"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Notifications
