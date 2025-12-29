import { ERROR_MESSAGES, HTTP_STATUS, ROLE, ROUTES } from '@/constants'
import { toast } from 'react-toastify'

export const handleSuccess = (message, prefix = '') => {
	const successPrefix = prefix ? `${prefix}: ` : ''
	toast.success(`${successPrefix}${message}`)
}

export const handleWarning = (message, prefix = '') => {
	const warningPrefix = prefix ? `${prefix}: ` : ''
	toast.warning(`${warningPrefix}${message}`)
}

export const handleError = (error = '', prefix = '', navigate, role = ROLE.USER.value) => {
	if (error.response?.status === HTTP_STATUS.NOT_FOUND && navigate) {
		if (role === ROLE.ADMIN.value) navigate(ROUTES.ADMIN.ERROR404)
		else navigate(ROUTES.ERROR404)
	}

	let errorPrefix = prefix ? `${prefix}: ` : ''
	let errorMessage =
		error?.response?.data?.message ||
		error?.response?.data?.error ||
		error?.response?.data ||
		error?.message ||
		error ||
		'Lỗi không xác định'

	if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
		errorPrefix = ''
		errorMessage = ERROR_MESSAGES.LOGIN_REQUIRE
		if (navigate) navigate(ROUTES.SIGNIN)
	}

	if (typeof errorMessage === 'object')
		errorMessage = JSON.stringify(errorMessage) || 'Lỗi không xác định'

	toast.error(`${errorPrefix}${errorMessage}`)
}

export const extractError = (action) =>
	action.payload?.message || action.error?.message || 'Lỗi không xác định'
