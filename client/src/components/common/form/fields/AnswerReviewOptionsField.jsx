import { getDynamicClasses } from '@/utils'

const AnswerReviewOptionsField = ({
	answers = [],
	value = '',
	isCorrect = false,
	showCorrect = true,
	correctValue = '',
	className,
	hint,
}) => {
	return (
		<>
			<div className="space-y-2">
				{answers.map((answer, index) => {
					const correct = correctValue === answer.id
					const wrong = value === answer.id && !isCorrect
					const optionLabel = `${index + 1}.`

					const containerClasses = getDynamicClasses(
						{
							baseClasses:
								'w-full rounded-lg border px-4 py-3 cursor-pointer transition-colors bg-white border-gray-300',
							stateClasses: [
								{
									class: 'bg-success-50 border-success-500 text-success-700',
									condition: showCorrect && correct,
								},
								{
									class: 'bg-error-50 border-error-500 text-error-700',
									condition: showCorrect && !correct && wrong,
								},
								{
									class: 'bg-white border-gray-300 hover:border-brand-300',
									condition: showCorrect && !correct && !wrong,
								},
								{
									class: 'bg-brand-50 border-brand-500 text-brand-700',
									condition: !showCorrect && correct,
								},
							],
						},
						{ className }
					)

					const checkClasses = getDynamicClasses({
						baseClasses: 'flex items-center justify-center w-5 h-5 rounded-full text-white',
						stateClasses: [
							{ class: 'bg-success-500', condition: showCorrect && correct },
							{ class: 'bg-error-500', condition: showCorrect && !correct && wrong },
							{ class: 'bg-white border-gray-500', condition: showCorrect && !correct && !wrong },
							{ class: 'bg-brand-500', condition: !showCorrect && correct },
						],
					})

					return (
						<div key={answer.id || `answer-${index}`}>
							<div className={containerClasses}>
								<div className="flex items-center justify-between w-full gap-1">
									<div className="flex-1 flex items-center space-x-2">
										<span className="font-semibold text-sm dark:text-gray-800">{optionLabel}</span>
										<span className="text-base text-gray-800">{answer.answer}</span>
									</div>

									{correct && <div className={checkClasses}>{correct && '✓'}</div>}
									{showCorrect && !correct && <div className={checkClasses}>{wrong && '✗'}</div>}
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
		</>
	)
}

export default AnswerReviewOptionsField
