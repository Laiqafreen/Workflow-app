import Task from '../models/Task.js'

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.userId })
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('project', 'title')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email')

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    res.status(200).json({
      success: true,
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, assignee, project, dueDate } = req.body

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignee,
      project,
      dueDate,
      createdBy: req.userId
    })

    const populatedTask = await task.populate('assignee', 'name email avatar').populate('createdBy', 'name email').populate('project', 'title').execPopulate()

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    // Check if user is task creator
    if (task.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      })
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('project', 'title')

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    // Check if user is task creator
    if (task.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getTasksByStatus = async (req, res, next) => {
  try {
    const { status } = req.params

    const tasks = await Task.find({ createdBy: req.userId, status })
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
