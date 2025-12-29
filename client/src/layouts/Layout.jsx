import { Outlet } from 'react-router-dom'

import { SidebarProvider } from '@/contexts'
import { Header, Footer, Backdrop, Sidebar } from '@/components'

const LayoutContent = () => {
	return (
		<div className="min-h-screen flex flex-col flex-1 transition-all duration-300 ease-in-out">
			<div>
				<Sidebar />
				<Backdrop />
			</div>
			<div className="flex-grow flex flex-col">
				<Header />
				<div className="flex-grow flex flex-col w-full">
					<Outlet />
				</div>
			</div>
			<Footer />
		</div>
	)
}

const Layout = () => {
	return (
		<SidebarProvider>
			<LayoutContent />
		</SidebarProvider>
	)
}

export default Layout
