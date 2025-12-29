import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTES, ERROR_MESSAGES, ROLE } from '@/constants'
import { useQuizAccessGuard } from '@/hooks'

const PrivateRoute = ({ requiredRole }) => {
	const auth = useSelector((state) => state.auth)

	useQuizAccessGuard(auth.me?.id)

	const location = useLocation()
	const isAuthenticated = auth.isAuthenticated
	const hasRequiredRole = requiredRole ? requiredRole.includes(auth.me?.role) : true
	const isAllowed = isAuthenticated && hasRequiredRole

	if (!auth.isLoading && !auth.isLogout && !isAllowed) {
		localStorage.setItem('redirectAfterLogin', location.pathname)

		let requireLoginMessage = ERROR_MESSAGES.LOGIN_REQUIRE
		if (requiredRole?.includes(ROLE.ADMIN.value)) requireLoginMessage = ERROR_MESSAGES.ADMIN_REQUIRE

		localStorage.setItem('requireLoginMessage', requireLoginMessage)
		return <Navigate to={ROUTES.SIGNIN} replace />
	}

	return <Outlet />
}

export default PrivateRoute
