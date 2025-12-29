import { Router } from 'express'
import authRoutes from './auth/index.js'
import apiRoutes from './api/index.js'
const router = Router()

router.use('/auth', authRoutes)
router.use('/api', apiRoutes)
// fallback 404
router.use((req, res) => res.status(404).json({ error: 'No route for this path' }))

export default router
