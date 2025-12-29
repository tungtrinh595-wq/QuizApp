import { Router } from 'express'

import { HTTP_STATUS } from '../constants/index.js'
import { emitToRoom } from '../utils/utils.js'

const router = Router()

const handleQuizEvent = (req, res, eventName) => {
	const { quiz } = req.body
	const subjectId = quiz?.subject?.id || quiz?.subject
	if (subjectId) {
		req.body.subjectId = subjectId
		emitToRoom(req, `subject-${subjectId}`, eventName)
	}
	res.status(HTTP_STATUS.OK).json()
}

router.post('/created', (req, res) => {
	handleQuizEvent(req, res, 'quiz-created')
})

router.post('/updated', (req, res) => {
	handleQuizEvent(req, res, 'quiz-updated')
})

router.post('/deleted', (req, res) => {
	handleQuizEvent(req, res, 'quiz-deleted')
})

export default router
