import { LightGrayCheckIcon, WhiteCheckIcon } from '@/assets/icons'
import { getDynamicClasses, getHintClasses } from '@/utils'

const Checkbox = ({
	id,
	name,
	label,
	isRequire = false,
	checked,
	onChange,
	onBlur,
	className,
	disabled = false,
	success = false,
	error = false,
	hint,
}) => {
	const checkLabelClasses = getDynamicClasses({
		baseClasses: 'flex items-center space-x-3 group cursor-pointer',
		stateClasses: [{ class: 'cursor-not-allowed opacity-60', condition: disabled }],
	})

	const checkboxClasses = getDynamicClasses(
		{
			baseClasses:
				'w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60',
		},
		{ className }
	)

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			<div className="relative flex items-center gap-3">
				<label htmlFor={id} className={checkLabelClasses}>
					<div className="relative w-5 h-5">
						<input
							id={id}
							name={name}
							type="checkbox"
							className={checkboxClasses}
							checked={!!checked}
							onChange={(e) => onChange?.(e.target.checked)}
							onBlur={onBlur}
							disabled={disabled}
						/>
						{checked && <WhiteCheckIcon />}
						{disabled && <LightGrayCheckIcon />}
					</div>

					{label && (
						<span className="text-sm font-medium text-gray-800 dark:text-gray-200">
							{label} {isRequire && <span className="text-error-500">*</span>}
						</span>
					)}
				</label>
			</div>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default Checkbox
