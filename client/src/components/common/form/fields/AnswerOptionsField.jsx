import { getDynamicClasses, getHintClasses } from '@/utils'

const AnswerOptionsField = ({
	name,
	answers = [],
	value = '',
	onChange,
	onBlur,
	disabled = false,
	error = false,
	success = false,
	hint,
	className,
}) => {
	const hintClasses = getHintClasses({ error, success })

	return (
		<>
			<div className="space-y-2">
				{answers.map((answer, index) => {
					const checked = value === answer.id
					const id = `answer-${answer.id}`
					const optionLabel = `${index + 1}.`

					const containerClasses = getDynamicClasses(
						{
							baseClasses: 'w-full rounded-lg border px-4 py-3 cursor-pointer transition-colors bg-white border-gray-300',
							stateClasses: [
								{ class: 'bg-brand-50 border-brand-500 text-brand-700', condition: checked },
								{ class: 'hover:border-brand-300', condition: !checked },
								{ class: 'opacity-50 cursor-not-allowed', condition: disabled },
							],
						},
						{ className }
					)

					const checkClasses = getDynamicClasses({
						baseClasses: 'flex items-center justify-center w-5 h-5 rounded-full text-white',
						stateClasses: [
							{ class: 'bg-brand-500', condition: checked },
							{ class: 'bg-white border-gray-500', condition: !checked },
						],
					})

					return (
						<div key={answer.id}>
							<label htmlFor={id}>
								<div className={containerClasses}>
									<input
										id={id}
										name={name}
										type="radio"
										value={answer.id}
										checked={checked}
										onChange={() => !disabled && onChange(answer.id)}
										onBlur={onBlur}
										className="sr-only"
										disabled={disabled}
									/>

									<div className="flex items-center justify-between w-full gap-1">
										<div className="flex-1 flex items-center space-x-2">
											<span className="font-semibold text-sm dark:text-gray-800">{optionLabel}</span>
											<span className="text-base text-gray-800">
												{answer.answer}
											</span>
										</div>

										<div className={checkClasses}>{checked && '✓'}</div>
									</div>
								</div>
							</label>
						</div>
					)
				})}
			</div>

			{hint && <p className={hintClasses}>{hint}</p>}
		</>
	)
}

export default AnswerOptionsField
