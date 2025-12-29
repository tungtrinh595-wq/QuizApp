import * as Yup from 'yup'
import { QUESTION_TYPE, QUIZ_RANDOM, QUIZ_TYPE } from '@/constants'

export const quizSchema = Yup.object({
	subjectId: Yup.string().required('Bắt buộc phải chọn 1 môn học'),
	title: Yup.string()
		.min(2, 'Tiêu đề phải có ít nhất 2 ký tự')
		.max(50, 'Tiêu đề không được vượt quá 50 ký tự')
		.required('Tiêu đề không được để trống'),
	type: Yup.string()
		.oneOf(
			Object.values(QUIZ_TYPE).map((s) => s.value),
			'Loại bài thi không hợp lệ'
		)
		.required('Vui lòng chọn 1 loại bài thi'),
	description: Yup.string().optional(),
	timeStart: Yup.date().when('type', {
		is: QUIZ_TYPE.EXAM.value,
		then: (schema) =>
			schema
				.required('Thời gian bắt đầu là bắt buộc với bài thi')
				.test('is-future', 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại', function (value) {
					if (!value) return false
					return value > new Date()
				}),
		otherwise: (schema) => schema.optional().nullable(),
	}),
	timeLimit: Yup.date().when('type', {
		is: QUIZ_TYPE.EXAM.value,
		then: (schema) => schema.required('Thời gian giới hạn là bắt buộc với bài thi'),
		otherwise: (schema) => schema.optional(),
	}),
	totalScore: Yup.number()
		.min(1, 'Điểm số phải lớn hơn 0')
		.when('type', {
			is: QUIZ_TYPE.SURVEY.value,
			then: (schema) => schema.optional(),
			otherwise: (schema) => schema.required('Bắt buộc nhập tổng điểm số'),
		}),
	passScore: Yup.number()
		.min(0, 'Điểm đậu không được âm')
		.when('totalScore', (totalScore, schema) =>
			schema.test('passScore-max', 'Điểm đậu không được vượt quá tổng điểm', function (passScore) {
				if (passScore === undefined || passScore === null) return true
				return passScore <= totalScore
			})
		)
		.when('type', {
			is: QUIZ_TYPE.SURVEY.value,
			then: (schema) => schema.optional(),
			otherwise: (schema) => schema.required('Bắt buộc nhập tổng điểm số'),
		}),
	randomCount: Yup.number()
		.min(0, 'Số lượng câu hỏi ngẫu nhiên không được âm')
		.when('isRandom', {
			is: QUIZ_RANDOM.FIXED.value,
			then: (schema) => schema.optional(),
			otherwise: (schema) => schema.min(1, 'Phải có ít nhất một câu hỏi trong bài thi'),
		}),
})

export const buildSubmitQuizSchema = (questions) => {
	const shape = {}

	questions.forEach(({ question }) => {
		const fieldName = question.id

		if (question.type === QUESTION_TYPE.MULTIPLE_CHOICE.value) {
			shape[fieldName] = Yup.string().required('Bạn cần chọn một đáp án')
		}

		if (question.type === QUESTION_TYPE.FILL_IN.value) {
			shape[fieldName] = Yup.string().trim().required('Bạn cần nhập câu trả lời')
		}
	})

	return Yup.object().shape(shape)
}
