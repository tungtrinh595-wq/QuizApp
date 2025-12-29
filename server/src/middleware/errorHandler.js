import { HTTP_STATUS } from '../constants/index.js'

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
	let response = { message: err.message || 'Lỗi máy chủ nội bộ' }

	if (err.name === 'ValidationError') response.message = 'Xác thực không thành công'
	if (err.name === 'CastError') response.message = 'Định dạng ID không hợp lệ'
	if (process.env.NODE_ENV !== 'production') console.error('[Lỗi]', err)

	response.details = err.errors
	res.status(statusCode).json(response)
}
