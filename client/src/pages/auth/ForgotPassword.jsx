import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { ChevronLeftIcon } from '@/assets/icons'
import { RequestPasswordResetForm } from '@/features'
import { PageMeta } from '@/components'

const ForgotPassword = () => {
	return (
		<>
			<PageMeta
				title="Quên mật khẩu | Ứng dụng Quiz"
				description="Nhập email của bạn để nhận liên kết khôi phục mật khẩu. Hệ thống Quiz App giúp bạn lấy lại quyền truy cập một cách nhanh chóng và an toàn."
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
								Nhập email để gửi yêu cầu lấy lại mật khẩu!
							</p>
						</div>
						<div>
							<RequestPasswordResetForm />
							<p className="mt-5 text-sm font-normal text-center text-gray-700 dark:text-gray-400">
								Đăng nhập bằng tài khoản khác?{' '}
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

export default ForgotPassword
