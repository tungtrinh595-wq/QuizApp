import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'

import { PREFIX, QUESTION_TYPE, QUIZ_TYPE, SUCCESS_MESSAGES, WARNING_MESSAGES } from '@/constants'
import { buildSubmitQuizSchema } from '@/validations'
import { formatTime, handleError, handleSuccess, handleWarning } from '@/utils'
import { useQuizTimer } from '@/hooks'
import { startQuiz, submitQuiz } from '@/features'
import { AnswerOptionsField, Button, Input } from '@/components'

const UserQuizForm = ({ quizId }) => {
	const hasFetched = useRef(false)
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const quiz = quizzes.quizMap?.[quizId]
	const [showQuiz, setShowQuiz] = useState(false)

	const doingQuiz = JSON.parse(localStorage.getItem('doingQuiz'))
	const isDoingQuiz = doingQuiz?.quizId === quizId
	const isExam = quiz && quiz.type === QUIZ_TYPE.EXAM.value
	const isQuiz = quiz && [QUIZ_TYPE.EXAM.value, QUIZ_TYPE.PRACTICE.value].includes(quiz.type)

	const timeStart = showQuiz && isExam && quiz.timeStart
	const timeLimit = showQuiz && isExam && quiz.timeLimit
	const timeLeft = useQuizTimer(timeStart, timeLimit, () => {
		handleWarning(WARNING_MESSAGES.TIME_LEFT_5_MIN)
	})
	const isTimeLimit = showQuiz && isExam && quiz.timeStart && quiz.timeLimit
	const disableSubmit = isTimeLimit && timeLeft === 0

	useEffect(() => {
		if (!hasFetched.current && isDoingQuiz) {
			setShowQuiz(true)
			hasFetched.current = true
		}
	}, [isDoingQuiz])

	const handleStartQuiz = () => {
		dispatch(startQuiz({ quizId }))
			.unwrap()
			.then(() => setShowQuiz(true))
			.catch((error) => handleError(error, PREFIX.PROCESSING_FAILED))
	}

	const quizQuestions = quiz?.quizQuestions
		? [...quiz.quizQuestions].sort((a, b) => a.order - b.order)
		: []

	const initialValues = quizQuestions?.reduce((acc, item) => {
		acc[item.question.id] = ''
		return acc
	}, {})

	const submitQuizSchema = buildSubmitQuizSchema(quizQuestions)

	const transformAnswers = (values, questions) => {
		const answers = questions
			.map(({ question }) => {
				const rawValue = values[question.id]

				if (question.type === QUESTION_TYPE.MULTIPLE_CHOICE.value) {
					return {
						questionId: question.id,
						answerId: rawValue,
					}
				}

				if (question.type === QUESTION_TYPE.FILL_IN.value) {
					return {
						questionId: question.id,
						answerText: rawValue,
					}
				}

				return null
			})
			.filter(Boolean)

		return answers
	}

	const handleSubmit = (values) => {
		const answers = transformAnswers(values, quizQuestions)
		const formData = {
			quizId,
			answers,
		}
		dispatch(submitQuiz({ quizId, formData }))
			.unwrap()
			.then(() =>
				handleSuccess(
					quiz.type === QUIZ_TYPE.SURVEY.value
						? SUCCESS_MESSAGES.SURVEY_SUBMITTED
						: SUCCESS_MESSAGES.QUIZ_SUBMITTED
				)
			)
			.catch((error) => handleError(error, PREFIX.PROCESSING_FAILED))
	}

	return (
		<>
			{!showQuiz ? (
				<Button onClick={handleStartQuiz} className="w-fit">
					{quiz?.type === QUIZ_TYPE.SURVEY.value ? 'Bắt đầu khảo sát' : 'Bắt đầu làm bài'}
				</Button>
			) : (
				<div className="w-full max-w-[700px] mx-auto space-y-6">
					<p className="font-semibold">
						{isQuiz ? `Đang làm bài thi: ` : `Đang làm khảo sát: `}
						{quiz?.title}
					</p>
					{isTimeLimit && (
						<p>
							Thời gian còn lại: <b>{formatTime(timeLeft)}</b>
						</p>
					)}

					{quizQuestions.length > 0 && (
						<Formik
							initialValues={initialValues}
							validationSchema={submitQuizSchema}
							onSubmit={handleSubmit}
						>
							{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
								<Form className="space-y-6">
									{quizQuestions?.map(({ question }, index) => {
										const questionId = question.id

										return (
											<div key={questionId}>
												<p className="mb-2 font-medium">
													{index + 1}. {question.question}
												</p>
												{question.type === QUESTION_TYPE.MULTIPLE_CHOICE.value && (
													<div>
														<AnswerOptionsField
															name={questionId}
															answers={question.answers}
															value={values[questionId]}
															onChange={(val) => setFieldValue(questionId, val)}
															onBlur={handleBlur}
															error={touched[questionId] && errors[questionId]}
															hint={
																touched[questionId] && errors[questionId] ? errors[questionId] : ''
															}
														/>
													</div>
												)}
												{question.type === QUESTION_TYPE.FILL_IN.value && (
													<div>
														<Input
															id={questionId}
															name={questionId}
															placeholder="Nhập đáp án của bạn"
															onChange={handleChange}
															onBlur={handleBlur}
															value={values?.[questionId]}
															error={touched?.[questionId] && errors?.[questionId]}
															hint={
																touched?.[questionId] && errors?.[questionId]
																	? errors?.[questionId]
																	: ''
															}
														/>
													</div>
												)}
											</div>
										)
									})}

									<Button type="submit" disabled={disableSubmit}>
										Nộp bài
									</Button>
								</Form>
							)}
						</Formik>
					)}
				</div>
			)}
		</>
	)
}

export default UserQuizForm
