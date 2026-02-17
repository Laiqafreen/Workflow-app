import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateProfile,
  getMe,
  deleteUser
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All user routes are protected except profile update
router.get('/', protect, getAllUsers)
router.get('/me', protect, getMe)
router.get('/:id', protect, getUserById)
router.put('/profile', protect, updateProfile)
router.delete('/:id', protect, deleteUser)

export default router
