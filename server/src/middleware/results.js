import * as resultService from '../services/results.js'
import { LIMIT_QUERY_DEFAULT, QUIZ_TYPE } from '../constants/index.js'
import { NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachQuizResults = async (req, res, next) => {
	const { _id, id } = req.foundQuiz || {}
	const quizId = _id ?? id
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	const { results, total } = await resultService.findQuizResults({
		quizId,
		queryRequest: req.query,
		page,
		limit,
	})
	req.results = results
	req.pagination = { page, limit, total }
	next()
}

export const attachAllQuizResults = async (req, res, next) => {
	const { _id, id, type } = req.foundQuiz || {}
	const quizId = _id ?? id
	const page = 1
	const withDetails = type === QUIZ_TYPE.SURVEY
	const { results, total } = await resultService.findAllQuizResults(quizId, withDetails)
	req.results = results
	req.pagination = { page, limit: total, total }
	next()
}

export const attachResultById =
	(paramName = 'id', withDetails = true) =>
	async (req, res, next) => {
		const resultId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!resultId) throw new UnprocessableEntityError('ID kết quả bị thiếu')

		req.foundResult = await resultService.findResultById(resultId, withDetails)
		if (!req.foundResult) throw new NotFoundError('Không tìm thấy kết quả bài kiểm tra')
		next()
	}

export const attachResultByUserAndQuizId =
	(paramName = 'id', withDetails = true, throwError = false) =>
	async (req, res, next) => {
		const quizId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!quizId) throw new UnprocessableEntityError('ID bài kiểm tra bị thiếu')

		const userId = req.user.id
		req.foundResult = await resultService.findResultByUserAndQuizId(userId, quizId, withDetails)
		if (throwError && !req.foundResult)
			throw new NotFoundError('Không tìm thấy kết quả bài kiểm tra')
		next()
	}

export const attachResultsByUserId =
	(paramName = 'id', withDetails = true, throwError = false) =>
	async (req, res, next) => {
		const userId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!userId) throw new UnprocessableEntityError('ID người dùng bị thiếu')

		const { results, total } = await resultService.findResultsByUserId(userId, withDetails)
		req.results = results
		req.total = total

		if (throwError && req.foundResults?.length === 0)
			throw new NotFoundError('Không tìm thấy bất kỳ kết quả bài kiểm tra nào')
		next()
	}

export const attachMyResults =
	(withDetails = true, throwError = false) =>
	async (req, res, next) => {
		const userId = req.user.id
		const { results, total } = await resultService.findResultsByUserId(userId, withDetails)
		req.results = results
		req.total = total

		if (throwError && req.foundResults?.length === 0)
			throw new NotFoundError('Không tìm thấy bất kỳ kết quả bài kiểm tra nào')
		next()
	}
