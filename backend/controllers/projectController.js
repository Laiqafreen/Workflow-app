import Project from '../models/Project.js'

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id })
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar')

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    res.status(200).json({
      success: true,
      data: project
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createProject = async (req, res, next) => {
  try {
    const { title, description, status, progress, dueDate, team, members } = req.body

    const project = await Project.create({
      title,
      description,
      status,
      progress,
      dueDate,
      team,
      members: members || [],
      createdBy: req.user._id
    })

    const populatedProject = await Project.findById(project._id)
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar')

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populatedProject
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({
        success: false,
        error: messages
      })
    }
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      })
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar')

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      })
    }

    await Project.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getProjectsByTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params

    const projects = await Project.find({ createdBy: req.user._id, team: teamId })
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
