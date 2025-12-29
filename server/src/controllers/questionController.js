import { HTTP_STATUS } from '../constants/index.js'
import * as questionService from '../services/questions.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getSubjectQuestions = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({
		questions: req.questions,
		total: req.total,
	})
}

export const getQuestion = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ question: req.foundQuestion })
}

export const createNewQuestion = async (req, res) => {
	const payload = {
		...req.body,
		user: req.user,
		subject: req.foundSubject,
	}
	const question = await questionService.createNewQuestion(payload)
	safeSocketPost('/question/created', { emitter: req.user, question })
	res.status(HTTP_STATUS.CREATED).json({ question })
}

export const updateQuestion = async (req, res) => {
	const payload = {
		...req.body,
		subject: req.foundSubject,
		foundQuestion: req.foundQuestion,
	}
	const question = await questionService.updateQuestion(req.foundQuestion.id, payload)
	safeSocketPost('/question/updated', { emitter: req.user, question })
	res.status(HTTP_STATUS.OK).json({ question })
}

export const deleteQuestion = async (req, res) => {
	await questionService.deleteQuestion(req.foundQuestion)
	safeSocketPost('/question/deleted', { emitter: req.user, question: req.foundQuestion })
	res.status(HTTP_STATUS.NO_CONTENT).json()
}
