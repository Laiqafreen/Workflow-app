import express from 'express'
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByTeam
} from '../controllers/projectController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All project routes are protected
router.use(protect)

router.get('/', getAllProjects)
router.get('/team/:teamId', getProjectsByTeam)
router.get('/:id', getProjectById)
router.post('/', createProject)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router
