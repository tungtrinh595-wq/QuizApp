import { HTTP_STATUS, PROVIDER } from '../constants/index.js'
import * as userService from '../services/users.js'
import { safeSocketPost } from '../config/socketApi.js'

export const getUserBySlug = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ user: req.foundUser })
}

export const getUsers = async (req, res) => {
	const { page, limit, total } = req.pagination
	res.status(HTTP_STATUS.OK).json({
		users: req.users,
		page,
		limit,
		total,
		totalPages: Math.ceil(total / limit),
	})
}

export const getMe = (req, res) => {
	res.status(HTTP_STATUS.OK).json({ me: req.user })
}

export const getUserById = async (req, res) => {
	res.status(HTTP_STATUS.OK).json({ user: req.foundUser })
}

export const createUser = async (req, res) => {
	const payload = { ...req.body, file: req.file }
	const user = await userService.createNewUser(payload)
	safeSocketPost('/user/created', { emitter: req.user, user })
	res.status(HTTP_STATUS.CREATED).json({ user })
}

export const setUserPassword = async (req, res) => {
	const { password } = req.body
	const payload = { password, provider: PROVIDER.EMAIL, file: req.file }
	const userUpdate = req.foundUser || req.user
	const user = await userService.updateUser(userUpdate, payload)
	safeSocketPost('/user/updated', { emitter: req.user, user })
	res.status(HTTP_STATUS.OK).json({ user })
}

export const updateUser = async (req, res) => {
	const userFound = req.foundUser ? req.foundUser : req.user
	const payload = { ...req.body, file: req.file }
	const user = await userService.updateUser(userFound, payload)
	safeSocketPost('/user/updated', { emitter: req.user, user })
	res.status(HTTP_STATUS.OK).json({ user })
}

export const reactiveUser = async (req, res) => {
	const userFound = req.foundUser ? req.foundUser : req.user
	const payload = { isActive: true }
	const user = await userService.updateUser(userFound, payload)
	safeSocketPost('/user/updated', { emitter: req.user, user })
	res.status(HTTP_STATUS.OK).json({ user })
}

export const deleteUser = async (req, res) => {
	await userService.deleteUser(req.foundUser)
	safeSocketPost('/user/deleted', { emitter: req.user, user: req.foundUser })
	res.status(HTTP_STATUS.NO_CONTENT).json()
}
