import { Router } from 'express'

import { HTTP_STATUS } from '../constants/index.js'
import { emitToRoom } from '../utils/utils.js'

const router = Router()

router.post('/created', (req, res) => {
	emitToRoom(req, 'users', 'user-created')
	res.status(HTTP_STATUS.OK).json()
})

router.post('/updated', (req, res) => {
	emitToRoom(req, 'users', 'user-updated')
	res.status(HTTP_STATUS.OK).json()
})

router.post('/deleted', (req, res) => {
	emitToRoom(req, 'users', 'user-deleted')
	res.status(HTTP_STATUS.OK).json()
})

export default router
