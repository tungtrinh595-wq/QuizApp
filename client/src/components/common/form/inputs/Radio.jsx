import { getDynamicClasses, getHintClasses } from '@/utils'

const Radio = ({
	id,
	name,
	value = '',
	checked,
	label,
	onChange,
	onBlur,
	className,
	disabled = false,
	success = false,
	error = false,
	hint,
}) => {
	const radioClasses = getDynamicClasses(
		{
			baseClasses:
				'relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium',
			stateClasses: [
				{ class: 'text-gray-300 dark:text-gray-600 cursor-not-allowed', condition: disabled },
				{ class: 'text-gray-700 dark:text-gray-400', condition: !disabled },
			],
		},
		{ className }
	)

	const checkedClasses = getDynamicClasses({
		baseClasses: 'flex h-5 w-5 items-center justify-center rounded-full border-[1.25px]',
		stateClasses: [
			{ class: 'border-brand-500 bg-brand-500', condition: checked },
			{ class: 'bg-transparent border-gray-300 dark:border-gray-700', condition: !checked },
			{
				class: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700',
				condition: disabled,
			},
		],
	})

	const spanCheckedClasses = getDynamicClasses({
		baseClasses: 'h-2 w-2 rounded-full bg-white',
		stateClasses: [
			{ class: 'block', condition: checked },
			{ class: 'hidden', condition: !checked },
		],
	})

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			<label htmlFor={id} className={radioClasses}>
				<input
					id={id}
					name={name}
					type="radio"
					value={value}
					checked={checked}
					onChange={() => !disabled && onChange(value)}
					onBlur={onBlur}
					className="sr-only"
					disabled={disabled}
				/>
				<span className={checkedClasses}>
					<span className={spanCheckedClasses}></span>
				</span>
				{label}
			</label>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default Radio
