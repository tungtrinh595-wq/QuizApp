import { ROLE, ROUTES } from '@/constants'

export const handleRedirectAfterLogin = (navigate, userRole = ROLE.USER) => {
	if (navigate) {
		const fallbackPath = userRole === ROLE.ADMIN.value ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME
		const redirectPath = localStorage.getItem('redirectAfterLogin') || fallbackPath

		setTimeout(() => {
			if (navigate) navigate(redirectPath)
			localStorage.removeItem('redirectAfterLogin')
		})
	}
}
