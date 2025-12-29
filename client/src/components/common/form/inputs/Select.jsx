import { useState } from 'react'

import { getDynamicClasses, getHintClasses } from '@/utils'
import { Label } from '@/components'

const Select = ({
	id,
	name,
	options,
	label,
	isRequire = false,
	placeholder = 'Select an option',
	value = '',
	onChange,
	onBlur,
	className,
	size = 'md',
	success = false,
	error = false,
	hint,
	allowReset = false,
}) => {
	const [selectedValue, setSelectedValue] = useState(value)
	const normalizedOptions = options.map((opt) =>
		typeof opt === 'object' ? opt : { value: opt, label: String(opt) }
	)

	const handleChange = (e) => {
		const value = e.target.value
		setSelectedValue(value)
		if (onChange) onChange(value)
	}

	const selectClasses = getDynamicClasses(
		{
			baseClasses:
				'w-full appearance-none rounded-lg border bg-transparent text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10',
			stateClasses: [
				{
					class:
						'border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800',
					condition: error,
				},
				{
					class:
						'border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800',
					condition: !error && success,
				},
				{
					class:
						'border-gray-300 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
					condition: !error && !success,
				},
				{
					class: 'text-gray-800 dark:text-white/90',
					condition: selectedValue,
				},
				{
					class: 'text-gray-400 dark:text-gray-400',
					condition: !selectedValue,
				},
			],
			variantClasses: [
				{
					size: {
						sm: 'h-7 px-2 py-1 pr-5',
						md: 'h-11 px-4 py-2.5 pr-11',
					},
				},
			],
		},
		{ size, className }
	)

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			{label && (
				<Label htmlFor={id || name}>
					{label} {isRequire && <span className="text-error-500">*</span>}
				</Label>
			)}

			<select
				id={id}
				className={selectClasses}
				name={name}
				value={selectedValue}
				onChange={handleChange}
				onBlur={onBlur}
			>
				<option
					disabled={!allowReset}
					value=""
					className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
				>
					{placeholder}
				</option>
				{normalizedOptions.map((option) => (
					<option
						key={option.value}
						value={option.value}
						className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
					>
						{option.label}
					</option>
				))}
			</select>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default Select
