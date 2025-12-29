import { getDynamicClasses } from '@/utils'

const Label = ({ tag = 'label', htmlFor, children, className = '' }) => {
	const labelClasses = getDynamicClasses(
		{
			baseClasses: 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',
		},
		{ className }
	)

	if (tag === 'p') return <p className={labelClasses}>{children}</p>

	if (tag === 'span') return <span className={labelClasses}>{children}</span>

	return (
		<label htmlFor={htmlFor} className={labelClasses}>
			{children}
		</label>
	)
}

export default Label
