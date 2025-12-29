import { getDynamicClasses, getHintClasses } from '@/utils'

const RadioSm = ({
	id,
	name,
	value = '',
	checked,
	label,
	onChange,
	onBlur,
	className,
	success = false,
	error = false,
	hint,
}) => {
	const radioClasses = getDynamicClasses(
		{
			baseClasses:
				'flex cursor-pointer select-none items-center text-sm text-gray-500 dark:text-gray-400',
		},
		{ className }
	)

	const checkedClasses = getDynamicClasses({
		baseClasses: 'mr-2 flex h-4 w-4 items-center justify-center rounded-full border',
		stateClasses: [
			{ class: 'border-brand-500 bg-brand-500', condition: checked },
			{ class: 'bg-transparent border-gray-300 dark:border-gray-700', condition: !checked },
		],
	})

	const spanCheckedClasses = getDynamicClasses({
		baseClasses: 'h-1.5 w-1.5 rounded-full',
		stateClasses: [
			{ class: 'bg-white', condition: checked },
			{ class: 'bg-white dark:bg-[#1e2636]', condition: !checked },
		],
	})

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			<label htmlFor={id} className={radioClasses}>
				<span className="relative">
					<input
						type="radio"
						id={id}
						name={name}
						value={value}
						checked={checked}
						onChange={() => onChange(value)}
						onBlur={onBlur}
						className="sr-only"
					/>
					<span className={checkedClasses}>
						<span className={spanCheckedClasses}></span>
					</span>
				</span>
				{label}
			</label>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default RadioSm
