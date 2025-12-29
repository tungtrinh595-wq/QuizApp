import { LIMIT_QUERY_DEFAULT, MAX_DEPTH, POPULATE } from '../constants/index.js'
import Message from '../models/Message.js'

export const buildMessageTree = async (message, depth = 0, maxDepth = MAX_DEPTH) => {
	const replies = await Message.find({ parentMessage: message.id })
		.sort({ _id: -1 })
		.populate(POPULATE.USER)
	const sanitizedMessage = {
		...message.toJSON(),
		createdBy: message.createdBy,
	}

	if (depth < maxDepth) {
		return {
			...sanitizedMessage,
			replies: await Promise.all(
				replies.map((reply) => buildMessageTree(reply, depth + 1, maxDepth))
			),
		}
	}
	return { ...sanitizedMessage, replies: [] }
}

export const findMessageById = async (messageId) => {
	const message = await Message.findById(messageId).populate(POPULATE.USER)
	if (message) {
		const tree = await buildMessageTree(message)
		return { ...tree }
	}
	return message
}

export const findMessagesByCursor = async ({ cursor, limit = LIMIT_QUERY_DEFAULT }) => {
	const query = cursor ? { _id: { $lt: cursor }, parentMessage: null } : { parentMessage: null }
	const messages = await Message.find(query).sort({ _id: -1 }).limit(limit).populate(POPULATE.USER)
	const messagesWithReplies = await Promise.all(
		messages.map(async (msg) => {
			const tree = await buildMessageTree(msg)
			return { ...tree }
		})
	)

	return messagesWithReplies
}

export const findUserMessagesByCursor = async ({ userId, cursor, limit = LIMIT_QUERY_DEFAULT }) => {
	const baseQuery = { createdBy: userId, parentMessage: null }
	const query = cursor ? { ...baseQuery, _id: { $lt: cursor } } : baseQuery
	const messages = await Message.find(query).sort({ _id: -1 }).limit(limit).populate(POPULATE.USER)
	const messagesWithReplies = await Promise.all(
		messages.map(async (msg) => {
			const tree = await buildMessageTree(msg)
			return { ...tree }
		})
	)
	return messagesWithReplies
}

export const findLessonMessagesByCursor = async ({
	lessonId,
	cursor,
	limit = LIMIT_QUERY_DEFAULT,
}) => {
	const baseQuery = { lesson: lessonId, parentMessage: null }
	const query = cursor ? { ...baseQuery, _id: { $lt: cursor } } : baseQuery
	const messages = await Message.find(query)
		.sort({ _id: -1 })
		.limit(limit + 1)
		.populate(POPULATE.USER)
	const messagesWithReplies = await Promise.all(
		messages.map(async (msg) => {
			const tree = await buildMessageTree(msg)
			return { ...tree }
		})
	)
	return messagesWithReplies
}

export const findMessageThreadIds = async (messageId) => {
	const threadIds = []

	let current = await Message.findById(messageId).select('_id parentMessage').lean()
	if (!current) return []

	threadIds.unshift(current._id.toString())

	while (current.parentMessage) {
		current = await Message.findById(current.parentMessage).select('_id parentMessage').lean()
		if (!current) return []
		threadIds.unshift(current._id.toString())
	}

	return threadIds
}

export const createNewMessage = async (request) => {
	const { text, lesson, user, parentMessage } = request
	const newMessage = {
		text,
		lesson: lesson.id,
		createdBy: user.id,
	}
	if (parentMessage?.id) newMessage.parentMessage = parentMessage.id
	const message = new Message(newMessage)
	await message.save()
	return await message.populate(POPULATE.USER)
}

export const collectReplyIds = async (rootIds) => {
	const idsToDelete = [...rootIds]
	const queue = [...rootIds]

	while (queue.length > 0) {
		const currentId = queue.pop()
		const replies = await Message.find({ parentMessage: currentId }).select('_id')

		for (const reply of replies) {
			idsToDelete.push(reply.id)
			queue.push(reply.id)
		}
	}

	return idsToDelete
}

export const updateMessage = async (id, request) => {
	const updates = {}
	if (request.text) updates.text = request.text
	return await Message.findByIdAndUpdate(id, { $set: updates }, { new: true }).populate(
		POPULATE.USER
	)
}

export const deleteMessage = async (messageId) => {
	const thread = await findMessageThreadIds(messageId)
	await Message.findByIdAndDelete(messageId)
	return { thread }
}

export const deleteLessonMessages = async (lessonId) => {
	const messages = await Message.find({ lesson: lessonId })
	const messageIds = messages.map((m) => m.id)
	const idsToDelete = await collectReplyIds([messageIds])
	if (idsToDelete.length > 0) {
		await Message.deleteMany({ _id: { $in: idsToDelete } })
	}
}

export const deleteUserMessages = async (userId) => {
	const messages = await Message.find({ createdBy: userId })
	const messageIds = messages.map((m) => m.id)
	const idsToDelete = await collectReplyIds([messageIds])
	if (idsToDelete.length > 0) {
		await Message.deleteMany({ _id: { $in: idsToDelete } })
	}
}

export const deleteOrphanMessages = async (req, res) => {
	const candidates = await Message.find({ parentMessage: { $ne: null } }).select(
		'_id parentMessage'
	)
	const orphanIds = []

	for (const msg of candidates) {
		const parentExists = await Message.exists({ _id: msg.parentMessage })
		if (!parentExists) {
			orphanIds.push(msg._id)

			const replyIds = await collectReplyIds([msg._id])
			orphanIds.push(...replyIds)
		}
	}

	return await Message.deleteMany({ _id: { $in: orphanIds } })
}
