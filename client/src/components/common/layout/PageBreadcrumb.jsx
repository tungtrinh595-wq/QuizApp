import { Link } from 'react-router-dom'

import { ChevronRightIcon } from '@/assets/icons'

const PageBreadcrumb = ({ breadcrumbs = [], pageTitle, showPageTitle = true }) => {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3">
			{showPageTitle && (
				<h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{pageTitle}</h2>
			)}
			<nav>
				<ol className="flex flex-wrap items-center gap-1.5">
					{breadcrumbs.map((item, index) => (
						<li key={index} className="flex flex-wrap items-center gap-1.5">
							<Link
								to={item.link}
								className="inline-flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
							>
								{item.title}
								<ChevronRightIcon />
							</Link>
						</li>
					))}
					<li className="text-sm text-gray-800 dark:text-white/90">{pageTitle}</li>
				</ol>
			</nav>
		</div>
	)
}

export default PageBreadcrumb
