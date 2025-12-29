import { createContext, useContext, useState } from 'react'

import { useResponsiveResize } from '@/hooks'

const SidebarContext = createContext(undefined)

export const useSidebar = () => {
	const context = useContext(SidebarContext)
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider')
	}
	return context
}

export const SidebarProvider = ({ children }) => {
	const [isExpanded, setIsExpanded] = useState(true)
	const [isMobileOpen, setIsMobileOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [isHovered, setIsHovered] = useState(false)
	const [activeItem, setActiveItem] = useState(null)
	const [openSubmenu, setOpenSubmenu] = useState(null)

	useResponsiveResize({
		onMobileResize: () => setIsMobile(true),
		onDesktopResize: () => {
			setIsMobile(false)
			setIsMobileOpen(false)
		},
	})

	const toggleSidebar = () => {
		setIsExpanded((prev) => !prev)
	}

	const toggleMobileSidebar = () => {
		setIsMobileOpen((prev) => !prev)
	}

	const toggleSubmenu = (item) => {
		setOpenSubmenu((prev) => (prev === item ? null : item))
	}

	return (
		<SidebarContext.Provider
			value={{
				isExpanded: isMobile ? false : isExpanded,
				isMobileOpen,
				isHovered,
				activeItem,
				openSubmenu,
				toggleSidebar,
				toggleMobileSidebar,
				setIsHovered,
				setActiveItem,
				toggleSubmenu,
			}}
		>
			{children}
		</SidebarContext.Provider>
	)
}
