import express from 'express'
import { getStats } from '../controllers/statsController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All stats routes are protected
router.use(protect)

router.get('/', getStats)

export default router
