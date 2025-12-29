import { Router } from 'express'

import { attachSlug } from '../../middleware/utils.js'
import {
	attachUserByEmail,
	checkPassword,
	checkUserNotExistsByEmail,
	verifyResetToken,
} from '../../middleware/users.js'
import {
	loginSchema,
	registerSchema,
	googleLoginSchema,
	facebookLoginSchema,
	requestPasswordResetSchema,
	verifyResetTokenSchema,
	validate,
} from '../../middleware/validators.js'
import { loginLimiter, registerLimiter } from '../../middleware/rateLimiter.js'

import * as authController from '../../controllers/authController.js'

const router = Router()

router.post(
	'/login',
	loginLimiter,
	validate(loginSchema),
	attachUserByEmail(),
	checkPassword(),
	authController.login
)
router.post(
	'/register',
	registerLimiter,
	validate(registerSchema),
	checkUserNotExistsByEmail(),
	attachSlug('email'),
	authController.register
)
router.post(
	'/forgot-password',
	validate(requestPasswordResetSchema),
	attachUserByEmail(),
	authController.sendMailResetPassword
)
router.get(
	'/verify-reset-token',
	validate(verifyResetTokenSchema),
	verifyResetToken,
	attachUserByEmail(),
	authController.confirmResetPassword
)

router.get('/google', authController.getAuthGoogle)
router.get('/google/callback', authController.authGoogleCallback)
router.post('/google', validate(googleLoginSchema), attachSlug('email'), authController.authGoogle)

router.post(
	'/facebook',
	validate(facebookLoginSchema),
	attachSlug('email'),
	authController.authFacebook
)

export default router
