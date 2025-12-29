import { Router } from 'express'

import { attachSlug } from '../../../middleware/utils.js'
import { attachLessonFileById } from '../../../middleware/lessonFiles.js'
import { storeImageUploaded, uploadImage } from '../../../middleware/uploadImage.js'
import { storeFilesUploaded, uploadFiles } from '../../../middleware/uploadFiles.js'
import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { attachSubjectById, attachOptionalSubjectById } from '../../../middleware/subjects.js'
import {
	attachLessonById,
	attachLessonBySlug,
	attachAllLessons,
	attachListLessons,
} from '../../../middleware/lessons.js'
import {
	lessonSchema,
	lessonFileSchema,
	lessonUpdateSchema,
	reorderSchema,
	validate,
} from '../../../middleware/validators.js'

import * as lessonController from '../../../controllers/lessonController.js'

const router = Router()

router.get('/', requireJwtAuth, requireAdmin, attachAllLessons, lessonController.getAllLessons)
router.get(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachLessonById('id', true),
	lessonController.getLesson
)
router.get(
	'/slug/:slug',
	requireJwtAuth,
	requireAdmin,
	attachLessonBySlug('slug', true),
	lessonController.getLesson
)

router.post(
	'/',
	validate(lessonSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachSubjectById('subjectId'),
	storeImageUploaded,
	attachSlug(),
	lessonController.createNewLesson
)
router.post(
	'/:id/files',
	validate(lessonFileSchema),
	requireJwtAuth,
	requireAdmin,
	uploadFiles,
	attachLessonById(),
	storeFilesUploaded,
	lessonController.uploadLessonFiles
)

router.put(
	'/reorder',
	validate(reorderSchema),
	requireJwtAuth,
	requireAdmin,
	attachListLessons(),
	lessonController.reorderLessons
)
router.put(
	'/:id',
	validate(lessonUpdateSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachOptionalSubjectById('subjectId'),
	attachLessonById(),
	storeImageUploaded,
	lessonController.updateLesson
)

router.delete(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachLessonById(),
	lessonController.deleteLesson
)
router.delete(
	'/files/:id',
	requireJwtAuth,
	requireAdmin,
	attachLessonFileById(),
	lessonController.deleteLessonFile
)

export default router
