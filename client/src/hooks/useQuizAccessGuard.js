import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { WARNING_MESSAGES } from '@/constants'
import { handleWarning } from '@/utils'

export const useQuizAccessGuard = (userId) => {
	const location = useLocation()
	const navigate = useNavigate()
	const hasWarnedRef = useRef(false)
	const [shouldRedirect, setShouldRedirect] = useState(false)
	const [redirectPath, setRedirectPath] = useState(null)

	const resetQuizAccessGuard = () => {
		setRedirectPath(null)
		setShouldRedirect(false)
	}

	useEffect(() => {
		if (userId) {
			const raw = localStorage.getItem('doingQuiz')
			if (!raw || hasWarnedRef.current) return

			const doingQuiz = JSON.parse(raw)
			if (doingQuiz) {
				const isDoingQuiz =
					doingQuiz.quizId && doingQuiz.userId && doingQuiz.userId === userId
				const isOnQuizPage = location.pathname === doingQuiz.quizRoute
				const isAllowedToAccess = !isDoingQuiz || isOnQuizPage

				if (isDoingQuiz && !isAllowedToAccess) {
					setTimeout(() => handleWarning(WARNING_MESSAGES.QUIZ_PROGRESS))
					hasWarnedRef.current = true
					setRedirectPath(doingQuiz.quizRoute)
					setShouldRedirect(true)
				} else {
					resetQuizAccessGuard()
				}
			} else {
				resetQuizAccessGuard()
			}
		} else {
			resetQuizAccessGuard()
		}
	}, [userId, location.pathname])

	useEffect(() => {
		if (shouldRedirect && redirectPath) {
			const timeout = setTimeout(() => navigate(redirectPath))
			return () => clearTimeout(timeout)
		}
	}, [shouldRedirect, redirectPath, navigate])
}
