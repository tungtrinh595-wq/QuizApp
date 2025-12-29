import { getDynamicClasses } from '@/utils'

const AnswerReviewTextField = ({
	value = '',
	isCorrect = false,
	showCorrect = true,
	correctValue = '',
	className,
	hint,
}) => {
	const containerClasses = getDynamicClasses({ baseClasses: 'space-y-2 px-4' }, { className })

	const checkClasses = getDynamicClasses({
		baseClasses: 'flex items-center justify-center w-5 h-5 rounded-full text-white',
		stateClasses: [
			{ class: 'bg-success-500', condition: isCorrect },
			{ class: 'bg-error-500', condition: !isCorrect },
		],
	})

	return (
		<>
			<div className={containerClasses}>
				<p className="inline-flex items-center flex-wrap gap-2">
					{value ? (
						<span className={`flex-1 ${showCorrect && !isCorrect ? 'line-through' : ''}`}>
							{value}
						</span>
					) : (
						<span className="font-light italic text-sm">(Chưa trả lời)</span>
					)}
					{showCorrect && isCorrect && <span className={checkClasses}>✓</span>}
					{showCorrect && !isCorrect && <span className={checkClasses}>✗</span>}
				</p>
				{showCorrect && !isCorrect && <p>Đáp án đúng: {correctValue}</p>}
			</div>

			{hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
		</>
	)
}

export default AnswerReviewTextField
