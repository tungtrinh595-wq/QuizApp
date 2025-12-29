import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { ROUTES, PREFIX, ERROR_MESSAGES } from '@/constants'
import { ChevronLeftIcon } from '@/assets/icons'
import { verifyResetToken, UserProfileSetPasswordForm } from '@/features'
import { PageMeta } from '@/components'

const ResetPassword = () => {
	const dispatch = useDispatch()
	const [params] = useSearchParams()
	const [authToken, setAuthToken] = useState('')
	const [isVerifying, setIsVerifying] = useState(true)
	const [error, setError] = useState('')
	const token = params.get('token')

	useEffect(() => {
		if (!token) {
			setError(ERROR_MESSAGES.RESET_PASSSWORD_TOKEN_REQUIRED)
			setIsVerifying(false)
			return
		}

		dispatch(verifyResetToken({ token }))
			.unwrap()
			.then(() => {
				setAuthToken(token)
				setIsVerifying(false)
			})
			.catch((error) => {
				setError(error?.response?.data?.message || PREFIX.FETCH_FAILED)
				setIsVerifying(false)
			})
	}, [token, dispatch])

	return (
		<>
			<PageMeta
				title="Quên mật khẩu | Ứng dụng Quiz"
				description="Nhập mật khẩu mới để đặt lại mật khẩu. Hệ thống Quiz App giúp bạn lấy lại quyền truy cập một cách nhanh chóng và an toàn."
			/>
			<div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
				<div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
					<Link
						to={ROUTES.HOME}
						className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
					>
						<ChevronLeftIcon className="size-5" />
						Quay về trang chủ
					</Link>
				</div>
				<div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
					<div>
						<div className="mb-5 sm:mb-8">
							<h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-title-sm sm:text-title-md">
								Lấy lại mật khẩu
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Nhập mật khẩu mới để đặt lại mật khẩu
							</p>
						</div>
						<div>
							{isVerifying ? (
								<p className="text-sm text-gray-500 dark:text-gray-400">Đang xác thực token...</p>
							) : error ? (
								<p className="text-sm text-red-500 dark:text-red-400">{error}</p>
							) : (
								<>
									<UserProfileSetPasswordForm authToken={authToken} />
									<p className="mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400">
										Đăng nhập bằng tài khoản khác?{' '}
										<Link
											to={ROUTES.SIGNIN}
											className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
										>
											Đăng nhập
										</Link>
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ResetPassword
