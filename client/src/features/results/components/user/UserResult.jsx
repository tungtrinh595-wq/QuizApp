import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { QUIZ_TYPE } from '@/constants'
import { ListResultQuestions, restartQuiz } from '@/features'
import {
	Button,
	AchievedIndicator,
} from '@/components'

const UserResult = ({ quizId }) => {
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const results = useSelector((state) => state.results)
	const [showSurvey, setShowSurvey] = useState(false)
	const quiz = quizzes.quizMap?.[quizId]
	const result = results.quizResultMap?.[quizId]?.result
	const resultAnswers = result?.answers
	const quizQuestions = quiz?.quizQuestions
		? quiz.isRandom
			? quiz.quizQuestions
			: [...quiz.quizQuestions].sort((a, b) => a.order - b.order)
		: []
	const isQuiz = [QUIZ_TYPE.EXAM.value, QUIZ_TYPE.PRACTICE.value].includes(quiz.type)
	const isSurvey = quiz.type === QUIZ_TYPE.SURVEY.value
	const isPractice = quiz.type === QUIZ_TYPE.PRACTICE.value
	const totalAnswer = resultAnswers?.length
	const totalCorrect = resultAnswers?.filter((ra) => ra.isCorrect).length
	const isPass = result?.score >= quiz?.passScore
	const isShowResult = resultAnswers && quizQuestions && (isQuiz || showSurvey)

	const handleRestartQuiz = () => {
		dispatch(restartQuiz({ quizId }))
	}

	return (
		<div className="w-full max-w-[700px] mx-auto">
			<p className="mb-4 font-semibold">
				{isQuiz
					? `Bạn đã hoàn thành bài thi: ${quiz?.title}`
					: `Cảm ơn bạn đã hoàn thành khảo sát!`}
			</p>
			<div className="space-y-6">
				{isQuiz && (
					<div className="flex flex-wrap gap-2 justify-between items-center">
						<p>
							Bạn đã trả lời đúng {totalCorrect} / {totalAnswer} câu
						</p>
						<p className="flex items-center gap-2">
							Kết quả: <AchievedIndicator isPass={isPass} />{' '}
						</p>
					</div>
				)}
				{isSurvey && !showSurvey && (
					<div className="flex flex-wrap gap-2 justify-between items-center">
						<p>Bạn có muốn xem lại nội dung khảo sát không?</p>
						<Button onClick={() => setShowSurvey(true)}>Xem lại</Button>
					</div>
				)}
				{isShowResult && <ListResultQuestions resultAnswers={resultAnswers} isSurvey={isSurvey} />}
			</div>
			{isPractice && (
				<div className="mt-6 space-y-3">
					<p>Bạn có muốn làm lại bài thi thử không?</p>
					<Button onClick={handleRestartQuiz} className="w-fit">
						Làm lại
					</Button>
				</div>
			)}
		</div>
	)
}

export default UserResult
