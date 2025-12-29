import { Router } from 'express'

import { attachUserById } from '../../../middleware/users.js'
import { attachLessonById } from '../../../middleware/lessons.js'
import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { messageSchema, messageUpdateSchema, validate } from '../../../middleware/validators.js'
import {
	attachMessageById,
	attachMessagesByCursor,
	attachOptionalMessageById,
	attachUserMessagesByCursor,
	checkOwnMessage,
	checkOwnOrAdmin,
} from '../../../middleware/messages.js'

import * as messageController from '../../../controllers/messageController.js'

const router = Router()

router.get('/', requireJwtAuth, requireAdmin, attachMessagesByCursor, messageController.getMessages)
router.get(
	'/user/:userId',
	requireJwtAuth,
	attachUserById('userId'),
	attachUserMessagesByCursor,
	messageController.getUserMessages
)

router.post(
	'/',
	validate(messageSchema),
	requireJwtAuth,
	attachLessonById('lessonId'),
	attachOptionalMessageById('parentMessageId'),
	messageController.createNewMessage
)

router.put(
	'/:id',
	validate(messageUpdateSchema),
	requireJwtAuth,
	attachMessageById(),
	checkOwnMessage,
	messageController.updateMessage
)

router.delete(
	'/:id',
	requireJwtAuth,
	attachMessageById(),
	checkOwnOrAdmin,
	messageController.deleteMessage
)

export default router
