import { useEffect, useRef, useState } from 'react'

export const useQuizTimer = (startTime, timeLimit, onWarning) => {
	const hasWarned = useRef(false)
	const [timeLeft, setTimeLeft] = useState(0)

	useEffect(() => {
		if (!startTime || !timeLimit) return

		const endTime = new Date(new Date(startTime).getTime() + timeLimit * 60 * 1000)
		let interval

		const updateTime = () => {
			const now = new Date()
			const left = Math.max(endTime.getTime() - now.getTime(), 0)
			setTimeLeft(left)

			if (left <= 5 * 60 * 1000 && !hasWarned.current) {
				onWarning?.()
				hasWarned.current = true
			}

			if (left <= 0 && interval) clearInterval(interval)
		}

		updateTime()
		interval = setInterval(updateTime, 1000)

		return () => clearInterval(interval)
	}, [startTime, timeLimit])

	return timeLeft
}
