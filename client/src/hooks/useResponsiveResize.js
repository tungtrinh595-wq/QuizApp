import { useState, useEffect } from 'react'
import debounce from 'lodash/debounce'

import { MOBILE_BREAK } from '@/constants'

export const useResponsiveResize = ({
	onMobileResize,
	onDesktopResize,
	delay = 150,
} = {}) => {
	const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAK)

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < MOBILE_BREAK
			setIsMobile(mobile)

			if (mobile) {
				onMobileResize?.()
			} else {
				onDesktopResize?.()
			}
		}

		const debouncedResize = debounce(handleResize, delay)
		window.addEventListener('resize', debouncedResize)
		handleResize()

		return () => window.removeEventListener('resize', debouncedResize)
	}, [delay, onMobileResize, onDesktopResize])

	return isMobile
}
