import jwt from 'jsonwebtoken'

import * as userServices from '../services/users.js'
import { jwtSecretKey, LIMIT_QUERY_DEFAULT, PROVIDER } from '../constants/index.js'
import {
	UnauthorizedError,
	ForbiddenError,
	BadRequestError,
	NotFoundError,
	ConflictError,
} from '../utils/errors.js'

export const attachUserByEmail =
	(paramName = 'email') =>
	async (req, res, next) => {
		const email = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!email) throw new BadRequestError('Email bị thiếu')

		req.foundUser = await userServices.findUserByEmail(email)
		if (!req.foundUser) throw new NotFoundError('Không tìm thấy người dùng')
		if (!req.foundUser.isActive) throw new ForbiddenError('Người dùng đã bị xóa')
		next()
	}

export const checkUserNotExistsByEmail =
	(paramName = 'email') =>
	async (req, res, next) => {
		const email = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!email) throw new BadRequestError('Email bị thiếu')

		req.foundUser = await userServices.findUserByEmail(email)
		if (req.foundUser) {
			if (req.foundUser.isActive) throw new ConflictError('Email này đã có người đăng ký')
			throw new ForbiddenError(
				'Email này thuộc về một người dùng đã bị vô hiệu hóa. Vui lòng kích hoạt lại tài khoản này.'
			)
		}
		next()
	}

export const attachUserBySlug =
	(paramName = 'slug') =>
	async (req, res, next) => {
		const slug = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!slug) throw new BadRequestError('Tham số slug bị thiếu')

		req.foundUser = await userServices.findUserBySlug(slug)
		if (!req.foundUser) throw new NotFoundError('Không tìm thấy người dùng')
		if (!req.foundUser.isActive) throw new ForbiddenError('Người dùng đã bị xóa')
		next()
	}

export const attachUserById =
	(paramName = 'id') =>
	async (req, res, next) => {
		const userId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!userId) throw new BadRequestError('ID người dùng bị thiếu')

		req.foundUser = await userServices.findUserById(userId)
		if (!req.foundUser) throw new NotFoundError('Không tìm thấy người dùng')
		if (!req.foundUser.isActive) throw new ForbiddenError('Người dùng đã bị xóa')
		next()
	}

export const attachUserDeletedById =
	(paramName = 'id') =>
	async (req, res, next) => {
		const userId = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		if (!userId) throw new BadRequestError('ID người dùng bị thiếu')

		req.foundUser = await userServices.findUserById(userId)
		if (!req.foundUser) throw new NotFoundError('Không tìm thấy người dùng')
		if (req.foundUser.isActive) throw new ForbiddenError('Người dùng đang hoạt động')
		next()
	}

export const attachUsers = async (req, res, next) => {
	const page = parseInt(req.query.page) || 1
	const limit = parseInt(req.query.limit) || LIMIT_QUERY_DEFAULT
	const { users, total } = await userServices.findUsers({ queryRequest: req.query, page, limit })
	req.users = users
	req.pagination = { page, limit, total }
	next()
}

export const attachUsersByCursor = async (req, res, next) => {
	const { cursor, limit } = req.query
	req.users = await userServices.findUsersByCursor({
		cursor,
		limit: parseInt(limit) || LIMIT_QUERY_DEFAULT,
	})
	next()
}

export const checkPassword =
	(paramName = 'password') =>
	async (req, res, next) => {
		const password = req.params?.[paramName] || req.body?.[paramName] || req.query?.[paramName]
		const user = req.foundUser || req.user

		if (paramName === 'password') {
			if (user.provider === PROVIDER.GOOGLE)
				throw new ForbiddenError(
					'Tài khoản này sử dụng đăng nhập bằng mạng xã hội. Vui lòng đăng nhập qua Google.'
				)
			if (user.provider === PROVIDER.FACEBOOK)
				throw new ForbiddenError(
					'Tài khoản này sử dụng đăng nhập bằng mạng xã hội. Vui lòng đăng nhập qua Facebook.'
				)
		}

		const isMatch = await user.comparePassword(password)
		if (!isMatch) throw new UnauthorizedError('Mật khẩu không đúng')

		req.user = user
		next()
	}

export const verifyResetToken = (req, res, next) => {
	const token = req.params?.token || req.body?.token || req.query?.token
	if (!token) throw new BadRequestError('Thiếu token khôi phục mật khẩu')

	try {
		const { email, purpose } = jwt.verify(token, jwtSecretKey)
		if (purpose !== 'reset-password')
			throw new ForbiddenError('Token không hợp lệ cho khôi phục mật khẩu')
		req.body = req.body || {}
		req.body.email = email
		next()
	} catch (err) {
		throw new UnauthorizedError('Token không hợp lệ hoặc đã hết hạn')
	}
}
