import express from 'express'
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
} from '../controllers/teamController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All team routes are protected
router.use(protect)

router.get('/', getAllTeams)
router.get('/:id', getTeamById)
router.post('/', createTeam)
router.put('/:id', updateTeam)
router.delete('/:id', deleteTeam)
router.post('/:id/members', addMember)
router.delete('/:id/members/:memberId', removeMember)

export default router
