import { Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import { PREFIX } from '@/constants'
import { messageSchema } from '@/validations'
import { handleError } from '@/utils'
import { editMessage } from '@/features'
import { Button, TextArea } from '@/components'

const MessageEditForm = ({ msg, lessonId, thread = [], closeForm }) => {
	const dispatch = useDispatch()
	const auth = useSelector((state) => state.auth)

	const handleSubmit = (values, { resetForm }) => {
		if (!!values.text.trim()) {
			dispatch(editMessage({ id: msg.id, lessonId, formData: values, thread }))
				.unwrap()
				.then(() => {
					resetForm()
					closeForm()
				})
				.catch((error) => handleError(error, PREFIX.ADD_FAILED))
		}
	}

	return (
		<div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] md:grid-rows-[auto] gap-x-3 gap-y-1 items-start w-full">
			<div className="row-span-1 md:row-span-2 w-15 h-15 overflow-hidden border border-gray-200 rounded-full">
				<img src={auth.me?.avatar?.url} alt="avatar" className="w-full h-full object-cover" />
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<p className="flex flex-wrap items-center gap-2">
					<span className="font-medium text-brand-950 dark:text-white/90">{auth.me?.name}</span>
					<span className="text-sm text-gray-500">{auth.me?.email}</span>
				</p>
			</div>

			<Formik
				initialValues={{ text: msg.text }}
				validationSchema={messageSchema}
				onSubmit={handleSubmit}
			>
				{({ values, errors, touched, handleChange, handleBlur }) => (
					<Form className="col-span-2 md:col-span-1 text-gray-800">
						<div>
							<TextArea
								name="text"
								placeholder="Nội dung bình luận"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.text}
								error={touched.text && errors.text}
								hint={touched.text && errors.text ? errors.text : ''}
							/>
						</div>

						<div className="flex items-center gap-3 mt-2 justify-end">
							<Button size="md" variant="outline" color="gray" onClick={closeForm}>
								Đóng
							</Button>
							<Button
								size="md"
								disabled={msg.isLoading || !values.text.trim()}
								type="submit"
								disableText={msg?.isLoading ? 'Đang cập nhật bình luận' : 'Bình luận'}
							>
								Sửa
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default MessageEditForm
