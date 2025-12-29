import { useEffect } from 'react'

export const useQuizGuard = (isActive) => {
	useEffect(() => {
		if (!isActive) return

		const handleBeforeUnload = (e) => {
			e.preventDefault()
			e.returnValue = ''
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isActive])
}
