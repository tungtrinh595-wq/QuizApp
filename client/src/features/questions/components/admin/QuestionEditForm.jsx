import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, QUESTION_TYPE, SUCCESS_MESSAGES } from '@/constants'
import { questionSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { useInitialFetch } from '@/hooks'
import { editSubjectQuestion, getSubjects } from '@/features'
import { Input, Button, Select, AnswerInputs } from '@/components'

const QuestionEditForm = ({ subjectId, quizId, question, closeModal }) => {
	const dispatch = useDispatch()
	const subjects = useSelector((state) => state.subjects)
	const [selectSubjects, setSelectSubjects] = useState([])

	const handleSubmit = (values) => {
		const cleanedAnswers = values.answers?.map((a) => {
			const cleaned = {
				answer: a.answer,
				isCorrect: a.isCorrect,
			}
			if (a.id) cleaned.id = a.id
			return cleaned
		})
		const payload = {
			...values,
			answers: cleanedAnswers,
		}

		dispatch(editSubjectQuestion({ id: question.id, formData: payload, subjectId, quizId }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.QUESTION_EDITED)
				if (closeModal) closeModal()
			})
			.catch((error) => handleError(error, PREFIX.ADD_FAILED))
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
					typeof question.subject === 'string' ? question.subject : question.subject?.id || '',
				question: question.question,
				type: question.type,
				answers: question.answers || [],
				explanation: question.explanation,
			}}
			validationSchema={questionSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
								<div className="col-span-1 lg:col-span-2">
									<Input
										id="question-edit-question"
										name="question"
										label="Câu hỏi"
										isRequire={true}
										placeholder="Nhập nội dung câu hỏi"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.question}
										error={touched.question && errors.question}
										hint={touched.question && errors.question ? errors.question : ''}
									/>
								</div>
								<div>
									<Select
										id="question-edit-subject-id"
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
									<Select
										id="question-edit-type"
										name="type"
										label="Loại câu hỏi"
										isRequire={true}
										placeholder="Lựa chọn loại câu hỏi"
										onChange={(value) => setFieldValue('type', value)}
										onBlur={handleBlur}
										value={values.type}
										options={Object.values(QUESTION_TYPE)}
										error={touched.type && errors.type}
										hint={touched.type && errors.type ? errors.type : ''}
									/>
								</div>
								<div className="col-span-1 lg:col-span-2">
									<AnswerInputs
										id="question-edit-answers"
										name="answers"
										label="Các câu trả lời"
										isRequire={true}
										placeholder="Nhập câu trả lời"
										onChange={(value) => setFieldValue('answers', value)}
										value={values.answers}
										error={touched.answers && errors.answers}
										hint={
											touched.answers && typeof errors.answers === 'string' ? errors.answers : ''
										}
									/>
								</div>
								<div className="col-span-1 lg:col-span-2">
									<Input
										id="question-edit-explanation"
										name="explanation"
										label="Giải thích câu trả lời"
										placeholder="Nhập giải thích cho câu trả lời (nếu có)"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.explanation}
										error={touched.explanation && errors.explanation}
										hint={touched.explanation && errors.explanation ? errors.explanation : ''}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeModal}>
							Đóng
						</Button>
						<Button size="md" disabled={subjects.isLoading} type="submit">
							Lưu
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default QuestionEditForm
