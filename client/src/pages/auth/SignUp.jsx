import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { ChevronLeftIcon } from '@/assets/icons'
import { SignUpForm, GoogleLoginButton, FacebookLoginButton } from '@/features'
import { PageMeta } from '@/components'

const SignUp = () => {
	return (
		<>
			<PageMeta
				title="Đăng ký | Quiz App"
				description="Tạo tài khoản để bắt đầu khám phá các bài kiểm tra, theo dõi tiến trình và mở khóa các tính năng cá nhân hoá trên Quiz App — được xây dựng bằng React và Tailwind CSS."
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
								Đăng ký
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Nhập email và mật khẩu để tạo tài khoản!
							</p>
						</div>
						<div>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
								<GoogleLoginButton label="Đăng ký bằng Google" />
								<FacebookLoginButton label="Đăng ký bằng Facebook" />
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

							<SignUpForm />

							<p className="mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400">
								Bạn đã có tài khoản?{' '}
								<Link
									to={ROUTES.SIGNIN}
									className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
								>
									Đăng nhập
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SignUp
