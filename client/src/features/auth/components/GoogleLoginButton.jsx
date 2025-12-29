import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'

import { PREFIX } from '@/constants'
import { GoogleIcon } from '@/assets/icons'
import { thirdPartyApi } from '@/apis'
import { getDynamicClasses, handleError, handleRedirectAfterLogin } from '@/utils'
import { loginWithGoogle } from '@/features'

const GoogleLoginButton = ({ className = '', label = 'Đăng nhập bằng Google' }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const login = useGoogleLogin({
		onSuccess: (credentialResponse) => handleLoginGoogleSuccess(credentialResponse),
		onError: (error) => handleError(error, PREFIX.LOGIN_FAILED),
	})

	const handleLoginGoogleSuccess = async (credentialResponse) => {
		try {
			const res = await thirdPartyApi.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${credentialResponse.access_token}`,
				},
			})

			if (res.data?.sub) {
				const userData = res.data
				const oauthData = {
					googleId: userData.sub,
					email: userData.email,
					name: userData.name,
					avatar: userData.picture || '',
				}
				dispatch(loginWithGoogle({ oauthData }))
					.unwrap()
					.then(({ me }) => handleRedirectAfterLogin(navigate, me.role))
					.catch((error) => handleError(error, PREFIX.LOGIN_FAILED))
			}
		} catch (error) {
			handleError(error, PREFIX.FETCH_FAILED)
		}
	}

	const buttonClasses = getDynamicClasses(
		{
			baseClasses:
				'inline-flex items-center justify-center gap-2 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-3 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 whitespace-nowrap',
		},
		{ className }
	)

	return (
		<button onClick={() => login()} className={buttonClasses}>
			<GoogleIcon />
			{label}
		</button>
	)
}

export default GoogleLoginButton
