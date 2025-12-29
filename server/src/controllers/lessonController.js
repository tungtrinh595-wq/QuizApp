import { HTTP_STATUS } from '../constants/index.js'
import * as lessonService from '../services/lessons.js'
import * as lessonFileService from '../services/lessonFiles.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getLessons = async (req, res) => {
	const { page, limit, total } = req.pagination
	res.status(HTTP_STATUS.OK).json({
		lessons: req.lessons,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
	})
}

export const getAllLessons = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({
		lessons: req.lessons,
		total: req.total,
	})
}

export const getSubjectLessons = async (req, res) => {
	const lessons = req.lessons
	const nextCursor = lessons.length ? lessons[lessons.length - 1].id : null
	res.status(HTTP_STATUS.OK).json({
		lessons,
		nextCursor,
		hasMore: lessons.length === (parseInt(req.query.limit) || 20),
	})
}

export const getLesson = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ lesson: req.foundLesson })
}

export const createNewLesson = async (req, res) => {
	const payload = { ...req.body, user: req.user, subject: req.foundSubject, file: req.file }
	const lesson = await lessonService.createNewLesson(payload)
	safeSocketPost('/lesson/created', { emitter: req.user, lesson })
	res.status(HTTP_STATUS.CREATED).json({ lesson })
}

export const uploadLessonFiles = async (req, res) => {
	const payload = { ...req.body, lesson: req.foundLesson, files: req.files }
	const { uploadedFiles } = await lessonFileService.updateLessonFiles(payload)
	safeSocketPost('/lesson/upload-files', {
		emitter: req.user,
		lessonId: req.foundLesson.id,
		uploadedFiles,
	})
	res.status(HTTP_STATUS.CREATED).json({ uploadedFiles })
}

export const deleteLessonFile = async (req, res) => {
	const lessonFile = await req.foundLessonFile.populate('lesson')
	const lessonId = lessonFile.lesson?.id || lessonFile.lesson
	const lessonFileId = req.foundLessonFile.id
	await lessonFileService.deleteLessonFile(req.foundLessonFile)
	safeSocketPost('/lesson/remove-file', {
		emitter: req.user,
		lessonId,
		lessonFileId,
	})
	res.status(HTTP_STATUS.NO_CONTENT).json()
}

export const updateLesson = async (req, res) => {
	const payload = { ...req.body, subject: req.foundSubject || null, file: req.file }
	const lesson = await lessonService.updateLesson(req.foundLesson, payload)
	safeSocketPost('/lesson/updated', { emitter: req.user, lesson })
	res.status(HTTP_STATUS.OK).json({ lesson })
}

export const reorderLessons = async (req, res) => {
	const payload = { ...req.body, lessons: req.foundLessons || [] }
	const lessons = await lessonService.updateLessonOrder(payload)
	safeSocketPost('/lesson/orders-updated', { emitter: req.user, lessons })
	res.status(HTTP_STATUS.OK).json({ lessons })
}

export const deleteLesson = async (req, res) => {
	await lessonService.deleteLesson(req.foundLesson)
	safeSocketPost('/lesson/deleted', { emitter: req.user, lesson: req.foundLesson })
	res.status(HTTP_STATUS.NO_CONTENT).json()
}
