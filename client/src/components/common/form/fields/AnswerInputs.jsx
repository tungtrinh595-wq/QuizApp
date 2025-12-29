import { Fragment, useEffect, useRef, useState } from 'react'

import { PlusIcon, TrashBinIcon } from '@/assets/icons'
import { getHintClasses } from '@/utils'
import { Input, Button, Tooltip, Checkbox, Label } from '@/components'

const AnswerInputs = ({
	id,
	name,
	value,
	label,
	isRequire = false,
	placeholder = '',
	onChange,
	success = false,
	error = false,
	hint,
}) => {
	const hasFetched = useRef(false)
	const [answers, setAnswers] = useState(value)

	useEffect(() => {
		const checkInitValue = Array.isArray(value) && value.length > 0
		if (!hasFetched.current && !checkInitValue) {
			updateField([{ answer: '', isCorrect: false }])
			hasFetched.current = true
		}
	}, [value])

	const handleChange = (index, field, value) => {
		const updated = [...answers]
		if (field === 'isCorrect') updated[index][field] = Boolean(value)
		else updated[index][field] = value || ''
		updateField(updated)
	}

	const addAnswer = () => {
		updateField([...answers, { answer: '', isCorrect: false }])
	}

	const removeAnswer = (index) => {
		updateField(answers.filter((_, i) => i !== index))
	}

	const updateField = (updated) => {
		setAnswers(updated)
		if (onChange) onChange(updated)
	}

	const getErrorMessage = (fieldError) => {
		if (typeof fieldError === 'string') return fieldError
		if (typeof fieldError?.message === 'string') return fieldError.message
		return ''
	}

	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			{label && (
				<Label htmlFor={id || name}>
					{label} {isRequire && <span className="text-error-500">*</span>}
				</Label>
			)}

			<div id={id} className="flex flex-col gap-2 items-start">
				{answers.map((item, index) => {
					const itemError = Array.isArray(error) ? error[index] : null
					const itemHint =
						getErrorMessage(itemError?.answer) || getErrorMessage(itemError?.isCorrect)
					const itemHintClasses = getHintClasses({ error: itemError })

					return (
						<Fragment key={`${name}-${index}`}>
							<div className="flex gap-2 items-center">
								<Input
									id={`${id}-input-answer-${index}`}
									name={`input-answer-${index}`}
									value={item.answer || ''}
									className="px-2 py-1 border rounded-md text-sm w-full"
									placeholder={`${placeholder || `Nhập đáp án ${index + 1}`}`}
									onChange={(e) => handleChange(index, 'answer', e.target.value)}
									size="sm"
									error={itemError?.answer}
								/>
								<Checkbox
									id={`${id}-checkbox-is-correct-${index}`}
									name={`checkbox-is-correct-${index}`}
									className="w-5 h-5"
									checked={item.isCorrect}
									onChange={(checked) => handleChange(index, 'isCorrect', checked)}
									label={item.isCorrect ? 'đáp án đúng' : ''}
									error={itemError?.isCorrect}
								/>
								<Tooltip content="Xóa đáp án" tooltipClassName="whitespace-nowrap">
									<Button
										size="xs"
										variant="roundGroup"
										color="warning"
										onClick={() => removeAnswer(index)}
										startIcon={
											<TrashBinIcon className="fill-warning-700 group-hover:fill-warning-800" />
										}
									/>
								</Tooltip>
							</div>
							{itemHint && <p className={itemHintClasses}>{itemHint}</p>}
						</Fragment>
					)
				})}
				<Button
					size="xs"
					variant="roundGroup"
					onClick={() => addAnswer()}
					startIcon={<PlusIcon />}
					className="mt-2"
				>
					Thêm đáp án
				</Button>
			</div>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default AnswerInputs
