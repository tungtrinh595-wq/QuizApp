import { useEffect, useRef } from 'react'

import { getDynamicClasses } from '@/utils'

const Dropdown = ({
	isOpen,
	onClose,
	children,
	className,
	position = 'right',
	mobilePosition = 'right',
}) => {
	const dropdownRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (event) => {
			const target = event.target

			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(target) &&
				!target.closest('.dropdown-toggle')
			) {
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [onClose])

	if (!isOpen) return null

	const dropdownClasses = getDynamicClasses(
		{
			baseClasses:
				'absolute z-40 mt-2 rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark',
			variantClasses: [
				{
					position: {
						left: 'lg:right-auto lg:left-0',
						right: 'lg:left-auto lg:right-0',
					},
				},
				{
					mobilePosition: {
						left: 'left-0',
						right: 'right-0',
					},
				},
			],
		},
		{ position, mobilePosition, className }
	)

	return (
		<div ref={dropdownRef} className={dropdownClasses}>
			{children}
		</div>
	)
}

export default Dropdown
