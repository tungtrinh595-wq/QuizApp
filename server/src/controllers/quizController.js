import { HTTP_STATUS } from '../constants/index.js'
import * as quizService from '../services/quizzes.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getQuizzes = async (req, res) => {
	const { page, limit, total } = req.pagination
	res.status(HTTP_STATUS.OK).json({
		quizzes: req.quizzes,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
	})
}

export const getAllQuizzes = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({
		quizzes: req.quizzes,
		total: req.total,
	})
}

export const getSubjectQuizzes = async (req, res) => {
	const quizzes = req.quizzes.map((q) => q.toJSON())
	const { page, limit, total } = req.pagination
	res.status(HTTP_STATUS.OK).json({
		quizzes,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
		hasMore: page * limit < total,
	})
}

export const publicQuiz = async (req, res) => {
	const { isPublished, quiz, result, message } = await quizService.publicQuiz({
		quiz: req.foundQuiz,
		user: req.user,
	})
	let quizDetails = quiz

	if (!isPublished) {
		return res.status(HTTP_STATUS.OK).json({
			isPublished,
			message,
		})
	}

	if (quiz.isRandom && quiz.randomCount > 0) {
		const quizQuestions = quiz.quizQuestions
		if (!Array.isArray(quizQuestions)) quizDetails.quizQuestions = []

		const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
		quizDetails.quizQuestions = shuffled.slice(0, quiz.randomCount)
	}

	safeSocketPost('/result/created', { emitter: req.user, result })
	res.status(HTTP_STATUS.OK).json({
		isPublished,
		quiz,
		result,
	})
}

export const getQuiz = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ quiz: req.foundQuiz })
}

export const createNewQuiz = async (req, res) => {
	const payload = {
		...req.body,
		user: req.user,
		subject: req.foundSubject,
		questions: req.foundQuestions,
		file: req.file,
	}
	const quiz = await quizService.createNewQuiz(payload)
	safeSocketPost('/quiz/created', { emitter: req.user, quiz })
	res.status(HTTP_STATUS.CREATED).json({ quiz })
}

export const updateQuiz = async (req, res) => {
	const payload = {
		...req.body,
		subject: req.foundSubject,
		questions: req.foundQuestions,
		file: req.file,
	}
	const quiz = await quizService.updateQuiz(req.foundQuiz, payload)
	safeSocketPost('/quiz/updated', { emitter: req.user, quiz })
	res.status(HTTP_STATUS.OK).json({ quiz })
}

export const addQuestionToQuiz = async (req, res) => {
	const payload = { quiz: req.foundQuiz, question: req.foundQuestion }
	const quizQuestion = await quizService.addQuestionToQuiz(payload)
	res.status(HTTP_STATUS.OK).json({ quizQuestion: quizQuestion })
}

export const bulkAddQuizQuestions = async (req, res) => {
	const payload = { quiz: req.foundQuiz, questions: req.body.questions, user: req.user }
	const quizQuestions = await quizService.bulkAddQuizQuestions(payload)
	res.status(HTTP_STATUS.OK).json({ quizQuestions })
}

export const reorderQuizQuestions = async (req, res) => {
	const quizQuestions = await quizService.updateQuizQuestionsOrder(req.body)
	res.status(HTTP_STATUS.OK).json({ quizQuestions })
}

export const deleteQuiz = async (req, res) => {
	await quizService.deleteQuiz(req.foundQuiz)
	safeSocketPost('/quiz/deleted', { emitter: req.user, quiz: req.foundQuiz })
	res.status(HTTP_STATUS.NO_CONTENT).json()
}

export const removeQuestionFromQuiz = async (req, res) => {
	const payload = { quiz: req.foundQuiz, question: req.foundQuestion }
	await quizService.removeQuestionFromQuiz(payload)
	res.status(HTTP_STATUS.NO_CONTENT).json()
}
