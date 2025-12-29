import { HTTP_STATUS, LIMIT_QUERY_DEFAULT } from '../constants/index.js'
import * as messageService from '../services/messages.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getMessages = async (req, res) => {
	const messages = req.messages
	const nextCursor = messages.length ? messages[messages.length - 1].id : null
	res.status(HTTP_STATUS.OK).json({
		messages,
		nextCursor,
		hasMore: messages.length === (parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT),
	})
}

export const getUserMessages = async (req, res) => {
	const messages = req.messages
	const nextCursor = messages.length ? messages[messages.length - 1].id : null
	res.status(HTTP_STATUS.OK).json({
		messages,
		nextCursor,
		hasMore: messages.length === (parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT),
	})
}

export const getLessonMessages = async (req, res) => {
	const limit = req.limit
	const messages = req.messages
	const hasMore = messages.length > limit
	const trimmedMessages = hasMore ? messages.slice(0, limit) : messages
	res.status(HTTP_STATUS.OK).json({
		messages: trimmedMessages,
		nextCursor: trimmedMessages.at(-1)?.id,
		hasMore,
	})
}

export const createNewMessage = async (req, res) => {
	const payload = {
		...req.body,
		lesson: req.foundLesson,
		user: req.user,
		parentMessage: req.foundMessage || null,
	}
	const { thread } = req.body
	const message = await messageService.createNewMessage(payload)
	safeSocketPost('/message/created', {
		emitter: req.user,
		message,
		thread,
	})
	res.status(HTTP_STATUS.CREATED).json({ message })
}

export const updateMessage = async (req, res) => {
	const { thread } = req.body
	const message = await messageService.updateMessage(req.foundMessage.id, req.body)
	safeSocketPost('/message/updated', {
		emitter: req.user,
		message,
		thread,
	})
	res.status(HTTP_STATUS.OK).json({ message })
}

export const deleteMessage = async (req, res) => {
	const { thread } = await messageService.deleteMessage(req.foundMessage.id)
	safeSocketPost('/message/deleted', {
		emitter: req.user,
		message: req.foundMessage,
		thread,
	})
	res.status(HTTP_STATUS.NO_CONTENT).json()
}

export const deleteOrphanMessages = async (req, res) => {
	const result = await messageService.deleteOrphanMessages()
	res.status(HTTP_STATUS.OK).json(result)
}
