import { LIMIT_QUERY_DEFAULT, POPULATE, PROVIDER } from '../constants/index.js'
import { ConflictError } from '../utils/errors.js'
import { applyPopulate, deleteMediaFile, unflattenQueryObject } from '../utils/utils.js'

import User, { hashPassword } from '../models/User.js'

import * as mediaService from './medias.js'

export const findUserById = async (userId) => {
	return await applyPopulate(User.findById(userId), true, POPULATE.AVATAR)
}

export const findUserByEmail = async (email) => {
	return await applyPopulate(User.findOne({ email }), true, POPULATE.AVATAR)
}

export const findUserBySlug = async (slug) => {
	return await applyPopulate(User.findOne({ slug }), true, POPULATE.AVATAR)
}

export const findUsers = async ({ queryRequest, page = 1, limit = LIMIT_QUERY_DEFAULT }) => {
	const query = { isActive: true }
	const skip = (page - 1) * limit
	const parsedQuery = unflattenQueryObject(queryRequest)
	if (parsedQuery.user) {
		query.$or = [
			{ name: { $regex: parsedQuery.user, $options: 'i' } },
			{ email: { $regex: parsedQuery.user, $options: 'i' } },
		]
	}
	if (parsedQuery.provider) query.provider = parsedQuery.provider
	if (parsedQuery.role) query.role = parsedQuery.role
	if (parsedQuery.createdAt?.startDate || parsedQuery.createdAt?.endDate) {
		query.createdAt = {}
		if (parsedQuery.createdAt.startDate)
			query.createdAt.$gte = new Date(parsedQuery.createdAt.startDate)
		if (parsedQuery.createdAt.endDate)
			query.createdAt.$lte = new Date(parsedQuery.createdAt.endDate)
	}
	const baseQuery = User.find(query).sort({ _id: -1 }).skip(skip).limit(limit)
	const users = await applyPopulate(baseQuery, true, POPULATE.AVATAR)
	const total = await User.countDocuments(query)
	return { users, total }
}

export const findUsersByCursor = async ({ cursor, limit = LIMIT_QUERY_DEFAULT }) => {
	const query = cursor ? { isActive: true, _id: { $lt: cursor } } : { isActive: true }
	const baseQuery = User.find(query).sort({ _id: -1 }).limit(limit)
	return await applyPopulate(baseQuery, true, POPULATE.AVATAR)
}

export const createNewUser = async (request) => {
	const { email, name, slug } = request
	let finalSlug = slug
	let count = 1
	while (await User.findOne({ slug: finalSlug })) {
		finalSlug = `${slug}-${count++}`
	}

	const newUserPayload = {
		provider: request.provider || PROVIDER.EMAIL,
		email,
		name,
		slug: finalSlug,
	}
	if (request.file?.url) {
		const media = await mediaService.saveMedia(request.file)
		newUserPayload.avatar = media
	} else if (request.avatar) newUserPayload.avatar = request.avatar

	if ((!request.provider || request.provider === PROVIDER.EMAIL) && request?.password)
		newUserPayload.password = request.password
	if (request.role) newUserPayload.role = request.role
	if (request.bio) newUserPayload.bio = request.bio

	const newUser = new User(newUserPayload)
	await newUser.registerUser()
	return await newUser.populate(POPULATE.AVATAR)
}

export const findOrCreateSocialUser = async (payload) => {
	const { provider, email, name, slug, avatar } = payload
	let user = await User.findOne({ email })

	if (!user) {
		let finalSlug = slug
		let count = 1
		while (await User.exists({ slug: finalSlug })) {
			finalSlug = `${slug}-${count++}`
		}
		const userPayload = {
			provider,
			email,
			slug: finalSlug,
			name,
		}
		if (avatar) {
			const media = await mediaService.saveMedia({ url: avatar })
			userPayload.avatar = media
		}

		if (payload.googleId) userPayload.googleId = payload.googleId
		if (payload.facebookId) userPayload.facebookId = payload.facebookId

		user = await createNewUser(userPayload)
	}

	const populatedUser = await user.populate(POPULATE.AVATAR)
	const token = populatedUser.generateJWT()

	return { token, user: populatedUser }
}

export const updateUser = async (user, request) => {
	const userId = user.id
	const updates = {}
	let oldAvatar = ''

	if ('provider' in request) updates.provider = request.provider
	if ('password' in request && request.password?.trim())
		updates.password = await hashPassword(request.password)
	if ('name' in request) updates.name = request.name
	if ('slug' in request) {
		const exists = await User.exists({ slug: request.slug, _id: { $ne: userId } })
		if (exists) throw new ConflictError('Slug already taken.')
		updates.slug = request.slug
	}
	if ('bio' in request) updates.bio = request.bio
	if ('role' in request) updates.role = request.role
	if ('isActive' in request) updates.isActive = request.isActive
	if (request.file?.url) {
		oldAvatar = user.avatar
		const media = await mediaService.saveMedia(request.file)
		updates.avatar = media
	}

	const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true })
	if (oldAvatar) await deleteMediaFile(oldAvatar)
	return await updatedUser.populate(POPULATE.AVATAR)
}

export const deleteUser = async (user) => {
	// return await user.updateOne({ isActive: false })
	await user.deleteOne()
}
