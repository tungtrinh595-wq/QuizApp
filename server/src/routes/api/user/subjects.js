import { Router } from 'express'

import { requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { attachSubjectBySlug, attachAllSubjects } from '../../../middleware/subjects.js'

import * as subjectController from '../../../controllers/subjectController.js'

const router = Router()

router.get('/', attachAllSubjects, subjectController.getSubjects)
router.get(
	'/slug/:slug',
	requireJwtAuth,
	attachSubjectBySlug('slug', true),
	subjectController.getSubject
)

export default router
