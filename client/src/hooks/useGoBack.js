import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants'

export const useGoBack = () => {
	const navigate = useNavigate()

	const goBack = () => {
		if (window.history.state && window.history.state.idx > 0) {
			navigate(-1)
		} else {
			navigate(ROUTES.HOME)
		}
	}

	return goBack
}
