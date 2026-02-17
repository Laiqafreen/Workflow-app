import jwt from 'jsonwebtoken'
import { getJwtConfig } from '../config/jwt.js'

export const generateToken = (id) => {
  const config = getJwtConfig()
  return jwt.sign({ id }, config.secret, { expiresIn: config.expiresIn })
}

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id)

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }
  })
}
