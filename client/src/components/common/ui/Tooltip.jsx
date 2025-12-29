import { getDynamicClasses } from '@/utils'

const Tooltip = ({
	children,
	content,
	position = 'top',
	className = '',
	tooltipClassName = '',
	tooltipMinWidth = '90px',
	tooltipMaxWidth = '100%',
	disabled = false,
}) => {
	const containerClasses = getDynamicClasses(
		{
			baseClasses: 'relative group inline-block',
		},
		{ className }
	)

	const tooltipClasses = getDynamicClasses(
		{
			baseClasses: 'absolute z-9 hidden px-2 py-1 text-sm text-white bg-gray-800 rounded w-fit',
			stateClasses: [{ class: 'group-hover:block', condition: !disabled }],
			variantClasses: [
				{
					position: {
						top: 'left-1/2 bottom-full mb-2 -translate-x-1/2',
						bottom: 'left-1/2 top-full mt-2 -translate-x-1/2',
						left: 'top-1/2 right-full mr-2 -translate-y-1/2',
						right: 'top-1/2 left-full ml-2 -translate-y-1/2',
						topleft: 'right-0 bottom-full mb-2',
						topRight: 'left-0 bottom-full mb-2',
						bottomleft: 'right-0 top-full mt-2',
						bottomRight: 'left-0 top-full mt-2',
					},
				},
			],
		},
		{ position, className: tooltipClassName }
	)

	return (
		<div className={containerClasses}>
			{children}
			{content && (
				<span
					style={{
						minWidth: tooltipMinWidth,
						maxWidth: tooltipMaxWidth,
					}}
					className={tooltipClasses}
				>
					{content}
				</span>
			)}
		</div>
	)
}

export default Tooltip
