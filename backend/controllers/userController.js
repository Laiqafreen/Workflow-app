import User from '../models/User.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name email avatar role -password')
      .sort({ name: 1 })

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar, role } = req.body

    // Find user
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        })
      }
      user.email = email
    }

    // Update allowed fields
    if (name) user.name = name
    if (avatar) user.avatar = avatar
    if (role && role !== 'user') {
      // Only admins can change roles (this check could be enhanced with authorize middleware)
      user.role = role
    }

    await user.save()

    // Remove password from response
    user.password = undefined

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Soft delete - mark as inactive instead of removing
    user.isActive = false
    await user.save()

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
