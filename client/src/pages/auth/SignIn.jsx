import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { ChevronLeftIcon } from '@/assets/icons'
import { handleError } from '@/utils'
import { SignInForm, GoogleLoginButton, FacebookLoginButton } from '@/features'
import { PageMeta } from '@/components'

const SignIn = () => {
	const hasFetched = useRef(false)

	useEffect(() => {
		if (!hasFetched.current) {
			const requireLoginMessage = localStorage.getItem('requireLoginMessage')
			if (!!requireLoginMessage) {
				handleError(requireLoginMessage)
				localStorage.removeItem('requireLoginMessage')
			}
			hasFetched.current = true
		}
	}, [])

	return (
		<>
			<PageMeta
				title="Đăng nhập | Quiz App"
				description="Truy cập bảng điều khiển Quiz App để quản lý bài kiểm tra, theo dõi tiến trình và khám phá hồ sơ của bạn. Đăng nhập an toàn với React và Tailwind CSS."
			/>
			<div className="flex flex-col flex-1">
				<div className="w-full max-w-md pt-10 mx-auto">
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
								Đăng nhập
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Nhập email và mật khẩu để đăng nhập!
							</p>
						</div>
						<div>
							<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-5">
								<GoogleLoginButton />
								<FacebookLoginButton />
							</div>
							<div className="relative py-3">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
										Hoặc
									</span>
								</div>
							</div>

							<SignInForm />

							<p className="mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400">
								Bạn chưa có tài khoản?{' '}
								<Link
									to={ROUTES.SIGNUP}
									className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
								>
									Đăng ký ngay
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SignIn
