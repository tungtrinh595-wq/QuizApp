import { HTTP_STATUS } from '../constants/index.js'
import * as resultService from '../services/results.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getQuizResults = async (req, res) => {
	const { page, limit, total } = req.pagination
	res.status(HTTP_STATUS.OK).json({
		results: req.results,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
		hasMore: page * limit < total,
	})
}

export const getResult = async (req, res) => {
	const result = req.foundResult
	const quiz = req.foundQuiz
	res.status(HTTP_STATUS.OK).json({ result, quiz })
}

export const getResults = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ results: req.results, total: req.total })
}

export const submitResult = async (req, res) => {
	const payload = {
		...req.body,
		quiz: req.foundQuiz,
	}
	const { result, quiz, message } = await resultService.submitResult(req.foundResult, payload)
	safeSocketPost('/result/updated', { emitter: req.user, result, quiz, message })
	res.status(HTTP_STATUS.OK).json({ result, quiz, message })
}

export const deleteResult = async (req, res) => {
	await resultService.deleteResult(req.foundResult)
	safeSocketPost('/result/deleted', { emitter: req.user, result: req.foundResult })
	res.status(HTTP_STATUS.NO_CONTENT).json()
}
