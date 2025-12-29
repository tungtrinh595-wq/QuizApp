import { Router } from 'express'

import { attachQuizById } from '../../../middleware/quizzes.js'
import { requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { attachMyResults, attachResultByUserAndQuizId } from '../../../middleware/results.js'
import { resultSubmitSchema, validate } from '../../../middleware/validators.js'

import * as resultController from '../../../controllers/resultController.js'

const router = Router()

router.get('/', requireJwtAuth, attachMyResults(), resultController.getResults)

router.get(
	'/quiz/:quizId',
	requireJwtAuth,
	attachQuizById('quizId'),
	attachResultByUserAndQuizId('quizId'),
	resultController.getResult
)

router.put(
	'/quiz/:quizId',
	validate(resultSubmitSchema),
	requireJwtAuth,
	attachQuizById('quizId'),
	attachResultByUserAndQuizId('quizId', false, true),
	resultController.submitResult
)

export default router
