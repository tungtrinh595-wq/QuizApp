import { useSelector } from 'react-redux'

import { useAuthInit } from '@/hooks'
import { Loader, Maintenance } from '@/components'

const AppInitializer = ({ children }) => {
	const auth = useSelector((state) => state.auth)
	useAuthInit()

	if (import.meta.env.VITE_MAINTENANCE_MODE === 'on') return <Maintenance />
	if (auth.isPageLoading) return <Loader />
	return children
}

export default AppInitializer
