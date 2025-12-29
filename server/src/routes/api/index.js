import { Router } from 'express'

import userRoutes from './user/users.js'
import subjectRoutes from './user/subjects.js'
import lessonRoutes from './user/lessons.js'
import messageRoutes from './user/messages.js'
import quizRoutes from './user/quizzes.js'
import resultRoutes from './user/results.js'

import adminUserRoutes from './admin/users.js'
import adminSubjectRoutes from './admin/subjects.js'
import adminLessonRoutes from './admin/lessons.js'
import adminMessageRoutes from './admin/messages.js'
import adminQuestionRoutes from './admin/questions.js'
import adminQuizRoutes from './admin/quizzes.js'
import adminResultRoutes from './admin/results.js'

const router = Router()

router.use('/users', userRoutes)
router.use('/subjects', subjectRoutes)
router.use('/lessons', lessonRoutes)
router.use('/messages', messageRoutes)
router.use('/quizzes', quizRoutes)
router.use('/results', resultRoutes)

router.use('/admin/users', adminUserRoutes)
router.use('/admin/subjects', adminSubjectRoutes)
router.use('/admin/lessons', adminLessonRoutes)
router.use('/admin/messages', adminMessageRoutes)
router.use('/admin/questions', adminQuestionRoutes)
router.use('/admin/quizzes', adminQuizRoutes)
router.use('/admin/results', adminResultRoutes)

export default router
