import slugify from 'slugify'
import { OAuth2Client } from 'google-auth-library'
import { UnauthorizedError } from '../utils/errors.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const attachGoogleUserData = async (req, res, next) => {
	const { idToken } = req.body
	if (!idToken) throw new UnauthorizedError('Missing Google ID token')

	let ticket
	try {
		ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		})
	} catch (err) {
		if (err.message?.includes('Token used too late') || err.message?.includes('invalid')) {
			throw new UnauthorizedError('Google token is invalid or expired')
		}
		throw err
	}

	const payload = ticket.getPayload()
	if (!payload) throw new UnauthorizedError('Google token verification failed')

	const { email, name, picture, sub: googleId } = payload
	const rawInput = email.split('@')[0]
	const slug = slugify(rawInput, { lower: true, strict: true })

	req.googlePayload = { email, name, picture, googleId, slug }
	next()
}
