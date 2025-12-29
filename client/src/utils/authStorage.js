import Cookies from 'js-cookie'

import { COOKIE_EXPIRE_DAYS } from '@/constants'

export const setCookie = (name, value, expireDays = COOKIE_EXPIRE_DAYS) => {
	Cookies.set(name, value, { expires: expireDays, secure: true, sameSite: 'Strict' })
}

export const getToken = () => {
	const sessionToken = sessionStorage.getItem('token')
	if (sessionToken) return sessionToken

	const token = Cookies.get('token')
	return token
}

export const removeToken = () => {
	localStorage.removeItem('token')
	sessionStorage.removeItem('token')
}

export const removeTokenWithDelay = () => {
	setTimeout(() => {
		deleteAllCookies()
		sessionStorage.removeItem('token')
		localStorage.removeItem('redirectAfterLogin')
		localStorage.removeItem('requireLoginMessage')
	}, 100)
}

export const deleteAllCookies = () => {
	const allCookies = document.cookie.split(';')
	allCookies.forEach((cookie) => {
		const name = cookie.trim().split('=')[0]
		Cookies.remove(name)
	})
}

export const attachTokenToHeaders = (getState, authToken) => {
	const token = authToken || getState().auth.token
	return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}
