import { HTTP_STATUS } from '../constants/index.js'

export class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message)
		this.statusCode = statusCode
		Error.captureStackTrace(this, this.constructor)
	}
}

export class BadRequestError extends AppError {
	constructor(message = 'Yêu cầu không hợp lệ') {
		super(message, HTTP_STATUS.BAD_REQUEST)
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = 'Bạn chưa được xác thực') {
		super(message, HTTP_STATUS.UNAUTHORIZED)
	}
}

export class ForbiddenError extends AppError {
	constructor(message = 'Bạn không có quyền thực hiện hành động này') {
		super(message, HTTP_STATUS.FORBIDDEN)
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Không tìm thấy tài nguyên yêu cầu') {
		super(message, HTTP_STATUS.NOT_FOUND)
	}
}

export class MethodNotAllowError extends AppError {
	constructor(message = 'Phương thức không được phép') {
		super(message, HTTP_STATUS.METHOD_NOT_ALLOWED)
	}
}

export class NotAcceptableError extends AppError {
	constructor(message = 'Yêu cầu không thể được chấp nhận') {
		super(message, HTTP_STATUS.NOT_ACCEPTABLE)
	}
}

export class RequestTimeoutError extends AppError {
	constructor(message = 'Yêu cầu đã hết thời gian xử lý') {
		super(message, HTTP_STATUS.REQUEST_TIMEOUT)
	}
}

export class ConflictError extends AppError {
	constructor(message = 'Xung đột dữ liệu') {
		super(message, HTTP_STATUS.CONFLICT)
	}
}

export class GoneError extends AppError {
	constructor(message = 'Tài nguyên không còn tồn tại') {
		super(message, HTTP_STATUS.GONE)
	}
}

export class LengthRequiredError extends AppError {
	constructor(message = 'Thiếu thông tin độ dài dữ liệu') {
		super(message, HTTP_STATUS.LENGTH_REQUIRED)
	}
}

export class PreconditionFailedError extends AppError {
	constructor(message = 'Điều kiện tiên quyết không được đáp ứng') {
		super(message, HTTP_STATUS.PRECONDITION_FAILED)
	}
}

export class PayloadTooLargeError extends AppError {
	constructor(message = 'Dữ liệu gửi lên quá lớn') {
		super(message, HTTP_STATUS.PAYLOAD_TOO_LARGE)
	}
}

export class UnsupportedMediaTypeError extends AppError {
	constructor(message = 'Định dạng dữ liệu không được hỗ trợ') {
		super(message, HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE)
	}
}

export class UnprocessableEntityError extends AppError {
	constructor(message = 'Không thể xử lý dữ liệu gửi lên') {
		super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY)
	}
}

export class TooManyRequestsError extends AppError {
	constructor(message = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau') {
		super(message, HTTP_STATUS.TOO_MANY_REQUESTS)
	}
}

export class InternalServerError extends AppError {
	constructor(message = 'Lỗi máy chủ nội bộ') {
		super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}
}

export class NotImplementedError extends AppError {
	constructor(message = 'Chức năng chưa được hỗ trợ') {
		super(message, HTTP_STATUS.NOT_IMPLEMENTED)
	}
}

export class BadGatewayError extends AppError {
	constructor(message = 'Lỗi kết nối đến máy chủ trung gian') {
		super(message, HTTP_STATUS.BAD_GATEWAY)
	}
}

export class ServiceUnavailableError extends AppError {
	constructor(message = 'Dịch vụ hiện không khả dụng') {
		super(message, HTTP_STATUS.SERVICE_UNAVAILABLE)
	}
}

export class GatewayTimeoutError extends AppError {
	constructor(message = 'Máy chủ trung gian không phản hồi kịp thời') {
		super(message, HTTP_STATUS.GATEWAY_TIMEOUT)
	}
}
