import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { QUESTION_TYPE } from '@/constants'
import { useInitialFetch } from '@/hooks'
import { getAllQuizResults } from '@/features'
import { AnswerStatsProgressField } from '@/components'

const SurveyResponses = ({ quizId }) => {
	const hasFetched = useRef(false)
	const results = useSelector((state) => state.results)
	const [statsByQuestion, setStatsByQuestion] = useState()

	const quizResults = results.quizResultsMap?.[quizId]
	const quizResultsList = quizResults?.list || []

	useInitialFetch(quizResults?.list, getAllQuizResults, { quizId })

	const getStatsByQuestion = (results) => {
		const stats = {}

		results.forEach((result) => {
			result.answers?.forEach(({ question, answer, answerText, log }) => {
				const qid = question.id
				const questionText = log?.question || question.question
				const questionType = log?.type || question.type

				if (!stats[qid]) {
					stats[qid] = {
						questionText,
						type: questionType,
						total: 0,
						answers: {},
						fillInAnswers: {},
					}
				}

				stats[qid].total += 1

				if (questionType === QUESTION_TYPE.MULTIPLE_CHOICE.value) {
					let aid = answer?.id
					let aText = answer?.answer

					if (log?.answers?.length > 0 && aid) {
						const loggedAnswer = log.answers.find((a) => a.id === aid || a._id === aid)
						if (loggedAnswer) {
							aText = loggedAnswer.answer
						}
					}

					if (aid && aText) {
						stats[qid].answers[aid] = stats[qid].answers[aid] || { text: aText, count: 0 }
						stats[qid].answers[aid].count += 1
					}
				}

				if (questionType === QUESTION_TYPE.FILL_IN.value) {
					const normalized = (answerText || '').trim().toLowerCase()
					if (normalized) {
						stats[qid].fillInAnswers[normalized] = stats[qid].fillInAnswers[normalized] || {
							text: answerText.trim(),
							count: 0,
						}
						stats[qid].fillInAnswers[normalized].count += 1
					}
				}
			})
		})

		return stats
	}

	useEffect(() => {
		if (quizResultsList.length > 0 && !hasFetched.current) {
			const answerStatsByQuestion = getStatsByQuestion(quizResultsList)
			setStatsByQuestion(answerStatsByQuestion)
			hasFetched.current = true
		}
	}, [quizResultsList])

	return (
		<div className="space-y-6">
			<div className="custom-scrollbar max-h-[450px] overflow-y-auto space-y-6 px-2">
				{typeof statsByQuestion === 'object' &&
					Object.entries(statsByQuestion).map(([qid, data]) => (
						<AnswerStatsProgressField key={qid} {...data} />
					))}
			</div>
		</div>
	)
}

export default SurveyResponses
