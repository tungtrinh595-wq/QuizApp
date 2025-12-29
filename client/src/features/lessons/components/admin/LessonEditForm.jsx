import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, LESSON_STATUS, SUCCESS_MESSAGES } from '@/constants'
import { lessonSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { Input, Button, Select, ImageField } from '@/components'
import { editLesson, getSubjects } from '@/features'
import { useInitialFetch } from '@/hooks'

const LessonEditForm = ({ subjectId, lesson, closeModal }) => {
	const dispatch = useDispatch()
	const lessons = useSelector((state) => state.lessons)
	const subjects = useSelector((state) => state.subjects)

	const [fileImage, setFileImage] = useState()
	const [selectSubjects, setSelectSubjects] = useState([])

	const handleSubmit = (values) => {
		const formData = new FormData()
		Object.entries(values).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value)
			}
		})
		if (fileImage) {
			formData.append('image', fileImage)
		}

		dispatch(editLesson({ id: lesson.id, formData }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.LESSON_EDITED)
				if (closeModal) closeModal()
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
					typeof lesson.subject === 'string'
						? lesson.subject
						: lesson.subject?.id || subjectId || '',
				title: lesson.title || '',
				status: lesson.status || '',
				description: lesson.description || '',
				content: lesson.content || '',
			}}
			validationSchema={lessonSchema}
			onSubmit={handleSubmit}
		>
			{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
				<Form className="flex flex-col">
					<div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
						<div className="mt-7">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
								<div>
									<ImageField
										id="lesson-edit-image"
										initImage={lesson.image.url}
										onChange={setFileImage}
									/>
								</div>
								<div>
									<Select
										id="lesson-edit-subject-id"
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
										id="lesson-edit-title"
										name="title"
										label="Tiêu đề bài học"
										isRequire={true}
										placeholder="Nhập tiêu đề bài học"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.title}
										error={touched.title && errors.title}
										hint={touched.title && errors.title ? errors.title : ''}
									/>
								</div>
								<div>
									<Select
										id="lesson-edit-status"
										name="status"
										label="Trạng thái"
										isRequire={true}
										placeholder="Lựa chọn trạng thái"
										onChange={(value) => setFieldValue('status', value)}
										onBlur={handleBlur}
										value={values.status}
										options={Object.values(LESSON_STATUS)}
										error={touched.status && errors.status}
										hint={touched.status && errors.status ? errors.status : ''}
									/>
								</div>
								<div className="col-span-1 lg:col-span-2">
									<Input
										id="lesson-edit-description"
										name="description"
										label="Mô tả"
										placeholder="Nhập mô tả cho bài học"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.description}
										error={touched.description && errors.description}
										hint={touched.description && errors.description ? errors.description : ''}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 px-2 lg:mt-6">
						<Button size="md" variant="outline" color="gray" onClick={closeModal}>
							Đóng
						</Button>
						<Button size="md" disabled={lessons.isLoading} type="submit">
							Lưu
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	)
}

export default LessonEditForm
