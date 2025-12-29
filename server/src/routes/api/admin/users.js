import { Router } from 'express'

import { attachSlug } from '../../../middleware/utils.js'
import { requireAdmin, requireJwtAuth } from '../../../middleware/requireJwtAuth.js'
import { storeImageUploaded, uploadImage } from '../../../middleware/uploadImage.js'
import {
	changePasswordSchema,
	setPasswordSchema,
	userSchema,
	userUpdateSchema,
	validate,
} from '../../../middleware/validators.js'
import {
	attachUsers,
	attachUserById,
	attachUserBySlug,
	attachUserDeletedById,
	checkPassword,
	checkUserNotExistsByEmail,
} from '../../../middleware/users.js'

import * as userController from '../../../controllers/userController.js'

const router = Router()

router.get('/', requireJwtAuth, requireAdmin, attachUsers, userController.getUsers)
router.get(
	'/slug/:slug',
	requireJwtAuth,
	requireAdmin,
	attachUserBySlug(),
	userController.getUserBySlug
)
router.get('/:id', requireJwtAuth, requireAdmin, attachUserById(), userController.getUserById)

router.post(
	'/',
	validate(userSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	checkUserNotExistsByEmail(),
	storeImageUploaded,
	attachSlug('email'),
	userController.createUser
)

router.put(
	'/set-password/:id',
	validate(setPasswordSchema),
	requireJwtAuth,
	requireAdmin,
	attachUserById(),
	userController.setUserPassword
)
router.put(
	'/change-password/:id',
	validate(changePasswordSchema),
	requireJwtAuth,
	requireAdmin,
	attachUserById(),
	checkPassword('currentPassword'),
	userController.updateUser
)
router.put(
	'/:id',
	validate(userUpdateSchema),
	requireJwtAuth,
	requireAdmin,
	uploadImage,
	attachUserById(),
	storeImageUploaded,
	userController.updateUser
)
router.put(
	'/reactive/:id',
	validate(userUpdateSchema),
	requireJwtAuth,
	requireAdmin,
	attachUserDeletedById(),
	userController.reactiveUser
)

router.delete('/:id', requireJwtAuth, requireAdmin, attachUserById(), userController.deleteUser)

export default router
