import { Router } from 'express'

import { checkPassword } from '../../../middleware/users.js'
import { requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { storeImageUploaded, uploadImage } from '../../../middleware/uploadImage.js'
import {
	changePasswordSchema,
	setPasswordSchema,
	userUpdateSchema,
	validate,
} from '../../../middleware/validators.js'

import * as userController from '../../../controllers/userController.js'

const router = Router()

router.get('/me', requireJwtAuth, userController.getMe)
router.put(
	'/set-password',
	validate(setPasswordSchema),
	requireJwtAuth,
	userController.setUserPassword
)
router.put(
	'/change-password',
	validate(changePasswordSchema),
	requireJwtAuth,
	checkPassword('currentPassword'),
	userController.updateUser
)
router.put(
	'/',
	validate(userUpdateSchema),
	requireJwtAuth,
	uploadImage,
	storeImageUploaded,
	userController.updateUser
)

export default router
