import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import taskService from "../services/taskService"
import userService from "../services/userService"
import projectService from "../services/projectService"

function CreateTask() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])

  // Search state for users
  const [userSearch, setUserSearch] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assignee: "", // stores ID
    project: "" // stores ID
  })

  // To display selected user name
  const [selectedUserName, setSelectedUserName] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getAllProjects()
        // Matches Projects.jsx logic
        if (res.data && Array.isArray(res.data)) {
          setProjects(res.data)
        } else {
          console.warn("Unexpected projects response:", res)
          setProjects([])
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err)
      }
    }

    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers()
        // Tries to handle common patterns: {data: []} or just [] or {users: []}
        if (res.data && Array.isArray(res.data)) {
          setUsers(res.data)
        } else if (Array.isArray(res)) {
          setUsers(res)
        } else if (res.users && Array.isArray(res.users)) {
          setUsers(res.users)
        } else {
          setUsers([])
        }
      } catch (err) {
        console.error("Failed to fetch users:", err)
      }
    }

    fetchProjects()
    fetchUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUserSelect = (user) => {
    setFormData(prev => ({ ...prev, assignee: user._id }))
    setSelectedUserName(user.name)
    setUserSearch(user.name)
    setShowUserDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Please enter a task title")
      return
    }
    if (!formData.assignee) {
      alert("Please assign the task to a user")
      return
    }
    if (!formData.project) {
      alert("Please select a project")
      return
    }
    if (!formData.dueDate) {
      alert("Please select a due date")
      return
    }

    try {
      setLoading(true)
      // Sending data matching backend schema: title, description, status, priority, assignee, project, dueDate
      await taskService.createTask(formData)
      navigate("/tasks")
    } catch (err) {
      console.error(err)
      alert(err.message || "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="create-task-page">
        <div className="create-task-header">
          <h1 className="create-task-title">Create New Task</h1>
        </div>

        <form className="create-task-form" onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>
                    {/* Fallback to name if title is missing, supporting user request */}
                    {p.title || p.name || "Untitled Project"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Assignee (Search)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search user..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value)
                  setShowUserDropdown(true)
                  if (formData.assignee) setFormData(prev => ({ ...prev, assignee: '' }))
                }}
                onFocus={() => setShowUserDropdown(true)}
              />
              {showUserDropdown && userSearch && (
                <div className="user-dropdown" style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'white', border: '1px solid #e2e8f0',
                  maxHeight: '200px', overflowY: 'auto', zIndex: 10,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {users.filter(u => (u.name || "").toLowerCase().includes(userSearch.toLowerCase())).map(user => (
                    <div
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                      style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                      className="user-dropdown-item"
                    >
                      {user.name} <small style={{ color: '#64748b' }}>({user.email})</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/tasks")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default CreateTask
