import { getDynamicClasses } from '@/utils'

const Button = ({
	children,
	block = 'inlineFlex',
	position = 'none',
	size = 'lg',
	variant = 'primary',
	color = 'primary',
	startIcon,
	endIcon,
	onClick,
	className,
	disabled = false,
	disableText = 'đang xử lý ..',
	disableComponent,
	type = 'button',
}) => {
	const buttonClasses = getDynamicClasses(
		{
			stateClasses: [{ class: 'cursor-not-allowed opacity-50', condition: disabled }],
			variantClasses: [
				{
					block: {
						inlineFlex: 'inline-flex items-center justify-center transition',
						absolute: 'absolute',
					},
				},
				{
					position: {
						none: '',
						full: 'top-0 bottom-0 left-0 right-0',
						center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
						topLeft: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
						topRight: 'top-0 right-0 -translate-x-1/2 -translate-y-1/2',
						bottomLeft: 'bottom-0 left-0 -translate-x-1/2 -translate-y-1/2',
						bottomRight: 'bottom-0 right-0 -translate-x-1/2 -translate-y-1/2',
					},
				},
				{
					size: {
						xs: 'px-2 py-1 text-sm gap-1 h-[28px]',
						sm: 'px-3 py-2 text-sm gap-2',
						md: 'px-4 py-3 text-sm gap-2',
						lg: 'px-5 py-3.5 text-sm gap-2',
					},
				},
				{
					variant: {
						primary: 'rounded-lg shadow-theme-xs',
						outline: 'rounded-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-700',
						round: 'rounded-full font-medium lg:inline-flex lg:w-auto border shadow-theme-xs',
						roundGroup:
							'rounded-full font-medium lg:inline-flex lg:w-auto whitespace-nowrap group border shadow-theme-xs dark:border-gray-700',
						hoverFadeIn:
							'absolute top-[70%] left-0 w-full h-[30%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out',
						clean: 'group',
					},
				},
				{
					color: {
						primary: 'bg-brand-500 text-white fill-white hover:bg-brand-600 disabled:bg-brand-300',
						gray: 'bg-white text-gray-700 fill-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
						lightGray: 'bg-gray-300 text-brand-950 fill-brand-950 hover:bg-gray-400',
						neutral:
							'border-gray-300 bg-white dark:bg-gray-800 dark:hover:bg-white/[0.03] text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200',
						warning:
							'border-warning-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:hover:bg-white/[0.03] text-warning-700 hover:bg-warning-50 hover:text-warning-800 dark:hover:text-warning-500',
						dark: 'bg-black/50',
						clean: '',
					},
				},
			],
		},
		{ block, position, size, variant, color, className }
	)

	const isText = (children) => {
		return typeof children === 'string' || typeof children === 'number'
	}

	return (
		<button className={buttonClasses} onClick={onClick} disabled={disabled} type={type}>
			{startIcon && <span className="flex items-center">{startIcon}</span>}
			{disabled ? (isText(children) ? disableText : disableComponent || children) : children}
			{endIcon && <span className="flex items-center">{endIcon}</span>}
		</button>
	)
}

export default Button
