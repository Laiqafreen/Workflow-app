import Task from '../models/Task.js'
import Project from '../models/Project.js'

export const getStats = async (req, res) => {
  try {
    const userId = req.userId

    // Fetch Projects
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }]
    })

    // Fetch Tasks
    const tasks = await Task.find({
      $or: [
        { createdBy: userId },
        { assignee: userId }
      ]
    })

    // Project Stats
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const activeProjects = projects.filter(p => p.status === 'in-progress').length

    // Task Stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const pendingTasks = tasks.filter(t => t.status === 'todo').length
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length

    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length
    const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length
    const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Weekly Progress
    const weeklyProgress = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Start of day
      const startOfDay = new Date(date.setHours(0, 0, 0, 0))
      // End of day
      const endOfDay = new Date(date.setHours(23, 59, 59, 999))

      const completedCount = tasks.filter(t => {
        const completedDate = new Date(t.updatedAt) // Assuming tasks are marked completed and updatedAt reflects that
        return t.status === 'completed' && completedDate >= startOfDay && completedDate <= endOfDay
      }).length

      weeklyProgress.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount
      })
    }

    res.status(200).json({
      projects: {
        total: totalProjects,
        completed: completedProjects,
        active: activeProjects
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks
      },
      completionRate,
      tasksByStatus: {
        todo: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks
      },
      tasksByPriority: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks
      },
      weeklyProgress
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
