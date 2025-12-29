import { Link } from 'react-router-dom'

import { getDynamicClasses } from '@/utils'

const DropdownItem = ({ tag = 'button', to, onClick, onItemClick, className, children }) => {
	const itemClasses = getDynamicClasses(
		{
			baseClasses:
				'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
		},
		{ className }
	)

	const handleClick = (event) => {
		if (tag === 'button') {
			event.preventDefault()
		}
		if (onClick) onClick()
		if (onItemClick) onItemClick()
	}

	if (tag === 'a' && to) {
		return (
			<Link to={to} className={itemClasses} onClick={handleClick}>
				{children}
			</Link>
		)
	}

	return (
		<button onClick={handleClick} className={itemClasses}>
			{children}
		</button>
	)
}

export default DropdownItem
