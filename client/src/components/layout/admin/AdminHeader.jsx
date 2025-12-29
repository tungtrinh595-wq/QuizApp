import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { HamburgerIcon, HamburgerMobileCloseIcon, ToggleApplicationMenuIcon } from '@/assets/icons'
import { useSidebar } from '@/contexts'
import { getDynamicClasses } from '@/utils'
import { UserDropdown } from '@/features'
import { ThemeToggleButton } from '@/components'

const AdminHeader = () => {
	const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false)

	const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar()

	const handleToggle = () => {
		if (window.innerWidth >= 1024) {
			toggleSidebar()
		} else {
			toggleMobileSidebar()
		}
	}

	const toggleApplicationMenu = () => {
		setApplicationMenuOpen((prev) => !prev)
	}

	const inputRef = useRef(null)

	useEffect(() => {
		const handleKeyDown = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault()
				inputRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const rightMenuClasses = getDynamicClasses({
		baseClasses:
			'items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none',
		stateClasses: [
			{ class: 'flex', condition: isApplicationMenuOpen },
			{ class: 'hidden', condition: !isApplicationMenuOpen },
		],
	})

	return (
		<header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
			<div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
				<div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
					<button
						className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
						onClick={handleToggle}
						aria-label="Toggle Sidebar"
					>
						{isMobileOpen ? <HamburgerMobileCloseIcon /> : <HamburgerIcon />}
					</button>

					<Link to={ROUTES.HOME} className="lg:hidden">
						<img className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" />
						<img className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" />
					</Link>

					<button
						onClick={toggleApplicationMenu}
						className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
					>
						<ToggleApplicationMenuIcon />
					</button>
				</div>
				<div className={rightMenuClasses}>
					<div className="flex items-center gap-2 2xsm:gap-3">
						<ThemeToggleButton />
					</div>
					<UserDropdown />
				</div>
			</div>
		</header>
	)
}

export default AdminHeader
