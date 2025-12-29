import { Link } from 'react-router-dom'

import { ROLE, ROUTES } from '@/constants'
import { PageMeta, GridShape } from '@/components'

const NotFound = ({ mode = ROLE.USER }) => {
	return (
		<>
			<PageMeta
				title="404 - Page Not Found | Quiz App"
				description="Oops! The page you're looking for doesn't exist. Explore quizzes, user profiles, and more on Quiz App — your Tailwind-powered React dashboard."
			/>
			<div className="flex-grow relative flex flex-col items-center justify-center p-6 overflow-hidden z-1">
				<GridShape />
				<div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
					<h1 className="mb-8 font-bold text-gray-800 dark:text-white/90 text-title-md xl:text-title-2xl">
						ERROR
					</h1>

					<img src="/images/error/404.svg" alt="404" className="dark:hidden" />
					<img
						src="/images/error/404-dark.svg"
						alt="404"
						className="hidden dark:block"
					/>

					<p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
						Có vẻ như chúng tôi không thể tìm thấy trang bạn đang tìm kiếm!
					</p>

					<Link
						to={
							mode === ROLE.ADMIN.value ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME
						}
						className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
					>
						Quay lại Trang chủ
					</Link>
				</div>
			</div>
		</>
	)
}

export default NotFound
