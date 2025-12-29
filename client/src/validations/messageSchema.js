import * as Yup from 'yup'

export const messageSchema = Yup.object({
	text: Yup.string().max(
		500,
		'Nội dung bình luận không được vượt quá 500 ký tự'
	),
})
