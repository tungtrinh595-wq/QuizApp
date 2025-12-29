import { Router } from 'express'

import { requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { attachQuizById, attachQuizBySlug } from '../../../middleware/quizzes.js'

import * as quizController from '../../../controllers/quizController.js'

const router = Router()

router.get(
	'/slug/:slug',
	requireJwtAuth,
	attachQuizBySlug('slug', true, false),
	quizController.getQuiz
)
router.get(
	'/public/:id',
	requireJwtAuth,
	attachQuizById('id', true, false),
	quizController.publicQuiz
)

export default router
