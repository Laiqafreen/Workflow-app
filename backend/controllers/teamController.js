import Team from '../models/Team.js'
import User from '../models/User.js'

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ createdBy: req.userId })
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.status(200).json({
      success: true,
      data: team
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const createTeam = async (req, res, next) => {
  try {
    const { name, description, members } = req.body

    const team = await Team.create({
      name,
      description,
      members: members || [],
      createdBy: req.userId
    })

    const populatedTeam = await team.populate('members', 'name email avatar role').populate('createdBy', 'name email')

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: populatedTeam
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateTeam = async (req, res, next) => {
  try {
    let team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check if user is team creator
    if (team.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this team'
      })
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email')

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: team
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const addMember = async (req, res, next) => {
  try {
    const { memberId } = req.body
    const team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check if user is team creator
    if (team.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members to this team'
      })
    }

    // Check if member already exists
    if (team.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: 'Member already in team'
      })
    }

    team.members.push(memberId)
    await team.save()

    const populatedTeam = await team.populate('members', 'name email avatar role').populate('createdBy', 'name email')

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: populatedTeam
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.body
    const team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check if user is team creator
    if (team.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove members from this team'
      })
    }

    team.members = team.members.filter(id => id.toString() !== memberId)
    await team.save()

    const populatedTeam = await team.populate('members', 'name email avatar role').populate('createdBy', 'name email')

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: populatedTeam
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check if user is team creator
    if (team.createdBy.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this team'
      })
    }

    await Team.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
