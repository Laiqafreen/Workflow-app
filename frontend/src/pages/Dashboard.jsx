import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import taskService from "../services/taskService"
import statsService from "../services/statsService"
import userService from "../services/userService"

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [members, setMembers] = useState([]) // Placeholder for now

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Use services to fetch data
      const [tasksData, statsData] = await Promise.all([
        taskService.getAllTasks(),
        statsService.getDashboardStats()
      ])

      // Handle tasks
      if (tasksData.success) {
        setTasks(tasksData.data || [])
      } else {
        setTasks([])
      }

      // Handle stats
      if (statsData) {
        setStats(statsData)
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err)
      // Set default values on error
      setTasks([])
      setStats({
        totalTasks: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0
      })
    }
  }

  const handleEditOpen = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee?._id || task.assignee,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0]
    })
    setErrors({})

    // Also fetch users for dropdown if we haven't already
    if (members.length === 0) {
      userService.getAllUsers().then(res => {
        setMembers(res.data || [])
      }).catch(err => console.error(err))
    }
  }

  const handleEditClose = () => {
    setEditingTask(null)
    setFormData({})
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title?.trim()) newErrors.title = "Title is required"
    if (!formData.description?.trim()) newErrors.description = "Description is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      const res = await taskService.updateTask(editingTask._id, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        assignee: formData.assignee,
        dueDate: formData.dueDate
      })

      if (res.success) {
        // Update tasks locally for immediate UI update
        setTasks(tasks.map(t =>
          t._id === editingTask._id
            ? res.data
            : t
        ))

        // Also update stats if status changed
        if (editingTask.status !== formData.status) {
          fetchDashboardData() // Refresh stats to be accurate
        }

        handleEditClose()
      } else {
        throw new Error(res.message || "Failed to update task")
      }
    } catch (err) {
      console.error("Error updating task:", err)
      alert("Error updating task: " + (err.response?.data?.message || err.message))
    }
  }

  const activeTasks = tasks.filter(t => t.status !== "completed")
  const paginatedTasks = activeTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(activeTasks.length / itemsPerPage)

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
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your tasks and progress</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="dashboard-card-label">Total Tasks</div>
              <div className="dashboard-card-value">{stats.totalTasks}</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="dashboard-card-label">In Progress</div>
              <div className="dashboard-card-value">{stats.inProgress}</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="dashboard-card-label">Completed</div>
              <div className="dashboard-card-value">{stats.completed}</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <div className="dashboard-card-label">High Priority</div>
              <div className="dashboard-card-value">{stats.highPriority}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Active Tasks</h2>

          <div className="dashboard-table-body">
            {paginatedTasks.map(task => (
              <div
                key={task._id}
                className="dashboard-table-row"
                onClick={() => handleEditOpen(task)}
                style={{ cursor: 'pointer' }}
              >
                <div className="dashboard-task-title">{task.title}</div>
                <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                <span>{task.progress || 0}%</span>
                <span>{task.assignee?.avatar || 'N/A'}</span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="dashboard-pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div>
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {editingTask && (
          <div className="tasks-modal-overlay" onClick={handleEditClose}>
            <div className="tasks-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tasks-modal-header">
                <h2 className="tasks-modal-title">Edit Task</h2>
                <button
                  className="tasks-modal-close"
                  onClick={handleEditClose}
                  aria-label="Close modal"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="tasks-modal-body">
                <div className="tasks-modal-field">
                  <label htmlFor="title" className="tasks-modal-label">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    className={`tasks-modal-input ${errors.title ? "error" : ""}`}
                  />
                  {errors.title && <div className="tasks-modal-error">{errors.title}</div>}
                </div>

                <div className="tasks-modal-field">
                  <label htmlFor="description" className="tasks-modal-label">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows="4"
                    className={`tasks-modal-textarea ${errors.description ? "error" : ""}`}
                  />
                  {errors.description && <div className="tasks-modal-error">{errors.description}</div>}
                </div>

                <div className="tasks-modal-row">
                  <div className="tasks-modal-field">
                    <label htmlFor="status" className="tasks-modal-label">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status || ""}
                      onChange={handleChange}
                      className="tasks-modal-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="tasks-modal-field">
                    <label htmlFor="priority" className="tasks-modal-label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority || ""}
                      onChange={handleChange}
                      className="tasks-modal-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="tasks-modal-row">
                  <div className="tasks-modal-field">
                    <label htmlFor="assignee" className="tasks-modal-label">
                      Assignee
                    </label>
                    <select
                      id="assignee"
                      name="assignee"
                      value={formData.assignee || ""}
                      onChange={handleChange}
                      className="tasks-modal-select"
                    >
                      <option value="">Select assignee</option>
                      {members.map(member => (
                        <option key={member.id} value={member.name}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="tasks-modal-field">
                    <label htmlFor="dueDate" className="tasks-modal-label">
                      Due Date <span className="required">*</span>
                    </label>
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate || ""}
                      onChange={handleChange}
                      className={`tasks-modal-input ${errors.dueDate ? "error" : ""}`}
                    />
                    {errors.dueDate && <div className="tasks-modal-error">{errors.dueDate}</div>}
                  </div>
                </div>
              </div>

              <div className="tasks-modal-footer">
                <button
                  className="tasks-modal-button tasks-modal-button-secondary"
                  onClick={handleEditClose}
                >
                  Cancel
                </button>
                <button
                  className="tasks-modal-button tasks-modal-button-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
