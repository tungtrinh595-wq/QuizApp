import * as quizService from '../services/quizzes.js'
import { LIMIT_QUERY_DEFAULT } from '../constants/index.js'
import { NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachQuizzes = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	const { quizzes, total } = await quizService.findQuizzes({ queryRequest: req.query, page, limit })
	req.quizzes = quizzes
	req.pagination = { page, limit, total }
	next()
}

export const attachAllQuizzes = async (req, res, next) => {
	const { quizzes, total } = await quizService.findAllQuizzes()
	req.quizzes = quizzes
	req.total = total
	next()
}

export const attachSubjectQuizzes = async (req, res, next) => {
	const subjectId = req.foundSubject.id
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	const queryTotal = parseInt(req.query.total) || null

	const { quizzes, total } = await quizService.findSubjectQuizzes({
		subjectId,
		page,
		limit,
		queryTotal,
	})
	req.quizzes = quizzes
	req.pagination = { page, limit, total }
	next()
}

export const attachQuizById =
	(paramName = 'id', withDetails = true, withCorrectAnswers = true) =>
	async (req, res, next) => {
		const quizId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!quizId) throw new UnprocessableEntityError('ID bài thi bị thiếu')

		const foundQuiz = await quizService.findQuizById(quizId, withDetails, withCorrectAnswers)
		if (!foundQuiz) throw new NotFoundError('Không tìm thấy bài thi')
		req.foundQuiz = foundQuiz
		next()
	}

export const attachQuizBySlug =
	(paramName = 'slug', withDetails = true, withCorrectAnswers = true) =>
	async (req, res, next) => {
		const slug = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!slug) throw new UnprocessableEntityError('slug không hợp lệ')

		const foundQuiz = await quizService.findQuizBySlug(slug, withDetails, withCorrectAnswers)
		if (!foundQuiz) throw new NotFoundError('Không tìm thấy bài thi')
		req.foundQuiz = foundQuiz
		next()
	}

export const attachListQuizQuestions =
	(paramName = 'orderList', withDetails = false) =>
	async (req, res, next) => {
		let rawList = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!rawList) throw new UnprocessableEntityError('Danh sách câu hỏi bị thiếu')

		if (typeof rawList === 'string') {
			try {
				rawList = JSON.parse(rawList)
			} catch (err) {
				throw new BadRequestError('Danh sách câu hỏi không hợp lệ (không thể parse JSON)')
			}
		}

		const quizQuestionIds = Array.isArray(rawList)
			? rawList.map((q) => (typeof q === 'object' ? q.id : q))
			: rawList
		req.foundQuizQuestions = await quizService.findListQuizQuestions(quizQuestionIds, withDetails)
		if (!req.foundQuizQuestions || req.foundQuizQuestions.length === 0) {
			throw new NotFoundError('Không tìm thấy câu hỏi')
		}

		const foundIds = req.foundQuizQuestions.map((q) => q.id.toString())
		const missingIds = quizQuestionIds.filter((id) => !foundIds.includes(id))
		if (missingIds.length > 0) {
			throw new BadRequestError(`ID các câu hỏi không hợp lệ: ${missingIds.join(', ')}`)
		}

		next()
	}
