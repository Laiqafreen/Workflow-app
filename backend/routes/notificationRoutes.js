import express from 'express'
import {
  getAllNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
} from '../controllers/notificationController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All notification routes are protected
router.use(protect)

router.get('/', getAllNotifications)
router.get('/unread', getUnreadNotifications)
router.post('/', createNotification)
router.put('/:id/read', markAsRead)
router.put('/mark/all-read', markAllAsRead)
router.delete('/:id', deleteNotification)

export default router
