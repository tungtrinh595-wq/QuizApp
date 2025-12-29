import { getDynamicClasses, getHintClasses } from '@/utils'
import { Label } from '@/components'

const TextArea = ({
	id,
	name,
	label,
	isRequire = false,
	placeholder = 'Enter your message',
	rows = 3,
	value = '',
	onChange,
	onBlur,
	className,
	disabled = false,
	success = false,
	error = false,
	hint,
}) => {
	const textareaClasses = getDynamicClasses(
		{
			baseClasses:
				'w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden',
			stateClasses: [
				{
					class:
						'bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
					condition: disabled,
				},
				{
					class:
						'bg-transparent border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800',
					condition: !disabled && error,
				},
				{
					class:
						'bg-transparent text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800',
					condition: !disabled && !error,
				},
			],
		},
		{ className }
	)

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			{label && (
				<Label htmlFor={id || name}>
					{label} {isRequire && <span className="text-error-500">*</span>}
				</Label>
			)}

			<div className="relative">
				<textarea
					id={id}
					name={name}
					placeholder={placeholder}
					rows={rows}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					className={textareaClasses}
				/>
				{hint && <p className={hintClasses}>{hint}</p>}
			</div>
		</>
	)
}

export default TextArea
