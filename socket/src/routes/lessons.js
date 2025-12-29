import { Router } from 'express'

import { HTTP_STATUS } from '../constants/index.js'
import { emitToRoom } from '../utils/utils.js'

const router = Router()

const handleLessonEvent = (req, res, eventName, lessonSource = 'lesson') => {
	let lesson = req.body[lessonSource]
	if (Array.isArray(lesson)) lesson = lesson[0]
	const subjectId = lesson?.subject?.id || lesson?.subject
	if (subjectId) {
		req.body.subjectId = subjectId
		emitToRoom(req, `subject-${subjectId}`, eventName)
	}
	res.status(HTTP_STATUS.OK).json()
}

const handlLessonFileEvent = (req, res, eventName) => {
	const { lessonId } = req.body
	if (lessonId) emitToRoom(req, `lesson-${lessonId}`, eventName)
	res.status(HTTP_STATUS.OK).json()
}

router.post('/created', (req, res) => {
	handleLessonEvent(req, res, 'lesson-created')
})

router.post('/updated', (req, res) => {
	handleLessonEvent(req, res, 'lesson-updated')
})

router.post('/deleted', (req, res) => {
	handleLessonEvent(req, res, 'lesson-deleted')
})

router.post('/orders-updated', (req, res) => {
	handleLessonEvent(req, res, 'lesson-orders-updated', 'lessons')
})

router.post('/upload-files', (req, res) => {
	handlLessonFileEvent(req, res, 'lesson-upload-files')
})

router.post('/remove-file', (req, res) => {
	handlLessonFileEvent(req, res, 'lesson-remove-file')
})

export default router
