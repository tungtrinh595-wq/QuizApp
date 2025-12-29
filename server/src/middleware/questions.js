import * as questionService from '../services/questions.js'
import { BadRequestError, NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachSubjectQuestions = async (req, res, next) => {
	const subjectId = req.foundSubject.id
	const { questions, total } = await questionService.findSubjectQuestions(subjectId)
	req.questions = questions
	req.total = total
	next()
}

export const attachQuestionById =
	(paramName = 'id', withDetails = true) =>
	async (req, res, next) => {
		const questionId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!questionId) throw new UnprocessableEntityError('ID cho câu hỏi bị thiếu')

		req.foundQuestion = await questionService.findQuestionById(questionId, withDetails)
		if (!req.foundQuestion) throw new NotFoundError('Không tìm thấy câu hỏi')
		next()
	}

export const attachListQuestions =
	(paramName = 'questionIds', { withDetails = false, parseJsonIfString = true } = {}) =>
	async (req, res, next) => {
		let rawList = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!rawList) throw new UnprocessableEntityError('Danh sách câu hỏi bị thiếu')

		if (parseJsonIfString && typeof rawList === 'string') {
			try {
				rawList = JSON.parse(rawList)
			} catch (err) {
				throw new BadRequestError('Danh sách câu hỏi không hợp lệ (không thể parse JSON)')
			}
		}

		const questionIds = Array.isArray(rawList)
			? rawList.map((q) => (typeof q === 'object' ? q.id : q))
			: rawList

		req.foundQuestions = await questionService.findListQuestions(questionIds, withDetails)
		if (!req.foundQuestions || req.foundQuestions.length === 0) {
			throw new NotFoundError('Không tìm thấy câu hỏi')
		}

		const foundIds = req.foundQuestions.map((q) => q.id.toString())
		const missingIds = questionIds.filter((id) => !foundIds.includes(id))
		if (missingIds.length > 0) {
			throw new BadRequestError(`ID các câu hỏi không hợp lệ: ${missingIds.join(', ')}`)
		}

		next()
	}
