import { Outlet } from 'react-router-dom'

import { SidebarProvider, useSidebar } from '@/contexts'
import { getDynamicClasses } from '@/utils'
import { AdminHeader, AdminSidebar, Backdrop } from '@/components'

const LayoutContent = () => {
	const { isExpanded, isHovered, isMobileOpen } = useSidebar()

	const layoutClasses = getDynamicClasses({
		baseClasses: 'flex-grow flex-1 transition-all duration-300 ease-in-out',
		stateClasses: [
			{ class: 'lg:ml-[290px]', condition: isExpanded || isHovered },
			{ class: 'lg:ml-[90px]', condition: !isExpanded && !isHovered },
			{ class: 'ml-0', condition: isMobileOpen },
		],
	})

	return (
		<div className="min-h-screen flex flex-col flex-1 transition-all duration-300 ease-in-out">
			<div>
				<AdminSidebar />
				<Backdrop />
			</div>
			<div className={layoutClasses}>
				<AdminHeader />
				<div className="p-4 mx-auto max-w-screen-2xl md:p-6">
					<Outlet />
				</div>
			</div>
		</div>
	)
}

const AdminLayout = () => {
	return (
		<SidebarProvider>
			<LayoutContent />
		</SidebarProvider>
	)
}

export default AdminLayout
