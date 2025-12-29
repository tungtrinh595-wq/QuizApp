import { Router } from 'express'
import { HTTP_STATUS } from '../constants/index.js'
import { emitToRoom } from '../utils/utils.js'

const router = Router()

const handleResultEvent = (req, res, eventName) => {
	const { result } = req.body
	const quizId = result?.quiz?.id || result?.quiz
	if (quizId) {
		req.body.quizId = quizId
		emitToRoom(req, `quiz-${quizId}`, eventName)
	}
	res.status(HTTP_STATUS.OK).json()
}

router.post('/created', (req, res) => {
	handleResultEvent(req, res, 'result-created')
})

router.post('/updated', (req, res) => {
	handleResultEvent(req, res, 'result-updated')
})

router.post('/deleted', (req, res) => {
	handleResultEvent(req, res, 'result-deleted')
})

export default router
