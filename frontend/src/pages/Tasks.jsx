import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import taskService from "../services/taskService"
import userService from "../services/userService"
import projectService from "../services/projectService"

function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([]) // For selection
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Edit Modal State
  const [editingTask, setEditingTask] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Search state for edit modal assignee
  const [userSearch, setUserSearch] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    project: "",
    dueDate: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, usersRes, projectsRes] = await Promise.all([
          taskService.getAllTasks(),
          userService.getAllUsers(),
          projectService.getAllProjects()
        ])

        if (tasksRes.success) setTasks(tasksRes.data || [])
        else setTasks([])

        if (usersRes.success) setMembers(usersRes.data || [])
        else setMembers([])

        if (projectsRes) setProjects(projectsRes.data || [])

      } catch (err) {
        console.error("Failed to fetch data:", err)
        setTasks([])
        setMembers([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleEditClick = (task) => {
    setEditingTask(task)
    const assigneeName = task.assignee?.name || ""
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee?._id || "",
      project: task.project?._id || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""
    })
    setUserSearch(assigneeName)
    setIsEditModalOpen(true)
  }

  const handleEditClose = () => {
    setIsEditModalOpen(false)
    setEditingTask(null)
    setShowUserDropdown(false)
  }

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(id)
        setTasks(tasks.filter(t => t._id !== id))
      } catch (err) {
        alert("Failed to delete task")
      }
    }
  }

  const handleUserSelect = (user) => {
    setFormData(prev => ({ ...prev, assignee: user._id }))
    setUserSearch(user.name)
    setShowUserDropdown(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const res = await taskService.updateTask(editingTask._id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        project: formData.project,
        dueDate: formData.dueDate
      })

      if (res.success) {
        setTasks(tasks.map(t =>
          t._id === editingTask._id
            ? res.data // Use returned updated task
            : t
        ))
        handleEditClose()
      } else {
        throw new Error(res.message || "Failed to update task")
      }
    } catch (err) {
      console.error("Error updating task:", err)
      alert("Error updating task: " + (err.response?.data?.message || err.message))
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "priority-high"
      case "medium": return "priority-medium"
      case "low": return "priority-low"
      default: return ""
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "status-completed"
      case "in-progress": return "status-in-progress"
      case "todo": return "status-todo"
      default: return ""
    }
  }

  return (
    <Layout>
      <div className="tasks-page">
        <div className="tasks-header">
          <div>
            <h1 className="tasks-title">Tasks</h1>
            <p className="tasks-subtitle">Manage and track your tasks</p>
          </div>

        </div>

        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <div className="task-info">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEditClick(task)} aria-label="Edit task">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteClick(task._id)} aria-label="Delete task">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="task-description">{task.description}</p>

                <div style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.5rem 0" }}>
                  Project: <strong>{task.project?.title || "Unassigned"}</strong>
                </div>

                <div className="task-footer">
                  <div className="task-meta">
                    <span className={`task-status ${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ")}
                    </span>
                    <span className="task-due-date">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="task-assignee">
                    {task.assignee?.avatar ? (
                      <img src={task.assignee.avatar} alt={task.assignee.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                        {task.assignee?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span style={{ marginLeft: '0.5rem' }}>{task.assignee?.name || "Unassigned"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isEditModalOpen && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '2rem', borderRadius: '8px', width: '500px', maxWidth: '90%'
            }}>
              <h2>Edit Task</h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label>Title</label>
                  <input name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div>
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.5rem' }}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Priority</label>
                    <select name="priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={{ width: '100%', padding: '0.5rem' }}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Project</label>
                  <select name="project" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} style={{ width: '100%', padding: '0.5rem' }}>
                    <option value="">Select Project</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div style={{ position: 'relative' }}>
                  <label>Assignee (Search)</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '0.5rem' }}
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
                      maxHeight: '150px', overflowY: 'auto', zIndex: 10,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      {members.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase())).map(user => (
                        <div
                          key={user._id}
                          onClick={() => handleUserSelect(user)}
                          style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                        >
                          {user.name} <small>({user.email})</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label>Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={handleEditClose} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Tasks
