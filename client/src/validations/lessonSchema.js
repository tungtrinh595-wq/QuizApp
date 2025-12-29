import * as Yup from 'yup'
import { LESSON_STATUS } from '@/constants'

export const lessonSchema = Yup.object({
	subjectId: Yup.string().required('Bắt buộc phải chọn 1 môn học'),
	title: Yup.string()
		.min(2, 'Tiêu đề phải có ít nhất 2 ký tự')
		.max(50, 'Tiêu đề không được vượt quá 50 ký tự')
		.required('Tiêu đề không được để trống'),
	description: Yup.string().optional(),
	status: Yup.string()
		.oneOf(
			Object.values(LESSON_STATUS).map((s) => s.value),
			'Trạng thái không hợp lệ'
		)
		.required('Vui lòng chọn 1 trạng thái'),
})

export const lessonContentSchema = Yup.object({
	content: Yup.string().optional(),
})
