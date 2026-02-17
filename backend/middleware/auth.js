import jwt from 'jsonwebtoken'
import { getJwtConfig } from '../config/jwt.js'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }

  try {
    const decoded = jwt.verify(token, getJwtConfig().secret)

    // Fetch user from database
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    req.userId = user._id
    req.user = user
    req.userRole = user.role
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.userRole should be set by protect middleware
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'User role is not authorized to access this route'
      })
    }
    next()
  }
}
