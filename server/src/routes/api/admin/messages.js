import { Router } from 'express'

import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'

import * as messageController from '../../../controllers/messageController.js'

const router = Router()

router.delete('/orphans', requireJwtAuth, requireAdmin, messageController.deleteOrphanMessages)

export default router
