import { Router } from 'express'

import { HTTP_STATUS } from '../constants/index.js'
import { emitToRoom } from '../utils/utils.js'

const router = Router()

const handleQuestionEvent = (req, res, eventName) => {
	const { question } = req.body
	const subjectId = question?.subject?.id || question?.subject
	if (subjectId) {
		req.body.subjectId = subjectId
		emitToRoom(req, `subject-${subjectId}`, eventName)
	}
	res.status(HTTP_STATUS.OK).json()
}

router.post('/created', (req, res) => {
	handleQuestionEvent(req, res, 'question-created')
})

router.post('/updated', (req, res) => {
	handleQuestionEvent(req, res, 'question-updated')
})

router.post('/deleted', (req, res) => {
	handleQuestionEvent(req, res, 'question-deleted')
})

export default router
