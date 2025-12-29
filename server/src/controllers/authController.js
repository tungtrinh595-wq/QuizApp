import jwt from 'jsonwebtoken'
import { google } from 'googleapis'

import {
	PROVIDER,
	HTTP_STATUS,
	clientUrl,
	jwtSecretKey,
	googleClientId,
	googleClientSecret,
	googleClientCallback,
} from '../constants/index.js'
import * as userService from '../services/users.js'
import * as emailServices from '../config/emailServices.js'
import { safeSocketPost } from '../config/socketApi.js'

const oauth2Client = new google.auth.OAuth2(
	googleClientId,
	googleClientSecret,
	googleClientCallback
)

export const login = (req, res) => {
	const token = req.user.generateJWT()
	const me = req.user
	res.status(HTTP_STATUS.OK).json({ token, me })
}

export const register = async (req, res) => {
	const user = await userService.createNewUser(req.body)
	const token = user.generateJWT()
	safeSocketPost('/user/created', { emitter: user, user })
	res.status(HTTP_STATUS.CREATED).json({ token, me: user })
}

export const sendMailResetPassword = async (req, res) => {
	const { email } = req.foundUser
	const token = jwt.sign(
		{
			email,
			purpose: 'reset-password',
		},
		jwtSecretKey,
		{ expiresIn: '15m' }
	)
	const resetLink = `${clientUrl}/reset-password?token=${token}`

	const mailResponse = await emailServices.sendMail({
		to: email,
		subject: 'Đặt lại mật khẩu cho ứng dụng Quiz App',
		html: `<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
			<p>Vui lòng bấm vào <a href="${resetLink}">đây</a> để tiến hành đặt lại mật khẩu của bạn.</p>
			<p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>
			<p>Trân trọng,</p>
			<p>Đội ngũ hỗ trợ Quiz App</p>`,
	})

	res.status(HTTP_STATUS.ACCEPTED).json({ mailResponse })
}

export const confirmResetPassword = (req, res) => {
	const token = req.foundUser.generateJWT()
	const me = req.foundUser
	res.status(HTTP_STATUS.OK).json({ token, me })
}

export const authGoogle = async (req, res) => {
	const googlePayload = { ...req.body, provider: PROVIDER.GOOGLE }
	const { token, user } = await userService.findOrCreateSocialUser(googlePayload)
	safeSocketPost('/user/created', { emitter: user, user })
	res.status(HTTP_STATUS.CREATED).json({ token, me: user })
}

export const getAuthGoogle = async (req, res) => {
	const scopes = ['https://www.googleapis.com/auth/drive.file']
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes,
		prompt: 'consent',
	})
	res.redirect(url)
}

export const authGoogleCallback = async (req, res) => {
	const { code } = req.query
	const { tokens } = await oauth2Client.getToken(code)
	res.json(tokens)
}

export const authFacebook = async (req, res) => {
	const facebookPayload = { ...req.body, provider: PROVIDER.FACEBOOK }
	const { token, user } = await userService.findOrCreateSocialUser(facebookPayload)
	safeSocketPost('/user/created', { emitter: user, user })
	res.status(HTTP_STATUS.CREATED).json({ token, me: user })
}
