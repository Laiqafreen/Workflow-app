import User from '../models/User.js'
import { sendTokenResponse, generateToken } from '../utils/tokenHelper.js'

export const register = async (req, res, next) => {
  try {
    console.log('Register request body:', req.body)
    const { name, email, password, role } = req.body

    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      })
    }

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      })
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      avatar: name ? name.substring(0, 2).toUpperCase() : 'U'
    })

    sendTokenResponse(user, 201, res)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    sendTokenResponse(user, 200, res)
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

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
