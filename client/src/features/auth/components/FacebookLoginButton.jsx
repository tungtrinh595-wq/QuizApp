import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FacebookLogin from '@greatsumini/react-facebook-login'
import { toast } from 'react-toastify'

import { PREFIX } from '@/constants'
import { FacebookIcon } from '@/assets/icons'
import { getDynamicClasses, handleError, handleRedirectAfterLogin } from '@/utils'
import { loginWithFacebook } from '@/features'

const FacebookLoginButton = ({ className = '', label = 'Đăng nhập bằng Facebook' }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleLoginFacebookProfileSuccess = (response) => {
		if (response.error?.message) {
			toast.error(`Login Failed!: ${response.error.message}`)
		} else {
			const userData = response
			const oauthData = {
				facebookId: userData.id,
				email: userData.email,
				name: userData.name,
				avatar: userData.picture?.data?.url || '',
			}
			dispatch(loginWithFacebook({ oauthData }))
				.unwrap()
				.then(({ me }) => handleRedirectAfterLogin(navigate, me.role))
				.catch((error) => handleError(error, PREFIX.LOGIN_FAILED))
		}
	}

	const handleLoginFacebookError = (error) => {
		handleError(error, PREFIX.LOGIN_FAILED)
	}

	const buttonClasses = getDynamicClasses(
		{
			baseClasses:
				'inline-flex items-center justify-center gap-2 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-3 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 whitespace-nowrap',
		},
		{ className }
	)

	return (
		<FacebookLogin
			appId={import.meta.env.VITE_FACEBOOK_APP_ID}
			className={buttonClasses}
			onFail={handleLoginFacebookError}
			onProfileSuccess={handleLoginFacebookProfileSuccess}
			render={({ onClick }) => (
				<button onClick={onClick} className={buttonClasses}>
					<FacebookIcon />
					{label}
				</button>
			)}
		/>
	)
}

export default FacebookLoginButton
