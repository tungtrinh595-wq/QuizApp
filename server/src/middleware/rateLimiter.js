import rateLimit from 'express-rate-limit'

const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX || '300', 10)
const loginRateLimitMax = parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10)
const registerRateLimitMax = parseInt(process.env.REGISTER_RATE_LIMIT_MAX || '15', 10)

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: rateLimitMax,
	message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.',
})

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: loginRateLimitMax,
	message: 'Quá nhiều lần đăng nhập. Vui lòng thử lại sau.',
})

export const registerLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: registerRateLimitMax,
	message: 'Quá nhiều lần đăng ký. Vui lòng thử lại sau.',
})
