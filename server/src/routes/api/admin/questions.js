import { Router } from 'express'

import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { attachQuestionById, attachSubjectQuestions } from '../../../middleware/questions.js'
import { attachSubjectById, attachOptionalSubjectById } from '../../../middleware/subjects.js'
import { questionSchema, questionUpdateSchema, validate } from '../../../middleware/validators.js'

import * as questionController from '../../../controllers/questionController.js'

const router = Router()

router.get(
	'/subject/:subjectId',
	requireJwtAuth,
	requireAdmin,
	attachSubjectById('subjectId'),
	attachSubjectQuestions,
	questionController.getSubjectQuestions
)
router.get(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachQuestionById(),
	questionController.getQuestion
)

router.post(
	'/',
	validate(questionSchema),
	requireJwtAuth,
	requireAdmin,
	attachSubjectById('subjectId'),
	questionController.createNewQuestion
)

router.put(
	'/:id',
	validate(questionUpdateSchema),
	requireJwtAuth,
	requireAdmin,
	attachQuestionById(),
	attachOptionalSubjectById('subjectId'),
	questionController.updateQuestion
)

router.delete(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachQuestionById(),
	questionController.deleteQuestion
)

export default router
