import { useDispatch, useSelector } from 'react-redux'

import { PREFIX, SUCCESS_MESSAGES } from '@/constants'
import { handleError, handleSuccess } from '@/utils'
import { attachLessonFiles, deleteLessonFile } from '@/features'
import { DropZone, ComponentCard, LessonFileGrid } from '@/components'

const LessonFilesCard = ({ lessonId }) => {
	const dispatch = useDispatch()
	const lessons = useSelector((state) => state.lessons)
	const lesson = lessonId ? lessons.lessonMap?.[lessonId] : null

	const handleSaveFiles = (files) => {
		const formData = new FormData()

		files.forEach((file) => {
			formData.append('files', file)
		})
		dispatch(attachLessonFiles({ lessonId: lesson.id, formData }))
			.unwrap()
			.then(() => handleSuccess(SUCCESS_MESSAGES.LESSON_FILES_ADDED))
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	const handleRemoveLessonFile = (id) => {
		dispatch(deleteLessonFile({ id, lessonId: lesson.id }))
			.unwrap()
			.then(() => handleSuccess(SUCCESS_MESSAGES.LESSON_FILE_REMOVED))
			.catch((error) => handleError(error, PREFIX.UPDATE_FAILED))
	}

	return (
		<>
			<DropZone
				title="Thêm các tập tin đính kèm"
				onDropFiles={(files) => handleSaveFiles(files)}
				isLoading={lessons.isLoading}
			/>

			{lesson?.lessonFiles?.length > 0 && (
				<ComponentCard title="Các tập tin đính kèm">
					<LessonFileGrid files={lesson.lessonFiles} onRemove={handleRemoveLessonFile} />
				</ComponentCard>
			)}
		</>
	)
}

export default LessonFilesCard
