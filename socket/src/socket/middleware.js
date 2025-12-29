import jwt from 'jsonwebtoken'

import { HTTP_STATUS } from '../constants/index.js'

export const verifySocket = (socket, next) => {
	const token = socket.handshake.auth?.token
	if (!token) return next(new Error('Thiếu token xác thực'))

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		socket.data.me = decoded
		return next()
	} catch (err) {
		return next(new Error('Token không hợp lệ'))
	}
}

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
	let response = { message: err.message || 'Lỗi máy chủ nội bộ' }

	if (err.name === 'ValidationError') response.message = 'Xác thực không thành công'
	if (err.name === 'CastError') response.message = 'Định dạng ID không hợp lệ'
	if (process.env.NODE_ENV !== 'production') console.error('[Lỗi]', err)

	response.details = err.errors
	res.status(statusCode).json(response)
}
