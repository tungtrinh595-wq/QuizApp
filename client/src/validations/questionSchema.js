import * as Yup from 'yup'
import { QUESTION_TYPE } from '@/constants'

export const questionSchema = Yup.object().shape({
	subjectId: Yup.string().required('Vui lòng chọn môn học'),
	question: Yup.string().required('Nội dung câu hỏi không được để trống'),
	type: Yup.string()
		.oneOf(
			Object.values(QUESTION_TYPE).map((s) => s.value),
			'Loại câu hỏi không hợp lệ'
		)
		.required('Vui lòng chọn 1 loại câu hỏi'),
	answers: Yup.array()
		.of(
			Yup.object().shape({
				answer: Yup.string().required('Đáp án không được để trống'),
				isCorrect: Yup.boolean(),
			})
		)
		.min(1, 'Danh sách đáp án không được trống')
		.required('Danh sách đáp án không được trống'),
	explanation: Yup.string().optional(),
})
