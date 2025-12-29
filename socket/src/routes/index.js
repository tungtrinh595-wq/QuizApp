import { Router } from 'express'

import userRoutes from './users.js'
import quizRoutes from './quizzes.js'
import resultRoutes from './results.js'
import lessonRoutes from './lessons.js'
import messageRoutes from './messages.js'
import subjectRoutes from './subjects.js'
import questionRoutes from './questions.js'

const router = Router()

router.use('/user', userRoutes)
router.use('/quiz', quizRoutes)
router.use('/result', resultRoutes)
router.use('/lesson', lessonRoutes)
router.use('/message', messageRoutes)
router.use('/subject', subjectRoutes)
router.use('/question', questionRoutes)

// fallback 404
router.use((req, res) => res.status(404).json({ error: 'No route for this path' }))

export default router
