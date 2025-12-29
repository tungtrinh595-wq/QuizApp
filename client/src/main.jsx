import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/contexts'
import store from '@/store'
import App from '@/App'
import '@/styles/main.css'

const router = createBrowserRouter([{ path: '/*', element: <App /> }])
const root = createRoot(document.getElementById('root'))

root.render(
	<StrictMode>
		<ThemeProvider>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<Provider store={store}>
					<RouterProvider router={router} />
				</Provider>
			</GoogleOAuthProvider>
		</ThemeProvider>
	</StrictMode>
)
