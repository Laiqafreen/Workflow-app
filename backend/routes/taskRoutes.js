import express from 'express'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus
} from '../controllers/taskController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All task routes are protected
router.use(protect)

router.get('/', getAllTasks)
router.get('/status/:status', getTasksByStatus)
router.get('/:id', getTaskById)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
