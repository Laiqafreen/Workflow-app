import { useState } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import "../styles/dashboard.css"

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-main">
        <Navbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  )
}

export default Layout
