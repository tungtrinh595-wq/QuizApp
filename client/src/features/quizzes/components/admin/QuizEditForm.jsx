import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, useParams, matchPath } from 'react-router-dom'
import { Form, Formik } from 'formik'

import { ROUTES, PREFIX, QUIZ_TYPE, SUCCESS_MESSAGES, QUIZ_RANDOM } from '@/constants'
import { quizSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { useInitialFetch } from '@/hooks'
import { editQuiz, getSubjects } from '@/features'
import { Input, Button, Select, DatePicker, ImageField } from '@/components'

const QuizEditForm = ({ subjectId, quiz, closeModal }) => {
	const dispatch = useDispatch()
	const quizzes = useSelector((state) => state.quizzes)
	const subjects = useSelector((state) => state.subjects)

	const { slug } = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const [fileImage, setFileImage] = useState()
	const [selectSubjects, setSelectSubjects] = useState([])

	const handleSubmit = (values) => {
		const formData = new FormData()
		Object.entries(values).forEach(([key, value]) => {
			if (key === 'isRandom') value = value === QUIZ_RANDOM.RANDOM.value
			if (value !== undefined && value !== null) {
				formData.append(key, value)
			}
		})
		if (fileImage) {
			formData.append('image', fileImage)
		}

		dispatch(editQuiz({ id: quiz.id, formData }))
			.unwrap()
			.then(({ quiz }) => {
				handleSuccess(SUCCESS_MESSAGES.QUIZ_EDITED)
				if (closeModal) closeModal()

				const isDetailPage = matchPath(ROUTES.ADMIN.QUIZ_DETAILS, location.pathname)
				if (isDetailPage && quiz?.slug !== slug) {
					navigate(ROUTES.ADMIN.QUIZ_DETAILS.replace(':id', quiz.id))
				}
			})
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	useInitialFetch(subjects.list, getSubjects)

	useEffect(() => {
		if (subjects.list)
			setSelectSubjects(
				subjects.list.map((subject) => ({
					value: subject.id,
					label: subject.title,
				}))
			)
	}, [subjects.list])

	return (
		<Formik
			initialValues={{
				subjectId:
					typeof quiz.subject === 'string' ? quiz.subject : quiz.subject?.id || subjectId || '',
				title: quiz.title || '',
				description: quiz.description || '',
				type: quiz.type || '',
				timeStart: quiz.timeStart || '',
				timeLimit: quiz.timeLimit || '',
				totalScore: quiz.totalScore || '',
				passScore: quiz.passScore || '',
				isRandom: quiz.isRandom ? QUIZ_RANDOM.RANDOM.value : QUIZ_RANDOM.FIXED.value,
				randomCount: quiz.randomCount || 0,
			}}
			validationSchema={quizSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
								<div>
									<ImageField
										id="quiz-edit-image"
										initImage={quiz.image.url}
										onChange={setFileImage}
									/>
								</div>
								<div>
									<Select
										id="quiz-edit-subject-id"
										name="subjectId"
										label="Môn học"
										isRequire={true}
										placeholder="Lựa chọn môn học"
										onChange={(value) => setFieldValue('subjectId', value)}
										onBlur={handleBlur}
										value={values.subjectId}
										options={Object.values(selectSubjects)}
										error={touched.subjectId && errors.subjectId}
										hint={touched.subjectId && errors.subjectId ? errors.subjectId : ''}
									/>
								</div>
								<div>
									<Input
										id="quiz-edit-title"
										name="title"
										label="Tiêu đề bài thi"
										isRequire={true}
										placeholder="Nhập tiêu đề bài thi"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.title}
										error={touched.title && errors.title}
										hint={touched.title && errors.title ? errors.title : ''}
									/>
								</div>
								<div>
									<Select
										id="quiz-edit-type"
										name="type"
										label="Loại bài thi"
										isRequire={true}
										placeholder="Chọn"
										onChange={(value) => setFieldValue('type', value)}
										onBlur={handleBlur}
										value={values.type}
										options={Object.values(QUIZ_TYPE)}
										error={touched.type && errors.type}
										hint={touched.type && errors.type ? errors.type : ''}
									/>
								</div>
								<div>
									<Select
										id="quiz-edit-random"
										name="isRandom"
										label="Cách chọn câu hỏi"
										placeholder="Chọn"
										onChange={(value) => setFieldValue('isRandom', value)}
										onBlur={handleBlur}
										value={values.isRandom}
										options={Object.values(QUIZ_RANDOM)}
										error={touched.isRandom && errors.isRandom}
										hint={touched.isRandom && errors.isRandom ? errors.isRandom : ''}
									/>
								</div>
								{values.isRandom === QUIZ_RANDOM.RANDOM.value && (
									<div>
										<Input
											id="quiz-edit-random-count"
											type="number"
											name="randomCount"
											label="Số lượng câu hỏi trong bài thi"
											isRequire={values.isRandom === QUIZ_RANDOM.RANDOM.value}
											placeholder="Nhập số lượng câu hỏi"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.randomCount}
											error={touched.randomCount && errors.randomCount}
											hint={touched.randomCount && errors.randomCount ? errors.randomCount : ''}
										/>
									</div>
								)}
								<div className="col-span-1 lg:col-span-2">
									<Input
										id="quiz-edit-description"
										name="description"
										label="Mô tả"
										placeholder="Nhập mô tả cho bài thi"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.description}
										error={touched.description && errors.description}
										hint={touched.description && errors.description ? errors.description : ''}
									/>
								</div>
								{values.type === QUIZ_TYPE.EXAM.value && (
									<>
										<div>
											<DatePicker
												id="quiz-edit-time-start"
												name="timeStart"
												label="Thời gian bắt đầu làm bài"
												isRequire={values.type === QUIZ_TYPE.EXAM.value}
												placeholder="Chọn ngày và giờ"
												onChange={(value) => setFieldValue('timeStart', value)}
												value={values.timeStart}
												error={touched.timeStart && errors.timeStart}
												hint={touched.timeStart && errors.timeStart ? errors.timeStart : ''}
											/>
										</div>
										<div>
											<Input
												id="quiz-edit-time-limit"
												type="number"
												name="timeLimit"
												label="Thời gian làm bài (phút)"
												isRequire={values.type === QUIZ_TYPE.EXAM.value}
												placeholder="Nhập thời gian làm bài"
												onChange={handleChange}
												value={values.timeLimit}
												error={touched.timeLimit && errors.timeLimit}
												hint={touched.timeLimit && errors.timeLimit ? errors.timeLimit : ''}
											/>
										</div>
									</>
								)}
								{values.type !== QUIZ_TYPE.SURVEY.value && (
									<>
										<div>
											<Input
												id="quiz-edit-total-score"
												type="number"
												name="totalScore"
												label="Tổng số điểm"
												isRequire={values.type !== QUIZ_TYPE.SURVEY.value}
												placeholder="Nhập tổng số điểm"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.totalScore}
												error={touched.totalScore && errors.totalScore}
												hint={touched.totalScore && errors.totalScore ? errors.totalScore : ''}
											/>
										</div>
										<div>
											<Input
												id="quiz-edit-pass-score"
												type="number"
												name="passScore"
												label="Số điểm đậu"
												isRequire={values.type !== QUIZ_TYPE.SURVEY.value}
												placeholder="Nhập số điểm đậu"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.passScore}
												error={touched.passScore && errors.passScore}
												hint={touched.passScore && errors.passScore ? errors.passScore : ''}
											/>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeModal}>
							Đóng
						</Button>
						<Button size="md" disabled={quizzes.isLoading} type="submit">
							Lưu
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default QuizEditForm
