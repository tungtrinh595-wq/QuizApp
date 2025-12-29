import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getToken } from '@/utils'
import { guestAccess, loadMe, loginWithOauth } from '@/features'

export const useAuthInit = () => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)

	const oauthCalledRef = useRef(false)
	const loadMeCalledRef = useRef(false)

	useEffect(() => {
		if (oauthCalledRef.current) return
		oauthCalledRef.current = true

		if (window.location.hash === '#_=_') {
			window.location.hash = ''
		}

		const token = getToken()
		if (token) {
			dispatch(loginWithOauth({ token }))
		} else {
			dispatch(guestAccess())
		}
	}, [dispatch])

	useEffect(() => {
		if (loadMeCalledRef.current) return
		loadMeCalledRef.current = true

		if (!auth.isLoading && auth.token && !auth.isAuthenticated) {
			dispatch(loadMe())
		}
	}, [auth.isLoading, auth.token, auth.isAuthenticated, dispatch])
}
