import express from 'express'
import { sendRequest, getRequests, acceptRequest, rejectRequest } from '../controllers/connectionController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/', sendRequest)
router.get('/', getRequests)
router.put('/:id/accept', acceptRequest)
router.delete('/:id', rejectRequest)

export default router
