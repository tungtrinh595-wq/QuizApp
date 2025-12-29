import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Formik } from 'formik'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { PencilIcon } from '@/assets/icons'
import { lessonContentSchema } from '@/validations'
import { handleError, handleSuccess } from '@/utils'
import { useModal } from '@/hooks'
import { editLesson, LessonEditForm } from '@/features'
import {
	Modal,
	Button,
	MetaCard,
	ComponentCard,
	ContentEditor,
	SafeHtmlContent,
	LessonStatusBadge,
} from '@/components'

const LessonMetaCard = ({ lessonId }) => {
	const dispatch = useDispatch()
	const lessons = useSelector((state) => state.lessons)
	const lesson = lessonId ? lessons.lessonMap?.[lessonId] : null
	const { isOpen: isOpenEdit, openModal: openEditModal, closeModal: closeEditModal } = useModal()
	const [editContent, setEditContent] = useState(!lesson?.content)

	const handleSubmit = (values) => {
		const subjectId =
			typeof lesson.subject === 'string' ? lesson.subject : lesson.subject?.id || subjectId || ''

		dispatch(editLesson({ id: lesson.id, formData: { ...values, subjectId } }))
			.unwrap()
			.then(() => {
				handleSuccess(SUCCESS_MESSAGES.CONTENT_EDITED)
				setEditContent(false)
			})
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	return (
		<>
			<MetaCard
				image={lesson?.image?.url}
				title={lesson?.title}
				badge={<LessonStatusBadge status={lesson?.status} />}
				description={lesson?.description}
				editButton={
					<Button
						size="xs"
						variant="roundGroup"
						color="neutral"
						onClick={openEditModal}
						startIcon={<PencilIcon />}
					>
						Sửa
					</Button>
				}
			/>

			{editContent ? (
				<ComponentCard title="Nội dung bài học">
					<Formik
						initialValues={{ content: lesson.content || '' }}
						validationSchema={lessonContentSchema}
						onSubmit={handleSubmit}
					>
						{({ values, errors, touched, setFieldValue }) => (
							<Form className="flex flex-col">
								<ContentEditor
									id="lesson-edit-content"
									onChange={(value) => setFieldValue('content', value)}
									value={values.content}
									error={touched.content && errors.content}
									hint={touched.content && errors.content ? errors.content : ''}
								/>

								<div className="flex justify-end gap-3 px-2 mt-3 lg:mt-6">
									<Button
										size="md"
										variant="outline"
										color="gray"
										onClick={() => setEditContent(false)}
									>
										Hủy bỏ
									</Button>
									<Button size="md" disabled={lessons.isLoading} type="submit">
										Cập nhật
									</Button>
								</div>
							</Form>
						)}
					</Formik>
				</ComponentCard>
			) : (
				<ComponentCard
					title="Nội dung bài học"
					headlineButton={
						<Button
							size="xs"
							variant="roundGroup"
							color="neutral"
							onClick={() => setEditContent(true)}
							startIcon={<PencilIcon />}
						>
							Sửa
						</Button>
					}
				>
					<SafeHtmlContent content={lesson.content} />
				</ComponentCard>
			)}

			<Modal isOpen={isOpenEdit} onClose={closeEditModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Cập nhật bài học
						</h4>
					</div>
					<LessonEditForm lesson={lesson} closeModal={closeEditModal} />
				</div>
			</Modal>
		</>
	)
}

export default LessonMetaCard
