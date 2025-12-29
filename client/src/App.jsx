import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'

import { AppRoutes } from '@/routes'
import { AppInitializer, SocketListener } from '@/components'

const App = () => {
	return (
		<HelmetProvider>
			<AppInitializer>
				<SocketListener />
				<AppRoutes />
				<ToastContainer position="bottom-right" autoClose={3000} />
			</AppInitializer>
		</HelmetProvider>
	)
}

export default App
