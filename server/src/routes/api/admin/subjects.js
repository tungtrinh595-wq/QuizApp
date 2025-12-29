import { Router } from 'express'

import { attachSlug } from '../../../middleware/utils.js'
import { attachSubjectById } from '../../../middleware/subjects.js'
import { storeImageUploaded, uploadImage } from '../../../middleware/uploadImage.js'
import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { subjectSchema, subjectUpdateSchema, validate } from '../../../middleware/validators.js'

import * as subjectController from '../../../controllers/subjectController.js'

const router = Router()

router.get(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachSubjectById('id', true),
	subjectController.getSubject
)

router.post(
	'/',
	validate(subjectSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachSlug(),
	storeImageUploaded,
	subjectController.createNewSubject
)

router.put(
	'/:id',
	validate(subjectUpdateSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachSubjectById(),
	storeImageUploaded,
	subjectController.updateSubject
)

router.delete(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachSubjectById(),
	subjectController.deleteSubject
)

export default router
