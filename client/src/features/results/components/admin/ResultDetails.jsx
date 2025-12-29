import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PREFIX, QUIZ_TYPE } from '@/constants'
import { handleError } from '@/utils'
import {
	getQuizDetails,
	getResultDetails,
	getSubjectDetails,
	getSubjectQuestions,
	ListResultQuestions,
} from '@/features'
import { AchievedIndicator, AnswerReviewOptionsField, AnswerReviewTextField } from '@/components'

const ResultDetails = ({ quizId, resultId }) => {
	const hasFetched = useRef(false)
	const hasQuizFetched = useRef(false)
	const hasSubjectFetched = useRef(false)
	const hasSubjectQuestiondFetched = useRef(false)
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const results = useSelector((state) => state.results)
	const subjects = useSelector((state) => state.subjects)

	const quiz = quizzes.quizMap?.[quizId]
	const result = results.resultMap?.[resultId]
	const resultAnswers = result?.answers
	const subjectId = quiz?.subject?.id
	const subject = subjects.subjectMap?.[subjectId]
	const isSurvey = quiz && quiz.type === QUIZ_TYPE.SURVEY.value
	const totalAnswer = resultAnswers?.length
	const totalCorrect = resultAnswers?.filter((ra) => ra.isCorrect).length
	const isPass = result?.score >= quiz?.passScore
	const quizQuestions = quiz?.quizQuestions ?? []

	useEffect(() => {
		const hasAnswersWithCorrectFlag = quizQuestions.some((q) =>
			q?.question?.answers?.some((a) => typeof a?.isCorrect === 'boolean')
		)
		if (!hasQuizFetched.current && (!quiz || !hasAnswersWithCorrectFlag)) {
			dispatch(getQuizDetails({ id: quizId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasQuizFetched.current = true
		}
	}, [quizId, quiz])

	useEffect(() => {
		if (!hasFetched.current && !result) {
			dispatch(getResultDetails({ id: resultId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasFetched.current = true
		}
	}, [result, resultId])

	useEffect(() => {
		if (!hasSubjectFetched.current && subjectId && !subject) {
			dispatch(getSubjectDetails({ id: subjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasSubjectFetched.current = true
		}
	}, [subjectId, subject])

	useEffect(() => {
		if (!hasSubjectQuestiondFetched.current && subjectId && !Array.isArray(subject?.questions)) {
			dispatch(getSubjectQuestions({ subjectId }))
				.unwrap()
				.catch((error) => handleError(error, PREFIX.FETCH_FAILED))
			hasSubjectQuestiondFetched.current = true
		}
	}, [subjectId, subject?.questions])

	return (
		<div className="space-y-6 dark:text-white/90">
			{!isSurvey && (
				<div className="mt-6 flex flex-wrap gap-2 justify-between items-center px-2">
					<p>
						Trả lời đúng {totalCorrect} / {totalAnswer} câu
					</p>
					<p className="flex items-center gap-2">
						Kết quả: <AchievedIndicator isPass={isPass} />
					</p>
				</div>
			)}
			<div className="custom-scrollbar max-h-[450px] overflow-y-auto space-y-6 px-2">
				<ListResultQuestions resultAnswers={resultAnswers} isSurvey={isSurvey} />
			</div>
		</div>
	)
}

export default ResultDetails
