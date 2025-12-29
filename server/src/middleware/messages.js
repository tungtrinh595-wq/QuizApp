import * as messageService from '../services/messages.js'
import { LIMIT_QUERY_DEFAULT, ROLE } from '../constants/index.js'
import { ForbiddenError, NotFoundError, UnprocessableEntityError } from '../utils/errors.js'

export const attachMessageById =
	(paramName = 'id') =>
	async (req, res, next) => {
		const messageId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!messageId) throw new UnprocessableEntityError('Tham số không hợp lệ')

		req.foundMessage = await messageService.findMessageById(messageId)
		if (!req.foundMessage) throw new NotFoundError('Không tìm thấy tin nhắn')
		next()
	}

export const attachOptionalMessageById =
	(paramName = 'id') =>
	async (req, res, next) => {
		const messageId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!messageId) return next()

		req.foundMessage = await messageService.findMessageById(messageId)
		next()
	}

export const attachMessagesByCursor = async (req, res, next) => {
	const { cursor, limit } = req.query
	req.messages = await messageService.findMessagesByCursor({
		cursor,
		limit: parseInt(limit) || LIMIT_QUERY_DEFAULT,
	})
	next()
}

export const attachUserMessagesByCursor = async (req, res, next) => {
	const userId = req.foundUser.id
	const { cursor, limit } = req.query

	req.messages = await messageService.findUserMessagesByCursor({
		userId,
		cursor,
		limit: parseInt(limit) || LIMIT_QUERY_DEFAULT,
	})
	next()
}

export const attachLessonMessagesByCursor = async (req, res, next) => {
	const lessonId = req.foundLesson.id
	const { cursor } = req.query
	req.limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	req.messages = await messageService.findLessonMessagesByCursor({
		lessonId,
		cursor,
		limit: req.limit,
	})
	next()
}

export const checkOwnMessage = async (req, res, next) => {
	if (req.foundMessage.createdBy.id !== req.user.id)
		throw new ForbiddenError('Chỉ có chủ tài khoản mới được phép thực hiện hành động này!')
	next()
}

export const checkOwnOrAdmin = (req, res, next) => {
	if (req.foundMessage.createdBy.id !== req.user.id && req.user.role !== ROLE.ADMIN)
		throw new ForbiddenError(
			'Chỉ có chủ tài khoản hoặc quản trị viên mới được phép thực hiện hành động này!'
		)
	next()
}
