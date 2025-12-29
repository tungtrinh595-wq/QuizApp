import { QUESTION_TYPE } from '@/constants'
import { AnswerReviewTextField, AnswerReviewOptionsField } from '@/components'

const ListResultQuestions = ({ resultAnswers = [], isSurvey = false }) => {
	const getQuestionData = (resultAnswer) => {
		const question = resultAnswer.question
		const log = resultAnswer?.log || {}

		return {
			questionText: log.question || question?.question || '',
			type: log.type || question?.type || QUESTION_TYPE.MULTIPLE_CHOICE.value,
			explanation: log.explanation || question?.explanation,
			answers: log.answers?.length
				? log.answers.map((a) => ({
						id: a.id,
						answer: a.answer,
						isCorrect: a.isCorrect,
				  }))
				: question?.answers || [],
		}
	}

	return (
		<>
			{resultAnswers?.length > 0 ? (
				resultAnswers.map((ra, index) => {
					const { question, answer, answerText, isCorrect } = ra
					const questionId = question.id
					const { questionText, type, explanation, answers } = getQuestionData(ra)
					const correctAnswer = answers?.find((a) => a.isCorrect)

					return (
						<div key={ra.id}>
							<p className="mb-2 font-medium">
								{index + 1}. {questionText}
							</p>

							{type === QUESTION_TYPE.MULTIPLE_CHOICE.value && (
								<div>
									<AnswerReviewOptionsField
										name={questionId}
										answers={answers}
										value={answer?.id}
										isCorrect={isSurvey || isCorrect}
										showCorrect={!isSurvey}
										correctValue={isSurvey ? answer?.id : correctAnswer?.id}
										hint={isSurvey ? '' : explanation}
									/>
								</div>
							)}

							{type === QUESTION_TYPE.FILL_IN.value && (
								<AnswerReviewTextField
									name={questionId}
									value={answerText}
									isCorrect={isSurvey || isCorrect}
									showCorrect={!isSurvey}
									correctValue={isSurvey ? answerText : correctAnswer?.answer}
									hint={isSurvey ? '' : explanation}
								/>
							)}
						</div>
					)
				})
			) : (
				<p className="text-center text-gray-500">Không có dữ liệu để hiển thị.</p>
			)}
		</>
	)
}

export default ListResultQuestions
