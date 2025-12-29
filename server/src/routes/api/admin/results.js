import { Router } from 'express'

import { attachUserById } from '../../../middleware/users.js'
import { attachQuizById } from '../../../middleware/quizzes.js'
import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import {
	attachResultById,
	attachQuizResults,
	attachAllQuizResults,
	attachResultsByUserId,
} from '../../../middleware/results.js'

import * as resultController from '../../../controllers/resultController.js'

const router = Router()

router.get(
	'/quiz/:quizId/all',
	requireJwtAuth,
	requireAdmin,
	attachQuizById('quizId', false),
	attachAllQuizResults,
	resultController.getQuizResults
)
router.get(
	'/quiz/:quizId',
	requireJwtAuth,
	requireAdmin,
	attachQuizById('quizId', false),
	attachQuizResults,
	resultController.getQuizResults
)
router.get(
	'/user/:userId',
	requireJwtAuth,
	requireAdmin,
	attachUserById('userId'),
	attachResultsByUserId('userId'),
	resultController.getResults
)
router.get('/:id', requireJwtAuth, requireAdmin, attachResultById(), resultController.getResult)

router.delete(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachResultById('id', false),
	resultController.deleteResult
)

export default router
