import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { DATE_FORMAT } from '@/constants'
import { getDynamicClasses, getHintClasses } from '@/utils'
import { Label } from '@/components'

const DateRangePicker = ({
	id,
	name,
	label,
	placeholder,
	onChange,
	onBlur,
	className,
	size = 'md',
	success = false,
	error = false,
	hint,
}) => {
	const [localRange, setLocalRange] = useState({
		startDate: null,
		endDate: null,
	})

	const handleChange = (dates) => {
		const [startDate, endDate] = dates
		setLocalRange({ startDate, endDate })
		onChange({ startDate, endDate })
	}

	const pickerClassName = getDynamicClasses(
		{
			baseClasses: 'px-3 py-2 border rounded-md text-sm w-full',
			variantClasses: [
				{
					size: {
						sm: 'h-7 px-2 py-1',
						md: 'h-11 px-3 py-2',
					},
				},
			],
		},
		{ size, className }
	)

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			<div className="date-range-picker flex flex-col gap-2">
				{label && <Label htmlFor={id}>{label}</Label>}
				<DatePicker
					id={id}
					name={name}
					selectsRange
					startDate={localRange.startDate}
					endDate={localRange.endDate}
					onChange={handleChange}
					onBlur={onBlur}
					isClearable
					placeholderText={placeholder || ''}
					className={pickerClassName}
					dateFormat={DATE_FORMAT}
				/>
			</div>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default DateRangePicker
