import { Router } from 'express'

import { attachSlug } from '../../../middleware/utils.js'
import { attachQuestionById } from '../../../middleware/questions.js'
import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { storeImageUploaded, uploadImage } from '../../../middleware/uploadImage.js'
import { attachOptionalSubjectById, attachSubjectById } from '../../../middleware/subjects.js'
import {
	bulkQuizQuestionSchema,
	quizQuestionSchema,
	quizSchema,
	quizUpdateSchema,
	reorderSchema,
	validate,
} from '../../../middleware/validators.js'
import {
	attachSubjectQuizzes,
	attachQuizById,
	attachAllQuizzes,
	attachQuizBySlug,
	attachListQuizQuestions,
} from '../../../middleware/quizzes.js'

import * as quizController from '../../../controllers/quizController.js'

const router = Router()

router.get('/', requireJwtAuth, requireAdmin, attachAllQuizzes, quizController.getAllQuizzes)
router.get(
	'/subject/:subjectId',
	requireJwtAuth,
	requireAdmin,
	attachSubjectById('subjectId'),
	attachSubjectQuizzes,
	quizController.getSubjectQuizzes
)
router.get('/slug/:slug', requireJwtAuth, requireAdmin, attachQuizBySlug(), quizController.getQuiz)
router.get('/:id', requireJwtAuth, requireAdmin, attachQuizById(), quizController.getQuiz)

router.post(
	'/',
	validate(quizSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachSubjectById('subjectId'),
	storeImageUploaded,
	attachSlug(),
	quizController.createNewQuiz
)
router.post(
	'/:id/questions',
	validate(quizQuestionSchema),
	requireJwtAuth,
	requireAdmin,
	attachQuizById(),
	attachQuestionById('questionId'),
	quizController.addQuestionToQuiz
)
router.post(
	'/:id/questions/bulk',
	validate(bulkQuizQuestionSchema),
	requireJwtAuth,
	requireAdmin,
	attachQuizById(),
	quizController.bulkAddQuizQuestions
)

router.put(
	'/questions/reorder',
	validate(reorderSchema),
	requireJwtAuth,
	requireAdmin,
	attachListQuizQuestions(),
	quizController.reorderQuizQuestions
)
router.put(
	'/:id',
	validate(quizUpdateSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachOptionalSubjectById('subjectId'),
	attachQuizById(),
	storeImageUploaded,
	quizController.updateQuiz
)

router.delete(
	'/:id',
	requireJwtAuth,
	requireAdmin,
	attachQuizById('id', false),
	quizController.deleteQuiz
)
router.delete(
	'/:id/questions/:questionId',
	requireJwtAuth,
	requireAdmin,
	attachQuizById('id', false),
	attachQuestionById('questionId'),
	quizController.removeQuestionFromQuiz
)

export default router
