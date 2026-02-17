import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import projectService from "../services/projectService"
import userService from "../services/userService"
import taskService from "../services/taskService"

function Projects() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
    members: []
  })

  useEffect(() => {
    fetchProjects()
    fetchUsers()
    fetchTasks()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAllProjects()
      setProjects(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers()
      setUsers(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await taskService.getAllTasks()
      setTasks(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleOpenModal = (project = null) => {
    if (project) {
      setCurrentProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : "",
        members: project.members ? project.members.map(m => m._id) : []
      })
    } else {
      setCurrentProject(null)
      setFormData({
        title: "",
        description: "",
        status: "todo",
        dueDate: "",
        members: []
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentProject(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'members') {
      const options = e.target.selectedOptions
      const values = []
      for (let i = 0; i < options.length; i++) {
        values.push(options[i].value)
      }
      setFormData(prev => ({ ...prev, members: values }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (currentProject) {
        await projectService.updateProject(currentProject._id, formData)
      } else {
        await projectService.createProject(formData)
      }
      fetchProjects()
      handleCloseModal()
    } catch (err) {
      alert(err.message || "Failed to save project")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return
    try {
      await projectService.deleteProject(id)
      fetchProjects()
    } catch (err) {
      console.error(err)
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
      <div className="projects-page">
        <div className="projects-header">
          <div>
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">View and manage your projects</p>
          </div>
          <button className="projects-add-button" onClick={() => handleOpenModal()}>
            + New Project
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const projectTaskCount = tasks.filter(t => t.project && (t.project._id === project._id || t.project === project._id)).length;

            return (
              <div key={project._id} className="projects-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="projects-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="projects-card-title" style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{project.title}</h3>
                  <span className={`status-badge ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <p className="projects-card-description" style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {project.description || "No description provided."}
                </p>

                <div className="projects-stats" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tasks</span>
                    <span style={{ color: '#0f172a' }}>{projectTaskCount}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</span>
                    <span style={{ color: '#0f172a' }}>{new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="projects-card-members">
                  <small style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.5rem' }}>Team Members</small>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: 'wrap' }}>
                    {project.members && project.members.length > 0 ? (
                      project.members.map(m => (
                        <div key={m._id} title={m.name} style={{ width: 28, height: 28, borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid white', boxShadow: '0 0 0 1px #e2e8f0' }}>
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No members assigned</span>
                    )}
                  </div>
                </div>

                <div className="projects-card-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleOpenModal(project)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: 'white',
                      color: '#475569',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid #fee2e2',
                      background: '#fef2f2',
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {isModalOpen && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              background: 'white', padding: '2rem', borderRadius: '8px', width: '500px', maxWidth: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>{currentProject ? "Edit Project" : "New Project"}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Title</label>
                  <input name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Due Date</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Assign Members (Multi-select)</label>
                  <select multiple name="members" value={formData.members} onChange={handleChange} style={{ width: '100%', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1', height: '120px' }}>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                  <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>Hold Ctrl (Windows) or Cmd (Mac) to select multiple users</small>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={handleCloseModal} style={{ padding: '0.625rem 1.25rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '0.625rem 1.25rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>{currentProject ? 'Update Project' : 'Create Project'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Projects
