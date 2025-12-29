import React from 'react'
import DatePickerLib from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { getDynamicClasses, getHintClasses } from '@/utils'
import { Label } from '@/components'

const DatePicker = ({
	id,
	name,
	label,
	isRequire,
	value,
	onChange,
	placeholder,
	showTimeSelect = true,
	dateFormat = 'dd-MM-yyyy, hh:mm aa',
	className,
	disabled = false,
	success = false,
	error = false,
	hint,
	size = 'md',
}) => {
	const datePickerClasses = getDynamicClasses(
		{
			baseClasses:
				'w-full rounded-lg border appearance-none text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
			stateClasses: [
				{
					class:
						'text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
					condition: disabled,
				},
				{
					class:
						'border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800',
					condition: !disabled && error,
				},
				{
					class:
						'border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800',
					condition: !disabled && !error && success,
				},
				{
					class:
						'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800',
					condition: !disabled && !error && !success,
				},
			],
			variantClasses: [
				{
					size: {
						sm: 'h-7 px-2 py-1',
						md: 'h-11 px-4 py-2.5',
					},
				},
			],
		},
		{ size, className }
	)

	const hintClasses = getHintClasses({ error, success })

	return (
		<div>
			{label && (
				<Label htmlFor={id || name}>
					{label} {isRequire && <span className="text-error-500">*</span>}
				</Label>
			)}
			<div>
				<DatePickerLib
					selected={value ? new Date(value) : null}
					onChange={onChange}
					placeholderText={placeholder}
					showTimeSelect={showTimeSelect}
					dateFormat={dateFormat}
					className={datePickerClasses}
				/>

				{hint && <p className={hintClasses}>{hint}</p>}
			</div>
		</div>
	)
}

export default DatePicker
