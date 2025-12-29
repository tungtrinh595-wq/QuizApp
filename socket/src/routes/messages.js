import { Router } from 'express'

import { HTTP_STATUS } from '../constants/index.js'
import { emitToRoom } from '../utils/utils.js'

const router = Router()

const handleMessageEvent = (req, res, eventName) => {
	const { message } = req.body
	const lessonId = message?.lesson?.id || message?.lesson
	if (lessonId) {
		req.body.lessonId = lessonId
		emitToRoom(req, `lesson-${lessonId}`, eventName)
	}
	res.status(HTTP_STATUS.OK).json()
}

router.post('/created', (req, res) => {
	handleMessageEvent(req, res, 'message-created')
})

router.post('/updated', (req, res) => {
	handleMessageEvent(req, res, 'message-updated')
})

router.post('/deleted', (req, res) => {
	handleMessageEvent(req, res, 'message-deleted')
})

export default router
