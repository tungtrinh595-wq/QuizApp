import jwt from 'jsonwebtoken'

import { findUserById } from '../services/users.js'
import { jwtSecretKey, ROLE } from '../constants/index.js'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '../utils/errors.js'

export const requireJwtAuth = async (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
	if (!token) throw new UnauthorizedError('Không có mã đăng nhập, quyền hạn bị từ chối')

	let decoded
	try {
		decoded = jwt.verify(token, jwtSecretKey)
	} catch (err) {
		if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
			throw new UnauthorizedError('Mã đăng nhập không hợp lệ hoặc đã hết hạn')
		}
		throw err
	}

	if (!decoded.id) throw new UnauthorizedError('Mã đăng nhập không hợp lệ!')

	const user = await findUserById(decoded.id)
	if (!user) throw new NotFoundError('Không tìm thấy người dùng!')
	if (!user.isActive) throw new ForbiddenError('Người dùng đã bị xóa')

	req.user = user
	next()
}

export const requireAdmin = (req, res, next) => {
	if (!req.user || !req.user?.role) throw new UnauthorizedError('Không được phép!')
	if (req.user.role !== ROLE.ADMIN) throw new ForbiddenError('Yêu cầu quyền quản trị viên!')
	next()
}
