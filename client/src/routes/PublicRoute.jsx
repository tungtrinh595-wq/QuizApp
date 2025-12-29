import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { useQuizAccessGuard } from '@/hooks'

const PublicRoute = () => {
	const auth = useSelector((state) => state.auth)
	useQuizAccessGuard(auth.me?.id)
	return <Outlet />
}

export default PublicRoute
