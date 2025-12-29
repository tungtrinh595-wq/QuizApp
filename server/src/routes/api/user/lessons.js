import { Router } from 'express'

import { attachSubjectById } from '../../../middleware/subjects.js'
import { requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { attachLessonMessagesByCursor } from '../../../middleware/messages.js'
import {
	attachLessonById,
	attachLessonBySlug,
	attachLessons,
	attachSubjectLessons,
} from '../../../middleware/lessons.js'

import * as lessonController from '../../../controllers/lessonController.js'
import * as messageController from '../../../controllers/messageController.js'

const router = Router()

router.get('/', requireJwtAuth, attachLessons(true), lessonController.getAllLessons)
router.get(
	'/subject/:subjectId',
	requireJwtAuth,
	attachSubjectById('subjectId'),
	attachSubjectLessons,
	lessonController.getSubjectLessons
)
router.get(
	'/:id/messages',
	requireJwtAuth,
	attachLessonById('id'),
	attachLessonMessagesByCursor,
	messageController.getLessonMessages
)
router.get('/:id', requireJwtAuth, attachLessonById('id', true, true), lessonController.getLesson)
router.get(
	'/slug/:slug',
	requireJwtAuth,
	attachLessonBySlug('slug', true, true),
	lessonController.getLesson
)

export default router
