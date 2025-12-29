import * as Yup from 'yup'

export const subjectSchema = Yup.object({
	title: Yup.string()
		.min(2, 'Tiêu đề phải có ít nhất 2 ký tự')
		.max(50, 'Tiêu đề không được vượt quá 50 ký tự')
		.required('Tiêu đề không được để trống'),
	description: Yup.string().optional(),
})
