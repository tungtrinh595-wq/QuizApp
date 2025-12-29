import { cloneElement, useCallback, useEffect, useRef, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'

import { PAGE_TITLES, ROUTES } from '@/constants'
import {
	GridIcon,
	BookIcon,
	UsersIcon,
	TableIcon,
	PersonIcon,
	QuestionIcon,
	HorizontaLDots,
	ChalkboardIcon,
	ChevronDownIcon,
} from '@/assets/icons'
import { useSidebar } from '@/contexts'

const navItems = [
	{
		icon: <GridIcon />,
		name: PAGE_TITLES.ADMIN.DASHBOARD,
		path: ROUTES.ADMIN_DASHBOARD,
	},
	{
		name: PAGE_TITLES.ADMIN.TABLES,
		icon: <TableIcon />,
		subItems: [
			{
				name: PAGE_TITLES.ADMIN.USERS,
				icon: <UsersIcon />,
				path: ROUTES.ADMIN.USERS,
				childs: [ROUTES.ADMIN.USER_DETAILS],
			},
			{
				name: PAGE_TITLES.ADMIN.SUBJECTS,
				icon: <BookIcon />,
				path: ROUTES.ADMIN.SUBJECTS,
				childs: [
					ROUTES.ADMIN.SUBJECT_DETAILS,
					ROUTES.ADMIN.SUBJECT_LESSON_DETAILS,
					ROUTES.ADMIN.SUBJECT_QUIZ_DETAILS,
				],
			},
			{
				name: PAGE_TITLES.ADMIN.LESSONS,
				icon: <ChalkboardIcon />,
				path: ROUTES.ADMIN.LESSONS,
				childs: [ROUTES.ADMIN.LESSON_DETAILS],
			},
			{
				name: PAGE_TITLES.ADMIN.QUIZZES,
				icon: <QuestionIcon />,
				path: ROUTES.ADMIN.QUIZZES,
				childs: [ROUTES.ADMIN.QUIZ_DETAILS],
			},
		],
	},
	{
		icon: <PersonIcon />,
		name: PAGE_TITLES.USER_PROFILE,
		path: ROUTES.ADMIN.PROFILE,
	},
]

const menuTypes = ['main']

const AdminSidebar = () => {
	const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar()
	const location = useLocation()

	const [openSubmenu, setOpenSubmenu] = useState(null)
	const [subMenuHeight, setSubMenuHeight] = useState({})
	const subMenuRefs = useRef({})

	const isActive = useCallback(
		(path, childs = []) => {
			return (
				(typeof path === 'string' && matchPath(path, location.pathname)) ||
				childs.some((child) => typeof child === 'string' && matchPath(child, location.pathname))
			)
		},
		[location.pathname]
	)

	useEffect(() => {
		let submenuMatched = false

		menuTypes.forEach((menuType) => {
			let items = []
			if (menuType === 'main') items = navItems

			items.forEach((nav, index) => {
				if (nav.subItems) {
					nav.subItems.forEach((subItem) => {
						if (isActive(subItem.path, subItem.childs || [])) {
							setOpenSubmenu({ type: menuType, index })
							submenuMatched = true
						}
					})
				}
			})
		})

		if (!submenuMatched) {
			setOpenSubmenu(null)
		}
	}, [location, isActive])

	useEffect(() => {
		if (openSubmenu !== null) {
			const key = `${openSubmenu.type}-${openSubmenu.index}`
			const el = subMenuRefs.current[key]
			if (el) {
				setSubMenuHeight((prev) => ({
					...prev,
					[key]: el.scrollHeight || 0,
				}))
			}
		}
	}, [openSubmenu])

	const handleSubmenuToggle = (index, menuType) => {
		setOpenSubmenu((prev) => {
			if (prev && prev.type === menuType && prev.index === index) {
				return null
			}
			return { type: menuType, index }
		})
	}

	const handleClickSidebarLink = () => {
		if (isMobileOpen) {
			toggleMobileSidebar()
		}
	}

	const renderMenuItems = (items, menuType) => (
		<ul className="flex flex-col gap-4">
			{items.map((nav, index) => (
				<li key={nav.name}>
					{nav.subItems ? (
						<button
							onClick={() => handleSubmenuToggle(index, menuType)}
							className={`menu-item group ${
								openSubmenu?.type === menuType && openSubmenu?.index === index
									? 'menu-item-active'
									: 'menu-item-inactive'
							} cursor-pointer ${
								!isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
							}`}
						>
							<span
								className={`menu-item-icon-size ${
									openSubmenu?.type === menuType && openSubmenu?.index === index
										? 'menu-item-icon-active'
										: 'menu-item-icon-inactive'
								}`}
							>
								{cloneElement(nav.icon, {
									className: `${
										isActive(openSubmenu?.type === menuType)
											? 'menu-dropdown-item-active-icon'
											: 'menu-dropdown-item-inactive-icon'
									}`,
								})}
							</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className="menu-item-text">{nav.name}</span>
							)}
							{(isExpanded || isHovered || isMobileOpen) && (
								<ChevronDownIcon
									className={`ml-auto w-5 h-5 transition-transform duration-200 ${
										openSubmenu?.type === menuType && openSubmenu?.index === index
											? 'rotate-180 text-brand-500'
											: ''
									}`}
								/>
							)}
						</button>
					) : (
						nav.path && (
							<Link
								to={nav.path}
								className={`menu-item group ${
									isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
								}`}
								onClick={() => handleClickSidebarLink()}
							>
								<span
									className={`menu-item-icon-size ${
										isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
									}`}
								>
									{cloneElement(nav.icon, {
										className: `${
											isActive(nav.path)
												? 'menu-dropdown-item-active-icon'
												: 'menu-dropdown-item-inactive-icon'
										}`,
									})}
								</span>
								{(isExpanded || isHovered || isMobileOpen) && (
									<span className="menu-item-text">{nav.name}</span>
								)}
							</Link>
						)
					)}
					{nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
						<div
							ref={(el) => {
								subMenuRefs.current[`${menuType}-${index}`] = el
							}}
							className="overflow-hidden transition-all duration-300"
							style={{
								height:
									openSubmenu?.type === menuType && openSubmenu?.index === index
										? `${subMenuHeight[`${menuType}-${index}`]}px`
										: '0px',
							}}
						>
							<ul className="mt-2 space-y-1 ml-9">
								{nav.subItems.map((subItem) => (
									<li key={subItem.name}>
										<Link
											to={subItem.path}
											className={`menu-dropdown-item ${
												isActive(subItem.path, subItem.childs)
													? 'menu-dropdown-item-active'
													: 'menu-dropdown-item-inactive'
											}`}
											onClick={() => handleClickSidebarLink()}
										>
											{subItem.icon && (
												<span className="menu-item-icon-size">
													{cloneElement(subItem.icon, {
														className: `${
															isActive(subItem.path, subItem.childs)
																? 'menu-dropdown-item-active-icon'
																: 'menu-dropdown-item-inactive-icon'
														}`,
													})}
												</span>
											)}
											{subItem.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</li>
			))}
		</ul>
	)

	return (
		<aside
			className={`fixed top-0 left-0 z-50 h-screen px-5 mt-16 lg:mt-0 flex flex-col bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 border-r border-gray-200 transition-all duration-300 ease-in-out
				${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
				${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				className={`hidden lg:flex py-8 ${
					!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
				}`}
			>
				<Link to={ROUTES.HOME}>
					{isExpanded || isHovered || isMobileOpen ? (
						<>
							<img
								className="dark:hidden"
								src="/images/logo/logo.svg"
								alt="Logo"
								width={150}
								height={40}
							/>
							<img
								className="hidden dark:block"
								src="/images/logo/logo-dark.svg"
								alt="Logo"
								width={150}
								height={40}
							/>
						</>
					) : (
						<img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
					)}
				</Link>
			</div>

			<div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
				<nav className="mb-6">
					<div className="flex flex-col gap-4">
						<div>
							<h2
								className={`mt-4 lg:mt-0 mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
									!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									'Menu'
								) : (
									<HorizontaLDots className="size-6" />
								)}
							</h2>
							{renderMenuItems(navItems, 'main')}
						</div>
					</div>
				</nav>
			</div>
		</aside>
	)
}

export default AdminSidebar
